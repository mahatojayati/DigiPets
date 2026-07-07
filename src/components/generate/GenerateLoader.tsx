import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const STAGES = [
  "Summoning your companion...",
  "Drafting concept sketch...",
  "Mixing custom pastels...",
  "Polishing outline strokes...",
  "Applying dynamic transparency...",
  "Infusing playful energy...",
];

export const GenerateLoader: React.FC = () => {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % STAGES.length);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center select-none">
      {/* Visual Summoning Aura */}
      <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
        {/* Soft rotating pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-dashed border-[#FFB7B2]/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-3 rounded-full border-4 border-dotted border-[#B5EAD7]/50"
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Glowing aura */}
        <motion.div
          className="absolute inset-6 bg-gradient-to-tr from-[#FFC6FF] to-[#9BF6FF] rounded-full blur-xl opacity-60"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Central Wand Sparkle */}
        <motion.div
          className="relative w-12 h-12 rounded-full bg-white shadow-lg border border-[#FFEAA7] flex items-center justify-center text-[#F1C40F]"
          animate={{
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-6 h-6 fill-[#FFEAA7]/30" />
        </motion.div>
      </div>

      <div className="min-h-[48px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={stageIndex}
            className="text-base font-bold text-[#1A1A1E] font-sans tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {STAGES[stageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
      
      <p className="text-xs text-[#9E9EAF] mt-2 max-w-xs leading-relaxed">
        Our cute-magic algorithm is designing a perfectly transparent vector virtual pet for your desktop!
      </p>
    </div>
  );
};
