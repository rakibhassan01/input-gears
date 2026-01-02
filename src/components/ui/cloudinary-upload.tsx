"use client";

import { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";

interface CloudinaryUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string;
}

export default function CloudinaryUpload({
  disabled,
  onChange,
  onRemove,
  value,
}: CloudinaryUploadProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    // Cloudinary result handling
    if (result.info && result.info.secure_url) {
      onChange(result.info.secure_url);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-4 w-full">
      {/* 1. Image Preview */}
      {value && (
        <div className="relative w-full h-[200px] rounded-xl overflow-hidden border border-gray-200 group">
          <div className="z-10 absolute top-2 right-2">
            <button
              type="button"
              onClick={() => onRemove(value)}
              className="bg-red-500 text-white p-2 rounded-lg shadow-sm hover:bg-red-600 transition-colors"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
          <Image
            fill
            className="object-cover"
            alt="Image"
            src={value}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // ✅ Fixed sizes error
          />
        </div>
      )}

      {/* 2. Upload Button */}
      <CldUploadWidget
        onSuccess={onUpload}
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          maxFiles: 1,
          resourceType: "image",
          clientAllowedFormats: ["png", "jpeg", "jpg", "webp"],
        }}
      >
        {({ open }) => {
          const onClick = () => {
            if (disabled) return;
            open();
          };

          return (
            <div
              onClick={onClick}
              className="flex flex-col items-center justify-center gap-4 w-full h-[200px] border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 hover:border-indigo-400 transition-all cursor-pointer bg-white"
            >
              <div className="p-4 bg-indigo-50 rounded-full text-indigo-600">
                <ImagePlus size={30} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700">
                  Click to upload image
                </p>
              </div>
            </div>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
