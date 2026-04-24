"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { FaceSilhouette, PreviewBadge } from "@/components/atoms";
import { FC, sevColor } from "@/lib/design";
import type { HBGrade } from "@/lib/types";
import { useSessionStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Expression = "rest" | "smile" | "brow";
const PRESETS: Record<Expression, number> = { rest: 0, smile: 20, brow: -15 };

export default function AvatarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const sessions = useSessionStore((s) => s.sessions);
  const latest = useSessionStore((s) => s.latest());
  const hydrated = useSessionStore((s) => s.hydrated);
  const seedIfEmpty = useSessionStore((s) => s.seedIfEmpty);

  const [ready, setReady] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [expression, setExpression] = useState<Expression>("rest");
  const controls = useAnimation();

  useEffect(() => {
    if (hydrated) seedIfEmpty();
    setReady(true);
  }, [hydrated, seedIfEmpty]);

  const report = sessions.find((s) => s.id === id) ?? latest;

  if (!ready || !report) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-white/70">
        Loading…
      </div>
    );
  }

  const { regions, metrics } = report;

  const left = Math.round((regions.forehead + regions.eye) / 2);
  const center = Math.round(regions.cheek);
  const right = Math.round(
    (regions.mouth + (100 - metrics.amplitudeAsymmetry * 100)) / 2
  );

  const lowestRegion = (Object.entries(regions) as [keyof typeof regions, number][])
    .reduce((min, cur) => (cur[1] < min[1] ? cur : min), ["forehead", regions.forehead] as [
      keyof typeof regions,
      number
    ])[0];

  const regionLabels: Record<keyof typeof regions, string> = {
    forehead: "forehead",
    eye: "eye region",
    cheek: "cheek / midface",
    mouth: "mouth / smile",
  };

  function handleSelect(next: Expression) {
    setExpression(next);
    const target = PRESETS[next];
    setRotation(target);
    controls.start({
      rotateY: target,
      transition: { type: "spring", stiffness: 180, damping: 18 },
    });
  }

  return (
    <div
      className="relative w-full min-h-full overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #0D1015 0%, #1F2430 100%)`,
      }}
    >
      {/* Top bar */}
      <div className="pt-[52px] px-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10"
          style={{ background: "rgba(255,255,255,0.10)" }}
          aria-label="Back"
        >
          <ChevronLeft size={16} className="text-white" strokeWidth={2.4} />
        </button>
        <div className="text-[15px] font-semibold text-white">3D Avatar</div>
        <div className="w-9 h-9" aria-hidden />
      </div>

      <PreviewBadge>
        <div className="pt-10 pb-6 flex flex-col items-center">
          {/* Face — drag to rotate */}
          <motion.div
            drag="x"
            dragElastic={0.2}
            dragMomentum={false}
            onDrag={(_e, info) => {
              const next = Math.max(-60, Math.min(60, info.offset.x * 0.5));
              setRotation(next);
            }}
            animate={controls}
            style={{
              perspective: 1000,
              rotateY: rotation,
              transformStyle: "preserve-3d",
            }}
            className="cursor-grab active:cursor-grabbing"
          >
            <FaceSilhouette size={260} showMesh showHeatmap heatSide="right" inverted />
          </motion.div>

          {/* Region chips */}
          <div className="flex gap-2 mt-6">
            <RegionChip label="LEFT" value={left} />
            <RegionChip label="CENTER" value={center} />
            <RegionChip label="RIGHT" value={right} />
          </div>

          {/* Segmented control */}
          <div
            className="mt-6 flex p-[3px] rounded-[14px] border border-white/10"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            {(["rest", "smile", "brow"] as const).map((e) => {
              const active = expression === e;
              return (
                <button
                  key={e}
                  type="button"
                  onClick={() => handleSelect(e)}
                  className={cn(
                    "px-4 py-1.5 rounded-[12px] text-[13px] font-semibold transition-colors",
                    active ? "text-white" : "text-white/60"
                  )}
                  style={{
                    background: active ? FC.brand : "transparent",
                  }}
                >
                  {e === "rest" ? "Rest" : e === "smile" ? "Smile" : "Brow Raise"}
                </button>
              );
            })}
          </div>

          {/* Caption */}
          <div
            className="mt-6 text-[13px] font-medium"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Max asymmetry at {regionLabels[lowestRegion]}
          </div>
        </div>
      </PreviewBadge>
    </div>
  );
}

function RegionChip({ label, value }: { label: string; value: number }) {
  const grade: HBGrade =
    value >= 80 ? "I" : value >= 60 ? "III" : value >= 40 ? "IV" : "V";
  const color = sevColor(grade);
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10"
      style={{ background: "rgba(255,255,255,0.06)" }}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ background: color }}
      />
      <span className="text-[10px] tracking-[0.18em] font-bold text-white/60">{label}</span>
      <span
        className="text-[13px] font-bold tabular-nums"
        style={{ color, fontFamily: "var(--font-mono)" }}
      >
        {value}
      </span>
    </div>
  );
}
