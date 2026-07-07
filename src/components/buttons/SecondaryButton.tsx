import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: LucideIcon;
  fullWidth?: boolean;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  icon: Icon,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.01, y: -0.5 }}
      whileTap={disabled ? {} : { scale: 0.99, y: 0.5 }}
      id={`btn-sec-${props.id || children?.toString().toLowerCase().replace(/\s+/g, '-')}`}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 px-6 py-3 
        rounded-xl font-medium tracking-tight text-sm text-[#5C5F6A] bg-white
        border border-[#E2E4E9] hover:bg-[#F9F9FB] hover:text-[#1A1A1E]
        focus:outline-hidden focus:ring-4 focus:ring-[#F0F1F5]
        transition-colors duration-200 select-none cursor-pointer
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-40 cursor-not-allowed bg-transparent' : ''}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 text-[#9E9EAF]" />}
      <span>{children}</span>
    </motion.button>
  );
};
