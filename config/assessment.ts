import { DimensionKey, Question, ReadinessBandInfo, CareerPathInfo } from '@/types';

export const REQUIRE_PHONE = process.env.NEXT_PUBLIC_REQUIRE_PHONE !== 'false';

export const DIMENSION_WEIGHTS: Record<DimensionKey, number> = {
  purpose: 0.20,
  coachingMindset: 0.25,
  peopleDevelopment: 0.15,
  learningReadiness: 0.20,
  professionalIntent: 0.20,
};

export const DIMENSION_LABELS: Record<DimensionKey, string> = {
  purpose: 'Purpose & Motivation',
  coachingMindset: 'Coaching Mindset',
  peopleDevelopment: 'People & Development',
  learningReadiness: 'Learning Readiness',
  professionalIntent: 'Professional Intent',
};

export const READINESS_BANDS: ReadinessBandInfo[] = [
  {
    key: 'ready_to_begin',
    label: 'Ready to Begin',
    minScore: 85,
    maxScore: 100,
    supportingMessage:
      'You already demonstrate many of the motivations and learning behaviours associated with beginning professional coach education. Your next step is less about deciding whether you are capable of learning coaching and more about choosing the right professional pathway.',
  },
  {
    key: 'strong_readiness',
    label: 'Strong Coaching Readiness',
    minScore: 70,
    maxScore: 84,
    supportingMessage:
      'You show strong alignment with several qualities that support professional coach development. Structured training, practice and feedback could help convert your natural strengths into professional coaching capability.',
  },
  {
    key: 'emerging_readiness',
    label: 'Emerging Coaching Readiness',
    minScore: 55,
    maxScore: 69,
    supportingMessage:
      'There are meaningful signs that coaching could fit your professional or personal goals, while a few areas would benefit from further exploration. Your next step should be learning more about what professional coaching actually involves.',
  },
  {
    key: 'exploring_path',
    label: 'Exploring Your Coaching Path',
    minScore: 0,
    maxScore: 54,
    supportingMessage:
      'You appear to be in the exploration stage rather than needing to make an immediate commitment. Use your results to understand what interests you about coaching before deciding whether professional training is the right next step.',
  },
];

