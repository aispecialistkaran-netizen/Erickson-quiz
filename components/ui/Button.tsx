'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showArrow?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  showArrow = false,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-semibold transition-all duration-200 select-none rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B740] focus:ring-offset-2 focus:ring-offset-[#071E2A] disabled:opacity-50 disabled:pointer-events-none';

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-6 py-3.5 text-sm sm:text-base gap-2.5',
    lg: 'px-8 py-4 text-base sm:text-lg gap-3',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#F4B740] via-[#FFD978] to-[#F4B740] text-[#071E2A] shadow-lg shadow-[#F4B740]/25 hover:shadow-xl hover:shadow-[#F4B740]/40 border border-[#FFD978]/60 font-bold',
    secondary:
      'bg-[#167FA3] hover:bg-[#1992bd] text-white shadow-lg shadow-[#167FA3]/30 border border-white/15',
    outline:
      'bg-transparent text-white border border-white/20 hover:border-[#F4B740]/60 hover:bg-white/5',
    ghost:
      'bg-transparent text-[#64757D] hover:text-white hover:bg-white/5',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02, y: disabled || isLoading ? 0 : -2 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <span>{children}</span>
          {showArrow && (
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-current" />
            </motion.span>
          )}
        </>
      )}
    </motion.button>
  );
};
