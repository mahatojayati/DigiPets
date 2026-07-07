import React, { useRef } from "react";
import { RefreshCw, Edit2 } from "lucide-react";
import { motion } from "motion/react";

interface NameEditorProps {
  name: string;
  onChange: (value: string) => void;
  onRefresh: () => void;
}

export const NameEditor: React.FC<NameEditorProps> = ({
  name,
  onChange,
  onRefresh,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  return (
    <div className="w-full flex flex-col gap-1.5 select-none mt-4">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide text-left">
        Name Your Companion
      </label>

      <div className="relative flex items-center w-full">
        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => onChange(e.target.value.slice(0, 20))} // max 20 chars
          placeholder="Enter pet name..."
          className="w-full pl-4 pr-24 py-3 bg-white border-2 border-gray-200 focus:border-[#FF7EA5] rounded-xl font-sans text-base font-bold text-gray-800 outline-none transition-all shadow-sm"
        />

        {/* Buttons right-aligned inside input for sleek Nintendo feel */}
        <div className="absolute right-2 flex items-center gap-1">
          {/* Refresh/Dice Button */}
          <motion.button
            whileTap={{ scale: 0.9, rotate: 180 }}
            type="button"
            onClick={onRefresh}
            className="p-1.5 rounded-lg text-gray-500 hover:text-[#FF7EA5] hover:bg-[#FFF0F5] transition-all cursor-pointer"
            title="Randomize Name"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>

          {/* Edit Focus Trigger */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={focusInput}
            className="p-1.5 rounded-lg text-gray-500 hover:text-[#FF7EA5] hover:bg-[#FFF0F5] transition-all cursor-pointer mr-1"
            title="Edit Name"
          >
            <Edit2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
