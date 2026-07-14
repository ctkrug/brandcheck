/**
 * BrandCheck heuristic scorer.
 *
 * Each metric returns a 0-100 "suspicion" score: higher means the string
 * looks more like an invented Amazon pseudo-brand, lower means it reads
 * like an ordinary English word or name.
 */

export interface MetricResult {
  key: string;
  label: string;
  score: number;
  detail: string;
}

export interface ScoreResult {
  input: string;
  metrics: MetricResult[];
  overallScore: number;
}

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

export function normalizeInput(raw: string): string {
  return raw.trim();
}

function letters(name: string): string[] {
  return name.toLowerCase().split("").filter((ch) => /[a-z]/.test(ch));
}

/**
 * Real English words average roughly 38-42% vowels. Pseudo-brands generated
 * to be keyword-dense or "unique" often drift far from that band in either
 * direction, so we score distance from the ideal midpoint rather than a
 * simple threshold.
 */
export function scoreVowelDensity(name: string): MetricResult {
  const chars = letters(name);
  const vowelCount = chars.filter((ch) => VOWELS.has(ch)).length;
  const density = chars.length === 0 ? 0 : vowelCount / chars.length;
  const idealMin = 0.32;
  const idealMax = 0.48;
  let distance = 0;
  if (density < idealMin) distance = idealMin - density;
  else if (density > idealMax) distance = density - idealMax;
  const score = Math.min(100, Math.round(distance * 250));

  return {
    key: "vowelDensity",
    label: "Vowel density",
    score,
    detail: `${Math.round(density * 100)}% vowels (typical English words: 32-48%)`,
  };
}

/**
 * The longest run of consecutive consonants is one of the sharpest tells:
 * real English words rarely exceed a 3-consonant cluster ("strength"),
 * while generated pseudo-brands frequently string together 4+ ("Vlkzor").
 */
export function scoreConsonantClustering(name: string): MetricResult {
  const chars = letters(name);
  let longest = 0;
  let current = 0;
  for (const ch of chars) {
    if (VOWELS.has(ch)) {
      current = 0;
    } else {
      current += 1;
      longest = Math.max(longest, current);
    }
  }
  const score = longest <= 2 ? 0 : longest === 3 ? 20 : Math.min(100, 20 + (longest - 3) * 30);

  return {
    key: "consonantClustering",
    label: "Consonant clustering",
    score,
    detail:
      longest <= 1
        ? "no consecutive consonants"
        : `longest consonant run: ${longest} letters`,
  };
}

/**
 * Ordinary brand names capitalize only their first letter ("Nike"). Fully
 * or mostly capitalized strings ("KUAFYQ") are common among keyword-stuffed
 * Amazon listings, so we score the uppercase ratio excluding the first
 * character (a normal capitalized brand name would otherwise always trip
 * this metric).
 */
export function scoreAllCapsRatio(name: string): MetricResult {
  const alpha = name.split("").filter((ch) => /[a-zA-Z]/.test(ch));
  const rest = alpha.slice(1);
  const upperCount = rest.filter((ch) => ch === ch.toUpperCase() && /[A-Z]/.test(ch)).length;
  const ratio = rest.length === 0 ? 0 : upperCount / rest.length;
  const score = Math.round(ratio * 100);

  return {
    key: "allCapsRatio",
    label: "All-caps ratio",
    score,
    detail:
      score === 0
        ? "standard capitalization"
        : `${score}% of trailing letters are uppercase`,
  };
}

export function analyzeBrandName(raw: string): ScoreResult {
  const input = normalizeInput(raw);
  const metrics: MetricResult[] = [
    scoreVowelDensity(input),
    scoreConsonantClustering(input),
    scoreAllCapsRatio(input),
  ];

  return {
    input,
    metrics,
    overallScore: 0,
  };
}

export { letters, VOWELS };
