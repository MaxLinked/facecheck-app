// PhoneFrame — wraps the app in an iPhone 17-like bezel on desktop.
// On phone-sized viewports, renders children full-bleed so mobile users see the app edge-to-edge.

"use client";

import { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
}

// iPhone 17 logical resolution: 393 × 852
const SCREEN_W = 393;
const SCREEN_H = 852;
// 4px titanium band + 6px black bezel on each side
const TITANIUM = 4;
const BEZEL = 6;
// Outer total = screen + 2*(titanium + bezel) = 393 + 20 = 413 × 872
const OUTER_W = SCREEN_W + 2 * (TITANIUM + BEZEL);
const OUTER_H = SCREEN_H + 2 * (TITANIUM + BEZEL);

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <>
      {/* Mobile: full-bleed — fills the real viewport height, respects safe areas */}
      <div
        className="md:hidden bg-[var(--color-fc-bg)]"
        style={{
          height: "100dvh",
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {children}
      </div>

      {/* Desktop: iPhone 17 shell */}
      <div className="hidden md:flex items-center justify-center min-h-screen py-10 px-4">
        <div className="relative" style={{ width: OUTER_W, height: OUTER_H }}>
          {/* Outer titanium frame (gradient) */}
          <div
            className="absolute inset-0 rounded-[60px] shadow-2xl"
            style={{
              background: "linear-gradient(180deg, #d7d7db 0%, #8b8b91 50%, #5f5f65 100%)",
            }}
          >
            {/* Inner black bezel (symmetric 4px inset on all sides) */}
            <div
              className="absolute rounded-[56px] overflow-hidden"
              style={{
                top: TITANIUM,
                left: TITANIUM,
                right: TITANIUM,
                bottom: TITANIUM,
                background: "#0a0a0c",
              }}
            >
              {/* Screen — 6px inset from black bezel on all sides, centered */}
              <div
                className="absolute rounded-[48px] overflow-hidden bg-[var(--color-fc-bg)]"
                style={{
                  top: BEZEL,
                  left: BEZEL,
                  right: BEZEL,
                  bottom: BEZEL,
                }}
              >
                {children}

                {/* Dynamic Island — always on top */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-[10px] rounded-full z-50 pointer-events-none"
                  style={{
                    width: 120,
                    height: 36,
                    background: "#000",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Side buttons (decorative) — flush against the titanium edge */}
          <div className="absolute top-[86px] left-0 w-[3px] h-[32px] rounded-l-[2px] bg-[#6b6b70]" />
          <div className="absolute top-[140px] left-0 w-[3px] h-[52px] rounded-l-[2px] bg-[#6b6b70]" />
          <div className="absolute top-[208px] left-0 w-[3px] h-[52px] rounded-l-[2px] bg-[#6b6b70]" />
          <div className="absolute top-[180px] right-0 w-[3px] h-[92px] rounded-r-[2px] bg-[#6b6b70]" />

          {/* Label under the phone */}
          <div
            className="absolute -bottom-8 left-0 right-0 text-center text-xs text-neutral-500"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            iPhone 17 · 393 × 852 · click-drag to scroll
          </div>
        </div>
      </div>
    </>
  );
}
