'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CareerPathInfo } from '@/types';
import { Compass, CheckCircle } from 'lucide-react';

interface CareerPathCardProps {
  careerPath: CareerPathInfo;
}

export const CareerPathCard: React.FC<CareerPathCardProps> = ({ careerPath }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 my-8 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#167FA3]/20 to-transparent blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-2xl bg-[#0C3347] border border-[#FFD978]/40 text-[#FFD978]">
          <Compass className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#FFD978]">
            Suggested Pathway
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            {careerPath.title}
          </h3>
        </div>
      </div>

      <div className="inline-block px-3.5 py-1 rounded-full bg-[#167FA3]/20 border border-[#167FA3]/40 text-xs font-semibold text-[#FFD978] mb-4">
        {careerPath.badge}
      </div>

      <p className="text-sm sm:text-base text-white/90 leading-relaxed mb-4">
        {careerPath.description}
      </p>

      <div className="p-4 rounded-xl bg-[#071E2A]/70 border border-white/10 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-[#1F9D73] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#64757D] mb-1">
            Why this path fits your responses
          </h4>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            {careerPath.whyFit}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
