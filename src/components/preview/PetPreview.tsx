import React from "react";
import { motion } from "motion/react";
import { usePreview } from "../../hooks/usePreview";
import { MetadataCard } from "./MetadataCard";
import { NameEditor } from "./NameEditor";
import { PreviewActions } from "./PreviewActions";
import { LoadingSpinner } from "../ui/LoadingSpinner";

interface PetPreviewProps {
  id: string;
  url: string;
  type: "upload" | "generated";
  prompt?: string;
  onConfirm: (petName: string) => void;
  onCancel: () => void;
}

export const PetPreview: React.FC<PetPreviewProps> = ({
  id,
  url,
  type,
  prompt,
  onConfirm,
  onCancel,
}) => {
  const { loading, error, metadata, petName, setPetName, refreshName } = usePreview(id, url);

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[350px] p-8 select-none">
        <LoadingSpinner size="lg" />
        <p className="text-sm font-semibold text-gray-500 mt-4 animate-pulse">
          Analyzing companion metadata...
        </p>
      </div>
    );
  }

  if (error || !metadata) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[300px] p-8 text-center select-none bg-[#FFF0F5] border-2 border-[#FF6492]/20 rounded-2xl">
        <span className="text-4xl mb-4">😿</span>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Analysis Failed</h3>
        <p className="text-sm text-gray-600 max-w-xs mb-6">
          {error || "We couldn't analyze the transparency or format of your uploaded pet."}
        </p>
        <button
          onClick={onCancel}
          className="px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-md mx-auto flex flex-col items-center bg-white border border-[#E2E4E9] shadow-lg rounded-2xl p-6"
    >
      <h2 className="text-2xl font-black text-[#1A1A1E] font-sans tracking-tight mb-1 text-center">
        Review Your Companion
      </h2>
      <p className="text-xs text-gray-500 mb-6 text-center leading-relaxed max-w-xs">
        Ensure your pet fits nicely inside the frame below. Only transparent elements will float!
      </p>

      {/* Grid Canvas Frame with Checkerboard Pattern */}
      <div className="relative w-full aspect-square max-w-[260px] rounded-2xl border-4 border-[#1A1A1E]/10 bg-[linear-gradient(45deg,#F4F4F6_25%,transparent_25%),linear-gradient(-45deg,#F4F4F6_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#F4F4F6_75%),linear-gradient(-45deg,transparent_75%,#F4F4F6_75%)] bg-[size:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0] flex items-center justify-center p-6 shadow-inner overflow-hidden mb-6 group">
        
        {/* Transparent Aura Flare */}
        <div className="absolute inset-0 bg-radial-gradient from-white/40 to-transparent pointer-events-none" />

        {/* Floating companion render */}
        <motion.img
          src={url}
          alt={petName}
          className="max-w-full max-h-full object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.15)]"
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          referrerPolicy="no-referrer"
        />
        
        {/* Overlay Transparency Badge */}
        {metadata.transparent && (
          <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider text-green-700 bg-green-50 border border-green-200 uppercase shadow-xs">
            ✨ Transparent
          </span>
        )}
      </div>

      {/* Name Input Editor */}
      <NameEditor
        name={petName}
        onChange={setPetName}
        onRefresh={refreshName}
      />

      {/* Companion Details Tag Grid */}
      <MetadataCard
        width={metadata.width}
        height={metadata.height}
        transparent={metadata.transparent}
        size={metadata.size}
        type={type}
      />

      {/* Actions */}
      <PreviewActions
        onConfirm={() => onConfirm(petName)}
        onCancel={onCancel}
        confirmDisabled={petName.trim() === ""}
      />
    </motion.div>
  );
};
