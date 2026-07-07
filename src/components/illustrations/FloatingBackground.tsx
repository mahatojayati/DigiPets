import React from 'react';
import { motion } from 'motion/react';
import { Heart, Star, Cloud, Leaf } from 'lucide-react';

interface FloatingDoodleProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: string;
  y?: string;
  scale?: number;
}

const FloatingDoodle: React.FC<FloatingDoodleProps> = ({
  children,
  delay = 0,
  duration = 10,
  x = '10%',
  y = '10%',
  scale = 1
}) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: 0.12,
        pointerEvents: 'none',
      }}
      animate={{
        y: ['0px', '-25px', '0px'],
        x: ['0px', '15px', '0px'],
        rotate: [0, 15, -15, 0],
        scale: [scale, scale * 1.08, scale],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

export const FloatingBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" id="floating-background">
      {/* Pastel Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#FFFDF0]/40 via-[#FFF0F5]/20 to-transparent" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[#F0FFF4]/20 blur-3xl" />
      <div className="absolute top-1/3 left-[-100px] w-[400px] h-[400px] rounded-full bg-[#F5F3FF]/30 blur-3xl" />

      {/* Cloud Doodles */}
      <FloatingDoodle x="8%" y="15%" delay={1} duration={12} scale={1.2}>
        <Cloud className="w-16 h-16 text-[#4EA8DE]" />
      </FloatingDoodle>
      <FloatingDoodle x="88%" y="22%" delay={3} duration={14} scale={1}>
        <Cloud className="w-14 h-14 text-[#4EA8DE]" />
      </FloatingDoodle>
      <FloatingDoodle x="15%" y="70%" delay={5} duration={11} scale={0.9}>
        <Cloud className="w-10 h-10 text-[#4EA8DE]" />
      </FloatingDoodle>

      {/* Heart Doodles */}
      <FloatingDoodle x="22%" y="35%" delay={2} duration={9} scale={1.1}>
        <Heart className="w-8 h-8 text-[#FF7EA5] fill-[#FF7EA5]" />
      </FloatingDoodle>
      <FloatingDoodle x="78%" y="65%" delay={4} duration={8} scale={0.95}>
        <Heart className="w-7 h-7 text-[#FF7EA5]" />
      </FloatingDoodle>

      {/* Star Doodles */}
      <FloatingDoodle x="45%" y="8%" delay={0} duration={10} scale={1}>
        <Star className="w-8 h-8 text-[#FFD166] fill-[#FFD166]" />
      </FloatingDoodle>
      <FloatingDoodle x="92%" y="48%" delay={2.5} duration={11} scale={1.1}>
        <Star className="w-9 h-9 text-[#FFD166]" />
      </FloatingDoodle>
      <FloatingDoodle x="35%" y="82%" delay={1.5} duration={9.5} scale={0.8}>
        <Star className="w-6 h-6 text-[#FFD166] fill-[#FFD166]" />
      </FloatingDoodle>

      {/* Leaf Doodles */}
      <FloatingDoodle x="68%" y="12%" delay={0.5} duration={13} scale={0.9}>
        <Leaf className="w-7 h-7 text-[#06D6A0]" />
      </FloatingDoodle>
      <FloatingDoodle x="12%" y="45%" delay={3.5} duration={10} scale={1}>
        <Leaf className="w-8 h-8 text-[#06D6A0]" />
      </FloatingDoodle>
      <FloatingDoodle x="62%" y="78%" delay={1.8} duration={12} scale={1.05}>
        <Leaf className="w-9 h-9 text-[#06D6A0] fill-[#06D6A0]" />
      </FloatingDoodle>

      {/* Cute Paw / Animal Doodles using customized SVGs */}
      <FloatingDoodle x="52%" y="55%" delay={6} duration={15} scale={1.3}>
        <svg className="w-10 h-10 text-[#8338EC]" viewBox="0 0 24 24" fill="currentColor" opacity="0.8">
          <circle cx="12" cy="13" r="4" />
          <circle cx="7" cy="7" r="2" />
          <circle cx="11" cy="5" r="2" />
          <circle cx="16" cy="6" r="2" />
          <circle cx="19" cy="9" r="2" />
        </svg>
      </FloatingDoodle>
      <FloatingDoodle x="82%" y="8%" delay={2} duration={13} scale={0.95}>
        <svg className="w-8 h-8 text-[#8338EC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="13" r="4" />
          <circle cx="7" cy="7" r="2" />
          <circle cx="11" cy="5" r="2" />
          <circle cx="16" cy="6" r="2" />
          <circle cx="19" cy="9" r="2" />
        </svg>
      </FloatingDoodle>
    </div>
  );
};
