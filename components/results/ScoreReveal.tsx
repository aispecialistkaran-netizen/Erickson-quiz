'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ScoreRevealProps {
  score: number; // 0-100
  bandLabel: string;
  supportingMessage: string;
}

export const ScoreReveal: React.FC<ScoreRevealProps> = ({
  score,
  bandLabel,
  supportingMessage,
}) => {
  const [displayedScore, setDisplayedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500; // ms
    const incrementTime = 20;
    const steps = duration / incrementTime;
    const stepValue = score / steps;

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= score) {
        setDisplayedScore(score);
        clearInterval(timer);
      } else {
        setDisplayedScore(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [score]);

  // SVG Circle stroke dash calculations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-full max-w-2xl mx-auto text-center py-10 px-4">
      {/* Background Ambient Particles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 0.8, 0],
              x: Math.cos((i * 30 * Math.PI) / 180) * 160,
              y: Math.sin((i * 30 * Math.PI) / 180) * 160,
            }}
            transition={{ duration: 1.8, delay: 0.2 + i * 0.05, ease: 'easeOut' }}
            className="absolute w-3 h-3 rounded-full bg-[#F4B740]"
          />
        ))}
      </div>

      {/* Main Radial Ring & Score Counter Container */}
      <div className="relative inline-flex items-center justify-center mb-6">
        {/* Glowing Background Radial */}
        <div className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-[#167FA3]/30 via-[#F4B740]/20 to-transparent blur-3xl" />

        <svg className="w-56 h-56 sm:w-64 sm:h-64 transform -rotate-90">
          {/* Track Circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#0C3347"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Animated Progress Circle */}
          <motion.circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="url(#goldGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#167FA3" />
              <stop offset="50%" stopColor="#FFD978" />
              <stop offset="100%" stopColor="#F4B740" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Displayed Number */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xs uppercase tracking-widest text-[#64757D] font-bold mb-1">
            Readiness Score
          </span>
          <span className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight">
            {displayedScore}
          </span>
          <span className="text-xs font-semibold text-[#FFD978]">out of 100</span>
        </div>
      </div>

      {/* Readiness Band Label */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <h2 className="text-2xl sm:text-4xl font-extrabold text-gradient-gold mb-4">
          {bandLabel}
        </h2>
        <p className="text-sm sm:text-base text-white/85 max-w-xl mx-auto leading-relaxed glass-panel p-5 sm:p-6 rounded-2xl border border-white/10">
          {supportingMessage}
        </p>
      </motion.div>
    </div>
  );
};
