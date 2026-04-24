// DragScroll — wraps a scrollable area so desktop users can click-and-drag to scroll,
// the way a finger moves content on a phone. Suppresses the browser's native "drag link"
// ghost, distinguishes real clicks from drags via a pixel threshold, and disables text
// selection only while actively dragging.

"use client";

import { ReactNode, useEffect, useRef } from "react";

interface DragScrollProps {
  children: ReactNode;
  className?: string;
}

const DRAG_THRESHOLD = 5; // pixels — below this, treat as a click

export default function DragScroll({ children, className }: DragScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let active = false;
    let startX = 0;
    let startY = 0;
    let startScrollTop = 0;
    let moved = false;

    const onPointerDown = (e: PointerEvent) => {
      // Mouse-only — touch should use native scroll
      if (e.pointerType !== "mouse") return;
      // Left button only
      if (e.button !== 0) return;
      active = true;
      moved = false;
      startX = e.clientX;
      startY = e.clientY;
      startScrollTop = el.scrollTop;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!active) return;
      const dy = e.clientY - startY;
      const dx = e.clientX - startX;
      if (!moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      if (!moved) {
        moved = true;
        el.setPointerCapture(e.pointerId);
        document.body.style.userSelect = "none";
        el.style.cursor = "grabbing";
      }
      el.scrollTop = startScrollTop - dy;
      e.preventDefault();
    };

    const endDrag = () => {
      if (!active) return;
      active = false;
      document.body.style.userSelect = "";
      el.style.cursor = "";
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!active) return;
      if (moved) {
        // Swallow the click that follows pointerup on this element so scroll-drag doesn't
        // also activate the Link / Button underneath.
        const swallowClick = (ev: MouseEvent) => {
          ev.preventDefault();
          ev.stopPropagation();
          window.removeEventListener("click", swallowClick, true);
        };
        window.addEventListener("click", swallowClick, true);
        // If no click fires, clean up the listener shortly after.
        setTimeout(() => window.removeEventListener("click", swallowClick, true), 0);
      }
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {}
      endDrag();
    };

    // Kill the native "drag link / drag image" ghost so anchors don't float away.
    const onDragStart = (e: DragEvent) => e.preventDefault();

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("dragstart", onDragStart);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("dragstart", onDragStart);
      document.body.style.userSelect = "";
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