export const MILESTONE_MESSAGES: Record<number, string> = {
  3: "You're getting started.",
  6: 'Halfway there. Your coaching profile is taking shape.',
  9: 'Almost there.',
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    questionText: 'What brings you to professional coaching right now?',
    dimensions: ['professionalIntent', 'purpose'],
    options: [
      {
        id: 'A',
        text: "I'm seriously considering becoming a professional coach.",
        scores: [
          { dimension: 'professionalIntent', points: 100 },
          { dimension: 'purpose', points: 85 },
        ],
      },
      {
        id: 'B',
        text: "I'd like coaching to become part of my leadership or management role.",
        scores: [
          { dimension: 'professionalIntent', points: 75 },
          { dimension: 'purpose', points: 90 },
        ],
      },
      {
        id: 'C',
        text: "I'm exploring coaching as a second or portfolio career.",
        scores: [
          { dimension: 'professionalIntent', points: 85 },
          { dimension: 'purpose', points: 80 },
        ],
      },
      {
        id: 'D',
        text: "I'm mainly curious about coaching and personal development.",
        scores: [
          { dimension: 'professionalIntent', points: 45 },
          { dimension: 'purpose', points: 60 },
        ],
      },
    ],
  },
  {
    id: 2,
    questionText:
      'If you decided coaching was right for you, when would you realistically want to begin training?',
    dimensions: ['professionalIntent'],
    specialField: 'timeline',
    options: [
      {
        id: 'A',
        text: 'Within the next 3 months',
        scores: [{ dimension: 'professionalIntent', points: 100 }],
      },
      {
        id: 'B',
        text: 'Within 3–6 months',
        scores: [{ dimension: 'professionalIntent', points: 85 }],
      },
      {
        id: 'C',
        text: 'Within 6–12 months',
        scores: [{ dimension: 'professionalIntent', points: 65 }],
      },
      {
        id: 'D',
        text: "I'm exploring without a timeline yet",
        scores: [{ dimension: 'professionalIntent', points: 40 }],
      },
    ],
  },
  {
    id: 3,
    questionText:
      'Someone tells you: "I\'ve tried everything and I don\'t know what to do next." What are you naturally most likely to do?',
    dimensions: ['coachingMindset'],
    options: [
      {
        id: 'A',
        text: 'Suggest a few solutions that have worked for me',
        scores: [{ dimension: 'coachingMindset', points: 35 }],
      },
      {
        id: 'B',
        text: 'Ask what they would like to be different',
        scores: [{ dimension: 'coachingMindset', points: 100 }],
      },
      {
        id: 'C',
        text: 'Explore everything that has gone wrong so far',
        scores: [{ dimension: 'coachingMindset', points: 50 }],
      },
      {
        id: 'D',
        text: 'Give them encouragement and reassurance',
        scores: [{ dimension: 'coachingMindset', points: 60 }],
      },
    ],
  },
  {
    id: 4,
    questionText:
      'When someone comes to you for advice, which statement sounds most like you?',
    dimensions: ['coachingMindset'],
    options: [
      {
        id: 'A',
        text: 'I usually have ideas and want to share them quickly.',
        scores: [{ dimension: 'coachingMindset', points: 45 }],
      },
      {
        id: 'B',
        text: 'I try to understand the situation fully before giving advice.',
        scores: [{ dimension: 'coachingMindset', points: 65 }],
      },
      {
        id: 'C',
        text: 'I often help them think through the answer for themselves.',
        scores: [{ dimension: 'coachingMindset', points: 100 }],
      },
      {
        id: 'D',
        text: 'It depends completely on the situation.',
        scores: [{ dimension: 'coachingMindset', points: 60 }],
      },
    ],
  },
  {
    id: 5,
    questionText:
      'How often do people currently come to you for perspective, support or guidance?',
    dimensions: ['peopleDevelopment'],
    options: [
      {
        id: 'A',
        text: 'Very often',
        scores: [{ dimension: 'peopleDevelopment', points: 100 }],
      },
      {
        id: 'B',
        text: 'Fairly often',
        scores: [{ dimension: 'peopleDevelopment', points: 80 }],
      },
      {
        id: 'C',
        text: 'Occasionally',
        scores: [{ dimension: 'peopleDevelopment', points: 60 }],
      },
      {
        id: 'D',
        text: 'Rarely',
        scores: [{ dimension: 'peopleDevelopment', points: 40 }],
      },
    ],
  },
  {
    id: 6,
    questionText: 'Which part of coaching appeals to you most?',
    dimensions: ['purpose', 'professionalIntent'],
    specialField: 'primary_motivation',
    options: [
      {
        id: 'A',
        text: 'Helping people discover possibilities they may not see themselves',
        scores: [
          { dimension: 'purpose', points: 100 },
          { dimension: 'professionalIntent', points: 80 },
        ],
      },
      {
        id: 'B',
        text: 'Building a meaningful professional career',
        scores: [
          { dimension: 'purpose', points: 85 },
          { dimension: 'professionalIntent', points: 95 },
        ],
      },
      {
        id: 'C',
        text: 'Becoming a stronger leader and communicator',
        scores: [
          { dimension: 'purpose', points: 80 },
          { dimension: 'professionalIntent', points: 75 },
        ],
      },
      {
        id: 'D',
        text: 'Understanding myself and other people better',
        scores: [
          { dimension: 'purpose', points: 70 },
          { dimension: 'professionalIntent', points: 50 },
        ],
      },
    ],
  },
  {
    id: 7,
    questionText:
      'How comfortable are you with asking a powerful question and allowing silence instead of immediately offering an answer?',
    dimensions: ['coachingMindset'],
    options: [
      {
        id: 'A',
        text: 'Very comfortable',
        scores: [{ dimension: 'coachingMindset', points: 100 }],
      },
      {
        id: 'B',
        text: 'Somewhat comfortable',
        scores: [{ dimension: 'coachingMindset', points: 75 }],
      },
      {
        id: 'C',
        text: 'I tend to fill the silence',
        scores: [{ dimension: 'coachingMindset', points: 45 }],
      },
      {
        id: 'D',
        text: "I've never really thought about it",
        scores: [{ dimension: 'coachingMindset', points: 55 }],
      },
    ],
  },
  {
    id: 8,
    questionText:
      'Professional coach training involves practice, feedback and reflecting on your own conversations. How does that sound to you?',
    dimensions: ['learningReadiness'],
    options: [
      {
        id: 'A',
        text: 'Exactly the type of learning I enjoy',
        scores: [{ dimension: 'learningReadiness', points: 100 }],
      },
      {
        id: 'B',
        text: "Challenging, but something I'd value",
        scores: [{ dimension: 'learningReadiness', points: 85 }],
      },
      {
        id: 'C',
        text: "I'd prefer mainly theoretical learning",
        scores: [{ dimension: 'learningReadiness', points: 45 }],
      },
      {
        id: 'D',
        text: "I'm unsure whether I'd enjoy that process",
        scores: [{ dimension: 'learningReadiness', points: 50 }],
      },
    ],
  },
  {
    id: 9,
    questionText:
      'How important would an internationally recognised coaching credential be to your goals?',
    dimensions: ['professionalIntent'],
    specialField: 'credential_interest',
    options: [
      {
        id: 'A',
        text: 'Very important',
        scores: [{ dimension: 'professionalIntent', points: 100 }],
      },
      {
        id: 'B',
        text: 'Probably important',
        scores: [{ dimension: 'professionalIntent', points: 80 }],
      },
      {
        id: 'C',
        text: "I'm still trying to understand certification",
        scores: [{ dimension: 'professionalIntent', points: 60 }],
      },
      {
        id: 'D',
        text: 'Not currently important',
        scores: [{ dimension: 'professionalIntent', points: 40 }],
      },
    ],
  },
  {
    id: 10,
    questionText: 'Which future sounds closest to what you\'re exploring?',
    dimensions: ['professionalIntent', 'purpose'],
    specialField: 'career_path',
    options: [
      {
        id: 'A',
        text: 'Building a professional coaching practice',
        scores: [
          { dimension: 'professionalIntent', points: 100 },
          { dimension: 'purpose', points: 85 },
        ],
      },
      {
        id: 'B',
        text: 'Using coaching alongside consulting, facilitation or another career',
        scores: [
          { dimension: 'professionalIntent', points: 85 },
          { dimension: 'purpose', points: 85 },
        ],
      },
      {
        id: 'C',
        text: 'Using coaching primarily as a leader or HR professional',
        scores: [
          { dimension: 'professionalIntent', points: 75 },
          { dimension: 'purpose', points: 85 },
        ],
      },
      {
        id: 'D',
        text: 'Learning coaching mainly for personal development',
        scores: [
          { dimension: 'professionalIntent', points: 40 },
          { dimension: 'purpose', points: 60 },
        ],
      },
    ],
  },
  {
    id: 11,
    questionText:
      'How willing would you be to consistently practise coaching conversations while learning?',
    dimensions: ['learningReadiness'],
    options: [
      {
        id: 'A',
        text: 'Very willing — practical learning is important to me',
        scores: [{ dimension: 'learningReadiness', points: 100 }],
      },
      {
        id: 'B',
        text: 'Willing, provided I receive guidance',
        scores: [{ dimension: 'learningReadiness', points: 80 }],
      },
      {
        id: 'C',
        text: 'I would prefer to learn first and practise later',
        scores: [{ dimension: 'learningReadiness', points: 45 }],
      },
      {
        id: 'D',
        text: "I'm not sure yet",
        scores: [{ dimension: 'learningReadiness', points: 50 }],
      },
    ],
  },
  {
    id: 12,
    questionText:
      'What is the biggest question standing between you and beginning a professional coaching journey?',
    dimensions: ['professionalIntent'],
    specialField: 'primary_barrier',
    options: [
      {
        id: 'A',
        text: 'Whether coaching is truly the right career direction for me',
        scores: [{ dimension: 'professionalIntent', points: 65 }],
      },
      {
        id: 'B',
        text: 'Understanding certification and the professional pathway',
        scores: [{ dimension: 'professionalIntent', points: 75 }],
      },
      {
        id: 'C',
        text: 'Finding the time and right learning format',
        scores: [{ dimension: 'professionalIntent', points: 70 }],
      },
      {
        id: 'D',
        text: 'Understanding whether the investment will be worthwhile',
        scores: [{ dimension: 'professionalIntent', points: 70 }],
      },
    ],
  },
];

