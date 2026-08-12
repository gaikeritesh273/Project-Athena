"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { formatCaseDate } from "@/lib/utils";

const RECENT = [
  { id: "C-0104", tool: "Claim Checker", subject: "Vaccine mandate claim", verdict: "Disputed", date: new Date("2026-08-09") },
  { id: "C-0103", tool: "Source Scorer", subject: "regional-news-daily.com", verdict: "Verified", date: new Date("2026-08-07") },
  { id: "C-0102", tool: "Bias Detector", subject: "Op-ed on trade policy", verdict: "Mixed", date: new Date("2026-08-05") },
];

const VERDICT_COLOR: Record<string, string> = {
  Verified: "text-verified border-verified/50",
  Disputed: "text-flagged border-flagged/50",
  Mixed: "text-slate border-slate/50",
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="stamp-label text-slate">loading case file…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="stamp-label mb-3 text-verified">case file</p>
      <h1 className="mb-2 font-display text-3xl text-paper">
        Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}.
      </h1>
      <p className="mb-12 text-slate">Your recent activity across all four instruments.</p>

      <div className="panel divide-y divide-slate/15">
        {RECENT.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-4 px-6 py-4">
            <div>
              <p className="font-mono text-xs text-slate">{r.id} · {r.tool}</p>
              <p className="mt-1 text-paper">{r.subject}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`stamp-label rounded-sm border px-3 py-1 ${VERDICT_COLOR[r.verdict]}`}>
                {r.verdict}
              </span>
              <span className="font-mono text-xs text-slate">{formatCaseDate(r.date)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/claim-checker", label: "New claim" },
          { href: "/bias-detector", label: "Check bias" },
          { href: "/source-scorer", label: "Score a source" },
          { href: "/trainer", label: "Run a drill" },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="rounded-sm border border-slate/30 px-5 py-4 text-center text-paper transition-colors hover:border-verified hover:text-verified"
          >
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
