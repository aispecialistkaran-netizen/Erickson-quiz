import { calculateAssessmentScores } from '../engine';
import { calculateLeadTemperature } from '../leadQualifier';
import { generateReadinessProfile } from '../personalization';

// Profile A: High-intent prospective professional coach
const PROFILE_A_ANSWERS = {
  '1': 'A', // Seriously considering becoming a professional coach
  '2': 'A', // Within 3 months
  '3': 'B', // Ask what they would like to be different (Mindset 100)
  '4': 'C', // Help them think through answer (Mindset 100)
  '5': 'A', // Very often
  '6': 'A', // Helping people discover possibilities
  '7': 'A', // Very comfortable with silence
  '8': 'A', // Exactly the type of learning I enjoy
  '9': 'A', // Very important credential
  '10': 'A', // Building a professional coaching practice
  '11': 'A', // Very willing to practise
  '12': 'B', // Understanding certification
};

// Profile B: Senior leader primarily interested in becoming a better leader
const PROFILE_B_ANSWERS = {
  '1': 'B', // Part of leadership role
  '2': 'B', // 3-6 months
  '3': 'B', // Ask what they would like to be different
  '4': 'B', // Understand fully before advice
  '5': 'B', // Fairly often
  '6': 'C', // Stronger leader and communicator
  '7': 'B', // Somewhat comfortable
  '8': 'B', // Challenging but valued
  '9': 'B', // Probably important
  '10': 'C', // Using coaching as leader/HR
  '11': 'B', // Willing with guidance
  '12': 'C', // Time & format
};

// Profile C: Early-stage curious visitor
const PROFILE_C_ANSWERS = {
  '1': 'D', // Mainly curious
  '2': 'D', // Exploring without timeline
  '3': 'A', // Suggest a few solutions
  '4': 'A', // Share ideas quickly
  '5': 'D', // Rarely
  '6': 'D', // Understanding myself
  '7': 'C', // Fill the silence
  '8': 'D', // Unsure whether I'd enjoy
  '9': 'D', // Not currently important
  '10': 'D', // Personal development
  '11': 'D', // Not sure yet
  '12': 'A', // Whether right direction
};

export function runScoringUnitTests() {
  console.log('--- RUNNING SCORING ENGINE UNIT TESTS ---');

  // Test Profile A
  const resA = calculateAssessmentScores(PROFILE_A_ANSWERS);
  const tempA = calculateLeadTemperature(resA.overallScore, resA.dimensionScores, resA.specialFields.timeline);
  const profileA = generateReadinessProfile(resA.dimensionScores, resA.overallScore, resA.careerPathKey, resA.specialFields.timeline);

  console.log(`Profile A Score: ${resA.overallScore}/100 | Band: ${resA.readinessBand.label} | Temp: ${tempA} | Path: ${resA.careerPathKey}`);
  if (resA.overallScore < 80 || tempA !== 'hot' || resA.careerPathKey !== 'professional_coach') {
    throw new Error('Profile A failed assertion! Expected High Score (>=80), HOT lead, professional_coach path.');
  }

  // Test Profile B
  const resB = calculateAssessmentScores(PROFILE_B_ANSWERS);
  const tempB = calculateLeadTemperature(resB.overallScore, resB.dimensionScores, resB.specialFields.timeline);
  const profileB = generateReadinessProfile(resB.dimensionScores, resB.overallScore, resB.careerPathKey, resB.specialFields.timeline);

  console.log(`Profile B Score: ${resB.overallScore}/100 | Band: ${resB.readinessBand.label} | Temp: ${tempB} | Path: ${resB.careerPathKey}`);
  if (resB.overallScore < 65 || resB.overallScore > 85 || resB.careerPathKey !== 'leader_as_coach') {
    throw new Error('Profile B failed assertion! Expected Moderate-High Score (65-85), leader_as_coach path.');
  }

  // Test Profile C
  const resC = calculateAssessmentScores(PROFILE_C_ANSWERS);
  const tempC = calculateLeadTemperature(resC.overallScore, resC.dimensionScores, resC.specialFields.timeline);
  const profileC = generateReadinessProfile(resC.dimensionScores, resC.overallScore, resC.careerPathKey, resC.specialFields.timeline);

  console.log(`Profile C Score: ${resC.overallScore}/100 | Band: ${resC.readinessBand.label} | Temp: ${tempC} | Path: ${resC.careerPathKey}`);
  if (resC.overallScore > 60 || tempC !== 'nurture' || resC.careerPathKey !== 'exploration') {
    throw new Error('Profile C failed assertion! Expected Low Score (<=60), NURTURE lead, exploration path.');
  }

  // Test Determinism: Same answers produce exact same result
  const resA2 = calculateAssessmentScores(PROFILE_A_ANSWERS);
  if (resA.overallScore !== resA2.overallScore) {
    throw new Error('Determinism assertion failed! Same answers produced different scores.');
  }

  // Test Empty / Partial Answers: Should not crash or produce NaN
  const resEmpty = calculateAssessmentScores({});
  if (isNaN(resEmpty.overallScore) || resEmpty.overallScore < 0 || resEmpty.overallScore > 100) {
    throw new Error('Empty answers test failed! Produced invalid score.');
  }

  console.log('✅ ALL SCORING ENGINE UNIT TESTS PASSED SUCCESSFULLY!');
}
