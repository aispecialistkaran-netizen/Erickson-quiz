import {
  DimensionKey,
  DimensionScores,
  PersonalisedProfile,
  CareerPathKey,
} from '@/types';
import {
  DIMENSION_LABELS,
  READINESS_BANDS,
  CAREER_PATHS,
} from '@/config/assessment';

const STRONGEST_INSIGHTS: Record<DimensionKey, string> = {
  purpose:
    'You possess a profound drive to empower others and act as a catalyst for meaningful personal and professional transformation.',
  coachingMindset:
    'You naturally lean toward asking powerful, perspective-shifting questions rather than rushing to provide immediate answers or solutions.',
  peopleDevelopment:
    'Others already instinctively turn to you for guidance, trusted reflection, and professional perspective in their work and lives.',
  learningReadiness:
    'You thrive in experiential learning environments that embrace active practice, feedback loops, and continuous self-reflection.',
  professionalIntent:
    'You hold a clear, highly focused strategic vision for incorporating professional coaching into your long-term career trajectory.',
};

const GROWTH_INSIGHTS: Record<DimensionKey, string> = {
  purpose:
    'Clarifying your specific vision and target impact will help refine how coaching fits into your overall professional identity.',
  coachingMindset:
    'You may naturally tend to advise or solve problems. Professional coach training develops another capability: facilitating self-discovery and ownership through curious questioning.',
  peopleDevelopment:
    'Expanding your exposure to diverse mentorship and development conversations will build natural confidence as a practicing coach.',
  learningReadiness:
    'Embracing live practice and feedback over purely theoretical study will accelerate your growth in professional coaching capability.',
  professionalIntent:
    'Exploring credentialing pathways and market demand will help transform your curiosity into a clear, actionable career timeline.',
};

export function generateReadinessProfile(
  dimensionScores: DimensionScores,
  overallScore: number,
  careerPathKey: CareerPathKey,
  timeline?: string
): PersonalisedProfile {
  // Find readiness band
  const readinessBand =
    READINESS_BANDS.find(
      (b) => overallScore >= b.minScore && overallScore <= b.maxScore
    ) || READINESS_BANDS[READINESS_BANDS.length - 1];

  // Identify highest dimension (Strongest Signal)
  let highestDim: DimensionKey = 'purpose';
  let highestScore = -1;
  (Object.keys(dimensionScores) as DimensionKey[]).forEach((dim) => {
    if (dimensionScores[dim] > highestScore) {
      highestScore = dimensionScores[dim];
      highestDim = dim;
    }
  });

  // Identify lowest dimension (Growth Opportunity)
  let lowestDim: DimensionKey = 'coachingMindset';
  let lowestScore = 999;
  (Object.keys(dimensionScores) as DimensionKey[]).forEach((dim) => {
    if (dimensionScores[dim] < lowestScore) {
      lowestScore = dimensionScores[dim];
      lowestDim = dim;
    }
  });

  // Career path object
  const careerPath = CAREER_PATHS[careerPathKey] || CAREER_PATHS.exploration;

  // Determine personalized summary paragraph based on combinations
  const { summaryParagraph, headline, recommendedNextStep, primaryCTAType } =
    generatePersonalizedCopy(dimensionScores, overallScore, timeline);

  return {
    overallScore,
    readinessBand,
    dimensionScores,
    careerPath,
    strongestDimension: {
      key: highestDim,
      label: DIMENSION_LABELS[highestDim],
      score: highestScore,
      insight: STRONGEST_INSIGHTS[highestDim],
    },
    growthDimension: {
      key: lowestDim,
      label: DIMENSION_LABELS[lowestDim],
      score: lowestScore,
      insight: GROWTH_INSIGHTS[lowestDim],
    },
    headline,
    summaryParagraph,
    recommendedNextStep,
    primaryCTAType,
  };
}

