"use client";

import { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Trash, CloudLightning } from "lucide-react";
import { toast } from "sonner";

// ✅ 1. Cloudinary Result এর জন্য নির্দিষ্ট টাইপ তৈরি
interface CloudinaryResult {
  info: {
    secure_url: string;
    [key: string]: unknown; // অন্য প্রপার্টি থাকতে পারে, তাই unknown দেওয়া নিরাপদ
  };
  event: string;
}

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

export default function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false);

  // ✅ 2. Hydration Mismatch Fix
  // এই প্যাটার্নটি Next.js এ স্ট্যান্ডার্ড এবং নিরাপদ
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ 3. Type Safe Upload Handler
  const onUpload = (result: any) => {
    // Note: CldUploadWidget এর টাইপ লাইব্রেরি থেকে অনেক সময় 'any' রিটার্ন করে,
    // তাই আমরা এখানে Type Assertion বা Check ব্যবহার করব।

    // Check if result exists and has info property
    if (result && typeof result === "object" && "info" in result) {
      const info = result.info as CloudinaryResult["info"];

      if (info.secure_url) {
        onChange(info.secure_url);
        toast.success("Image uploaded successfully");
      }
    }
  };

  // মাউন্ট না হওয়া পর্যন্ত কিছুই রেন্ডার করবে না (Hydration Error প্রতিরোধ করে)
  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-4 w-full">
      {/* Image Preview */}
      {value && value.length > 0 && (
        <div className="flex items-center gap-4">
          {value.map((url) => (
            <div
              key={url}
              className="relative w-[200px] h-[200px] rounded-xl overflow-hidden border border-gray-200 shadow-sm group"
            >
              <div className="z-10 absolute top-2 right-2">
                <button
                  type="button"
                  onClick={() => onRemove(url)}
                  disabled={disabled}
                  className="bg-red-500 text-white p-1.5 rounded-lg shadow-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  <Trash size={16} />
                </button>
              </div>
              <Image fill className="object-cover" alt="Image" src={url} />
            </div>
          ))}
        </div>
      )}

      {/* Upload Widget */}
      <CldUploadWidget
        onSuccess={onUpload}
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          maxFiles: 1,
          sources: ["local", "url", "camera"],
          clientAllowedFormats: ["image"],
        }}
      >
        {({ open }) => {
          const onClick = () => {
            if (disabled) return;
            if (open) {
              open();
            }
          };

          return (
            <div
              onClick={onClick}
              className={`border-2 border-dashed border-gray-300 rounded-2xl p-10 transition flex flex-col items-center justify-center gap-4 cursor-pointer group bg-white ${
                disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
              }`}
            >
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full group-hover:scale-110 transition-transform">
                <CloudLightning size={32} />
              </div>
              <div className="text-center space-y-1">
                <p className="font-bold text-gray-700 text-sm">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400">
                  SVG, PNG, JPG or GIF (max. 800x400px)
                </p>
              </div>
              <button
                type="button"
                disabled={disabled}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 transition shadow-sm"
              >
                Choose File
              </button>
            </div>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
