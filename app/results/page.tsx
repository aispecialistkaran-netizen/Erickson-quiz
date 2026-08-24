'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { generateReadinessProfile } from '@/lib/scoring/personalization';
import { calculateAssessmentScores } from '@/lib/scoring/engine';
import { trackEvent } from '@/lib/analytics';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { AnimatedConstellation } from '@/components/assessment/AnimatedConstellation';
import { ScoreReveal } from '@/components/results/ScoreReveal';
import { DimensionChart } from '@/components/results/DimensionChart';
import { InsightCard } from '@/components/results/InsightCard';
import { CareerPathCard } from '@/components/results/CareerPathCard';
import { CTASection } from '@/components/results/CTASection';
import { ShareResult } from '@/components/results/ShareResult';
import { Button } from '@/components/ui/Button';
import { PersonalisedProfile } from '@/types';
import { RefreshCw } from 'lucide-react';

export default function ResultsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<PersonalisedProfile | null>(null);
  const [leadName, setLeadName] = useState<string>('');

  useEffect(() => {
    trackEvent('full_result_view');

    // Load latest result from sessionStorage
    const stored = sessionStorage.getItem('erickson_latest_result');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const { answers, scoringResult, leadName: name } = parsed;

        if (name) setLeadName(name);

        if (scoringResult) {
          const generatedProfile = generateReadinessProfile(
            scoringResult.dimensionScores,
            scoringResult.overallScore,
            scoringResult.careerPathKey,
            scoringResult.specialFields?.timeline
          );
          setProfile(generatedProfile);
          return;
        } else if (answers) {
          const calculated = calculateAssessmentScores(answers);
          const generatedProfile = generateReadinessProfile(
            calculated.dimensionScores,
            calculated.overallScore,
            calculated.careerPathKey,
            calculated.specialFields?.timeline
          );
          setProfile(generatedProfile);
          return;
        }
      } catch (err) {
        console.warn('Could not parse stored result:', err);
      }
    }

    // Fallback default profile if directly accessed
    const defaultAnswers = {
      '1': 'A',
      '2': 'B',
      '3': 'B',
      '4': 'C',
      '5': 'A',
      '6': 'A',
      '7': 'A',
      '8': 'A',
      '9': 'A',
      '10': 'A',
      '11': 'A',
      '12': 'B',
    };
    const calculated = calculateAssessmentScores(defaultAnswers);
    const fallbackProfile = generateReadinessProfile(
      calculated.dimensionScores,
      calculated.overallScore,
      calculated.careerPathKey,
      calculated.specialFields?.timeline
    );
    setProfile(fallbackProfile);
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#071E2A] flex items-center justify-center p-4">
        <div className="text-[#FFD978] animate-pulse font-semibold">
          Loading your readiness profile...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#071E2A] text-white py-8 px-4 overflow-hidden select-none">
      <AnimatedConstellation progressStage={4} />

      {/* Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <BrandLogo size="md" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            trackEvent('assessment_restart');
            router.push('/assessment');
          }}
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Retake Assessment</span>
        </Button>
      </header>

      {/* Main Results Document */}
      <main className="relative z-10 w-full max-w-4xl mx-auto space-y-12">
        {/* Welcome Lead Greeting */}
        {leadName && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-xs uppercase tracking-widest font-bold text-[#FFD978]">
              Personalised Readiness Profile
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Welcome, {leadName}
            </h1>
          </motion.div>
        )}

        {/* 1. Score Reveal */}
        <section>
          <ScoreReveal
            score={profile.overallScore}
            bandLabel={profile.readinessBand.label}
            supportingMessage={profile.summaryParagraph}
          />
        </section>

        {/* 2. 5 Dimensions Breakdown */}
        <section>
          <DimensionChart scores={profile.dimensionScores} />
        </section>

        {/* 3. Strongest Signal & Growth Opportunity */}
        <section>
          <InsightCard
            strongest={profile.strongestDimension}
            growth={profile.growthDimension}
          />
        </section>

        {/* 4. Career Path Recommendation */}
        <section>
          <CareerPathCard careerPath={profile.careerPath} />
        </section>

        {/* 5. Erickson Conversion CTAs */}
        <section>
          <CTASection
            professionalIntentScore={profile.dimensionScores.professionalIntent}
          />
        </section>

        {/* 6. Share Result */}
        <section>
          <ShareResult
            score={profile.overallScore}
            bandLabel={profile.readinessBand.label}
            strongestSignal={profile.strongestDimension.label}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto text-center text-xs text-[#64757D] pt-12 border-t border-white/5 mt-16">
        <p className="mb-2">
          This assessment is a reflective readiness tool, not a psychological or psychometric evaluation.
        </p>
        <p>© {new Date().getFullYear()} Erickson Coaching International India. All rights reserved.</p>
      </footer>
    </div>
  );
}
