'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

interface JourneyProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  onBack?: () => void;
  canGoBack?: boolean;
}

export const JourneyProgress: React.FC<JourneyProgressProps> = ({
  currentQuestion,
  totalQuestions = 12,
  onBack,
  canGoBack = false,
}) => {
  // Approximate remaining time calculation
  const remainingQuestions = totalQuestions - currentQuestion + 1;
  const remainingMinutes = Math.max(1, Math.ceil((remainingQuestions * 15) / 60));

  return (
    <div className="w-full max-w-3xl mx-auto mb-4 px-4">
      {/* Top Meta Row */}
      <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-[#64757D] mb-4 select-none">
        <div className="flex items-center gap-2">
          {canGoBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1 text-[#167FA3] hover:text-[#F4B740] transition-colors py-1 px-2.5 rounded-lg hover:bg-white/5 font-semibold"
              aria-label="Previous Question"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
          <span className="text-white/90 font-semibold tracking-wide">
            Question {currentQuestion} of {totalQuestions}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[#FFD978]/90 font-medium">
          <span className="w-2 h-2 rounded-full bg-[#F4B740] inline-block animate-pulse" />
          <span>~{remainingMinutes} min remaining</span>
        </div>
      </div>

      {/* 12-Node Journey Line */}
      <div className="relative flex items-center justify-between w-full px-1">
        {/* Background Track Line */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 bg-[#0C3347] z-0" />

        {/* Active Progress Track Fill */}
        <div
          className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 bg-gradient-to-r from-[#167FA3] to-[#F4B740] z-0 transition-all duration-300 ease-out"
          style={{
            width: `${((currentQuestion - 1) / (totalQuestions - 1)) * 100}%`,
          }}
        />

        {/* 12 Journey Nodes */}
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const nodeNumber = idx + 1;
          const isCompleted = nodeNumber < currentQuestion;
          const isCurrent = nodeNumber === currentQuestion;

          return (
            <div key={`node-${nodeNumber}`} className="relative z-10 flex items-center justify-center">
              <motion.div
                key={`anim-node-${nodeNumber}-${isCurrent}`}
                initial={isCurrent ? { scale: 1.4 } : false}
                animate={isCurrent ? { scale: [1.4, 1] } : { scale: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isCompleted
                    ? 'bg-[#167FA3] border border-[#FFD978]/60 shadow-[0_0_8px_rgba(22,127,163,0.6)]'
                    : isCurrent
                    ? 'bg-[#F4B740] border-2 border-white shadow-[0_0_12px_rgba(244,183,64,0.8)]'
                    : 'bg-[#071E2A] border border-[#0C3347]'
                }`}
              >
                {isCompleted && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#071E2A]" />
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
