"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Sparkles, Image as ImageIcon, Camera } from "lucide-react";
import { FC } from "@/lib/design";

export default function CapturePage() {
  const router = useRouter();
  const libraryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const blobUrl = URL.createObjectURL(file);
      sessionStorage.setItem("fc.pendingImage", blobUrl);
    } catch {
      // sessionStorage may be unavailable — ignore and proceed.
    }
    router.push("/analyzing");
  }

  return (
    <div
      className="relative w-full min-h-screen-dvh overflow-hidden text-white pb-tab"
      style={{
        background: `radial-gradient(circle at 50% 38%, #1F2430 0%, #0A0B0F 72%)`,
      }}
    >
      {/* Top bar */}
      <div
        className="absolute left-0 right-0 px-4 flex items-center justify-between z-20"
        style={{ top: "max(52px, calc(env(safe-area-inset-top) + 8px))" }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10"
          style={{ background: "rgba(255,255,255,0.14)", backdropFilter: "blur(18px)" }}
          aria-label="Close"
        >
          <X size={14} className="text-white" strokeWidth={2.4} />
        </button>

        <div
          className="px-3 py-1.5 rounded-[14px] text-[12px] font-semibold tabular-nums border border-white/10"
          style={{ background: "rgba(255,255,255,0.14)", backdropFilter: "blur(18px)" }}
        >
          1 / 1
        </div>

        <div
          className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10"
          style={{ background: "rgba(255,255,255,0.14)", backdropFilter: "blur(18px)" }}
        >
          <Sparkles size={16} style={{ color: "#7FB8F2" }} />
        </div>
      </div>

      {/* Title block */}
      <div className="absolute top-[120px] left-0 right-0 px-6 text-center z-10">
        <div
          className="inline-flex text-[11px] font-bold tracking-[0.18em] uppercase rounded-[10px] px-2.5 py-1"
          style={{ color: "#9CCCFF", background: "rgba(10,122,224,0.22)" }}
        >
          Capture
        </div>
        <h1
          className="mt-2.5 text-[30px] font-bold leading-[1.1] tracking-tight"
          style={{ color: "#fff" }}
        >
          Capture an Image
        </h1>
        <p className="mt-1.5 text-[15px] leading-snug" style={{ color: "rgba(255,255,255,0.75)" }}>
          Pick a clear, front-facing photo for analysis.
        </p>
      </div>

      {/* Dashed ellipse reticle */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <svg width={260} height={340} viewBox="0 0 260 340">
          <ellipse
            cx={130}
            cy={170}
            rx={120}
            ry={158}
            fill="none"
            stroke={FC.brand}
            strokeOpacity={0.9}
            strokeWidth={2}
            strokeDasharray="3 5"
          />
        </svg>
      </div>

      {/* Hidden inputs */}
      <input
        ref={libraryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleFile}
        className="hidden"
      />

      {/* CTA stack */}
      <div className="absolute bottom-[120px] left-0 right-0 px-6 z-20">
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => libraryInputRef.current?.click()}
            className="w-full h-[52px] rounded-[26px] flex items-center justify-center gap-2 font-semibold text-[17px] tracking-tight text-white"
            style={{
              background: FC.brand,
              boxShadow: `0 8px 24px ${FC.brand}33`,
            }}
          >
            <ImageIcon size={18} strokeWidth={2} />
            Choose from Library
          </button>
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="w-full h-[52px] rounded-[26px] flex items-center justify-center gap-2 font-semibold text-[17px] tracking-tight text-white border"
            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.24)" }}
          >
            <Camera size={18} strokeWidth={2} />
            Take Photo
          </button>
        </div>
      </div>
    </div>
  );
}
