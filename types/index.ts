export type DimensionKey =
  | 'purpose'
  | 'coachingMindset'
  | 'peopleDevelopment'
  | 'learningReadiness'
  | 'professionalIntent';

export interface DimensionScores {
  purpose: number;
  coachingMindset: number;
  peopleDevelopment: number;
  learningReadiness: number;
  professionalIntent: number;
}

export type ReadinessBandKey =
  | 'ready_to_begin'
  | 'strong_readiness'
  | 'emerging_readiness'
  | 'exploring_path';

export interface ReadinessBandInfo {
  key: ReadinessBandKey;
  label: string;
  minScore: number;
  maxScore: number;
  supportingMessage: string;
}

export type CareerPathKey =
  | 'professional_coach'
  | 'portfolio_career'
  | 'leader_as_coach'
  | 'hr_people_dev'
  | 'exploration';

export interface CareerPathInfo {
  key: CareerPathKey;
  title: string;
  badge: string;
  description: string;
  whyFit: string;
}

export interface OptionScore {
  dimension: DimensionKey;
  points: number; // 0 to 100
}

export interface QuestionOption {
  id: string; // 'A', 'B', 'C', 'D'
  text: string;
  scores: OptionScore[];
}

export interface Question {
  id: number;
  questionText: string;
  dimensions: DimensionKey[];
  options: QuestionOption[];
  specialField?: 'primary_motivation' | 'credential_interest' | 'career_path' | 'primary_barrier' | 'timeline';
}

export type LeadTemperature = 'hot' | 'warm' | 'nurture';

export interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role?: string;
  city?: string;
  marketingConsent: boolean;
}

export interface UTMParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
  landingPage?: string;
}

export interface AssessmentResponseDoc {
  id?: string;
  sessionId: string;
  answers: Record<string, string>; // e.g. { q1: 'A', q2: 'B' }
  dimensionScores: DimensionScores;
  overallScore: number;
  readinessBand: ReadinessBandKey;
  careerPath: CareerPathKey;
  primaryMotivation?: string;
  primaryBarrier?: string;
  credentialInterest?: string;
  timeline?: string;
  createdAt: string;
}

export interface LeadDoc {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  city: string;
  marketingConsent: boolean;
  marketingConsentTimestamp: string;
  sessionId: string;
  responseId?: string;
  overallScore: number;
  readinessBand: ReadinessBandKey;
  dimensionScores: DimensionScores;
  careerPath: CareerPathKey;
  leadTemperature: LeadTemperature;
  professionalIntentScore: number;
  primaryMotivation?: string;
  primaryBarrier?: string;
  credentialInterest?: string;
  timeline?: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  referrer: string;
  createdAt: string;
  updatedAt: string;
  leadStatus: 'new' | 'started' | 'completed' | 'contacted' | 'qualified' | 'converted' | 'unqualified';
  source: 'coach-readiness-assessment';
}

export interface PersonalisedProfile {
  overallScore: number;
  readinessBand: ReadinessBandInfo;
  dimensionScores: DimensionScores;
  careerPath: CareerPathInfo;
  strongestDimension: {
    key: DimensionKey;
    label: string;
    score: number;
    insight: string;
  };
  growthDimension: {
    key: DimensionKey;
    label: string;
    score: number;
    insight: string;
  };
  headline: string;
  summaryParagraph: string;
  recommendedNextStep: string;
  primaryCTAType: 'advisor' | 'program' | 'info_session';
}
