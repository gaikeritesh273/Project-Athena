'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Compass, CheckCircle2, AlertCircle, HelpCircle, Sparkles, Info } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface PerspectiveProps {
  data: any;
  isDemo?: boolean;
}

// Source credibility tier labels — honest about source types, not implying equal validity
const CREDIBILITY_TIERS: Record<string, { label: string; color: string; bg: string }> = {
  'Scientific & Academic': { label: 'High Credibility', color: 'text-teal-300', bg: 'border-teal-500/20 bg-teal-950/10' },
  'Fact-Checking Community': { label: 'High Credibility', color: 'text-teal-300', bg: 'border-teal-500/20 bg-teal-950/10' },
  'International Organizations': { label: 'High Credibility', color: 'text-teal-300', bg: 'border-teal-500/20 bg-teal-950/10' },
  'Social Media Community': { label: 'Low Credibility', color: 'text-amber-300', bg: 'border-amber-500/20 bg-amber-950/10' },
  'Tech Blog / Clickbait': { label: 'Low Credibility', color: 'text-rose-300', bg: 'border-rose-500/20 bg-rose-950/10' },
};

function getCategoryTier(category: string) {
  return CREDIBILITY_TIERS[category] ?? { label: 'Varies', color: 'text-slate-400', bg: 'border-slate-700 bg-slate-900/40' };
}

const stanceStyle = (stance: string) => {
  const s = stance?.toLowerCase() || '';
  if (s.includes('skeptical') || s.includes('debunked') || s.includes('contradicted')) {
    return 'bg-rose-500/10 text-rose-300 border border-rose-500/20';
  }
  if (s.includes('educational') || s.includes('corroborated') || s.includes('supporting')) {
    return 'bg-teal-500/10 text-teal-300 border border-teal-500/20';
  }
  if (s.includes('mixed') || s.includes('viral') || s.includes('unknown')) {
    return 'bg-amber-500/10 text-amber-300 border border-amber-500/20';
  }
  return 'bg-slate-800 text-slate-300 border border-slate-700';
};

export default function PerspectiveExplorer({ data, isDemo = false }: PerspectiveProps) {
  const { t } = useI18n();

  if (!data) return null;

  const { perspectives, common_ground, key_differences, remaining_uncertainties } = data;

  return (
    <div className="space-y-6">

      {/* ── Header ───────────────────────────────────── */}
      <div className="glass-card p-6 rounded-2xl border border-sky-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/30 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 text-editorial">{t('peTitle')}</h3>
              <p className="text-xs text-slate-400 mt-0.5">How does the same claim get framed differently across source types?</p>
            </div>
          </div>
          {isDemo && (
            <span className="demo-badge">
              <Sparkles className="w-3 h-3" />
              Demonstration Data
            </span>
          )}
        </div>

        {/* Important credibility note */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300">Not all perspectives are equally credible.</strong>{' '}
            Source type matters — academic, scientific, and fact-checking sources carry different weight than social media or clickbait content.
          </p>
        </div>
      </div>

      {/* ── Same Claim, Different Framing ─────────────── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold whitespace-nowrap">
            Same claim — different frames
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        </div>
      </div>

      {/* ── Perspectives Grid ─────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {perspectives?.map((item: any, idx: number) => {
          const tier = getCategoryTier(item.category);
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className={`p-5 rounded-xl border space-y-3 ${tier.bg}`}
            >
              {/* Category + Credibility Row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="badge-cyan px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  {item.category}
                </span>
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${tier.color}`}>
                  {tier.label}
                </span>
              </div>

              {/* Source name + stance */}
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-slate-100 text-sm leading-snug">{item.source_name}</h4>
                <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded shrink-0 ${stanceStyle(item.stance)}`}>
                  {item.stance}
                </span>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-300 leading-relaxed">{item.summary}</p>

              {/* Quote */}
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs italic text-slate-400 leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Multi-Perspective Synthesis ───────────────── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 px-1">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold whitespace-nowrap">
            Synthesis
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Common Ground */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-5 rounded-xl border border-teal-500/20 bg-teal-950/10 space-y-2"
          >
            <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              {t('peCommonGround')}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{common_ground}</p>
          </motion.div>

          {/* Key Differences */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.37 }}
            className="glass-card p-5 rounded-xl border border-amber-500/20 bg-amber-950/10 space-y-2"
          >
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              {t('peKeyDifferences')}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{key_differences}</p>
          </motion.div>

          {/* Remaining Uncertainties */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44 }}
            className="glass-card p-5 rounded-xl border border-purple-500/20 bg-purple-950/10 space-y-2"
          >
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              {t('peUncertainties')}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{remaining_uncertainties}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
