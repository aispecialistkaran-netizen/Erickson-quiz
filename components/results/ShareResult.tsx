'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Share2, Download, Copy, Check } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface ShareResultProps {
  score: number;
  bandLabel: string;
  strongestSignal: string;
}

export const ShareResult: React.FC<ShareResultProps> = ({
  score,
  bandLabel,
  strongestSignal,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    setIsGenerating(true);
    trackEvent('share_result', { action: 'download_image' });

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Background Fill
      ctx.fillStyle = '#071E2A';
      ctx.fillRect(0, 0, 1080, 1080);

      // Inner Border
      ctx.strokeStyle = '#0C3347';
      ctx.lineWidth = 16;
      ctx.strokeRect(16, 16, 1080 - 32, 1080 - 32);

      // 2. Glowing Radial Orbs
      const glowGrad1 = ctx.createRadialGradient(900, 180, 0, 900, 180, 400);
      glowGrad1.addColorStop(0, 'rgba(22, 127, 163, 0.35)');
      glowGrad1.addColorStop(1, 'rgba(7, 30, 42, 0)');
      ctx.fillStyle = glowGrad1;
      ctx.fillRect(0, 0, 1080, 1080);

      const glowGrad2 = ctx.createRadialGradient(180, 900, 0, 180, 900, 400);
      glowGrad2.addColorStop(0, 'rgba(244, 183, 64, 0.25)');
      glowGrad2.addColorStop(1, 'rgba(7, 30, 42, 0)');
      ctx.fillStyle = glowGrad2;
      ctx.fillRect(0, 0, 1080, 1080);

      // 3. Header Text & Branding
      ctx.textAlign = 'left';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('ERICKSON', 80, 100);

      ctx.fillStyle = '#FFD978';
      ctx.font = '600 18px sans-serif';
      ctx.fillText('COACHING INTERNATIONAL INDIA', 80, 130);

      // Pill Badge
      ctx.fillStyle = 'rgba(22, 127, 163, 0.3)';
      ctx.strokeStyle = 'rgba(22, 127, 163, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(760, 70, 240, 50, 25);
      } else {
        ctx.rect(760, 70, 240, 50);
      }
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFD978';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Readiness Snapshot', 880, 102);

      // 4. Center Content - Score
      ctx.textAlign = 'center';
      ctx.fillStyle = '#64757D';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('MY PROFESSIONAL COACHING READINESS', 540, 320);

      // Score Gold Gradient
      const goldGrad = ctx.createLinearGradient(400, 360, 680, 480);
      goldGrad.addColorStop(0, '#FFFFFF');
      goldGrad.addColorStop(0.5, '#FFD978');
      goldGrad.addColorStop(1, '#F4B740');
      ctx.fillStyle = goldGrad;
      ctx.font = '900 140px sans-serif';
      ctx.fillText(`${score}`, 540, 470);

      ctx.fillStyle = '#64757D';
      ctx.font = '600 32px sans-serif';
      ctx.fillText('/ 100', 540, 530);

      // Band Label Box
      ctx.fillStyle = '#0C3347';
      ctx.strokeStyle = '#F4B740';
      ctx.lineWidth = 3;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(240, 580, 600, 70, 20);
      } else {
        ctx.rect(240, 580, 600, 70);
      }
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText(bandLabel, 540, 626);

      // Strongest Signal
      ctx.fillStyle = '#64757D';
      ctx.font = '600 22px sans-serif';
      ctx.fillText('STRONGEST READINESS SIGNAL', 540, 730);

      ctx.fillStyle = '#FFD978';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(strongestSignal, 540, 780);

      // 5. Footer
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 960);
      ctx.lineTo(1000, 960);
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '500 20px sans-serif';
      ctx.fillText('Discover your coaching readiness profile', 80, 1010);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#F4B740';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('erickson.co.in', 1000, 1010);

      // Trigger Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Erickson-Coaching-Readiness-${score}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating share image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = () => {
    const text = `I just evaluated my coaching readiness with Erickson Coaching International India!\n\nScore: ${score}/100 - ${bandLabel}\nStrongest Signal: ${strongestSignal}\n\nDiscover your coaching readiness here: https://erickson.co.in/coaching-readiness-assessment`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    trackEvent('share_result', { action: 'copy_text' });

    setTimeout(() => setCopied(false), 2500);
  };

  const handleLinkedInShare = () => {
    const shareUrl = encodeURIComponent(
      'https://erickson.co.in/coaching-readiness-assessment'
    );
    const text = encodeURIComponent(
      `I scored ${score}/100 (${bandLabel}) on the Erickson Coaching Readiness Assessment!`
    );
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&summary=${text}`,
      '_blank'
    );
    trackEvent('share_result', { action: 'linkedin_share' });
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8 text-center select-none">
      {/* Visible Action Bar */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Share2 className="w-5 h-5 text-[#F4B740]" />
          <span>Share Your Coaching Readiness</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            isLoading={isGenerating}
          >
            <Download className="w-4 h-4" />
            <span>Download Card</span>
          </Button>

          <Button variant="outline" size="sm" onClick={handleCopyText}>
            {copied ? <Check className="w-4 h-4 text-[#1F9D73]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </Button>

          <Button variant="secondary" size="sm" onClick={handleLinkedInShare}>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
            </svg>
            <span>Share on LinkedIn</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
