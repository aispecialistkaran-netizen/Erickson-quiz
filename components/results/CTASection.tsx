'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CTA_LINKS } from '@/config/ctaLinks';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';
import { Award, Users, BookOpen } from 'lucide-react';

interface CTASectionProps {
  professionalIntentScore: number;
}

export const CTASection: React.FC<CTASectionProps> = ({
  professionalIntentScore,
}) => {
  const getCTALayout = () => {
    if (professionalIntentScore >= 80) {
      return {
        primaryText: 'Speak to a Coaching Advisor',
        primaryUrl: CTA_LINKS.ADVISOR_URL,
        primaryEventType: 'advisor_cta_click' as const,
        secondaryText: 'Explore The Art & Science of Coaching',
        secondaryUrl: CTA_LINKS.TASC_URL,
        secondaryEventType: 'program_cta_click' as const,
      };
    } else if (professionalIntentScore >= 60) {
      return {
        primaryText: 'Explore The Art & Science of Coaching',
        primaryUrl: CTA_LINKS.TASC_URL,
        primaryEventType: 'program_cta_click' as const,
        secondaryText: 'Speak to a Coaching Advisor',
        secondaryUrl: CTA_LINKS.ADVISOR_URL,
        secondaryEventType: 'advisor_cta_click' as const,
      };
    } else {
      return {
        primaryText: 'Join an Information Session',
        primaryUrl: CTA_LINKS.INFO_SESSION_URL,
        primaryEventType: 'info_session_click' as const,
        secondaryText: 'Explore The Art & Science of Coaching',
        secondaryUrl: CTA_LINKS.TASC_URL,
        secondaryEventType: 'program_cta_click' as const,
      };
    }
  };

  const cta = getCTALayout();

  const handleCTA = (url: string, eventName: Parameters<typeof trackEvent>[0]) => {
    trackEvent(eventName, { intent_score: professionalIntentScore });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto glass-panel rounded-3xl p-6 sm:p-10 border-2 border-[#F4B740]/40 my-10 shadow-2xl relative overflow-hidden text-center"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#167FA3]/20 via-transparent to-[#F4B740]/10 blur-3xl pointer-events-none" />

      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
        What could your next step look like?
      </h2>

      <p className="text-sm sm:text-base text-[#FFD978] font-medium mb-6 max-w-lg mx-auto">
        Professional coaching is a capability that can be learned, practised and refined.
      </p>

      {/* Program Summary Card */}
      <div className="glass-card rounded-2xl p-5 mb-8 text-left border border-white/10">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <Award className="w-5 h-5 text-[#F4B740]" />
          The Art &amp; Science of Coaching™
        </h3>
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-4">
          Erickson Coaching International&apos;s flagship ICF-accredited program, built around Solution-Focused methodology, neuroscience-informed learning, and practical conversation mastery.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-white/90 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#167FA3]" />
            <span>ICF Accredited Education (Level 1 &amp; Level 2)</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#167FA3]" />
            <span>Live Interactive Practice &amp; Mentorship</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => handleCTA(cta.primaryUrl, cta.primaryEventType)}
          showArrow
        >
          {cta.primaryText}
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => handleCTA(cta.secondaryUrl, cta.secondaryEventType)}
        >
          {cta.secondaryText}
        </Button>
      </div>
    </motion.div>
  );
};
