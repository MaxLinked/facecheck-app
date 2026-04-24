// MockAssessmentGenerator — TS port of FaceCheck/Mock/MockRules.swift + MockAssessmentGenerator.swift
// Same physiologically-plausible rules, same anchor values (mild=78, moderate=54, severe=22).

import type {
  AssessmentReport,
  HBGrade,
  HistoricalSession,
  Preset,
  QuantitativeMetrics,
  RegionScores,
} from "./types";
import { TIER_C_FIELDS } from "./types";

// ────────────────────────────────────────────────────────────
// Seedable RNG (LCG) — deterministic given a seed.
// ────────────────────────────────────────────────────────────

type RNG = () => number; // returns a float in [0,1)

function seededRNG(seed: number): RNG {
  let state = BigInt(seed === 0 ? 0xdeadbeef : seed >>> 0);
  const A = 6364136223846793005n;
  const C = 1442695040888963407n;
  const M = 1n << 64n;
  return () => {
    state = (state * A + C) % M;
    return Number(state >> 32n) / 0xffffffff;
  };
}

function systemRNG(): RNG {
  return () => Math.random();
}

// ────────────────────────────────────────────────────────────
// Distributions
// ────────────────────────────────────────────────────────────

type Range = { mean: number; std: number };

const sunnybrookByGrade: Record<HBGrade, Range> = {
  I: { mean: 95, std: 3 },
  II: { mean: 78, std: 5 },
  III: { mean: 54, std: 8 },
  IV: { mean: 38, std: 8 },
  V: { mean: 22, std: 6 },
  VI: { mean: 5, std: 4 },
};

const synkinesisByGrade: Record<HBGrade, Range> = {
  I: { mean: 0.0, std: 0.1 },
  II: { mean: 1.0, std: 0.3 },
  III: { mean: 2.5, std: 0.6 },
  IV: { mean: 3.5, std: 0.5 },
  V: { mean: 4.5, std: 0.3 },
  VI: { mean: 5.0, std: 0.1 },
};

const palpebralByGrade: Record<HBGrade, Range> = {
  I: { mean: 0.98, std: 0.02 },
  II: { mean: 0.92, std: 0.04 },
  III: { mean: 0.7, std: 0.08 },
  IV: { mean: 0.5, std: 0.08 },
  V: { mean: 0.3, std: 0.06 },
  VI: { mean: 0.1, std: 0.05 },
};

const amplitudeAsymByGrade: Record<HBGrade, Range> = {
  I: { mean: 0.03, std: 0.02 },
  II: { mean: 0.14, std: 0.04 },
  III: { mean: 0.38, std: 0.08 },
  IV: { mean: 0.55, std: 0.08 },
  V: { mean: 0.71, std: 0.06 },
  VI: { mean: 0.85, std: 0.05 },
};

const probCenterByGrade: Record<HBGrade, number> = {
  I: 0.05,
  II: 0.25,
  III: 0.45,
  IV: 0.65,
  V: 0.83,
  VI: 0.97,
};

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

/** Box-Muller Gaussian sample. */
function gauss(mu: number, sigma: number, rng: RNG, lo = -Infinity, hi = Infinity): number {
  const u1 = Math.max(1e-6, rng());
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return clamp(mu + z * sigma, lo, hi);
}

function randInt(rng: RNG, lo: number, hi: number): number {
  return Math.floor(rng() * (hi - lo + 1)) + lo;
}

function regionsFromSB(sb: number, rng: RNG): RegionScores {
  const pick = () => clamp(sb + randInt(rng, -15, 15), 0, 100);
  return {
    forehead: Math.round(pick()),
    eye: Math.round(pick()),
    cheek: Math.round(pick()),
    mouth: Math.round(pick()),
  };
}

function trendEndingAt(current: number, rng: RNG): number[] {
  const startPct = 0.4 + rng() * 0.4; // 0.4..0.8
  const start = Math.round(current * startPct);
  const step = Math.max(1, Math.round((current - start) / 5));
  const values: number[] = [];
  for (let i = 0; i < 6; i++) {
    const base = start + i * step;
    const jitter = randInt(rng, -2, 2);
    values.push(clamp(base + jitter, 0, 100));
  }
  values[5] = current; // pin the last to current
  return values;
}

