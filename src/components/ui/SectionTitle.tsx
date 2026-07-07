import React from 'react';
import { Sparkles } from 'lucide-react';

interface SectionTitleProps {
  id?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  align?: 'left' | 'center' | 'right';
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  id,
  title,
  subtitle,
  badge,
  align = 'center'
}) => {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end',
  };

  return (
    <div id={id || `section-title-${title.toLowerCase().replace(/\s+/g, '-')}`} className={`flex flex-col gap-2 ${alignClasses[align]} max-w-2xl mb-8`}>
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase text-[#8338EC] bg-[#8338EC]/10 border border-[#8338EC]/20">
          <Sparkles className="w-3.5 h-3.5" />
          {badge}
        </span>
      )}
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1A1A1E] font-sans">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base text-[#5C5F6A] leading-relaxed tracking-tight">
          {subtitle}
        </p>
      )}
    </div>
  );
};
