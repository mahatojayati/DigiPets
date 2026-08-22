import React, { useState, useRef } from 'react';
import { Upload, X, FileImage, AlertCircle } from 'lucide-react';
import { Card } from './Card';
import { validateFile, formatBytes } from '../../lib/helpers';

interface UploadCardProps {
  id?: string;
  selected: boolean;
  onSelect: () => void;
  onFileUploaded: (file: File) => void;
  onFileCleared: () => void;
  uploadedImageUrl: string | null;
  uploadedFile: File | null;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  id,
  selected,
  onSelect,
  onFileUploaded,
  onFileCleared,
  uploadedImageUrl,
  uploadedFile
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setErrorMessage(null);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const validation = validateFile(file);
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Invalid file');
      return;
    }
    onFileUploaded(file);
    onSelect(); // Automatically select this method when a file is dropped/uploaded
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card
      id={id || 'upload-card'}
      selected={selected}
      onClick={onSelect}
      colorTheme="pink"
      className="flex flex-col h-full"
    >
      <div className="flex flex-col items-center text-center flex-1">
        {/* Magic hand-drawn style container */}
        <div className="relative mb-6">
          <div className="absolute inset-[-6px] bg-[#FFF0F5] rounded-full border-2 border-dashed border-[#FF7EA5]/30" />
          <div className="relative w-16 h-16 rounded-full bg-[#FFF0F5] border-2 border-[#FF7EA5]/30 flex items-center justify-center text-[#FF7EA5]">
            <Upload className="w-8 h-8" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-[#1A1A1E] mb-2 font-sans tracking-tight">
          Upload Existing Pet
        </h3>
        
        <p className="text-sm text-[#5C5F6A] mb-6 tracking-tight max-w-xs">
          Bring your own creature to life! Upload any transparent animal portrait or character.
        </p>

        {/* Upload Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={(e) => {
            // Prevent Card selection handler from firing twice if clicking inside the interactive dropzone
            e.stopPropagation();
            if (!uploadedImageUrl) {
              triggerFileSelect();
            }
          }}
          className={`
            w-full py-6 px-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 cursor-pointer select-none
            ${isDragging 
              ? 'border-[#FF7EA5] bg-[#FFF0F5]/40 scale-[1.01]' 
              : uploadedImageUrl 
                ? 'border-[#06D6A0] bg-[#F0FFF4]/20' 
                : 'border-[#E2E4E9] hover:border-[#FF7EA5]/60 hover:bg-[#F9F9FB]'
            }
          `}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".png,.webp,.jpg,.jpeg,.svg,.gif"
            className="hidden"
          />

          {uploadedImageUrl && uploadedFile ? (
            <div className="flex flex-col items-center w-full gap-3">
              {/* Image Preview */}
              <div className="relative group w-20 h-20 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                <img
                  src={uploadedImageUrl}
                  alt="Pet preview"
                  className="max-w-full max-h-full object-contain"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileCleared();
                  }}
                  className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 rounded-full text-white transition-opacity cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-center w-full">
                <p className="text-xs font-semibold text-[#1A1A1E] truncate max-w-[200px] mx-auto">
                  {uploadedFile.name}
                </p>
                <p className="text-[11px] text-[#9E9EAF]">
                  {formatBytes(uploadedFile.size)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <FileImage className="w-8 h-8 text-[#9E9EAF] mb-2" />
              <p className="text-xs font-medium text-[#5C5F6A] mb-1">
                Drag & drop your PNG/WEBP here
              </p>
              <p className="text-[10px] text-[#9E9EAF] mb-2">
                or click to browse your files
              </p>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider text-[#FF7EA5] bg-[#FFF0F5] border border-[#FF7EA5]/20 uppercase">
                PNG or WEBP
              </span>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="flex items-center gap-1.5 mt-3 text-left text-xs font-medium text-[#FF6492] bg-[#FFF0F5] border border-[#FF6492]/20 px-3 py-1.5 rounded-lg w-full">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
