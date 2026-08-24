'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QUESTIONS, MILESTONE_MESSAGES } from '@/config/assessment';
import { calculateAssessmentScores } from '@/lib/scoring/engine';
import { calculateLeadTemperature } from '@/lib/scoring/leadQualifier';
import {
  createSessionRecord,
  completeSessionRecord,
  saveResponseRecord,
  submitLeadRecord,
} from '@/lib/firebase/services';
import { trackEvent } from '@/lib/analytics';
import { JourneyProgress } from '@/components/assessment/JourneyProgress';
import { QuestionCard } from '@/components/assessment/QuestionCard';
import { MilestoneToast } from '@/components/assessment/MilestoneToast';
import { AnalysisLoader } from '@/components/assessment/AnalysisLoader';
import { LeadGate } from '@/components/assessment/LeadGate';
import { AnimatedConstellation } from '@/components/assessment/AnimatedConstellation';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { LeadFormData, UTMParams } from '@/types';
import { Button } from '@/components/ui/Button';

const STORAGE_KEY = 'erickson_assessment_answers_v1';
const SESSION_ID_KEY = 'erickson_assessment_session_id';

function AssessmentEngine() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState(1);
  const [sessionId, setSessionId] = useState<string>('');

  // Assessment Stage: 'quiz' | 'analyzing' | 'lead_gate'
  const [stage, setStage] = useState<'quiz' | 'analyzing' | 'lead_gate'>('quiz');
  const [milestoneMessage, setMilestoneMessage] = useState<string | null>(null);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  // Extract UTM Parameters from URL
  const utmParams: UTMParams = {
    utmSource: searchParams.get('utm_source') || '',
    utmMedium: searchParams.get('utm_medium') || '',
    utmCampaign: searchParams.get('utm_campaign') || '',
    utmContent: searchParams.get('utm_content') || '',
    utmTerm: searchParams.get('utm_term') || '',
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    landingPage: '/assessment',
  };

  // Demo Mode check (?demo=true)
  const isDemo = searchParams.get('demo') === 'true';

  useEffect(() => {
    // 1. Demo Mode Auto-fill for quick testing
    if (isDemo) {
      const demoAnswers: Record<string, string> = {
        '1': 'A',
        '2': 'A',
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
      setAnswers(demoAnswers);
      setStage('lead_gate');
      return;
    }

    // 2. Initialize Session ID & LocalStorage restore check
    let sid = localStorage.getItem(SESSION_ID_KEY);
    if (!sid) {
      createSessionRecord(utmParams).then((id) => {
        sid = id;
        localStorage.setItem(SESSION_ID_KEY, id);
        setSessionId(id);
      });
    } else {
      setSessionId(sid);
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Object.keys(parsed).length > 0) {
          setShowRestorePrompt(true);
        }
      } catch (e) {
        console.warn('Could not parse stored answers:', e);
      }
    }
  }, [isDemo]);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progressStage = Math.min(4, Math.ceil((currentQuestionIndex + 1) / 3));

  // Handle Option Selection
  const handleSelectOption = (optionId: string) => {
    const qId = currentQuestion.id.toString();
    const updatedAnswers = { ...answers, [qId]: optionId };
    setAnswers(updatedAnswers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnswers));

    // Log Analytics event
    trackEvent('question_answered', {
      question_id: qId,
      question_number: currentQuestionIndex + 1,
      selected_option: optionId,
    });

    // Check Halfway event
    if (currentQuestionIndex + 1 === 6) {
      trackEvent('assessment_halfway');
    }

    // Check Milestone Toast
    const milestoneText = MILESTONE_MESSAGES[currentQuestionIndex + 1];
    if (milestoneText) {
      setMilestoneMessage(milestoneText);
    }

    // Advance to next question or complete quiz
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setDirection(1);
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 250);
    } else {
      // Completed all 12 questions
      trackEvent('assessment_complete');
      setStage('analyzing');
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1);
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleRestoreContinue = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setAnswers(parsed);
      const answeredCount = Object.keys(parsed).length;
      setCurrentQuestionIndex(Math.min(answeredCount, QUESTIONS.length - 1));
    }
    setShowRestorePrompt(false);
  };

  const handleRestoreRestart = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowRestorePrompt(false);
    trackEvent('assessment_restart');
  };

  // Called when AnalysisLoader finishes 2-stage processing
  const handleAnalysisComplete = () => {
    completeSessionRecord(sessionId);
    setStage('lead_gate');
    trackEvent('score_teaser_view');
    trackEvent('lead_form_view');
  };

  // Calculate scores for teaser reveal & lead gate
  const scoringResult = calculateAssessmentScores(answers);

  // Submit Lead Handler
  const handleSubmitLead = async (formData: LeadFormData) => {
    setIsSubmittingLead(true);
    trackEvent('lead_form_submit');

    try {
      const leadTemp = calculateLeadTemperature(
        scoringResult.overallScore,
        scoringResult.dimensionScores,
        scoringResult.specialFields.timeline
      );

      // Save Assessment Response Record
      const responseId = await saveResponseRecord({
        sessionId,
        answers,
        dimensionScores: scoringResult.dimensionScores,
        overallScore: scoringResult.overallScore,
        readinessBand: scoringResult.readinessBand.key,
        careerPath: scoringResult.careerPathKey,
        primaryMotivation: scoringResult.specialFields.primaryMotivation,
        primaryBarrier: scoringResult.specialFields.primaryBarrier,
        credentialInterest: scoringResult.specialFields.credentialInterest,
        timeline: scoringResult.specialFields.timeline,
      });

      // Submit Lead
      await submitLeadRecord({
        formData,
        sessionId,
        responseId,
        overallScore: scoringResult.overallScore,
        readinessBand: scoringResult.readinessBand.key,
        dimensionScores: scoringResult.dimensionScores,
        careerPath: scoringResult.careerPathKey,
        leadTemperature: leadTemp,
        primaryMotivation: scoringResult.specialFields.primaryMotivation,
        primaryBarrier: scoringResult.specialFields.primaryBarrier,
        credentialInterest: scoringResult.specialFields.credentialInterest,
        timeline: scoringResult.specialFields.timeline,
        utmParams,
      });

      // Save result bundle into sessionStorage for immediate smooth results rendering
      sessionStorage.setItem(
        'erickson_latest_result',
        JSON.stringify({
          answers,
          scoringResult,
          leadName: formData.firstName,
        })
      );

      // Clear quiz progress from localStorage
      localStorage.removeItem(STORAGE_KEY);

      router.push('/results');
    } catch (err) {
      console.error('Lead submission error:', err);
      trackEvent('lead_form_error');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <div className={`relative ${stage === 'quiz' ? 'h-screen h-[100dvh] max-h-[100dvh] overflow-hidden' : 'min-h-screen'} w-full flex flex-col justify-between p-2 sm:p-6 select-none`}>
      <AnimatedConstellation progressStage={progressStage} />

      {/* Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 flex items-center justify-between py-2 shrink-0">
        <BrandLogo size="md" />
      </header>

      {/* Restore Progress Modal Prompt */}
      {showRestorePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel max-w-md w-full p-6 sm:p-8 rounded-3xl text-center border border-[#F4B740]/40 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-white">Continue your assessment?</h3>
            <p className="text-sm text-white/80">
              We saved your previous progress. Would you like to continue where you left off or start fresh?
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="primary" size="md" onClick={handleRestoreContinue}>
                Continue
              </Button>
              <Button variant="outline" size="md" onClick={handleRestoreRestart}>
                Start Again
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative z-10 w-full my-auto flex flex-col justify-center">
        <MilestoneToast
          message={milestoneMessage}
          onDismiss={() => setMilestoneMessage(null)}
        />

        {stage === 'quiz' && currentQuestion && (
          <div className="w-full flex flex-col items-center justify-center">
            <JourneyProgress
              currentQuestion={currentQuestionIndex + 1}
              totalQuestions={QUESTIONS.length}
              onBack={handleBack}
              canGoBack={currentQuestionIndex > 0}
            />

            <QuestionCard
              question={currentQuestion}
              selectedOptionId={answers[currentQuestion.id.toString()]}
              onSelectOption={handleSelectOption}
              direction={direction}
            />
          </div>
        )}

        {stage === 'analyzing' && (
          <AnalysisLoader onComplete={handleAnalysisComplete} />
        )}

        {stage === 'lead_gate' && (
          <LeadGate
            overallScore={scoringResult.overallScore}
            readinessBandLabel={scoringResult.readinessBand.label}
            onSubmitLead={handleSubmitLead}
            isLoading={isSubmittingLead}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center text-xs text-[#64757D] py-2 shrink-0">
        <span>Are You Ready to Become a Professional Coach? · Erickson Coaching International India</span>
      </footer>
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#071E2A] flex items-center justify-center text-[#FFD978] animate-pulse">
          Loading assessment engine...
        </div>
      }
    >
      <AssessmentEngine />
    </Suspense>
  );
}
