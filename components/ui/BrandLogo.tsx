'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const containerSizes = {
    sm: 'h-12 sm:h-14',
    md: 'h-16 sm:h-24 md:h-28',
    lg: 'h-24 sm:h-32 md:h-36',
  };

  const imageDimensions = {
    sm: { width: 260, height: 60 },
    md: { width: 380, height: 100 },
    lg: { width: 500, height: 140 },
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${containerSizes[size]} ${className}`}>
      {!imgError ? (
        <div className="relative flex items-center h-full">
          <Image
            src="/erickson.png"
            alt="Erickson Coaching International India"
            width={imageDimensions[size].width}
            height={imageDimensions[size].height}
            priority
            className="h-full w-auto max-h-full object-contain filter brightness-110 drop-shadow-xl transition-all duration-300"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        /* Fallback component */
        <div className="inline-flex items-center gap-3">
          <div className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#167FA3] to-[#0C3347] p-2 shadow-lg border border-white/20 w-12 h-12">
            <svg
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full text-[#F4B740]"
            >
              <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.4" />
              <polygon points="20,8 24,16 32,20 24,24 20,32 16,24 8,20 16,16" fill="currentColor" />
            </svg>
          </div>
          <div className="flex flex-col justify-center leading-tight">
            <span className={`font-extrabold tracking-tight text-xl sm:text-2xl ${variant === 'light' ? 'text-white' : 'text-[#102630]'}`}>
              ERICKSON
            </span>
            <span className={`text-xs sm:text-sm tracking-widest font-semibold uppercase ${variant === 'light' ? 'text-[#FFD978]' : 'text-[#167FA3]'}`}>
              COACHING INTERNATIONAL INDIA
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
