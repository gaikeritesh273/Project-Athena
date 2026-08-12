"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { formatCaseDate } from "@/lib/utils";
import AthenaLogo from "@/components/AthenaLogo";

const RECENT = [
  { id: "C-0104", tool: "Claim Checker", subject: "Vaccine mandate claim", verdict: "Disputed", date: new Date("2026-08-09") },
  { id: "C-0103", tool: "Source Scorer", subject: "regional-news-daily.com", verdict: "Verified", date: new Date("2026-08-07") },
  { id: "C-0102", tool: "Bias Detector", subject: "Op-ed on trade policy", verdict: "Mixed", date: new Date("2026-08-05") },
];

const VERDICT_BADGE: Record<string, string> = {
  Verified: "badge-green",
  Disputed: "badge-red",
  Mixed: "badge-gold",
};

export default function DashboardPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[var(--color-bg-primary)] text-[var(--color-text-main)]">
        <div className="flex items-center gap-3 font-mono-code text-sm text-slate-400">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sky-400" />
          <span>loading case file…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-main)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <AthenaLogo size="lg" />
        </div>
        <div className="flex items-center justify-between gap-4 mb-2">
          <span className="badge-cyan px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            case file
          </span>
          <span className="text-xs text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full font-medium">
            Illustrative sample data — persistent activity logging is a planned feature
          </span>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-slate-100 text-editorial">
          Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}.
        </h1>
        <p className="mb-10 text-slate-400">Your recent activity across all four instruments.</p>

        <div className="glass-card rounded-2xl border border-slate-800 divide-y divide-slate-800 overflow-hidden">
          {RECENT.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
              <div>
                <p className="font-mono-code text-xs text-slate-400">{r.id} · {r.tool}</p>
                <p className="mt-1 font-medium text-slate-100">{r.subject}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${VERDICT_BADGE[r.verdict] || 'badge-cyan'}`}>
                  {r.verdict}
                </span>
                <span className="font-mono-code text-xs text-slate-400">{formatCaseDate(r.date)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/claim-checker", label: "New claim" },
            { href: "/bias-detector", label: "Check bias" },
            { href: "/source-scorer", label: "Score a source" },
            { href: "/trainer", label: "Run a drill" },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="glass-card glass-card-hover rounded-xl border border-slate-800 px-5 py-4 text-center font-medium text-slate-200 hover:text-sky-400 transition-colors"
            >
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
