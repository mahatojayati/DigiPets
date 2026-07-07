import React from 'react';
import { Cat, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E2E4E9] py-8 text-[#9E9EAF]" id="app-footer">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left column */}
        <div className="flex items-center gap-2 text-sm font-medium">
          <Cat className="w-4 h-4 text-[#FF7EA5]" />
          <span>© 2026 Digital Pets. All rights reserved.</span>
        </div>

        {/* Center column - badges */}
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider text-[#8338EC] bg-[#8338EC]/10 border border-[#8338EC]/20 uppercase">
            React 19
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider text-[#FF7EA5] bg-[#FF7EA5]/10 border border-[#FF7EA5]/20 uppercase">
            Framer Motion
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider text-[#4EA8DE] bg-[#4EA8DE]/10 border border-[#4EA8DE]/20 uppercase">
            Express
          </span>
        </div>

        {/* Right column */}
        <div className="flex items-center gap-1.5 text-xs font-semibold hover:text-[#5C5F6A] transition-colors">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-[#FF6492] fill-[#FF6492] animate-pulse" />
          <span>for friendly desktop surfing</span>
        </div>
      </div>
    </footer>
  );
};
