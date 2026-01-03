"use client";

import { useEffect, useState } from "react";
import { CldUploadWidget, CldImage } from "next-cloudinary";
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
    if (result.info && result.info.secure_url) {
      onChange(result.info.secure_url);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-4 w-full">
      {/* 1. Image Preview Section (ইমেজ থাকলে এটি দেখাবে) */}
      {value && (
        <div className="relative w-full h-[200px] rounded-xl overflow-hidden border border-gray-200 group bg-gray-50">
          <div className="z-10 absolute top-2 right-2">
            <button
              type="button"
              onClick={() => onRemove(value)}
              className="bg-red-500 text-white p-2 rounded-lg shadow-sm hover:bg-red-600 transition-colors"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>

          {/* Image Rendering Logic */}
          {value.startsWith("http") || value.startsWith("data:") ? (
            <Image
              fill
              className="object-cover"
              alt="Uploaded Image"
              src={value}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <CldImage
              fill
              src={value}
              alt="Uploaded Image"
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>
      )}

      {/* 2. Upload Button Section (ইমেজ না থাকলে তবেই এটি দেখাবে) */}
      {/* ✅ FIX: '!value' কন্ডিশন যোগ করা হয়েছে */}
      {!value && (
        <CldUploadWidget
          onSuccess={onUpload}
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          options={{
            maxFiles: 1,
            resourceType: "image",
            clientAllowedFormats: ["png", "jpeg", "jpg", "webp", "svg"],
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
                className={`
                  flex flex-col items-center justify-center gap-4 
                  w-full h-[200px] 
                  border-2 border-dashed border-gray-300 rounded-xl
                  transition-all cursor-pointer bg-white
                  ${
                    disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-50 hover:border-indigo-400"
                  }
                `}
              >
                <div className="p-4 bg-indigo-50 rounded-full text-indigo-600">
                  <ImagePlus size={30} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700">
                    Click to upload image
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    SVG, PNG, JPG or GIF (max 5MB)
                  </p>
                </div>
              </div>
            );
          }}
        </CldUploadWidget>
      )}
    </div>
  );
}
