'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface MilestoneToastProps {
  message: string | null;
  onDismiss: () => void;
}

export const MilestoneToast: React.FC<MilestoneToastProps> = ({
  message,
  onDismiss,
}) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 2600);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-gradient-to-r from-[#0C3347] via-[#167FA3] to-[#0C3347] border border-[#FFD978]/40 text-white shadow-xl shadow-black/40 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#F4B740] animate-spin" style={{ animationDuration: '4s' }} />
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#FFD978]">
              {message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