function uuid(rng?: RNG): string {
  // RFC4122 v4-ish; uses Math.random if rng not provided (UUID only needs uniqueness, not reproducibility).
  const r = rng ?? Math.random;
  const rand = () => Math.floor(r() * 16);
  const hex = (n: number) => rand().toString(16).padStart(1, "0").slice(-1);
  let s = "";
  for (let i = 0; i < 32; i++) {
    if (i === 8 || i === 12 || i === 16 || i === 20) s += "-";
    if (i === 12) s += "4";
    else if (i === 16) s += ((rand() & 0x3) | 0x8).toString(16);
    else s += hex(i);
  }
  return s;
}

// ────────────────────────────────────────────────────────────
// Public API
// ────────────────────────────────────────────────────────────

export function gradeFromProb(p: number): HBGrade {
  if (p < 0.15) return "I";
  if (p < 0.35) return "II";
  if (p < 0.55) return "III";
  if (p < 0.75) return "IV";
  if (p < 0.92) return "V";
  return "VI";
}

export function preset(p: Preset, seed = 42): AssessmentReport {
  switch (p) {
    case "mild":
      return generate({ grade: "II", patientName: "Chen, L.", seed });
    case "moderate":
      return generate({ grade: "III", patientName: "Wang, J.", seed });
    case "severe":
      return generate({ grade: "V", patientName: "Liu, H.", seed });
  }
}

export function randomReport(seed?: number): AssessmentReport {
  const rng = seed !== undefined ? seededRNG(seed) : systemRNG();
  const grades: HBGrade[] = ["I", "II", "III", "IV", "V", "VI"];
  const grade = grades[Math.floor(rng() * grades.length)];
  const names = ["Chen, L.", "Wang, J.", "Liu, H.", "Zhao, M.", "Huang, Y."];
  const patientName = names[Math.floor(rng() * names.length)];
  return generateWithRNG(grade, patientName, rng);
}

export function generate(args: { grade: HBGrade; patientName: string; seed?: number }): AssessmentReport {
  const rng = args.seed !== undefined ? seededRNG(args.seed) : systemRNG();
  return generateWithRNG(args.grade, args.patientName, rng);
}

function generateWithRNG(grade: HBGrade, patientName: string, rng: RNG): AssessmentReport {
  const sbCfg = sunnybrookByGrade[grade];
  const sb = Math.round(gauss(sbCfg.mean, sbCfg.std, rng, 0, 100));

  const sykCfg = synkinesisByGrade[grade];
  const syk = gauss(sykCfg.mean, sykCfg.std, rng, 0, 5);

  const palpCfg = palpebralByGrade[grade];
  const palp = gauss(palpCfg.mean, palpCfg.std, rng, 0, 1);

  const ampCfg = amplitudeAsymByGrade[grade];
  const amp = gauss(ampCfg.mean, ampCfg.std, rng, 0, 1);

  const regions = regionsFromSB(sb, rng);
  const trend = trendEndingAt(sb, rng);

  const prob = clamp(gauss(probCenterByGrade[grade], 0.05, rng), 0, 1);

  const metrics: QuantitativeMetrics = {
    palpebralFissureClosureRate: Math.round(palp * 100) / 100,
    interLandmarkDistanceAsymMM: Math.round(gauss(0.08 + amp * 0.2, 0.01, rng, 0) * 1000) / 1000,
    temporalAsymmetrySmileMS: Math.round(gauss(50 + amp * 180, 10, rng, 0)),
    browExcursionRatio: Math.round(gauss(Math.max(0.05, 1 - amp), 0.05, rng, 0, 1) * 100) / 100,
    oralCommissureDropMM: Math.round(gauss(amp * 5.5, 0.3, rng, 0) * 10) / 10,
    amplitudeAsymmetry: Math.round(amp * 100) / 100,
  };

  const now = new Date();
  const history: HistoricalSession[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - 7 * (5 - i));
    history.push({
      id: uuid(),
      date: d.toISOString(),
      grade,
      sunnybrook: trend[i],
      isLatest: i === 5,
    });
  }

  return {
    id: uuid(),
    patientName,
    probAffected: Math.round(prob * 1000) / 1000,
    labelAffected: prob >= 0.5,
    capturedAt: now.toISOString(),
    history,
    trendSunnybrook: trend,
    grade,
    sunnybrook: sb,
    synkinesis: Math.round(syk * 10) / 10,
    regions,
    metrics,
    mockFields: [...TIER_C_FIELDS],
  };
}
