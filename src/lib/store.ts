// SessionStore — Zustand mirror of iOS's SessionStore (RootView.swift).
// Persists to localStorage for parity with UserDefaults.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AssessmentReport, Preset } from "./types";
import { preset as mockPreset } from "./mock";

interface SessionState {
  sessions: AssessmentReport[];
  hydrated: boolean;
  setHydrated: () => void;
  latest: () => AssessmentReport | undefined;
  append: (r: AssessmentReport) => void;
  replaceLatest: (p: Preset) => void;
  clear: () => void;
  seedIfEmpty: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessions: [],
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      latest: () => get().sessions[0],
      append: (r) => set({ sessions: [r, ...get().sessions] }),
      replaceLatest: (p) => {
        const fresh = mockPreset(p, Math.floor(Math.random() * 1e9));
        const current = get().sessions;
        if (current.length === 0) set({ sessions: [fresh] });
        else set({ sessions: [fresh, ...current.slice(1)] });
      },
      clear: () => set({ sessions: [] }),
      seedIfEmpty: () => {
        if (get().sessions.length === 0) {
          set({ sessions: [mockPreset("moderate")] });
        }
      },
    }),
    {
      name: "fc.sessions",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
        state?.seedIfEmpty();
      },
    }
  )
);
