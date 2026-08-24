'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DimensionScores, DimensionKey } from '@/types';
import { DIMENSION_LABELS } from '@/config/assessment';

interface DimensionChartProps {
  scores: DimensionScores;
}

export const DimensionChart: React.FC<DimensionChartProps> = ({ scores }) => {
  const dimensions: { key: DimensionKey; label: string; score: number }[] = [
    { key: 'purpose', label: DIMENSION_LABELS.purpose, score: scores.purpose },
    { key: 'coachingMindset', label: DIMENSION_LABELS.coachingMindset, score: scores.coachingMindset },
    { key: 'peopleDevelopment', label: DIMENSION_LABELS.peopleDevelopment, score: scores.peopleDevelopment },
    { key: 'learningReadiness', label: DIMENSION_LABELS.learningReadiness, score: scores.learningReadiness },
    { key: 'professionalIntent', label: DIMENSION_LABELS.professionalIntent, score: scores.professionalIntent },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 tracking-tight">
        Your Coaching Profile Dimensions
      </h3>

      <div className="space-y-5">
        {dimensions.map((dim, index) => (
          <div key={dim.key} className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
              <span className="text-white/90">{dim.label}</span>
              <span className="text-[#FFD978] font-bold">{dim.score} / 100</span>
            </div>

            {/* Track & Bar */}
            <div className="h-3.5 w-full bg-[#071E2A] rounded-full overflow-hidden p-0.5 border border-[#0C3347]">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${dim.score}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 + index * 0.1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-[#167FA3] via-[#FFD978] to-[#F4B740] shadow-[0_0_10px_rgba(244,183,64,0.3)]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
