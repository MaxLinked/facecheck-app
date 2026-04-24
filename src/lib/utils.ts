// Shared utilities.
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** clsx + tailwind-merge — standard Tailwind class combiner. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a Date or ISO string as "Today · 9:24 AM" style. */
export function formatSessionDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  if (sameDay) return `Today · ${time}`;
  const short = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return `${short} · ${time}`;
}

/** Format just the time portion (e.g., "9:24 AM"). */
export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
