import React from 'react';
import { Wand2, Sparkles, RefreshCw } from 'lucide-react';
import { Card } from './Card';
import { PRESET_AI_PROMPTS } from '../../lib/constants';
import { getRandomPrompt } from '../../lib/helpers';

interface GenerateCardProps {
  id?: string;
  selected: boolean;
  onSelect: () => void;
  promptValue: string;
  onPromptChange: (value: string) => void;
}

export const GenerateCard: React.FC<GenerateCardProps> = ({
  id,
  selected,
  onSelect,
  promptValue,
  onPromptChange
}) => {
  const handleRandomize = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering Card select twice
    onSelect();
    const randomized = getRandomPrompt(promptValue);
    onPromptChange(randomized);
  };

  const selectPreset = (preset: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    onPromptChange(preset);
  };

  return (
    <Card
      id={id || 'generate-card'}
      selected={selected}
      onClick={onSelect}
      colorTheme="purple"
      className="flex flex-col h-full"
    >
      <div className="flex flex-col items-center text-center flex-1">
        {/* Magic hand-drawn style container */}
        <div className="relative mb-6">
          <div className="absolute inset-[-6px] bg-[#F5F3FF] rounded-full border-2 border-dashed border-[#8338EC]/30" />
          <div className="relative w-16 h-16 rounded-full bg-[#F5F3FF] border-2 border-[#8338EC]/30 flex items-center justify-center text-[#8338EC]">
            <Wand2 className="w-8 h-8" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-[#1A1A1E] mb-2 font-sans tracking-tight">
          Generate AI Pet
        </h3>
        
        <p className="text-sm text-[#5C5F6A] mb-6 tracking-tight max-w-xs">
          Describe your dream companion! Our backend will illustrate and paint a brand-new transparent pet.
        </p>

        {/* Prompt Input Area */}
        <div 
          className="w-full flex flex-col gap-2.5 text-left"
          onClick={(e) => e.stopPropagation()} // Stop clicking input from trigger card selection multiple times
        >
          <div className="relative">
            <textarea
              id="ai-prompt-textarea"
              placeholder="Describe your pet (e.g. 'cute fluffy brown owl holding a wizard wand')..."
              value={promptValue}
              onChange={(e) => {
                onPromptChange(e.target.value);
                onSelect(); // Automatically select this method when typing
              }}
              className="w-full h-24 px-4 py-3 rounded-xl border-2 border-[#E2E4E9] focus:border-[#8338EC] focus:ring-3 focus:ring-[#8338EC]/10 text-sm font-medium text-[#1A1A1E] placeholder-[#9E9EAF] resize-none outline-hidden transition-all"
            />
            
            <button
              type="button"
              onClick={handleRandomize}
              className="absolute right-3 bottom-3 p-1.5 rounded-lg text-[#9E9EAF] hover:text-[#8338EC] hover:bg-[#F5F3FF] transition-all cursor-pointer"
              title="Get random idea"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Presets Grid */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#9E9EAF] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FFD166]" /> Or try an idea:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-[105px] overflow-y-auto pr-1">
              {PRESET_AI_PROMPTS.slice(0, 4).map((preset, index) => {
                const isSelectedPreset = promptValue === preset;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={(e) => selectPreset(preset, e)}
                    className={`
                      text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium tracking-tight border transition-all cursor-pointer
                      ${isSelectedPreset
                        ? 'bg-[#8338EC]/10 text-[#8338EC] border-[#8338EC]/30'
                        : 'bg-[#F9F9FB] hover:bg-[#F5F3FF] text-[#5C5F6A] hover:text-[#8338EC] border-[#E2E4E9] hover:border-[#8338EC]/20'
                      }
                    `}
                  >
                    {preset.length > 32 ? preset.substring(0, 32) + '...' : preset}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
