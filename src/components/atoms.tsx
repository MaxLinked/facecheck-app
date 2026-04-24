// Shared atoms: Card, GradeChip, MetricTile, RegionBar, Sparkline, SeverityScale, PreviewBadge, FaceSilhouette.
"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FC, HB_GRADES, sevColor, sevSoft } from "@/lib/design";
import type { HBGrade } from "@/lib/types";

// ────────────────────────────────────────────────────────────
// PreviewBadge — no-op wrapper (retained so call sites compile; the visual
// "PREVIEW" marker was removed to keep the prototype looking polished).
// ────────────────────────────────────────────────────────────

export function PreviewBadge({ children, className }: { children: ReactNode; className?: string }) {
  if (className) {
    return <div className={cn(className)}>{children}</div>;
  }
  return <>{children}</>;
}

// ────────────────────────────────────────────────────────────
// Card
// ────────────────────────────────────────────────────────────

export function Card({ children, className, padding = 18 }: { children: ReactNode; className?: string; padding?: number | string }) {
  return (
    <div
      className={cn("bg-white rounded-[20px] shadow-sm", className)}
      style={{ padding, boxShadow: "0 1px 4px rgba(15,20,30,0.04), 0 10px 24px rgba(15,20,30,0.03)" }}
    >
      {children}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// GradeChip — "III" mono-font tile
// ────────────────────────────────────────────────────────────

export function GradeChip({ grade, size = 36 }: { grade: HBGrade; size?: number }) {
  return (
    <div
      className="flex items-center justify-center font-mono font-bold rounded-[10px]"
      style={{
        width: size,
        height: size,
        background: sevSoft(grade),
        color: sevColor(grade),
        fontSize: size * 0.38,
      }}
    >
      {grade}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// MetricTile — colored quadrant tile with label + value
// ────────────────────────────────────────────────────────────

export function MetricTile({
  label,
  value,
  unit = "",
  color,
  bg,
}: {
  label: string;
  value: string;
  unit?: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-[14px] p-3.5 pt-3.5 pb-3" style={{ background: bg }}>
      <div className="text-[11px] font-bold tracking-wider uppercase" style={{ color }}>
        {label}
      </div>
      <div className="mt-1.5 font-mono font-bold tracking-tighter tabular-nums" style={{ color, fontSize: 28 }}>
        {value}
        <span style={{ fontSize: 14, opacity: 0.7, fontFamily: "var(--font-sans)" }}>{unit}</span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// RegionBar — "Forehead / 88 / 100" with a colored bar
// ────────────────────────────────────────────────────────────

export function RegionBar({ label, value }: { label: string; value: number }) {
  const color =
    value >= 80 ? FC.sev1 : value >= 60 ? FC.sev3 : value >= 40 ? FC.sev4 : FC.sev5;
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between text-[13px] font-semibold mb-1.5">
        <span>{label}</span>
        <span className="tabular-nums text-neutral-600">
          {value}
          <span className="text-neutral-400 font-medium">/100</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-[var(--color-fc-surface3)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Sparkline — small trend line from numeric array
// ────────────────────────────────────────────────────────────

export function Sparkline({
  data,
  width = 80,
  height = 26,
  stroke = FC.sev1,
}: {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
}) {
  if (data.length < 2) return <div style={{ width, height }} />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const d = "M " + pts.join(" L ");
  const last = pts[pts.length - 1].split(",").map(Number);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path d={d} fill="none" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={2.5} fill={stroke} />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
// SeverityScale — 6 colored segments with indicator arrow under current grade
// ────────────────────────────────────────────────────────────

export function SeverityScale({ grade }: { grade: HBGrade }) {
  const grades: HBGrade[] = ["I", "II", "III", "IV", "V", "VI"];
  return (
    <div className="relative pb-4">
      <div className="flex gap-[3px]">
        {grades.map((g) => (
          <div
            key={g}
            className="relative flex-1 h-2 rounded-full"
            style={{ background: g === grade ? sevColor(g) : sevSoft(g) }}
          >
            {g === grade && (
              <div
                className="absolute left-1/2 -translate-x-1/2 top-[12px]"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "5px solid transparent",
                  borderRight: "5px solid transparent",
                  borderTop: `6px solid ${sevColor(g)}`,
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-3 text-[10px] font-semibold tracking-wider text-neutral-500">
        <span>NORMAL</span>
        <span>TOTAL</span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// FaceSilhouette — schematic face outline with optional mesh/heatmap overlay
// ────────────────────────────────────────────────────────────

export function FaceSilhouette({
  size = 160,
  showMesh = false,
  showHeatmap = false,
  heatSide = "right",
  inverted = false,
}: {
  size?: number;
  showMesh?: boolean;
  showHeatmap?: boolean;
  heatSide?: "left" | "right";
  inverted?: boolean;
}) {
  const strokeColor = inverted ? "#FFFFFF" : FC.label2;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* face oval */}
        <ellipse
          cx={size / 2}
          cy={size / 2}
          rx={size * 0.35}
          ry={size * 0.45}
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.2}
        />
        {/* eyes */}
        <circle cx={size * 0.38} cy={size * 0.42} r={size * 0.03} fill={strokeColor} />
        <circle cx={size * 0.62} cy={size * 0.42} r={size * 0.03} fill={strokeColor} />
        {/* mouth arc */}
        <path
          d={`M ${size * 0.38} ${size * 0.62} Q ${size / 2} ${size * 0.72} ${size * 0.62} ${size * 0.62}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.2}
          strokeLinecap="round"
        />
        {/* mesh dots */}
        {showMesh && (
          <g opacity={0.55}>
            {Array.from({ length: 56 }).map((_, i) => {
              const r = i % 8;
              const c = Math.floor(i / 8);
              const x = (r + 1) * (size / 9);
              const y = (c + 1) * (size / 9);
              const inEllipse =
                Math.pow((x - size / 2) / (size * 0.35), 2) +
                  Math.pow((y - size / 2) / (size * 0.45), 2) <=
                1;
              if (!inEllipse) return null;
              return <circle key={i} cx={x} cy={y} r={1.2} fill={FC.brand} />;
            })}
          </g>
        )}
        {/* heat side overlay */}
        {showHeatmap && (
          <defs>
            <linearGradient id="heat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={FC.sev5} stopOpacity={0} />
              <stop offset="100%" stopColor={FC.sev5} stopOpacity={0.55} />
            </linearGradient>
          </defs>
        )}
        {showHeatmap && (
          <rect
            x={heatSide === "right" ? size / 2 : 0}
            y={size * 0.1}
            width={size / 2}
            height={size * 0.7}
            fill="url(#heat)"
            style={{ filter: "blur(8px)", mixBlendMode: "multiply" }}
            clipPath={`url(#face-clip-${size})`}
          />
        )}
        <defs>
          <clipPath id={`face-clip-${size}`}>
            <ellipse cx={size / 2} cy={size / 2} rx={size * 0.35} ry={size * 0.45} />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// GradeBadge — rounded-square H-B tile with grade + label + description
// ────────────────────────────────────────────────────────────

export function GradeHero({ grade }: { grade: HBGrade }) {
  const meta = HB_GRADES[grade];
  return (
    <div
      className="rounded-[26px] p-5"
      style={{
        background: `linear-gradient(180deg, ${sevSoft(grade)}, #FFFFFF)`,
      }}
    >
      <div
        className="text-[13px] font-bold tracking-wider uppercase"
        style={{ color: sevColor(grade) }}
      >
        Your Grade
      </div>
      <div className="flex items-center gap-[18px] mt-3">
        <div
          className="font-mono font-bold tracking-tighter leading-none"
          style={{ color: sevColor(grade), fontSize: 64 }}
        >
          {grade}
        </div>
        <div className="flex-1">
          <div className="text-[22px] font-bold tracking-tight">{meta.label}</div>
          <div className="text-[13px] text-neutral-500 mt-1 leading-snug">{meta.description}</div>
        </div>
      </div>
      <div className="mt-5">
        <SeverityScale grade={grade} />
      </div>
    </div>
  );
}
