import React from "react";
import { AlertCircle, X } from "lucide-react";

interface UploadErrorProps {
  message: string;
  onClear: () => void;
}

export const UploadError: React.FC<UploadErrorProps> = ({ message, onClear }) => {
  return (
    <div className="flex items-start gap-2.5 text-left text-xs font-semibold text-[#FF6492] bg-[#FFF0F5] border-2 border-[#FF6492]/20 px-4 py-3 rounded-xl w-full relative group">
      <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-[#FF6492]" />
      <div className="flex-1 pr-6">
        <p className="font-bold mb-0.5">Upload Failed</p>
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="absolute top-2.5 right-2.5 p-1 text-[#FF6492]/60 hover:text-[#FF6492] hover:bg-[#FF6492]/10 rounded-lg transition-all cursor-pointer"
        aria-label="Dismiss error"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
