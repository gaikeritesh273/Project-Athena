'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Share2, AlertTriangle, CheckCircle, FileText, Zap } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface NarrativeProps {
  data: any;
}

export default function NarrativeMemoryTimeline({ data }: NarrativeProps) {
  const { t } = useI18n();
  const [activeStep, setActiveStep] = useState<number | null>(null);

  if (!data) return null;

  const { title, timeline } = data;

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'ORIGINAL_PAPER_CONCEPT':
        return <FileText className="w-4 h-4 text-sky-400" />;
      case 'HEADLINE_MANIPULATION':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'VIRAL_AMPLIFICATION':
        return <Zap className="w-4 h-4 text-rose-400" />;
      case 'FACT_CHECK_CORRECTION':
        return <CheckCircle className="w-4 h-4 text-teal-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl border border-teal-500/20 bg-gradient-to-br from-slate-900 to-teal-950/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100 text-editorial">{t('nmTitle')}</h3>
            <p className="text-xs text-slate-400">{t('nmSubtitle')}</p>
          </div>
        </div>
      </div>

      {/* Empty timeline state fallback */}
      {(!timeline || timeline.length === 0) ? (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 text-center space-y-2">
          <p className="text-sm font-semibold text-slate-300">No historical claim timeline mutation recorded for this input.</p>
          <p className="text-xs text-slate-400">Claims with tracked viral evolution history will display their step-by-step timeline here.</p>
        </div>
      ) : (
        /* Visual Timeline Stepper */
        <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-sky-500 before:via-amber-500 before:to-teal-500">
          {timeline.map((event: any, idx: number) => {
          const isActive = activeStep === idx;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setActiveStep(isActive ? null : idx)}
              className="relative cursor-pointer group"
            >
              {/* Timeline Bullet Node */}
              <div className="absolute -left-[31px] top-1.5 p-1.5 rounded-full bg-slate-900 border-2 border-sky-400 group-hover:scale-125 transition-transform">
                {getEventIcon(event.event_type)}
              </div>

              {/* Event Card */}
              <div className={`p-5 rounded-xl border transition-all ${
                isActive
                  ? 'bg-slate-900 border-teal-500/60 shadow-lg shadow-teal-500/10'
                  : 'glass-card border-slate-800 hover:border-slate-700'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-code text-sky-400 font-semibold">{event.date}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      Step {event.step}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{event.source}</span>
                </div>

                <h4 className="text-sm font-bold text-slate-100 mb-1 leading-snug">
                  {event.headline}
                </h4>

                <p className="text-xs text-amber-300/90 font-medium mb-2">
                  <strong>Mutation:</strong> {event.what_changed}
                </p>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {event.details}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
      )}
    </div>
  );
}
