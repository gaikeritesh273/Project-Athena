'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle, FileText, Zap, Sparkles, ArrowDown } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface NarrativeProps {
  data: any;
  isDemo?: boolean;
}

// Event type visual config — tells the story visually
const EVENT_TYPES: Record<string, {
  icon: React.ReactNode;
  label: string;
  borderColor: string;
  bgColor: string;
  dotColor: string;
  labelColor: string;
}> = {
  ORIGINAL_PAPER_CONCEPT: {
    icon: <FileText className="w-4 h-4 text-sky-400" />,
    label: 'Original',
    borderColor: 'border-sky-500/30',
    bgColor: 'bg-sky-950/15',
    dotColor: 'border-sky-400 bg-sky-950',
    labelColor: 'text-sky-400 bg-sky-500/10 border-sky-500/25',
  },
  HEADLINE_MANIPULATION: {
    icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    label: 'Reframed',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-950/15',
    dotColor: 'border-amber-400 bg-amber-950',
    labelColor: 'text-amber-300 bg-amber-500/10 border-amber-500/25',
  },
  VIRAL_AMPLIFICATION: {
    icon: <Zap className="w-4 h-4 text-rose-400" />,
    label: 'Amplified',
    borderColor: 'border-rose-500/30',
    bgColor: 'bg-rose-950/15',
    dotColor: 'border-rose-400 bg-rose-950',
    labelColor: 'text-rose-300 bg-rose-500/10 border-rose-500/25',
  },
  FACT_CHECK_CORRECTION: {
    icon: <CheckCircle className="w-4 h-4 text-teal-400" />,
    label: 'Fact-Checked',
    borderColor: 'border-teal-500/30',
    bgColor: 'bg-teal-950/15',
    dotColor: 'border-teal-400 bg-teal-950',
    labelColor: 'text-teal-300 bg-teal-500/10 border-teal-500/25',
  },
};

function getEventConfig(type: string) {
  return EVENT_TYPES[type] ?? {
    icon: <Clock className="w-4 h-4 text-slate-400" />,
    label: 'Event',
    borderColor: 'border-slate-700',
    bgColor: 'bg-slate-900/40',
    dotColor: 'border-slate-500 bg-slate-900',
    labelColor: 'text-slate-400 bg-slate-800 border-slate-700',
  };
}

export default function NarrativeMemoryTimeline({ data, isDemo = false }: NarrativeProps) {
  const { t } = useI18n();

  if (!data) return null;

  const { title, timeline } = data;

  return (
    <div className="space-y-6">

      {/* ── Header Banner ─────────────────────────────── */}
      <div className="glass-card p-6 rounded-2xl border border-teal-500/20 bg-gradient-to-br from-slate-900 to-teal-950/20 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 text-editorial">{t('nmTitle')}</h3>
              <p className="text-xs text-slate-400 mt-0.5">How did the original information change as it spread?</p>
            </div>
          </div>
          {isDemo && (
            <span className="demo-badge">
              <Sparkles className="w-3 h-3" />
              Demonstration Timeline
            </span>
          )}
        </div>

        {title && (
          <div className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800">
            <p className="text-xs text-slate-300 italic">{title}</p>
          </div>
        )}

        {isDemo && (
          <p className="text-[10px] text-slate-500 italic">
            This timeline illustrates how information typically mutates — it uses curated demonstration data, not a live internet scan.
          </p>
        )}
      </div>

      {/* ── Empty State ────────────────────────────────── */}
      {(!timeline || timeline.length === 0) ? (
        <div className="glass-card p-8 rounded-2xl border border-slate-800 text-center space-y-2">
          <Clock className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">No timeline data available for this input.</p>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            Claims with tracked viral evolution history display their step-by-step narrative progression here.
          </p>
        </div>
      ) : (
        <div className="space-y-0">
          {timeline.map((event: any, idx: number) => {
            const config = getEventConfig(event.event_type);
            const isLast = idx === timeline.length - 1;

            return (
              <React.Fragment key={idx}>
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.35 }}
                  whileHover={{ scale: 1.015 }}
                >
                  <div className={`p-5 rounded-xl border space-y-3 ${config.borderColor} ${config.bgColor}`}>
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.labelColor} flex items-center gap-1.5`}>
                          {config.icon}
                          {config.label}
                        </span>
                        <span className="text-xs font-mono-code text-slate-500">Step {event.step}</span>
                        <span className="text-[10px] font-mono-code text-slate-600">{event.date}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">{event.source}</span>
                    </div>

                    {/* Headline */}
                    <h4 className="text-sm font-bold text-slate-100 leading-snug">
                      &ldquo;{event.headline}&rdquo;
                    </h4>

                    {/* What changed — the key educational insight */}
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold shrink-0 mt-0.5">
                        Change:
                      </span>
                      <p className="text-xs text-amber-200/90 leading-relaxed">{event.what_changed}</p>
                    </div>

                    {/* Details */}
                    {event.details && (
                      <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2">
                        {event.details}
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* Connector arrow between steps */}
                {!isLast && (
                  <div className="flex justify-center py-2">
                    <ArrowDown className="w-4 h-4 text-slate-700" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* ── Key Takeaway ───────────────────────────────── */}
      {timeline && timeline.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2"
        >
          <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Key Insight from This Timeline</h5>
          <p className="text-xs text-slate-400 leading-relaxed">
            Notice how the same underlying idea became more absolute and authoritative with each retelling. 
            Original speculative content gained fake scientific approval and unlimited capability claims as it spread. 
            This pattern — escalation of certainty without escalation of evidence — is one of the most common mechanisms of misinformation.
          </p>
        </motion.div>
      )}
    </div>
  );
}
