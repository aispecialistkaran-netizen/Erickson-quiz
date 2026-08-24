'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Button } from '@/components/ui/Button';
import { AnimatedConstellation } from '@/components/assessment/AnimatedConstellation';
import { GatewayModal } from '@/components/assessment/GatewayModal';
import { submitLeadRecord } from '@/lib/firebase/services';
import { trackEvent } from '@/lib/analytics';
import { Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);

  useEffect(() => {
    trackEvent('assessment_view');
  }, []);

  const handleStartClick = () => {
    trackEvent('assessment_start');
    setIsGatewayOpen(true);
  };

  const handleGatewaySubmit = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }) => {
    // Save initial gateway lead state
    sessionStorage.setItem('erickson_gateway_lead', JSON.stringify(data));

    // Submit initial lead record to Firebase
    await submitLeadRecord({
      formData: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        marketingConsent: true,
      },
      sessionId: 'sess-' + Date.now(),
      responseId: 'resp-pending',
      overallScore: 0,
      readinessBand: 'exploring_path',
      dimensionScores: {
        purpose: 0,
        coachingMindset: 0,
        peopleDevelopment: 0,
        learningReadiness: 0,
        professionalIntent: 0,
      },
      careerPath: 'exploration',
      leadTemperature: 'warm',
      utmParams: {},
    });

    setIsGatewayOpen(false);
    router.push('/assessment');
  };

  return (
    <div className="relative h-screen h-[100dvh] max-h-[100dvh] w-full flex flex-col justify-between overflow-hidden select-none p-3 sm:p-6">
      {/* Animated Constellation Background */}
      <AnimatedConstellation progressStage={1} />

      {/* Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-2 sm:px-4 py-1 sm:py-2 flex items-center justify-between shrink-0">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <BrandLogo size="md" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#FFD978]/90 bg-[#0C3347]/60 px-4 py-2 rounded-full border border-white/10"
        >
          <Sparkles className="w-4 h-4 text-[#F4B740]" />
          <span>Professional Coaching Readiness Assessment</span>
        </motion.div>
      </header>

      {/* Main Hero Container */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-2 sm:px-4 py-1 sm:py-2 text-center my-auto flex flex-col items-center justify-center">
        {/* Eyebrow Label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#167FA3]/25 border border-[#167FA3]/40 text-xs sm:text-sm font-semibold text-[#FFD978] mb-2 sm:mb-4 shadow-lg shadow-black/20"
        >
          <span>3-Minute Digital Assessment</span>
        </motion.div>

        {/* Primary Headline Reveal */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-2xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-2 sm:mb-4"
        >
          Are You Ready to Become a{' '}
          <span className="text-gradient-gold">Professional Coach?</span>
        </motion.h1>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-xs sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed mb-4 sm:mb-6 font-normal"
        >
          Discover your coaching readiness in just 3 minutes and get a personalised snapshot of your strengths, motivations and next steps.
        </motion.p>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25, delay: 0.6 }}
          className="flex flex-col items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6"
        >
          <Button variant="primary" size="lg" onClick={handleStartClick} showArrow>
            Take the 3-Minute Assessment
          </Button>

          <span className="text-[11px] sm:text-sm text-[#64757D] font-medium">
            12 questions · Instant personalised results
          </span>
        </motion.div>

        {/* Three Trust/Value Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 max-w-3xl mx-auto w-full"
        >
          {[
            'Understand your readiness',
            'Discover your strongest coaching qualities',
            'Get your suggested next step',
          ].map((trustText, idx) => (
            <div
              key={idx}
              className="glass-card p-2 sm:p-3 rounded-xl border border-white/10 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-white/90"
            >
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1F9D73] shrink-0" />
              <span>{trustText}</span>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Subtle Credibility Statement Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-2 sm:px-4 py-1 sm:py-2 text-center text-[10px] sm:text-xs text-[#64757D] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-2 shrink-0">
        <p className="max-w-xl mx-auto sm:mx-0 text-left hidden sm:block">
          Created for professionals exploring coaching, leadership development and meaningful career transitions.
        </p>

        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 text-[#64757D]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1F9D73]" />
            ICF Accredited Context
          </span>
          <span>© {new Date().getFullYear()} Erickson Coaching India</span>
        </div>
      </footer>

      {/* Gateway Lead Popup Modal */}
      <GatewayModal
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        onSubmitGateway={handleGatewaySubmit}
      />
    </div>
  );
}
