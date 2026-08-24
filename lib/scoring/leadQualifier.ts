import { LeadTemperature, DimensionScores } from '@/types';

export function calculateLeadTemperature(
  overallScore: number,
  dimensionScores: DimensionScores,
  timeline?: string
): LeadTemperature {
  const isImminentTimeline =
    timeline?.includes('3 months') || timeline?.includes('3–6 months') || timeline?.includes('3-6 months');

  if (
    overallScore >= 75 &&
    dimensionScores.professionalIntent >= 80 &&
    isImminentTimeline
  ) {
    return 'hot';
  }

  if (overallScore >= 60 && dimensionScores.professionalIntent >= 60) {
    return 'warm';
  }

  return 'nurture';
}
