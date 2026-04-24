"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, Info, ChevronRight } from "lucide-react";
import { Card, GradeChip, Sparkline, PreviewBadge } from "@/components/atoms";
import { FC, HB_GRADES, sevColor } from "@/lib/design";
import { useSessionStore } from "@/lib/store";
import { formatSessionDate } from "@/lib/utils";
import type { HBGrade } from "@/lib/types";

const RANGE_OPTIONS = ["1W", "1M", "3M", "All"] as const;

export default function HistoryPage() {
  const [ready, setReady] = useState(false);
  const sessions = useSessionStore((s) => s.sessions);
  const latest = useSessionStore((s) => s.latest());
  const hydrated = useSessionStore((s) => s.hydrated);
  const seedIfEmpty = useSessionStore((s) => s.seedIfEmpty);

  useEffect(() => {
    if (hydrated) seedIfEmpty();
    setReady(true);
  }, [hydrated, seedIfEmpty]);

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-neutral-500">
        Loading…
      </div>
    );
  }

  if (sessions.length === 0 || !latest) {
    return (
      <div className="pt-topbar-loose px-6 flex flex-col items-center text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: FC.surface3 }}
        >
          <Clock size={24} style={{ color: FC.label3 }} />
        </div>
        <div className="text-[18px] font-bold tracking-tight" style={{ color: FC.label }}>
          No assessments yet
        </div>
        <div className="mt-1.5 text-[14px]" style={{ color: FC.label2 }}>
          Tap Home to start your first assessment.
        </div>
      </div>
    );
  }

  // Stats
  const totalSessions = sessions.length;
  const avgSunnybrook =
    sessions.reduce((sum, s) => sum + s.sunnybrook, 0) / totalSessions;

  let trendLabel = "→ Stable";
  let trendColor: string = FC.label2;
  if (sessions.length >= 2) {
    const sorted = [...sessions].sort(
      (a, b) => new Date(a.capturedAt).getTime() - new Date(b.capturedAt).getTime()
    );
    const oldSlice = sorted.slice(0, Math.min(3, sorted.length));
    const newSlice = sorted.slice(-Math.min(3, sorted.length));
    const avg = (arr: typeof sessions) =>
      arr.reduce((s, x) => s + x.sunnybrook, 0) / arr.length;
    const diff = avg(newSlice) - avg(oldSlice);
    if (Math.abs(diff) < 2) {
      trendLabel = "→ Stable";
      trendColor = FC.label2;
    } else if (diff > 0) {
      trendLabel = "↑ Improving";
      trendColor = FC.sev1;
    } else {
      trendLabel = "↓ Declining";
      trendColor = FC.sev5;
    }
  }

  // Grade distribution
  const allGrades: HBGrade[] = ["I", "II", "III", "IV", "V", "VI"];
  const counts: Record<HBGrade, number> = { I: 0, II: 0, III: 0, IV: 0, V: 0, VI: 0 };
  sessions.forEach((s) => {
    counts[s.grade] += 1;
  });
  const maxCount = Math.max(1, ...allGrades.map((g) => counts[g]));

  // Insight
  const sorted = [...sessions].sort(
    (a, b) => new Date(a.capturedAt).getTime() - new Date(b.capturedAt).getTime()
  );
  const first = sorted[0];
  const firstDateLabel = new Date(first.capturedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const insightDelta = latest.sunnybrook - first.sunnybrook;

  // Delta chip (from first trend point to current)
  const sbDelta = latest.sunnybrook - latest.trendSunnybrook[0];

  return (
    <div className="px-4 pt-topbar pb-8 flex flex-col gap-3">
      {/* Trend headline card */}
      <PreviewBadge>
        <Card padding={18}>
          <div className="flex items-start justify-between">
            <div>
              <div
                className="text-[13px] font-bold tracking-[0.18em] uppercase"
                style={{ color: FC.label3 }}
              >
                Sunnybrook Score
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span
                  className="text-[44px] font-bold tracking-tighter leading-none tabular-nums"
                  style={{ color: FC.label, fontFamily: "var(--font-mono)" }}
                >
                  {latest.sunnybrook}
                </span>
                <span
                  className="text-[18px] font-medium"
                  style={{ color: FC.label3 }}
                >
                  /100
                </span>
              </div>
              <div
                className="mt-2 inline-flex items-center px-2.5 py-1 rounded-[10px] text-[13px] font-bold"
                style={{
                  background: sbDelta >= 0 ? FC.sev1Soft : FC.sev5Soft,
                  color: sbDelta >= 0 ? FC.sev1 : FC.sev5,
                }}
              >
                {sbDelta >= 0 ? "↑" : "↓"} {Math.abs(sbDelta)} pts · 6 weeks
              </div>
            </div>

            {/* Range toggle (visual only) */}
            <div
              className="flex p-[2px] rounded-[10px]"
              style={{ background: FC.surface3 }}
            >
              {RANGE_OPTIONS.map((r) => {
                const active = r === "1M";
                return (
                  <div
                    key={r}
                    className="px-2.5 py-1.5 rounded-[8px] text-[12px] font-semibold"
                    style={{
                      background: active ? FC.surface : "transparent",
                      color: active ? FC.label : FC.label3,
                    }}
                  >
                    {r}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <Sparkline
              data={latest.trendSunnybrook}
              width={340}
              height={160}
              stroke={FC.brand}
            />
          </div>
        </Card>
      </PreviewBadge>

      {/* Stats card */}
      <PreviewBadge>
        <Card padding={16}>
          <div className="grid grid-cols-3 gap-2">
            <StatTile label="Total Sessions" value={`${totalSessions}`} />
            <StatTile label="Avg Sunnybrook" value={avgSunnybrook.toFixed(1)} />
            <StatTile label="Trend" value={trendLabel} color={trendColor} small />
          </div>
        </Card>
      </PreviewBadge>

      {/* Grade distribution */}
      <PreviewBadge>
        <Card padding={16}>
          <div className="text-[16px] font-bold tracking-tight mb-2.5">
            Grade Distribution
          </div>
          <div className="flex flex-col gap-2">
            {allGrades.map((g) => {
              const count = counts[g];
              const pct = (count / maxCount) * 100;
              return (
                <div key={g} className="flex items-center gap-3">
                  <div
                    className="w-6 text-[12px] font-bold tabular-nums text-center"
                    style={{ color: sevColor(g), fontFamily: "var(--font-mono)" }}
                  >
                    {g}
                  </div>
                  <div
                    className="flex-1 h-2 rounded-full overflow-hidden"
                    style={{ background: FC.surface3 }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.max(pct, count > 0 ? 4 : 0)}%`,
                        minWidth: count > 0 ? 4 : 0,
                        background: sevColor(g),
                      }}
                    />
                  </div>
                  <div
                    className="w-6 text-[12px] font-semibold tabular-nums text-right"
                    style={{ color: FC.label2 }}
                  >
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </PreviewBadge>

      {/* Insight strip — Tier B, no badge */}
      <div
        className="rounded-[20px] p-4 flex items-start gap-3"
        style={{ background: FC.brandSoft }}
      >
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
          style={{ background: FC.brand }}
        >
          <Info size={16} className="text-white" />
        </div>
        <div className="flex-1 text-[13px] leading-snug" style={{ color: FC.label2 }}>
          {sessions.length < 2 ? (
            <>Complete another assessment to see trend insights.</>
          ) : (
            <>
              You&apos;ve{" "}
              <span className="font-bold" style={{ color: FC.brandDeep }}>
                {insightDelta >= 0
                  ? `improved by ${insightDelta} points`
                  : `declined by ${Math.abs(insightDelta)} points`}
              </span>{" "}
              since your first assessment on {firstDateLabel}.
            </>
          )}
        </div>
      </div>

      {/* Sessions list */}
      <div
        className="flex justify-between items-center mt-1 mb-1 px-1"
      >
        <div
          className="text-[13px] font-semibold tracking-[0.18em] uppercase"
          style={{ color: FC.label3 }}
        >
          Sessions
        </div>
      </div>
      <Card padding={0}>
        {sessions.map((s, i) => (
          <Link
            key={s.id}
            href={`/report/${s.id}`}
            className="flex items-center gap-3 p-4 border-b last:border-b-0"
            style={{ borderColor: FC.separator }}
          >
            <GradeChip grade={s.grade} />
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-semibold flex items-center gap-2">
                {formatSessionDate(s.capturedAt)}
                {i === 0 && (
                  <span
                    className="text-[11px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: FC.brandSoft, color: FC.brand }}
                  >
                    LATEST
                  </span>
                )}
              </div>
              <div
                className="text-[13px] mt-0.5"
                style={{ color: FC.label3 }}
              >
                {HB_GRADES[s.grade].label} · {s.sunnybrook}/100
              </div>
            </div>
            <ChevronRight size={12} style={{ color: FC.label4 }} />
          </Link>
        ))}
      </Card>
    </div>
  );
}

function StatTile({
  label,
  value,
  color,
  small,
}: {
  label: string;
  value: string;
  color?: string;
  small?: boolean;
}) {
  return (
    <div
      className="rounded-[14px] p-3"
      style={{ background: FC.surface2 }}
    >
      <div
        className="text-[10px] font-bold tracking-[0.14em] uppercase"
        style={{ color: FC.label3 }}
      >
        {label}
      </div>
      <div
        className={
          small
            ? "mt-1 text-[13px] font-bold tracking-tight"
            : "mt-1 text-[22px] font-bold tracking-tighter tabular-nums"
        }
        style={{
          color: color ?? FC.label,
          fontFamily: small ? "var(--font-sans)" : "var(--font-mono)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

