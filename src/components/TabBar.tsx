// iOS-style bottom tab bar. Two tabs: Home / History.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home as HomeIcon, History as HistoryIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TabBar() {
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: "Home", icon: HomeIcon, match: (p: string) => p === "/" || p.startsWith("/capture") || p.startsWith("/analyzing") || p.startsWith("/report") || p.startsWith("/avatar") || p.startsWith("/settings") },
    { href: "/history", label: "History", icon: HistoryIcon, match: (p: string) => p.startsWith("/history") },
  ];

  return (
    <nav
      className="absolute bottom-0 left-0 right-0 pt-2 px-16 flex items-center justify-center pointer-events-none"
      style={{
        // Respect iOS home-indicator safe area on mobile; falls back to 20px on desktop (no env inset)
        paddingBottom: "max(20px, env(safe-area-inset-bottom))",
      }}
    >
      <div className="flex items-center gap-10 px-8 py-2 bg-white/70 backdrop-blur-xl rounded-full shadow-lg border border-black/5 pointer-events-auto">
        {tabs.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 transition-colors",
                active ? "text-[var(--color-fc-brand)]" : "text-neutral-400"
              )}
            >
              <Icon size={22} strokeWidth={active ? 2.4 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
