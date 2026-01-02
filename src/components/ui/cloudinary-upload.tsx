"use client";

import { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Trash, X } from "lucide-react";
import Image from "next/image";
import { CldImage } from "next-cloudinary";

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
    // Cloudinary returns the public_id or secure_url
    onChange(result.info.public_id);
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-4 w-full">
      {/* 1. Image Preview State */}
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
          {/* যদি Public ID হয় তবে CldImage, আর URL হলে সাধারণ Image */}
          {value.startsWith("http") ? (
            <Image
              fill
              style={{ objectFit: "cover" }}
              alt="Image"
              src={value}
            />
          ) : (
            <CldImage
              fill
              src={value}
              alt="Uploaded Image"
              className="object-cover"
            />
          )}
        </div>
      )}

      {/* 2. Drag & Drop Upload Button */}
      {!value && (
        <CldUploadWidget
          onSuccess={onUpload}
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} // .env থেকে নিবে
          options={{
            maxFiles: 1,
            resourceType: "image", // ✅ শুধু ইমেজ আপলোড হবে
            clientAllowedFormats: ["png", "jpeg", "jpg", "webp", "svg"], // ✅ নির্দিষ্ট ফরম্যাট
            maxFileSize: 5000000, // 5MB limit (optional)
            sources: ["local", "url", "camera"],
            styles: {
              palette: {
                window: "#FFFFFF",
                windowBorder: "#90A0B3",
                tabIcon: "#0078FF",
                menuIcons: "#5A616A",
                textDark: "#000000",
                textLight: "#FFFFFF",
                link: "#0078FF",
                action: "#FF620C",
                inactiveTabIcon: "#0E2F5A",
                error: "#F44235",
                inProgress: "#0078FF",
                complete: "#20B832",
                sourceBg: "#E4EBF1",
              },
            },
          }}
        >
          {({ open }) => {
            const onClick = () => {
              open();
            };

            return (
              <div
                onClick={onClick}
                className="
                  flex flex-col items-center justify-center gap-4 
                  w-full h-[200px] 
                  border-2 border-dashed border-gray-300 rounded-xl
                  hover:bg-gray-50 hover:border-indigo-400 
                  transition-all cursor-pointer bg-white
                "
              >
                <div className="p-4 bg-indigo-50 rounded-full text-indigo-600">
                  <ImagePlus size={30} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    SVG, PNG, JPG or GIF (max. 800x400px)
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
