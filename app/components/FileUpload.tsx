"use client";

import { useState } from "react";
import { UploadDropzone } from "@/app/lib/uploadthing";
import { OurFileRouter } from "@/app/api/uploadthing/types";
import { X, FileImage } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  onChange: (url: string) => void;
  onRemove: (url: string) => void;
  value: string[];
  disabled?: boolean;
}

export const FileUpload = ({
  onChange,
  onRemove,
  value,
  disabled,
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const onUploadComplete = (res: { url: string }[]) => {
    setIsUploading(false);
    onChange(res[0].url);
  };

  const onUploadError = (error: Error) => {
    setIsUploading(false);
    console.log("ERROR: ", error);
  };

  return (
    <div className="space-y-4">
      {/* Separate main image (first image) from additional images */}
      {value.length > 0 && (
        <div className="mb-4">
          <div className="relative w-full h-64 md:h-80">
            <div className="absolute top-2 right-2 z-10">
              <button
                type="button"
                className="bg-rose-500 text-white p-1 rounded-full"
                onClick={() => onRemove(value[0])}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Image
              fill
              className="rounded-lg object-cover border border-gray-200"
              alt="Main Upload"
              src={value[0]}
            />
            {/* Add a visual indicator that this is the main image */}
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
              Main Image
            </div>
          </div>
        </div>
      )}
      
      {/* Additional images as thumbnails */}
      {value.length > 1 && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">Additional Images</p>
          <div className="flex flex-wrap gap-4">
            {value.slice(1).map((url) => (
              <div key={url} className="relative h-24 w-24">
                <div className="absolute top-0 right-0 z-10">
                  <button
                    type="button"
                    className="bg-rose-500 text-white p-1 rounded-full"
                    onClick={() => onRemove(url)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <Image
                  fill
                  className="rounded-md object-cover"
                  alt="Additional Upload"
                  src={url}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {!disabled && (
        <div className="border-2 border-dashed border-primary/20 rounded-lg p-2">
          <UploadDropzone
            endpoint="imageUploader"
            onUploadBegin={() => {
              setIsUploading(true);
            }}
            onClientUploadComplete={(res: { url: string }[]) => {
              setIsUploading(false);
              if (res && res.length > 0) {
                // Handle all uploaded images, not just the first one
                res.forEach(file => {
                  onChange(file.url);
                });
              }
            }}
            onUploadError={(error: Error) => {
              setIsUploading(false);
              console.log("ERROR: ", error);
            }}
          />
        </div>
      )}
    </div>
  );
};
