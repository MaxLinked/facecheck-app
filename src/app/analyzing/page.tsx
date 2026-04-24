"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { FaceSilhouette } from "@/components/atoms";
import { FC } from "@/lib/design";
import { randomReport } from "@/lib/mock";
import { useSessionStore } from "@/lib/store";

const STEPS = [
  "Extracting 1,220 landmarks",
  "Fusing RGB + depth channels",
  "Computing symmetry indices",
  "Classifying severity grade",
];
const STEP_MS = 3000; // 4 steps × 3s = 12s total

export default function AnalyzingPage() {
  const router = useRouter();
  const append = useSessionStore((s) => s.append);
  const [progress, setProgress] = useState<number[]>([0, 0, 0, 0]);
  const finishedRef = useRef(false);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;

    const tick = () => {
      const elapsed = performance.now() - start;
      const next: number[] = STEPS.map((_, i) => {
        const stepStart = i * STEP_MS;
        const stepEnd = stepStart + STEP_MS;
        if (elapsed >= stepEnd) return 100;
        if (elapsed <= stepStart) return 0;
        return Math.round(((elapsed - stepStart) / STEP_MS) * 100);
      });
      setProgress(next);

      if (elapsed >= STEP_MS * STEPS.length) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish() {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const report = randomReport();
    append(report);
    router.replace(`/report/${report.id}`);
  }

  return (
    <div
      className="w-full min-h-full flex flex-col items-center justify-center px-6 py-16 text-center"
      style={{
        background: `linear-gradient(180deg, ${FC.brandMist} 0%, #FFFFFF 100%)`,
      }}
    >
      {/* Spinner + silhouette */}
      <div className="relative mb-6" style={{ width: 140, height: 140 }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <FaceSilhouette size={140} showMesh />
        </div>
        <svg
          width={140}
          height={140}
          viewBox="0 0 140 140"
          className="absolute inset-0"
          style={{ animation: "fc-spin 1.4s linear infinite", transformOrigin: "70px 70px" }}
        >
          <circle cx={70} cy={70} r={64} fill="none" stroke={FC.brandSoft} strokeWidth={3} />
          <circle
            cx={70}
            cy={70}
            r={64}
            fill="none"
            stroke={FC.brand}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray="40 400"
          />
        </svg>
        <style>{`@keyframes fc-spin { to { transform: rotate(360deg); } }`}</style>
      </div>

      {/* Title */}
      <h1 className="text-[22px] font-bold tracking-tight" style={{ color: FC.label }}>
        Analyzing your assessment
      </h1>
      <p className="text-[14px] mt-1.5 mb-7" style={{ color: FC.label2 }}>
        This will take about 12 seconds
      </p>

      {/* Steps list */}
      <div className="w-full max-w-[320px] flex flex-col gap-3">
        {STEPS.map((label, i) => {
          const pct = progress[i];
          const done = pct >= 100;
          return (
            <div key={label} className="flex flex-col gap-1.5">
              <div
                className="flex items-center justify-between text-[13px] font-semibold"
                style={{ color: pct > 0 ? FC.label : FC.label3 }}
              >
                <span>{label}</span>
                {done && (
                  <span className="flex items-center gap-1" style={{ color: FC.sev1 }}>
                    <Check size={12} strokeWidth={3} />
                    done
                  </span>
                )}
              </div>
              <div
                className="h-1 rounded-full overflow-hidden"
                style={{ background: FC.separator }}
              >
                <div
                  className="h-full rounded-full transition-[width] duration-300 ease-out"
                  style={{
                    width: `${pct}%`,
                    background: done ? FC.sev1 : FC.brand,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Skip */}
      <button
        type="button"
        onClick={finish}
        className="mt-8 px-5 py-2.5 rounded-[20px] text-[14px] font-semibold"
        style={{
          color: FC.brand,
          background: FC.surface,
          border: `1px solid ${FC.separator}`,
        }}
      >
        Skip to results →
      </button>
    </div>
  );
}
