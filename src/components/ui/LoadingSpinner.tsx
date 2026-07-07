import React from 'react';
import { motion } from 'motion/react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text
}) => {
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -12, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const sizeClasses = {
    sm: 'w-2 h-2 bg-[#8338EC]',
    md: 'w-3.5 h-3.5 bg-[#8338EC]',
    lg: 'w-5 h-5 bg-[#8338EC]',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-6" id="loading-spinner">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex gap-2"
      >
        <motion.span variants={dotVariants} className={`${sizeClasses[size]} rounded-full bg-[#FF7EA5]`} />
        <motion.span variants={dotVariants} className={`${sizeClasses[size]} rounded-full bg-[#FFD166]`} />
        <motion.span variants={dotVariants} className={`${sizeClasses[size]} rounded-full bg-[#4EA8DE]`} />
      </motion.div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-medium text-[#5C5F6A] tracking-tight animate-pulse"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};
