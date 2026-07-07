import React from "react";

const SUGGESTIONS = [
  "Shiba Inu",
  "Fox Mage",
  "Cyber Cat",
  "Tiny Penguin",
  "Baby Dragon",
  "Floating Ghost",
  "Sleepy Panda",
  "Robot Hamster",
];

interface PromptSuggestionsProps {
  onSelect: (prompt: string) => void;
}

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onSelect }) => {
  return (
    <div className="w-full flex flex-col gap-2 mt-4 select-none">
      <p className="text-xs font-bold text-[#9E9EAF] tracking-wider uppercase">
        Need some ideas?
      </p>
      
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onSelect(item)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-[#FFF0F5] hover:text-[#FF7EA5] hover:border-[#FF7EA5]/30 border border-transparent transition-all cursor-pointer active:scale-95"
          >
            🌟 {item}
          </button>
        ))}
      </div>
    </div>
  );
};
