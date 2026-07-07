import React from "react";
import { Move, Image, CheckCircle, Scale } from "lucide-react";
import { formatBytes } from "../../lib/helpers";

interface MetadataCardProps {
  width: number;
  height: number;
  transparent: boolean;
  size: number;
  type: "upload" | "generated";
}

export const MetadataCard: React.FC<MetadataCardProps> = ({
  width,
  height,
  transparent,
  size,
  type,
}) => {
  return (
    <div className="w-full grid grid-cols-2 gap-3 mt-4 select-none">
      {/* Resolution Tag */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-gray-100 bg-[#E2F0CB]/30 text-[#4D8054]">
        <Move className="w-4.5 h-4.5 shrink-0" />
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-85">Resolution</span>
          <span className="text-xs font-black font-mono">{width} &times; {height}</span>
        </div>
      </div>

      {/* Transparency Tag */}
      <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-gray-100 ${transparent ? 'bg-[#B5EAD7]/30 text-[#2C6E5C]' : 'bg-[#FFB7B2]/20 text-[#8C3A3A]'}`}>
        <CheckCircle className="w-4.5 h-4.5 shrink-0" />
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-85">Background</span>
          <span className="text-xs font-black">{transparent ? "Transparent" : "Opaque"}</span>
        </div>
      </div>

      {/* File Size Tag */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-gray-100 bg-[#C7CEEA]/30 text-[#48508A]">
        <Scale className="w-4.5 h-4.5 shrink-0" />
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-85">File Size</span>
          <span className="text-xs font-black font-mono">{formatBytes(size)}</span>
        </div>
      </div>

      {/* Creator/Type Tag */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-gray-100 bg-[#FFDAC1]/30 text-[#9E5D30]">
        <Image className="w-4.5 h-4.5 shrink-0" />
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-85">Source</span>
          <span className="text-xs font-black capitalize">{type === "upload" ? "Local Upload" : "AI Magic"}</span>
        </div>
      </div>
    </div>
  );
};
