"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/atoms";
import { FC } from "@/lib/design";
import { useSessionStore } from "@/lib/store";
import type { Preset } from "@/lib/types";
import { cn } from "@/lib/utils";

const PRESETS: { id: Preset; label: string }[] = [
  { id: "mild", label: "Mild" },
  { id: "moderate", label: "Moderate" },
  { id: "severe", label: "Severe" },
];

// Best-effort: guess which preset the current latest session matches based on patient name.
function inferPreset(name: string | undefined): Preset | null {
  if (!name) return null;
  if (name.startsWith("Chen")) return "mild";
  if (name.startsWith("Wang")) return "moderate";
  if (name.startsWith("Liu")) return "severe";
  return null;
}

export default function SettingsPage() {
  const router = useRouter();
  const latest = useSessionStore((s) => s.latest());
  const replaceLatest = useSessionStore((s) => s.replaceLatest);
  const clear = useSessionStore((s) => s.clear);
  const hydrated = useSessionStore((s) => s.hydrated);
  const seedIfEmpty = useSessionStore((s) => s.seedIfEmpty);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (hydrated) seedIfEmpty();
    setReady(true);
  }, [hydrated, seedIfEmpty]);

  const activePreset = inferPreset(latest?.patientName);

  function handlePick(p: Preset) {
    replaceLatest(p);
  }

  function handleClear() {
    clear();
    router.push("/");
  }

  return (
    <div className="w-full min-h-screen-dvh pb-tab" style={{ background: FC.bg }}>
      {/* Header */}
      <div className="pt-topbar px-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-black/5"
          aria-label="Back"
        >
          <ChevronLeft size={14} style={{ color: FC.label2 }} strokeWidth={2.4} />
        </button>
        <div className="text-[15px] font-semibold" style={{ color: FC.label }}>
          Settings
        </div>
        <div className="w-9 h-9" aria-hidden />
      </div>

      <div className="px-4 pt-4 flex flex-col gap-3">
        {/* Demo Case picker */}
        <Card padding={16}>
          <div
            className="text-[12px] font-bold tracking-[0.18em] uppercase"
            style={{ color: FC.label3 }}
          >
            Demo Case
          </div>
          <div className="mt-2 text-[13px]" style={{ color: FC.label2 }}>
            Regenerate the latest assessment with a preset severity.
          </div>
          <div
            className="mt-3 flex p-[3px] rounded-[12px]"
            style={{ background: FC.surface3 }}
          >
            {PRESETS.map((p) => {
              const active = ready && activePreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePick(p.id)}
                  className={cn(
                    "flex-1 py-2 rounded-[10px] text-[14px] font-semibold transition-colors"
                  )}
                  style={{
                    background: active ? FC.surface : "transparent",
                    color: active ? FC.label : FC.label2,
                    boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Data section */}
        <Card padding={0}>
          <div
            className="px-4 pt-3.5 pb-2 text-[12px] font-bold tracking-[0.18em] uppercase"
            style={{ color: FC.label3 }}
          >
            Data
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="w-full text-left px-4 py-3.5 text-[15px] font-semibold"
            style={{ color: FC.sev6 }}
          >
            Clear History
          </button>
        </Card>

        {/* About */}
        <Card padding={16}>
          <div
            className="text-[12px] font-bold tracking-[0.18em] uppercase"
            style={{ color: FC.label3 }}
          >
            About
          </div>
          <div className="mt-2 text-[14px]" style={{ color: FC.label2 }}>
            FaceCheck Web · v0.1.0 · Phase 1 prototype
          </div>
        </Card>
      </div>
    </div>
  );
}
