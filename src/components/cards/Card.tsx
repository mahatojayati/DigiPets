import React from 'react';
import { motion } from 'motion/react';

interface CardProps {
  id?: string;
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  hoverable?: boolean;
  className?: string;
  colorTheme?: 'pink' | 'yellow' | 'blue' | 'green' | 'purple' | 'slate';
}

export const Card: React.FC<CardProps> = ({
  id,
  children,
  selected = false,
  onClick,
  hoverable = true,
  className = '',
  colorTheme = 'purple'
}) => {
  const themeBorderColor = {
    pink: 'border-[#FF7EA5] ring-[#FF7EA5]/15 bg-[#FFF0F5]/30',
    yellow: 'border-[#FFD166] ring-[#FFD166]/15 bg-[#FFFDF0]/30',
    blue: 'border-[#4EA8DE] ring-[#4EA8DE]/15 bg-[#F0F8FF]/30',
    green: 'border-[#06D6A0] ring-[#06D6A0]/15 bg-[#F0FFF4]/30',
    purple: 'border-[#8338EC] ring-[#8338EC]/15 bg-[#F5F3FF]/30',
    slate: 'border-[#1A1A1E] ring-[#1A1A1E]/15 bg-[#F0F1F5]/30',
  };

  const isClickable = !!onClick;

  return (
    <motion.div
      id={id || 'ui-card'}
      whileHover={hoverable && isClickable ? { y: -4, scale: 1.01 } : {}}
      whileTap={hoverable && isClickable ? { scale: 0.99 } : {}}
      onClick={onClick}
      className={`
        relative p-6 md:p-8 rounded-2xl border-2 bg-white
        transition-all duration-300
        ${isClickable ? 'cursor-pointer select-none' : ''}
        ${selected 
          ? `${themeBorderColor[colorTheme]} border-t-[3px] border-b-[6px] shadow-sm ring-4` 
          : 'border-[#E2E4E9] border-b-4 hover:border-[#D1D5DB] shadow-xs'
        }
        ${className}
      `}
    >
      {selected && (
        <div className={`
          absolute -top-3 -right-3 w-6 h-6 rounded-full flex items-center justify-center text-white font-extrabold text-xs shadow-md animate-bounce
          ${colorTheme === 'pink' ? 'bg-[#FF7EA5]' : ''}
          ${colorTheme === 'yellow' ? 'bg-[#FFD166] text-[#1A1A1E]' : ''}
          ${colorTheme === 'blue' ? 'bg-[#4EA8DE]' : ''}
          ${colorTheme === 'green' ? 'bg-[#06D6A0]' : ''}
          ${colorTheme === 'purple' ? 'bg-[#8338EC]' : ''}
          ${colorTheme === 'slate' ? 'bg-[#1A1A1E]' : ''}
        `}>
          ✓
        </div>
      )}
      {children}
    </motion.div>
  );
};
