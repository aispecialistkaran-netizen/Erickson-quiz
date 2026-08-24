'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp } from 'lucide-react';

interface InsightCardProps {
  strongest: {
    label: string;
    score: number;
    insight: string;
  };
  growth: {
    label: string;
    score: number;
    insight: string;
  };
}

export const InsightCard: React.FC<InsightCardProps> = ({
  strongest,
  growth,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
      {/* Strongest Signal Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass-panel rounded-3xl p-6 border border-[#F4B740]/40 relative overflow-hidden shadow-xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-[#F4B740]/20 text-[#F4B740] border border-[#F4B740]/30">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#FFD978]">
              Highest Dimension
            </span>
            <h4 className="text-sm font-bold text-white">Your Strongest Signal</h4>
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <h3 className="text-lg font-bold text-white">{strongest.label}</h3>
          <span className="text-lg font-extrabold text-[#F4B740]">{strongest.score}/100</span>
        </div>

        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
          {strongest.insight}
        </p>
      </motion.div>

      {/* Growth Opportunity Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="glass-panel rounded-3xl p-6 border border-[#167FA3]/40 relative overflow-hidden shadow-xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-[#167FA3]/20 text-[#167FA3] border border-[#167FA3]/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#167FA3]">
              Development Focus
            </span>
            <h4 className="text-sm font-bold text-white">Your Biggest Growth Opportunity</h4>
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <h3 className="text-lg font-bold text-white">{growth.label}</h3>
          <span className="text-lg font-extrabold text-[#167FA3]">{growth.score}/100</span>
        </div>

        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
          {growth.insight}
        </p>
      </motion.div>
    </div>
  );
};
