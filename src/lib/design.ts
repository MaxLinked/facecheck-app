// FaceCheck design tokens — ported from FaceCheck/Components/FCDesign.swift
// Same hex codes, same HB grade metadata, same expression copy.

import type { HBGrade } from "./types";

export const FC = {
  // Surfaces
  bg: "#F2F2F7",
  surface: "#FFFFFF",
  surface2: "#F7F7FA",
  surface3: "#ECECF1",
  separator: "rgba(60, 60, 67, 0.08)",

  // Text
  label: "#0B0B0F",
  label2: "rgba(60, 60, 67, 0.75)",
  label3: "rgba(60, 60, 67, 0.55)",
  label4: "rgba(60, 60, 67, 0.35)",

  // Brand (clinical teal-blue)
  brand: "#0A7AE0",
  brandDeep: "#055BB5",
  brandSoft: "#E6F1FB",
  brandMist: "#F3F8FD",

  // Severity scale (H-B I..VI)
  sev1: "#34C759",
  sev2: "#A8D84E",
  sev3: "#F5C518",
  sev4: "#FF9F0A",
  sev5: "#FF6B35",
  sev6: "#E5484D",

  sev1Soft: "#E6F7EC",
  sev2Soft: "#F0F8DC",
  sev3Soft: "#FDF4D6",
  sev4Soft: "#FDEDD3",
  sev5Soft: "#FEE9DB",
  sev6Soft: "#FBE3E4",
} as const;

export function sevColor(grade: HBGrade): string {
  switch (grade) {
    case "I": return FC.sev1;
    case "II": return FC.sev2;
    case "III": return FC.sev3;
    case "IV": return FC.sev4;
    case "V": return FC.sev5;
    case "VI": return FC.sev6;
  }
}

export function sevSoft(grade: HBGrade): string {
  switch (grade) {
    case "I": return FC.sev1Soft;
    case "II": return FC.sev2Soft;
    case "III": return FC.sev3Soft;
    case "IV": return FC.sev4Soft;
    case "V": return FC.sev5Soft;
    case "VI": return FC.sev6Soft;
  }
}

// House-Brackmann grade metadata
export const HB_GRADES: Record<HBGrade, { label: string; description: string }> = {
  I: { label: "Normal", description: "Normal facial function in all areas" },
  II: { label: "Mild Dysfunction", description: "Slight weakness on close inspection" },
  III: { label: "Moderate", description: "Obvious but not disfiguring asymmetry" },
  IV: { label: "Moderate-Severe", description: "Obvious weakness, disfiguring asymmetry" },
  V: { label: "Severe", description: "Barely perceptible motion" },
  VI: { label: "Total Paralysis", description: "No movement" },
};

// Six Sunnybrook-aligned expression tasks (for future capture protocol)
export const EXPRESSIONS = [
  { id: "rest", name: "Resting", instruction: "Relax your face, look forward", durationSec: 3 },
  { id: "brow", name: "Raise Brows", instruction: "Raise your eyebrows as high as you can", durationSec: 3 },
  { id: "close", name: "Gentle Close", instruction: "Gently close your eyes", durationSec: 3 },
  { id: "force", name: "Force Close", instruction: "Squeeze your eyes shut tightly", durationSec: 3 },
  { id: "smile", name: "Open Smile", instruction: "Smile showing your teeth", durationSec: 3 },
  { id: "puff", name: "Puff Cheeks", instruction: "Puff out both cheeks with air", durationSec: 3 },
] as const;

// Font stacks matching iOS
export const font = {
  text: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif',
  mono: '"SF Mono", ui-monospace, Menlo, monospace',
} as const;
