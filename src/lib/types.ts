// AssessmentReport — TS mirror of the iOS Swift struct.
// Kept in sync with ../../FaceCheck/api-contract/README.md (iOS sibling).

export type HBGrade = "I" | "II" | "III" | "IV" | "V" | "VI";

export interface RegionScores {
  forehead: number; // 0..100
  eye: number;
  cheek: number;
  mouth: number;
}

export interface QuantitativeMetrics {
  palpebralFissureClosureRate: number; // 0..1 L/R ratio
  interLandmarkDistanceAsymMM: number; // mm
  temporalAsymmetrySmileMS: number; // ms, integer
  browExcursionRatio: number; // 0..1
  oralCommissureDropMM: number; // mm
  amplitudeAsymmetry: number; // 0..1
}

export interface HistoricalSession {
  id: string; // UUID
  date: string; // ISO8601
  grade: HBGrade;
  sunnybrook: number;
  isLatest: boolean;
}

export interface AssessmentReport {
  id: string; // UUID

  // Tier A — real from /pipeline
  patientName: string;
  probAffected: number; // 0..1
  labelAffected: boolean;

  // Tier B — client-side real
  capturedAt: string; // ISO8601
  history: HistoricalSession[];
  trendSunnybrook: number[]; // last 6 sessions' sunnybrook scores

  // Tier C — model-generated (mocked until backend grows matching heads)
  grade: HBGrade;
  sunnybrook: number; // 0..100
  synkinesis: number; // 0..5
  regions: RegionScores;
  metrics: QuantitativeMetrics;

  // Meta: which fields are currently sourced from mock (UI paints PREVIEW badges)
  mockFields: string[];
}

export const TIER_C_FIELDS = [
  "grade",
  "sunnybrook",
  "synkinesis",
  "regions",
  "metrics",
] as const;

export type Preset = "mild" | "moderate" | "severe";
