import {
  DimensionKey,
  DimensionScores,
  ReadinessBandInfo,
  CareerPathKey,
} from '@/types';
import {
  QUESTIONS,
  DIMENSION_WEIGHTS,
  READINESS_BANDS,
  CAREER_PATHS,
} from '@/config/assessment';

export interface ScoringResult {
  dimensionScores: DimensionScores;
  overallScore: number;
  readinessBand: ReadinessBandInfo;
  careerPathKey: CareerPathKey;
  specialFields: {
    timeline?: string;
    primaryMotivation?: string;
    credentialInterest?: string;
    careerPath?: string;
    primaryBarrier?: string;
  };
}

export function calculateAssessmentScores(
  answers: Record<string, string> // e.g. { "1": "A", "2": "B", ... }
): ScoringResult {
  // Dimension total points accumulated and answer counts
  const dimensionTotals: Record<DimensionKey, number> = {
    purpose: 0,
    coachingMindset: 0,
    peopleDevelopment: 0,
    learningReadiness: 0,
    professionalIntent: 0,
  };

  const dimensionCounts: Record<DimensionKey, number> = {
    purpose: 0,
    coachingMindset: 0,
    peopleDevelopment: 0,
    learningReadiness: 0,
    professionalIntent: 0,
  };

  const specialFields: ScoringResult['specialFields'] = {};

  QUESTIONS.forEach((q) => {
    const selectedId = answers[q.id.toString()] || answers[`q${q.id}`];
    if (!selectedId) return;

    const selectedOption = q.options.find((opt) => opt.id === selectedId);
    if (!selectedOption) return;

    // Record special field selections if applicable
    if (q.specialField === 'timeline') specialFields.timeline = selectedOption.text;
    if (q.specialField === 'primary_motivation') specialFields.primaryMotivation = selectedOption.text;
    if (q.specialField === 'credential_interest') specialFields.credentialInterest = selectedOption.text;
    if (q.specialField === 'career_path') specialFields.careerPath = selectedOption.text;
    if (q.specialField === 'primary_barrier') specialFields.primaryBarrier = selectedOption.text;

    // Apply scores
    selectedOption.scores.forEach(({ dimension, points }) => {
      // Q12 primary barrier has slightly lower weighting multiplier (0.7) to avoid distorting readiness
      const multiplier = q.id === 12 ? 0.7 : 1.0;
      dimensionTotals[dimension] += points * multiplier;
      dimensionCounts[dimension] += 1 * multiplier;
    });
  });

  // Calculate normalized dimension scores (0 to 100)
  const dimensionScores: DimensionScores = {
    purpose: dimensionCounts.purpose > 0 ? Math.round(dimensionTotals.purpose / dimensionCounts.purpose) : 50,
    coachingMindset: dimensionCounts.coachingMindset > 0 ? Math.round(dimensionTotals.coachingMindset / dimensionCounts.coachingMindset) : 50,
    peopleDevelopment: dimensionCounts.peopleDevelopment > 0 ? Math.round(dimensionTotals.peopleDevelopment / dimensionCounts.peopleDevelopment) : 50,
    learningReadiness: dimensionCounts.learningReadiness > 0 ? Math.round(dimensionTotals.learningReadiness / dimensionCounts.learningReadiness) : 50,
    professionalIntent: dimensionCounts.professionalIntent > 0 ? Math.round(dimensionTotals.professionalIntent / dimensionCounts.professionalIntent) : 50,
  };

  // Weighted overall score
  let weightedSum = 0;
  (Object.keys(DIMENSION_WEIGHTS) as DimensionKey[]).forEach((dim) => {
    weightedSum += dimensionScores[dim] * DIMENSION_WEIGHTS[dim];
  });

  const overallScore = Math.min(100, Math.max(0, Math.round(weightedSum)));

  // Determine Readiness Band
  const readinessBand =
    READINESS_BANDS.find(
      (band) => overallScore >= band.minScore && overallScore <= band.maxScore
    ) || READINESS_BANDS[READINESS_BANDS.length - 1];

  // Determine Career Path Key based on Q10, Q1, Q6 answers or fallback
  const careerPathKey = deriveCareerPathKey(answers, dimensionScores);

  return {
    dimensionScores,
    overallScore,
    readinessBand,
    careerPathKey,
    specialFields,
  };
}

function deriveCareerPathKey(
  answers: Record<string, string>,
  dimensionScores: DimensionScores
): CareerPathKey {
  const q10Answer = answers['10'] || answers['q10'];
  const q1Answer = answers['1'] || answers['q1'];

  // Q10 direct mapping if selected
  if (q10Answer === 'A') return 'professional_coach';
  if (q10Answer === 'B') return 'portfolio_career';
  if (q10Answer === 'C') return 'leader_as_coach';
  if (q10Answer === 'D') return 'exploration';

  // Fallback to Q1 logic
  if (q1Answer === 'A') return 'professional_coach';
  if (q1Answer === 'B') return 'leader_as_coach';
  if (q1Answer === 'C') return 'portfolio_career';
  if (q1Answer === 'D') return 'exploration';

  // High professional intent fallback
  if (dimensionScores.professionalIntent >= 80) return 'professional_coach';
  if (dimensionScores.purpose >= 80) return 'portfolio_career';

  return 'exploration';
}
