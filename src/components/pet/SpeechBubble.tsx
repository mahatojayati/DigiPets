import React from "react";
import { motion, AnimatePresence } from "motion/react";

interface SpeechBubbleProps {
  text: string | null;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = React.memo(({ text }) => {
  return (
    <AnimatePresence>
      {text && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 z-50 min-w-[120px] max-w-[200px]"
        >
          {/* Main Bubble Container */}
          <div className="bg-white text-gray-800 text-xs font-semibold px-3 py-2 rounded-xl shadow-md border border-gray-100 text-center select-none leading-tight relative">
            {text}
            {/* Downward pointing carrot/arrow */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

SpeechBubble.displayName = "SpeechBubble";
