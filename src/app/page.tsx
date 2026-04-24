"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, ChevronRight, Settings, Smile } from "lucide-react";
import { Card, GradeChip, Sparkline, PreviewBadge } from "@/components/atoms";
import { FC, HB_GRADES, sevColor, sevSoft } from "@/lib/design";
import { useSessionStore } from "@/lib/store";
import { formatTime } from "@/lib/utils";
import type { HBGrade } from "@/lib/types";

export default function HomePage() {
  const [ready, setReady] = useState(false);
  const sessions = useSessionStore((s) => s.sessions);
  const latest = useSessionStore((s) => s.latest());
  const hydrated = useSessionStore((s) => s.hydrated);
  const seedIfEmpty = useSessionStore((s) => s.seedIfEmpty);

  useEffect(() => {
    if (hydrated) seedIfEmpty();
    setReady(true);
  }, [hydrated, seedIfEmpty]);

  if (!ready || !latest) {
    return <div className="flex items-center justify-center h-full text-sm text-neutral-500">Loading…</div>;
  }

  const grade = latest.grade;
  const gradeMeta = HB_GRADES[grade];
  const todayStr = new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });

  return (
    <div
      className="px-5 min-h-screen-dvh pb-tab bg-[var(--color-fc-bg)]"
      style={{ paddingTop: "max(52px, calc(env(safe-area-inset-top) + 8px))" }}
    >
      {/* Greeting header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-[15px] text-neutral-500 font-medium">{todayStr}</div>
          <div className="text-[30px] font-bold leading-tight tracking-tight mt-0.5">
            Good morning,
            <br />
            Max
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/settings"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 border border-black/5 text-neutral-500"
            aria-label="Settings"
          >
            <Settings size={16} />
          </Link>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ background: "linear-gradient(135deg, #FFD6A5, #FF9F6B)" }}
          >
            M
          </div>
        </div>
      </div>

      {/* Latest assessment hero */}
      <PreviewBadge>
        <Link href={`/report/${latest.id}`} className="block">
          <div className="bg-white rounded-[20px] overflow-hidden shadow-sm">
            <div className="px-[18px] pt-[18px] pb-[14px] border-b border-neutral-100">
              <div className="flex justify-between items-center mb-3">
                <div className="text-[13px] font-semibold tracking-wider text-neutral-500 uppercase">
                  Latest Assessment
                </div>
                <div className="flex items-center gap-1 text-[13px] text-neutral-500">
                  <Clock size={13} />
                  {formatTime(latest.capturedAt)}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="w-[72px] h-[72px] rounded-[18px] flex flex-col items-center justify-center"
                  style={{ background: sevSoft(grade) }}
                >
                  <div className="font-mono font-bold leading-none" style={{ color: sevColor(grade), fontSize: 28 }}>
                    {grade}
                  </div>
                  <div className="text-[10px] font-semibold mt-1" style={{ color: sevColor(grade), opacity: 0.8 }}>
                    H-B GRADE
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-[20px] font-bold tracking-tight">{gradeMeta.label}</div>
                  <div className="text-[14px] text-neutral-500 mt-0.5 leading-snug line-clamp-2">
                    {gradeMeta.description}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex py-3.5 px-1">
              <MiniMetric label="SUNNYBROOK" value={`${latest.sunnybrook}`} unit="/100" />
              <div className="w-px bg-neutral-100 my-1" />
              <MiniMetric label="SYNKINESIS" value={latest.synkinesis.toFixed(1)} unit="/5" />
              <div className="w-px bg-neutral-100 my-1" />
              <div className="flex-1 py-1.5 px-3 flex flex-col items-center gap-1">
                <div className="text-[11px] font-semibold tracking-wider text-neutral-500">TREND</div>
                <Sparkline data={latest.trendSunnybrook} stroke={FC.sev1} />
              </div>
            </div>
          </div>
        </Link>
      </PreviewBadge>

      {/* Start Assessment CTA */}
      <Link
        href="/capture"
        className="mt-3 rounded-[20px] flex items-center gap-3.5 p-5 text-white"
        style={{
          background: `linear-gradient(135deg, ${FC.brand}, ${FC.brandDeep})`,
          boxShadow: `0 10px 28px ${FC.brand}40`,
        }}
      >
        <div className="w-12 h-12 rounded-[14px] bg-white/20 flex items-center justify-center">
          <Smile size={26} />
        </div>
        <div className="flex-1">
          <div className="text-[17px] font-bold tracking-tight">Start Assessment</div>
          <div className="text-[13px] opacity-85 mt-0.5">Tap to select or take a photo</div>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <ChevronRight size={14} strokeWidth={3} />
        </div>
      </Link>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-2.5 mt-4">
        <Card padding={14}>
          <div className="text-[12px] font-semibold tracking-wider text-neutral-500 uppercase">Sessions</div>
          <div className="text-[26px] font-bold tracking-tighter mt-1">{sessions.length}</div>
          <div className="text-[12px] font-semibold mt-0.5" style={{ color: FC.sev1 }}>
            ↑ {Math.min(sessions.length, 3)} this week
          </div>
        </Card>
        <Card padding={14}>
          <div className="text-[12px] font-semibold tracking-wider text-neutral-500 uppercase">Recovery</div>
          <div className="text-[26px] font-bold tracking-tighter mt-1">
            +{latest.trendSunnybrook.at(-1)! - latest.trendSunnybrook[0]}
            <span className="text-[14px] text-neutral-400 font-medium"> pts</span>
          </div>
          <div className="text-[12px] font-semibold mt-0.5" style={{ color: FC.sev1 }}>
            since first session
          </div>
        </Card>
      </div>

      {/* History section */}
      <div className="flex justify-between items-center mt-5 mb-2.5 px-1">
        <div className="text-[13px] font-semibold tracking-wider text-neutral-500 uppercase">History</div>
        <Link href="/history" className="text-[14px] font-semibold" style={{ color: FC.brand }}>
          See All
        </Link>
      </div>
      <Card padding={0}>
        {buildHistoryRows(latest.id, latest.grade, latest.sunnybrook, latest.capturedAt, latest.trendSunnybrook).map(
          (row, idx) => (
            <Link
              key={idx}
              href={row.reportId ? `/report/${row.reportId}` : `/report/${latest.id}`}
              className="flex items-center gap-3 p-4 border-b border-neutral-100 last:border-b-0"
            >
              <GradeChip grade={row.grade} />
              <div className="flex-1">
                <div className="text-[15px] font-semibold flex items-center gap-2">
                  {row.date}
                  {row.isLatest && (
                    <span
                      className="text-[11px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: FC.brandSoft, color: FC.brand }}
                    >
                      LATEST
                    </span>
                  )}
                </div>
                <div className="text-[13px] text-neutral-400 mt-0.5">
                  {HB_GRADES[row.grade].label} · {row.score}/100
                </div>
              </div>
              <ChevronRight size={12} className="text-neutral-300" />
            </Link>
          )
        )}
      </Card>
    </div>
  );
}

