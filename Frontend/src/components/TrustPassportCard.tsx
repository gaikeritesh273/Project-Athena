'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, HelpCircle, FileText, ExternalLink, ChevronDown, ChevronUp, CheckCircle, Info, Sparkles } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface TrustPassportProps {
  data: any;
}

export default function TrustPassportCard({ data }: TrustPassportProps) {
  const { t } = useI18n();
  const [expandedSection, setExpandedSection] = useState<string | null>('assessment');

  if (!data) return null;

  const { claim, source, evidence, context, language_analysis, ai_generation_indicators, assessment, confidence_level, uncertainty_notes, suggested_actions } = data;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner: Epistemological Assessment */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-2xl border-l-4 border-l-amber-500 bg-gradient-to-r from-slate-900/90 to-slate-950/90"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="badge-gold px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                {t('tpAssessmentTitle')}
              </span>
              <span className="text-xs text-slate-400 font-mono-code">{confidence_level}</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-100 text-editorial leading-tight">
              "{assessment}"
            </h3>
            <p className="text-sm text-slate-400 font-medium">
              <span className="text-amber-400 font-semibold">Uncertainty Note:</span> {uncertainty_notes}
            </p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400 shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
        </div>
      </motion.div>

      {/* Claim Section */}
      <div className="glass-card rounded-xl overflow-hidden border border-slate-800">
        <button
          onClick={() => toggleSection('claim')}
          aria-expanded={expandedSection === 'claim'}
          aria-controls="tp-panel-claim"
          className="w-full p-4 flex items-center justify-between text-left bg-slate-900/60 hover:bg-slate-900 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-sky-400" />
            <span className="font-semibold text-slate-200">{t('tpClaimTitle')}</span>
          </div>
          {expandedSection === 'claim' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {expandedSection === 'claim' && (
          <div id="tp-panel-claim" className="p-5 bg-slate-950/50 space-y-3 text-sm text-slate-300 border-t border-slate-800">
            <p className="text-base font-medium text-slate-100 bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
              {claim}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span><strong>Domain:</strong> Science & Technology</span>
              <span><strong>Virality Assessment:</strong> High Risk</span>
            </div>
          </div>
        )}
      </div>

      {/* Source Analysis */}
      <div className="glass-card rounded-xl overflow-hidden border border-slate-800">
        <button
          onClick={() => toggleSection('source')}
          aria-expanded={expandedSection === 'source'}
          aria-controls="tp-panel-source"
          className="w-full p-4 flex items-center justify-between text-left bg-slate-900/60 hover:bg-slate-900 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-teal-400" />
            <span className="font-semibold text-slate-200">{t('tpSourceTitle')}</span>
          </div>
          {expandedSection === 'source' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {expandedSection === 'source' && source && (
          <div id="tp-panel-source" className="p-5 bg-slate-950/50 space-y-4 text-sm text-slate-300 border-t border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-400 mb-1">Origin</div>
                <div className="font-medium text-slate-200">{source.origin}</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-400 mb-1">Publisher Account</div>
                <div className="font-medium text-slate-200">{source.publisher}</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-400 mb-1">Transparency Score</div>
                <div className="font-medium text-amber-400">{source.transparency_score}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Evidence Matrix */}
      <div className="glass-card rounded-xl overflow-hidden border border-slate-800">
        <button
          onClick={() => toggleSection('evidence')}
          aria-expanded={expandedSection === 'evidence'}
          aria-controls="tp-panel-evidence"
          className="w-full p-4 flex items-center justify-between text-left bg-slate-900/60 hover:bg-slate-900 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-slate-200">{t('tpEvidenceTitle')}</span>
          </div>
          {expandedSection === 'evidence' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {expandedSection === 'evidence' && evidence && (
          <div id="tp-panel-evidence" className="p-5 bg-slate-950/50 space-y-4 text-sm border-t border-slate-800">
            <div className="flex gap-3 text-xs">
              <span className="badge-green px-2.5 py-1 rounded-full font-medium">✓ Supporting ({evidence.supporting_count})</span>
              <span className="badge-red px-2.5 py-1 rounded-full font-medium">⚠ Conflicting ({evidence.conflicting_count})</span>
              <span className="badge-gold px-2.5 py-1 rounded-full font-medium">? Unverified ({evidence.unverified_count})</span>
            </div>

            {/* Conflicting items */}
            {evidence.conflicting_items?.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Conflicting Credible Sources</h5>
                {evidence.conflicting_items.map((item: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-medium text-slate-200">{item.title}</span>
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline text-xs flex items-center gap-1 shrink-0">
                          Verify <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{item.verdict}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Context Analysis */}
      <div className="glass-card rounded-xl overflow-hidden border border-slate-800">
        <button
          onClick={() => toggleSection('context')}
          aria-expanded={expandedSection === 'context'}
          aria-controls="tp-panel-context"
          className="w-full p-4 flex items-center justify-between text-left bg-slate-900/60 hover:bg-slate-900 transition-colors"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-slate-200">Context & Historical Precedent</span>
          </div>
          {expandedSection === 'context' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {expandedSection === 'context' && context && (
          <div id="tp-panel-context" className="p-5 bg-slate-950/50 space-y-4 text-sm text-slate-300 border-t border-slate-800">
            {context.missing_context?.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Missing Critical Context</h5>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {context.missing_context.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {context.historical_precedent && (
              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-400 mb-1 font-semibold">Historical Precedent</div>
                <div className="text-xs text-slate-300">{context.historical_precedent}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Language & Emotional Framing */}
      <div className="glass-card rounded-xl overflow-hidden border border-slate-800">
        <button
          onClick={() => toggleSection('language')}
          aria-expanded={expandedSection === 'language'}
          aria-controls="tp-panel-language"
          className="w-full p-4 flex items-center justify-between text-left bg-slate-900/60 hover:bg-slate-900 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="font-semibold text-slate-200">{t('tpLanguageTitle')}</span>
          </div>
          {expandedSection === 'language' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {expandedSection === 'language' && language_analysis && (
          <div id="tp-panel-language" className="p-5 bg-slate-950/50 space-y-3 text-sm text-slate-300 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Sensationalism Index</span>
              <span className="text-rose-400 font-semibold">{language_analysis.sensationalism_score}/100 (High)</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: `${language_analysis.sensationalism_score}%` }}></div>
            </div>
            <div className="pt-2">
              <span className="text-xs text-slate-400 font-medium">Trigger Words Detected: </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {language_analysis.loaded_words?.map((word: string, i: number) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 text-xs border border-rose-500/20 font-mono-code">
                    "{word}"
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Actions */}
      <div className="glass-card p-5 rounded-xl border border-sky-500/20 bg-sky-950/20 space-y-3">
        <h4 className="text-sm font-bold text-sky-300 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-sky-400" />
          {t('tpSuggestedActions')}
        </h4>
        <ul className="space-y-2 text-xs text-slate-300">
          {suggested_actions?.map((action: string, i: number) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-sky-400 font-bold">•</span>
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