export const CAREER_PATHS: Record<string, CareerPathInfo> = {
  professional_coach: {
    key: 'professional_coach',
    title: 'Professional Coach Path',
    badge: 'Independent Practice / Professional Career',
    description:
      'You are aiming to build an independent coaching practice or transition into professional coaching as a core career.',
    whyFit:
      'Your high professional intent combined with strong purpose indicates you are ready to invest in accredited training and build a recognized professional reputation.',
  },
  portfolio_career: {
    key: 'portfolio_career',
    title: 'Portfolio Career Path',
    badge: 'Consulting + Coaching Hybrid',
    description:
      'You see coaching as a strategic component alongside consulting, advisory, facilitation, or executive mentorship.',
    whyFit:
      'Adding ICF-credentialed Solution-Focused coaching capability creates a powerful high-value differentiator for your broader professional services portfolio.',
  },
  leader_as_coach: {
    key: 'leader_as_coach',
    title: 'Leader-as-Coach Path',
    badge: 'Executive & Managerial Capability',
    description:
      'You want to embed coaching skills into your management, leadership, or organizational responsibility to elevate team performance.',
    whyFit:
      'Shifting from telling and solving to asking and empowering allows you to unlock capability, autonomy, and engagement across your team.',
  },
  hr_people_dev: {
    key: 'hr_people_dev',
    title: 'HR / People Development Path',
    badge: 'Talent, L&D & People Leadership',
    description:
      'You are focused on transforming organizational culture, developing talent pipelines, and driving internal coaching initiatives.',
    whyFit:
      'Solution-Focused coaching provides structured methodology to foster psychological safety, retention, and leadership development across your organization.',
  },
  exploration: {
    key: 'exploration',
    title: 'Exploration Path',
    badge: 'Curiosity & Personal Growth',
    description:
      'You are currently exploring coaching as a personal capability or evaluating whether it aligns with your future direction.',
    whyFit:
      'Your primary focus is exploring what coaching actually entails before making an immediate professional commitment.',
  },
};