function MiniMetric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex-1 py-1.5 px-3 flex flex-col items-center gap-1">
      <div className="text-[11px] font-semibold tracking-wider text-neutral-500">{label}</div>
      <div className="text-[20px] font-bold tracking-tight tabular-nums">
        {value}
        <span className="text-[12px] text-neutral-400 font-medium">{unit}</span>
      </div>
    </div>
  );
}

interface HRow {
  reportId: string | null;
  date: string;
  grade: HBGrade;
  score: number;
  isLatest: boolean;
}

function buildHistoryRows(latestId: string, latestGrade: HBGrade, latestScore: number, latestDate: string, trend: number[]): HRow[] {
  const fmt = formatTime(latestDate);
  const rows: HRow[] = [
    { reportId: latestId, date: `Today · ${fmt}`, grade: latestGrade, score: latestScore, isLatest: true },
  ];
  const fallbackDates = ["Apr 16 · 10:12 AM", "Apr 09 · 9:47 AM", "Apr 02 · 8:55 AM", "Mar 26 · 9:30 AM"];
  const order: HBGrade[] = ["I", "II", "III", "IV", "V", "VI"];
  const olderIdx = Math.min(order.indexOf(latestGrade) + 1, order.length - 1);
  const olderGrade = order[olderIdx];
  for (let i = 0; i < 4; i++) {
    const trendIdx = Math.max(0, trend.length - 2 - i);
    const score = trend[trendIdx];
    const grade = i >= 2 ? olderGrade : latestGrade;
    rows.push({ reportId: null, date: fallbackDates[i], grade, score, isLatest: false });
  }
  return rows;
}
