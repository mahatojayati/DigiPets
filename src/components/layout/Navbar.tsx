import React from 'react';
import { Logo } from '../illustrations/Logo';
import { usePet } from '../../hooks/usePet';
import { RefreshCw, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export const Navbar: React.FC = () => {
  const { activePet, resetState } = usePet();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-[#E2E4E9]" id="app-navbar">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Logo size="sm" />

        {/* Right: Companion Status & Actions */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#5C5F6A] mr-2">
            <a href="#" className="hover:text-[#1A1A1E] transition-colors flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD166]" /> Home
            </a>
            <a href="#about" className="hover:text-[#1A1A1E] transition-colors flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> About Companions
            </a>
          </nav>

          {activePet ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2.5 bg-[#F5F3FF] border border-[#8338EC]/20 pl-2.5 pr-3 py-1.5 rounded-full shadow-xs"
            >
              <div className="w-6 h-6 rounded-full bg-white border border-[#E2E4E9] flex items-center justify-center overflow-hidden">
                <img 
                  src={activePet.imageUrl} 
                  alt={activePet.name} 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#1A1A1E] leading-none">{activePet.name}</p>
                <p className="text-[10px] text-[#8338EC] font-semibold leading-none mt-0.5 capitalize">Active Pet</p>
              </div>
              
              <button
                onClick={resetState}
                className="ml-1.5 p-1 hover:bg-[#8338EC]/10 rounded-full text-[#8338EC] hover:text-[#7226DB] transition-colors cursor-pointer"
                title="Create a new companion"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </motion.div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#9E9EAF]">
              <span className="w-2 h-2 rounded-full bg-[#E2E4E9]" />
              <span>No active pet</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
