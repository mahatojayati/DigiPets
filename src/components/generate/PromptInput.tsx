import React from "react";
import { Sparkles } from "lucide-react";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isGenerating: boolean;
  maxLength?: number;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  value,
  onChange,
  onSubmit,
  isGenerating,
  maxLength = 100,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <div className="w-full flex flex-col gap-1.5 select-none">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
        Describe Your Companion
      </label>
      
      <div className="relative w-full flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Cute corgi wizard with a tiny star wand"
          maxLength={maxLength}
          disabled={isGenerating}
          className="w-full pl-4 pr-11 py-3 bg-white border-2 border-gray-200 focus:border-[#FF7EA5] rounded-xl font-sans text-sm outline-none transition-all placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-400 font-medium"
        />
        
        <span className="absolute right-4 text-xs font-bold text-gray-400 select-none">
          {maxLength - value.length}
        </span>
      </div>
    </div>
  );
};
