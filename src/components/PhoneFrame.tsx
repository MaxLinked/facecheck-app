// PhoneFrame — wraps the app in an iPhone 17-like bezel on desktop.
// On phone-sized viewports, renders children full-bleed so mobile users see the app edge-to-edge.

"use client";

import { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
}

// iPhone 17 logical resolution: 393 x 852
const PHONE_W = 393;
const PHONE_H = 852;

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <>
      {/* Mobile: full-bleed */}
      <div className="md:hidden min-h-screen bg-[var(--color-fc-bg)]">
        {children}
      </div>

      {/* Desktop: iPhone 17 shell */}
      <div className="hidden md:flex items-center justify-center min-h-screen py-8 px-4">
        <div className="relative" style={{ width: PHONE_W + 24, height: PHONE_H + 24 }}>
          {/* Outer titanium frame with subtle gradient */}
          <div
            className="absolute inset-0 rounded-[62px] shadow-2xl"
            style={{
              background: "linear-gradient(180deg, #d7d7db 0%, #8b8b91 50%, #5f5f65 100%)",
              padding: 4,
            }}
          >
            {/* Inner black bezel */}
            <div
              className="relative w-full h-full rounded-[58px] overflow-hidden"
              style={{ background: "#0a0a0c" }}
            >
              {/* Screen */}
              <div
                className="absolute top-[12px] left-[12px] rounded-[48px] overflow-hidden bg-[var(--color-fc-bg)]"
                style={{ width: PHONE_W, height: PHONE_H }}
              >
                {children}

                {/* Dynamic Island (always-on top overlay) */}
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

          {/* Side buttons (decorative) */}
          {/* Volume up */}
          <div className="absolute -left-[2px] top-[140px] w-[4px] h-[52px] rounded-l-sm bg-[#6b6b70]" />
          {/* Volume down */}
          <div className="absolute -left-[2px] top-[210px] w-[4px] h-[52px] rounded-l-sm bg-[#6b6b70]" />
          {/* Action button */}
          <div className="absolute -left-[2px] top-[88px] w-[4px] h-[32px] rounded-l-sm bg-[#6b6b70]" />
          {/* Power button */}
          <div className="absolute -right-[2px] top-[180px] w-[4px] h-[92px] rounded-r-sm bg-[#6b6b70]" />

          {/* Label under the phone */}
          <div
            className="absolute -bottom-7 left-0 right-0 text-center text-xs text-neutral-500"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            iPhone 17 · 393 × 852
          </div>
        </div>
      </div>
    </>
  );
}