function generatePersonalizedCopy(
  scores: DimensionScores,
  overall: number,
  timeline?: string
): {
  headline: string;
  summaryParagraph: string;
  recommendedNextStep: string;
  primaryCTAType: 'advisor' | 'program' | 'info_session';
} {
  // Rule 1: High Intent + Strong Mindset
  if (scores.professionalIntent >= 80 && scores.coachingMindset >= 70) {
    return {
      headline: 'Clear Professional Alignment & Mindset Readiness',
      summaryParagraph:
        'You demonstrate both clear professional intent and strong coaching-oriented conversational tendencies. Your responses indicate that professional coaching is a primary career direction, and structured ICF-accredited education will convert your natural abilities into a recognized capability.',
      recommendedNextStep:
        'Schedule a 1-on-1 consultation with an Erickson Coaching Advisor to review your qualification goals, training schedules, and ICF certification pathway.',
      primaryCTAType: 'advisor',
    };
  }

  // Rule 2: High Purpose + Lower Intent (Impact Seeker)
  if (scores.purpose >= 80 && scores.professionalIntent < 60) {
    return {
      headline: 'Deep Human Motivation & Exploring the Pathway',
      summaryParagraph:
        'You appear strongly attracted to the human-development side of coaching, while the commercial or professional path itself is still taking shape. Exploring how coaching is practised, credentialed, and monetised will help you decide if training is your next step.',
      recommendedNextStep:
        'Explore the curriculum and methodology of The Art & Science of Coaching™ to understand how Solution-Focused coaching builds practical professional skills.',
      primaryCTAType: 'program',
    };
  }

  // Rule 3: High Learning Readiness + Lower Mindset (Keen Learner)
  if (scores.learningReadiness >= 80 && scores.coachingMindset < 70) {
    return {
      headline: 'High Receptivity to Practical Coach Education',
      summaryParagraph:
        'You show fantastic enthusiasm for practical, feedback-rich learning. While you currently lean toward sharing ideas or solving problems, professional coach training is specifically designed to transform advice-giving habits into powerful insight-generating questioning.',
      recommendedNextStep:
        'Attend an upcoming interactive Information Session to experience Solution-Focused coaching in action and see how live practical feedback works.',
      primaryCTAType: 'info_session',
    };
  }

  // Rule 4: High People Development + High Intent
  if (scores.peopleDevelopment >= 85 && scores.professionalIntent >= 80) {
    return {
      headline: 'Proven Mentorship Instincts Ready for Professional Credentialing',
      summaryParagraph:
        'People already seek your perspective frequently, and you are ready to formalize this natural strength with an internationally recognized ICF credential. You are in an ideal position to step into formal coach education.',
      recommendedNextStep:
        'Speak directly with a Senior Erickson Advisor to discuss cohort dates, Solution-Focused modules, and ICF credential pathways.',
      primaryCTAType: 'advisor',
    };
  }

  // Rule 5: Imminent Timeline + High Intent
  if (scores.professionalIntent >= 80 && timeline?.includes('3 months')) {
    return {
      headline: 'Accelerated Readiness for Upcoming Cohorts',
      summaryParagraph:
        'With a high readiness score and an immediate timeline, your next logical step is selecting the right cohort format (online, immersive, or hybrid) for The Art & Science of Coaching™.',
      recommendedNextStep:
        'Connect with an Erickson Advisor immediately to reserve a seat in the upcoming ICF-accredited cohort.',
      primaryCTAType: 'advisor',
    };
  }

  // Rule 6: High Purpose + High Learning
  if (scores.purpose >= 85 && scores.learningReadiness >= 85) {
    return {
      headline: 'Strong Purpose & Passion for Experiential Growth',
      summaryParagraph:
        'Your answers reflect a high commitment to human empowerment matched by a willingness to engage in rigorous, practice-based learning. You possess the foundational qualities of a successful solution-focused practitioner.',
      recommendedNextStep:
        'Discover how Solution-Focused Coach Education at Erickson transforms personal passion into professional mastery.',
      primaryCTAType: 'program',
    };
  }

  // Rule 7: High Coaching Mindset + High Purpose
  if (scores.coachingMindset >= 85 && scores.purpose >= 80) {
    return {
      headline: 'Natural Coaching Orientation & Insight Capability',
      summaryParagraph:
        'You naturally excel at creating space for others to reflect and discover their own solutions — one of the rarest and most critical mindsets in coaching. Accredited training will provide the structured framework to scale this impact.',
      recommendedNextStep:
        'Explore the 4-Module structure of The Art & Science of Coaching™ to build a recognized professional practice.',
      primaryCTAType: 'program',
    };
  }

  // Rule 8: Default / Exploratory Profile
  return {
    headline: 'Exploratory Coaching Profile',
    summaryParagraph:
      'Your current responses suggest you are exploring how coaching intersects with your leadership, career, or personal growth goals. Understanding the distinction between advising, mentoring, and professional coaching will give you clarity on your ideal path.',
    recommendedNextStep:
      'Download our comprehensive guide to The Art & Science of Coaching™ or join a live information session.',
    primaryCTAType: 'program',
  };
}
