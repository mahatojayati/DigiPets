import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '../../lib/constants';

export const Hero: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', damping: 25, stiffness: 200 }
    }
  };

  return (
    <motion.section
      id="hero-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 md:mb-14 relative"
    >
      {/* Playful Floating Sparkles Badge */}
      <motion.div
        variants={itemVariants}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-[#8338EC] bg-[#8338EC]/10 border border-[#8338EC]/20 mb-5 shadow-xs"
      >
        <Sparkles className="w-4 h-4 text-[#FFD166] fill-[#FFD166] animate-pulse" />
        <span>STEP 1: PET FOUNDATION IS LIVE!</span>
      </motion.div>

      {/* Main Title with Cute Accents */}
      <motion.h1
        variants={itemVariants}
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#1A1A1E] font-sans mb-4 leading-none select-none relative"
      >
        {APP_NAME}
        <motion.span
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-block absolute -top-4 -right-8 md:-top-5 md:-right-10 text-3xl md:text-4xl"
        >
          ✨
        </motion.span>
      </motion.h1>

      {/* Tagline / Subtitle */}
      <motion.p
        variants={itemVariants}
        className="text-lg sm:text-xl text-[#5C5F6A] leading-relaxed tracking-tight max-w-2xl font-sans"
      >
        {APP_TAGLINE}
      </motion.p>
    </motion.section>
  );
};
