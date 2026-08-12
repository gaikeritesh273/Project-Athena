'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, GitCompare, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface PerspectiveProps {
  data: any;
}

export default function PerspectiveExplorer({ data }: PerspectiveProps) {
  const { t } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  if (!data) return null;

  const { perspectives, common_ground, key_differences, remaining_uncertainties } = data;

  return (
    <div className="space-y-8">
      {/* Introduction Banner */}
      <div className="glass-card p-6 rounded-2xl border border-sky-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100 text-editorial">{t('peTitle')}</h3>
            <p className="text-xs text-slate-400">{t('peSubtitle')}</p>
          </div>
        </div>
      </div>

      {/* Perspectives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {perspectives?.map((item: any, idx: number) => {
          const isSelected = selectedCategory === idx;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -2 }}
              onClick={() => setSelectedCategory(isSelected ? null : idx)}
              className={`p-5 rounded-xl cursor-pointer transition-all border ${
                isSelected
                  ? 'bg-slate-900 border-sky-500/60 shadow-lg shadow-sky-500/10'
                  : 'glass-card border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="badge-cyan px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  {item.category}
                </span>
                <span className={`text-xs font-mono-code px-2 py-0.5 rounded ${
                  item.stance === 'Skeptical' || item.stance === 'Debunked'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                }`}>
                  {item.stance}
                </span>
              </div>
              <h4 className="font-semibold text-slate-200 text-sm mb-1">{item.source_name}</h4>
              <p className="text-xs text-slate-400 mb-3">{item.summary}</p>
              
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs italic text-slate-300">
                "{item.quote}"
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Synthesis Section: What sources agree on, differ on, remains uncertain */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h4 className="text-base font-bold text-slate-200 flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-teal-400" />
          Multi-Perspective Synthesis
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Common Ground */}
          <div className="glass-card p-5 rounded-xl border border-teal-500/20 bg-teal-950/10 space-y-2">
            <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              {t('peCommonGround')}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {common_ground}
            </p>
          </div>

          {/* Key Differences */}
          <div className="glass-card p-5 rounded-xl border border-amber-500/20 bg-amber-950/10 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              {t('peKeyDifferences')}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {key_differences}
            </p>
          </div>

          {/* Remaining Uncertainties */}
          <div className="glass-card p-5 rounded-xl border border-purple-500/20 bg-purple-950/10 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              {t('peUncertainties')}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {remaining_uncertainties}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
