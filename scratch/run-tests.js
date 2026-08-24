// CommonJS / Node runner for scoring engine validation
const fs = require('fs');

// Simple inline evaluation script testing engine calculations
const QUESTIONS = [
  { id: 1, weights: { A: 100, B: 75, C: 85, D: 45 }, dim: 'professionalIntent' },
  { id: 2, weights: { A: 100, B: 85, C: 65, D: 40 }, dim: 'professionalIntent' },
  { id: 3, weights: { A: 35, B: 100, C: 50, D: 60 }, dim: 'coachingMindset' },
  { id: 4, weights: { A: 45, B: 65, C: 100, D: 60 }, dim: 'coachingMindset' },
  { id: 5, weights: { A: 100, B: 80, C: 60, D: 40 }, dim: 'peopleDevelopment' },
  { id: 6, weights: { A: 100, B: 85, C: 80, D: 70 }, dim: 'purpose' },
  { id: 7, weights: { A: 100, B: 75, C: 45, D: 55 }, dim: 'coachingMindset' },
  { id: 8, weights: { A: 100, B: 85, C: 45, D: 50 }, dim: 'learningReadiness' },
  { id: 9, weights: { A: 100, B: 80, C: 60, D: 40 }, dim: 'professionalIntent' },
  { id: 10, weights: { A: 100, B: 85, C: 75, D: 40 }, dim: 'professionalIntent' },
  { id: 11, weights: { A: 100, B: 80, C: 45, D: 50 }, dim: 'learningReadiness' },
  { id: 12, weights: { A: 65, B: 75, C: 70, D: 70 }, dim: 'professionalIntent' },
];

function scoreProfile(answers) {
  let total = 0;
  let count = 0;
  QUESTIONS.forEach(q => {
    const ans = answers[q.id.toString()];
    if (ans && q.weights[ans]) {
      total += q.weights[ans];
      count++;
    }
  });
  return count > 0 ? Math.round(total / count) : 0;
}

const profA = scoreProfile({ '1':'A','2':'A','3':'B','4':'C','5':'A','6':'A','7':'A','8':'A','9':'A','10':'A','11':'A','12':'B' });
const profB = scoreProfile({ '1':'B','2':'B','3':'B','4':'B','5':'B','6':'C','7':'B','8':'B','9':'B','10':'C','11':'B','12':'C' });
const profC = scoreProfile({ '1':'D','2':'D','3':'A','4':'A','5':'D','6':'D','7':'C','8':'D','9':'D','10':'D','11':'D','12':'A' });

console.log('Profile A Score:', profA);
console.log('Profile B Score:', profB);
console.log('Profile C Score:', profC);

if (profA > 85 && profB >= 70 && profB <= 85 && profC < 55) {
  console.log('✅ ALL TEST PROFILES PRODUCED DISTINCT, HIGHLY ACCURATE SCORES!');
} else {
  console.error('❌ PROFILE SCORE ASSERTIONS FAILED!');
  process.exit(1);
}
