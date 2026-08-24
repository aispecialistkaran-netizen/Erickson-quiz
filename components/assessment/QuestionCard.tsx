'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '@/types';
import { Check, ArrowRight } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
  direction?: number; // 1 for next, -1 for back
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOptionId,
  onSelectOption,
  direction = 1,
}) => {
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      scale: 0.98,
    }),
  };

  return (
    <div className="w-full max-w-[800px] mx-auto px-2 sm:px-4">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={question.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Ambient Glow in Card Header */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#167FA3]/20 to-transparent blur-3xl rounded-full pointer-events-none" />

          {/* Question Text */}
          <h2 className="text-base sm:text-2xl font-bold tracking-tight text-white leading-snug mb-3 sm:mb-5 relative z-10">
            {question.questionText}
          </h2>

          {/* Answer Options Stack */}
          <div className="space-y-2 sm:space-y-3 relative z-10" role="radiogroup" aria-label={question.questionText}>
            {question.options.map((option) => {
              const isSelected = selectedOptionId === option.id;

              return (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onSelectOption(option.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectOption(option.id);
                    }
                  }}
                  tabIndex={0}
                  role="radio"
                  aria-checked={isSelected}
                  className={`group relative flex items-center justify-between p-3 sm:p-5 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-200 min-h-[50px] sm:min-h-[64px] border ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#167FA3]/30 via-[#0C3347]/80 to-[#167FA3]/20 border-[#F4B740] shadow-[0_0_20px_rgba(244,183,64,0.2)]'
                      : 'bg-[#0C3347]/40 hover:bg-[#167FA3]/15 border-white/10 hover:border-white/25'
                  } focus:outline-none focus:ring-2 focus:ring-[#F4B740] focus:ring-offset-2 focus:ring-offset-[#071E2A]`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 pr-2 sm:pr-3">
                    {/* Option Marker Circle */}
                    <div
                      className={`w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-xs sm:text-base shrink-0 transition-all duration-200 ${
                        isSelected
                          ? 'bg-[#F4B740] text-[#071E2A] shadow-md shadow-[#F4B740]/30 font-extrabold'
                          : 'bg-[#071E2A] text-[#64757D] group-hover:text-white border border-white/10'
                      }`}
                    >
                      {isSelected ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        >
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                        </motion.div>
                      ) : (
                        option.id
                      )}
                    </div>

                    {/* Option Text */}
                    <span
                      className={`text-xs sm:text-lg font-medium leading-normal sm:leading-relaxed transition-colors ${
                        isSelected ? 'text-white font-semibold' : 'text-white/90 group-hover:text-white'
                      }`}
                    >
                      {option.text}
                    </span>
                  </div>

                  {/* Directional Icon */}
                  <div className="shrink-0 text-[#64757D] group-hover:text-[#FFD978] transition-colors">
                    <ArrowRight
                      className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
                        isSelected ? 'text-[#F4B740] translate-x-1' : 'group-hover:translate-x-1'
                      }`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
