import React from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

interface UploadProgressProps {
  progress: number;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ progress }) => {
  return (
    <div className="w-full flex flex-col items-center py-4 px-2 select-none">
      <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-[#FF7EA5]">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Uploading Companion... {progress}%</span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-3 bg-[#E2E4E9] rounded-full overflow-hidden border border-gray-200 shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-[#FF7EA5] to-[#FF8B94] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};
