'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STAGES = [
  'Understanding your motivations...',
  'Mapping your coaching mindset...',
  'Identifying your next step...',
];

interface AnalysisLoaderProps {
  onComplete: () => void;
}

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ onComplete }) => {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 600);
          return prev;
        }
      });
    }, 600);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-16 text-center select-none">
      <div className="glass-panel rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[380px]">
        {/* Ambient Radial Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#167FA3]/20 via-transparent to-[#F4B740]/10 blur-2xl pointer-events-none" />

        {/* Animated Central Node Constellation Spinner */}
        <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
          {/* Outer rotating pulse ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-[#167FA3]/40"
          />
          {/* Inner counter-rotating ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
            className="absolute inset-2 rounded-full border border-dotted border-[#F4B740]/60"
          />

          {/* Central Glowing Core */}
          <motion.div
            animate={{ scale: [0.95, 1.1, 0.95] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#167FA3] to-[#F4B740] flex items-center justify-center shadow-[0_0_20px_rgba(244,183,64,0.6)]"
          >
            <div className="w-4 h-4 rounded-full bg-white animate-ping" />
          </motion.div>
        </div>

        {/* Main Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 tracking-tight">
          Building your Coaching Readiness Profile
        </h3>

        {/* Rotating Stage Subtitle */}
        <div className="h-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={stageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="text-sm sm:text-base font-medium text-[#FFD978]"
            >
              {STAGES[stageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Stage Progress Nodes */}
        <div className="flex items-center gap-2 mt-6">
          {STAGES.map((_, idx) => (
            <div
              key={`stage-dot-${idx}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === stageIndex
                  ? 'w-8 bg-[#F4B740]'
                  : idx < stageIndex
                  ? 'w-3 bg-[#167FA3]'
                  : 'w-3 bg-[#0C3347]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
