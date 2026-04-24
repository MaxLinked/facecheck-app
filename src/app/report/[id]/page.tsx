"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Share, Info } from "lucide-react";
import {
  Card,
  GradeChip,
  GradeHero,
  MetricTile,
  RegionBar,
  Sparkline,
  FaceSilhouette,
  PreviewBadge,
} from "@/components/atoms";
import { FC, HB_GRADES, sevColor, sevSoft } from "@/lib/design";
import { useSessionStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type ResultView = "patient" | "clinical";

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const sessions = useSessionStore((s) => s.sessions);
  const latest = useSessionStore((s) => s.latest());
  const hydrated = useSessionStore((s) => s.hydrated);
  const seedIfEmpty = useSessionStore((s) => s.seedIfEmpty);

  const [view, setView] = useState<ResultView>("patient");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (hydrated) seedIfEmpty();
    setReady(true);
  }, [hydrated, seedIfEmpty]);

  const report = sessions.find((s) => s.id === id) ?? latest;

  if (!ready || !report) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-neutral-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen-dvh pb-tab" style={{ background: FC.bg }}>
      {/* Header */}
      <div className="pt-topbar px-4 pb-0 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-black/5"
          aria-label="Back"
        >
          <ChevronLeft size={14} style={{ color: FC.label2 }} strokeWidth={2.4} />
        </button>
        <div className="text-[15px] font-semibold" style={{ color: FC.label }}>
          Assessment Report
        </div>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-black/5"
          style={{ opacity: 0.5 }}
          aria-hidden
        >
          <Share size={16} style={{ color: FC.label2 }} />
        </div>
      </div>

      {/* Toggle */}
      <div className="px-4 pt-3.5 pb-1">
        <div
          className="flex p-[3px] rounded-[12px]"
          style={{ background: FC.surface3 }}
        >
          {(["patient", "clinical"] as const).map((v) => {
            const active = view === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={cn(
                  "flex-1 py-2 rounded-[10px] text-[14px] font-semibold tracking-tight transition-colors"
                )}
                style={{
                  background: active ? FC.surface : "transparent",
                  color: active ? FC.label : FC.label2,
                  boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {v === "patient" ? "Patient View" : "Clinical View"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pt-3 pb-10 flex flex-col gap-3">
        {view === "patient" ? (
          <PatientView report={report} />
        ) : (
          <ClinicalView report={report} />
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Patient View
// ────────────────────────────────────────────────────────────
function PatientView({ report }: { report: ReturnType<typeof useSessionStore.getState>["sessions"][number] }) {
  const { grade, regions, trendSunnybrook } = report;
  return (
    <>
      <PreviewBadge>
        <GradeHero grade={grade} />
      </PreviewBadge>

      {/* Asymmetry Map */}
      <PreviewBadge>
        <Card padding={18}>
          <div className="flex items-center justify-between mb-2.5">
            <div className="text-[16px] font-bold tracking-tight">Asymmetry Map</div>
          </div>
          <div className="flex justify-center py-1.5 pb-2.5">
            <FaceSilhouette size={160} showHeatmap heatSide="right" />
          </div>
          <div
            className="h-1.5 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${FC.sev1}, ${FC.sev3}, ${FC.sev5}, ${FC.sev6})`,
            }}
          />
          <div
            className="flex justify-between mt-1.5 text-[11px] font-semibold"
            style={{ color: FC.label3 }}
          >
            <span>Symmetric</span>
            <span>Right-side weakness</span>
          </div>
        </Card>
      </PreviewBadge>

      {/* By Region */}
      <PreviewBadge>
        <Card padding={18}>
          <div className="text-[16px] font-bold tracking-tight mb-3">By Region</div>
          <RegionBar label="Forehead" value={regions.forehead} />
          <RegionBar label="Eye Region" value={regions.eye} />
          <RegionBar label="Cheek / Midface" value={regions.cheek} />
          <RegionBar label="Mouth / Smile" value={regions.mouth} />
        </Card>
      </PreviewBadge>

      {/* Recovery Trend — Tier B, no badge */}
      <Card padding={18}>
        <div className="flex items-start justify-between mb-1.5">
          <div>
            <div className="text-[16px] font-bold tracking-tight">Recovery Trend</div>
            <div
              className="text-[13px] font-semibold mt-0.5"
              style={{ color: FC.sev1 }}
            >
              ↑ Improving over 6 weeks
            </div>
          </div>
          <ChevronRight size={14} style={{ color: FC.label3 }} />
        </div>
        <div className="mt-2">
          <Sparkline data={trendSunnybrook} width={310} height={64} stroke={FC.sev1} />
        </div>
      </Card>

      {/* Recommendation — Tier B */}
      <div
        className="rounded-[20px] p-4 flex items-start gap-3"
        style={{ background: FC.brandSoft }}
      >
        <div
          className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0"
          style={{ background: FC.brand }}
        >
          <Info size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="text-[14px] font-bold" style={{ color: FC.brandDeep }}>
            Keep up your exercises
          </div>
          <div className="text-[13px] leading-snug mt-1" style={{ color: FC.label2 }}>
            Your score has improved — keep practising the daily exercises.
          </div>
        </div>
      </div>
    </>
  );
}

// ────────────────────────────────────────────────────────────
// Clinical View
// ────────────────────────────────────────────────────────────
function ClinicalView({ report }: { report: ReturnType<typeof useSessionStore.getState>["sessions"][number] }) {
  const { id, grade, patientName, sunnybrook, synkinesis, regions, metrics, capturedAt } = report;
  const shortId = id.slice(0, 8);
  const capturedDate = new Date(capturedAt);
  const dateSlug = `${capturedDate.getFullYear()}${(capturedDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${capturedDate.getDate().toString().padStart(2, "0")}`;

  const nameOnly = patientName.split("·")[0].trim();

  return (
    <>
      {/* Patient Ref card */}
      <Card padding={14}>
        <div className="flex items-center justify-between">
          <div>
            <div
              className="text-[11px] font-bold tracking-[0.18em] uppercase"
              style={{ color: FC.label3 }}
            >
              Patient
            </div>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-[16px] font-bold" style={{ color: FC.label }}>
                {nameOnly}
              </span>
              <span
                className="text-[13px] font-medium"
                style={{ color: FC.label3 }}
              >
                · ID {shortId}
              </span>
            </div>
          </div>
          <GradeChip grade={grade} size={36} />
        </div>
      </Card>

      {/* 2x2 metrics grid */}
      <PreviewBadge>
        <div className="grid grid-cols-2 gap-2.5">
          <MetricTile
            label="House-Brackmann"
            value={grade}
            color={sevColor(grade)}
            bg={sevSoft(grade)}
          />
          <MetricTile
            label="Sunnybrook"
            value={`${sunnybrook}`}
            unit="/100"
            color={FC.brand}
            bg={FC.brandSoft}
          />
          <MetricTile
            label="Synkinesis"
            value={synkinesis.toFixed(1)}
            unit="/5"
            color={FC.sev3}
            bg={FC.sev3Soft}
          />
          <MetricTile
            label="Δ Amplitude"
            value={metrics.amplitudeAsymmetry.toFixed(2)}
            color={FC.sev4}
            bg="#FDEDD3"
          />
        </div>
      </PreviewBadge>

      {/* Quantitative metrics */}
      <PreviewBadge>
        <Card padding={0}>
          <div
            className="px-4 pt-3.5 pb-2 text-[12px] font-bold tracking-[0.18em] uppercase"
            style={{ color: FC.label3 }}
          >
            Quantitative Metrics
          </div>
          <MetricRow
            label="Palpebral fissure closure rate (L/R)"
            value={metrics.palpebralFissureClosureRate.toFixed(2)}
            hint="Ratio ≥ 0.9 = symmetric"
          />
          <MetricRow
            label="Inter-landmark distance asymmetry"
            value={metrics.interLandmarkDistanceAsymMM.toString()}
            unit="mm"
            hint="Depth-augmented 3D"
          />
          <MetricRow
            label="Temporal asymmetry (smile)"
            value={metrics.temporalAsymmetrySmileMS.toString()}
            unit="ms"
            hint="Onset delay R vs L"
          />
          <MetricRow
            label="Brow excursion (L/R)"
            value={metrics.browExcursionRatio.toFixed(2)}
            hint="Normalized ratio"
          />
          <MetricRow
            label="Oral commissure drop"
            value={metrics.oralCommissureDropMM.toString()}
            unit="mm"
            hint="Downward displacement"
            last
          />
        </Card>
      </PreviewBadge>

      {/* Regional Scoring */}
      <PreviewBadge>
        <Card padding={0}>
          <div
            className="px-4 pt-3.5 pb-2 text-[12px] font-bold tracking-[0.18em] uppercase"
            style={{ color: FC.label3 }}
          >
            Regional Scoring
          </div>
          <div className="px-4 pb-4">
            <div
              className="grid py-2 border-b"
              style={{
                gridTemplateColumns: "1.3fr 1fr 1fr 1fr",
                borderColor: FC.separator,
              }}
            >
              <div
                className="text-[11px] font-bold tracking-[0.12em] uppercase"
                style={{ color: FC.label3 }}
              >
                Region
              </div>
              {["Static", "Dynamic", "Total"].map((h) => (
                <div
                  key={h}
                  className="text-[11px] font-bold tracking-[0.12em] uppercase text-right"
                  style={{ color: FC.label3 }}
                >
                  {h}
                </div>
              ))}
            </div>
            {[
              { region: "Forehead", total: regions.forehead, s: 68, d: 60 },
              { region: "Eye", total: regions.eye, s: 48, d: 56 },
              { region: "Nasolabial", total: regions.cheek, s: 42, d: 50 },
              { region: "Oral", total: regions.mouth, s: 55, d: 61 },
            ].map((r, i, arr) => (
              <div
                key={r.region}
                className={cn(
                  "grid py-2.5 text-[13px] tabular-nums",
                  i < arr.length - 1 && "border-b"
                )}
                style={{
                  gridTemplateColumns: "1.3fr 1fr 1fr 1fr",
                  borderColor: FC.separator,
                }}
              >
                <div className="font-semibold" style={{ color: FC.label }}>
                  {r.region}
                </div>
                <div className="text-right" style={{ color: FC.label2 }}>
                  {r.s}
                </div>
                <div className="text-right" style={{ color: FC.label2 }}>
                  {r.d}
                </div>
                <div className="text-right font-bold" style={{ color: FC.label }}>
                  {r.total}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </PreviewBadge>

      {/* Actions row */}
      <div className="grid grid-cols-2 gap-2.5">
        <Link
          href={`/avatar/${id}`}
          className="rounded-[20px] py-3.5 flex items-center justify-center gap-2 bg-white border"
          style={{ borderColor: FC.separator }}
        >
          <span
            className="inline-block w-[18px] h-[18px] rounded-[4px]"
            style={{
              background: `radial-gradient(circle, ${FC.brand} 1px, transparent 1.5px) 0 0 / 6px 6px`,
            }}
          />
          <span className="text-[14px] font-semibold" style={{ color: FC.label }}>
            3D Avatar
          </span>
        </Link>
        <div
          className="rounded-[20px] py-3.5 flex items-center justify-center gap-2 bg-white border pointer-events-none"
          style={{ borderColor: FC.separator, opacity: 0.6 }}
          aria-disabled
        >
          <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
            <path
              d="M2 14 L6 9 L10 11 L16 4"
              stroke={FC.brand}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[14px] font-semibold" style={{ color: FC.label }}>
            Longitudinal
          </span>
        </div>
      </div>

      {/* Raw export strip */}
      <div
        className="rounded-[20px] px-4 py-2.5 flex items-center justify-between"
        style={{
          background: FC.surface,
          border: `1px dashed ${FC.separator}`,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: FC.label3,
        }}
      >
        <div className="truncate pr-2">
          session_{shortId}_{dateSlug}.json · 1,220 mesh · 30 fps · 18.4 MB
        </div>
        <div className="font-semibold shrink-0" style={{ color: FC.brand }}>
          Export
        </div>
      </div>
    </>
  );
}

// ────────────────────────────────────────────────────────────
// Helper atoms
// ────────────────────────────────────────────────────────────
function MetricRow({
  label,
  value,
  unit,
  hint,
  last = false,
}: {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
  last?: boolean;
}) {
  return (
    <div
      className={cn("px-4 py-3 flex items-start justify-between", !last && "border-b")}
      style={{ borderColor: FC.separator }}
    >
      <div className="flex-1 pr-4">
        <div className="text-[14px] font-semibold" style={{ color: FC.label }}>
          {label}
        </div>
        {hint && (
          <div className="text-[12px] mt-0.5" style={{ color: FC.label3 }}>
            {hint}
          </div>
        )}
      </div>
      <div
        className="text-[16px] font-bold tabular-nums shrink-0"
        style={{ fontFamily: "var(--font-mono)", color: FC.label }}
      >
        {value}
        {unit && (
          <span
            className="ml-1 text-[12px] font-medium"
            style={{ color: FC.label3, fontFamily: "var(--font-sans)" }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
