import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: LucideIcon;
  loading?: boolean;
  color?: 'pink' | 'yellow' | 'blue' | 'green' | 'purple' | 'slate';
  fullWidth?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  icon: Icon,
  loading = false,
  color = 'purple',
  fullWidth = false,
  disabled,
  className = '',
  ...props
}) => {
  // Pastel-Notion Theme Mapping
  const colorClasses = {
    pink: 'bg-[#FF7EA5] hover:bg-[#FF6492] text-white shadow-xs focus:ring-[#FF7EA5]/40 border-b-4 border-[#E0527B]',
    yellow: 'bg-[#FFD166] hover:bg-[#FFC53D] text-[#1A1A1E] shadow-xs focus:ring-[#FFD166]/40 border-b-4 border-[#E2B13B]',
    blue: 'bg-[#4EA8DE] hover:bg-[#3A97D0] text-white shadow-xs focus:ring-[#4EA8DE]/40 border-b-4 border-[#3285B5]',
    green: 'bg-[#06D6A0] hover:bg-[#05C090] text-white shadow-xs focus:ring-[#06D6A0]/40 border-b-4 border-[#04A87D]',
    purple: 'bg-[#8338EC] hover:bg-[#7226DB] text-white shadow-xs focus:ring-[#8338EC]/40 border-b-4 border-[#6620CE]',
    slate: 'bg-[#1A1A1E] hover:bg-[#2F2F35] text-white shadow-xs focus:ring-[#1A1A1E]/40 border-b-4 border-[#0A0A0C]',
  };

  const isBtnDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={isBtnDisabled ? {} : { scale: 1.02, y: -1 }}
      whileTap={isBtnDisabled ? {} : { scale: 0.98, y: 1 }}
      id={`btn-${props.id || children?.toString().toLowerCase().replace(/\s+/g, '-')}`}
      disabled={isBtnDisabled}
      className={`
        relative inline-flex items-center justify-center gap-2 px-6 py-3 
        rounded-xl font-medium tracking-tight text-sm transition-colors duration-200
        focus:outline-hidden focus:ring-4 select-none cursor-pointer
        ${colorClasses[color]}
        ${fullWidth ? 'w-full' : ''}
        ${isBtnDisabled ? 'opacity-50 cursor-not-allowed border-b-0 translate-y-[2px] shadow-none bg-[#E2E4E9] text-[#9E9EAF]' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon ? (
        <Icon className="w-5 h-5" />
      ) : null}
      
      <span>{children}</span>
    </motion.button>
  );
};
