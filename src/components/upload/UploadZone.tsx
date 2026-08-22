import React, { useState, useRef } from "react";
import { Upload, FileImage } from "lucide-react";
import { useUpload } from "../../hooks/useUpload";
import { UploadProgress } from "./UploadProgress";
import { UploadError } from "./UploadError";

interface UploadZoneProps {
  onSuccess: (id: string, url: string) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { handleUpload, isUploading, progress, error, clearError } = useUpload({
    onSuccess,
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isUploading) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isUploading) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUploading) return;
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const triggerFileSelect = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
        className={`
          w-full py-8 px-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 cursor-pointer select-none
          ${isDragging 
            ? "border-[#FF7EA5] bg-[#FFF0F5]/40 scale-[1.01]" 
            : isUploading 
              ? "border-[#E2E4E9] bg-gray-50/50 cursor-not-allowed"
              : "border-[#E2E4E9] hover:border-[#FF7EA5]/60 hover:bg-[#F9F9FB]"
          }
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <UploadProgress progress={progress} />
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="absolute inset-[-6px] bg-[#FFF0F5] rounded-full border-2 border-dashed border-[#FF7EA5]/30 animate-pulse" />
              <div className="relative w-14 h-14 rounded-full bg-[#FFF0F5] border-2 border-[#FF7EA5]/30 flex items-center justify-center text-[#FF7EA5]">
                <Upload className="w-7 h-7" />
              </div>
            </div>

            <p className="text-sm font-semibold text-[#1A1A1E] mb-1">
              Drag & drop your companion image here
            </p>
            <p className="text-xs text-[#9E9EAF] mb-3">
              or click to browse your local files
            </p>
            
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider text-[#FF7EA5] bg-[#FFF0F5] border border-[#FF7EA5]/20 uppercase">
              PNG, JPG, WEBP, SVG (Max 15MB)
            </span>
          </div>
        )}
      </div>

      {error && <UploadError message={error} onClear={clearError} />}
    </div>
  );
};
