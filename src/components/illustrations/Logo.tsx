import React from 'react';
import { motion } from 'motion/react';
import { Cat, Sparkles } from 'lucide-react';

interface LogoProps {
  id?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  id,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: {
      text: 'text-lg',
      icon: 'w-5 h-5',
      spark: 'w-3 h-3',
      gap: 'gap-1.5'
    },
    md: {
      text: 'text-2xl',
      icon: 'w-7 h-7',
      spark: 'w-4 h-4',
      gap: 'gap-2'
    },
    lg: {
      text: 'text-4xl',
      icon: 'w-11 h-11',
      spark: 'w-6 h-6',
      gap: 'gap-3.5'
    },
  };

  return (
    <div
      id={id || 'app-logo'}
      className={`flex items-center ${sizeClasses[size].gap} font-sans font-black tracking-tight select-none cursor-pointer`}
    >
      <div className="relative">
        {/* Animated Background blob */}
        <motion.div
          animate={{
            borderRadius: ["42% 58% 70% 30% / 45% 45% 55% 55%", "70% 30% 52% 48% / 60% 40% 60% 40%", "42% 58% 70% 30% / 45% 45% 55% 55%"],
            rotate: [0, 15, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute inset-[-4px] bg-[#FFF0F5] border-2 border-dashed border-[#FF7EA5]/40`}
        />

        {/* Main Logo Icon Container */}
        <motion.div
          whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-tr from-[#8338EC] to-[#FF7EA5] p-1.5 rounded-2xl shadow-xs text-white flex items-center justify-center"
        >
          <Cat className={sizeClasses[size].icon} />
        </motion.div>
        
        {/* Floating Sparkle */}
        <motion.div
          animate={{
            y: [-2, 2, -2],
            scale: [0.9, 1.1, 0.9],
            rotate: [0, 45, 0]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-1.5 -right-1.5 text-[#FFD166]"
        >
          <Sparkles className={sizeClasses[size].spark} />
        </motion.div>
      </div>

      <span className={`font-extrabold ${sizeClasses[size].text} bg-linear-to-r from-[#1A1A1E] via-[#8338EC] to-[#FF7EA5] bg-clip-text text-transparent`}>
        Digital<span className="text-[#FF7EA5]">Pets</span>
      </span>
    </div>
  );
};
