'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, AlertTriangle, HelpCircle, FileText, ChevronDown, ChevronUp,
  CheckCircle, Info, Sparkles, XCircle, MinusCircle, ArrowRight
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface TrustPassportProps {
  data: any;
  isDemo?: boolean;
}

// Renders a single evidence item with semantic color based on type
function EvidenceItem({
  item,
  type,
}: {
  item: any;
  type: 'supporting' | 'conflicting' | 'unverified';
}) {
  const styles = {
    supporting: {
      container: 'border-teal-500/20 bg-teal-950/10',
      icon: <CheckCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />,
      verdictColor: 'text-teal-300',
    },
    conflicting: {
      container: 'border-rose-500/20 bg-rose-950/10',
      icon: <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />,
      verdictColor: 'text-rose-300',
    },
    unverified: {
      container: 'border-amber-500/20 bg-amber-950/10',
      icon: <MinusCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />,
      verdictColor: 'text-amber-300',
    },
  };

  const style = styles[type];

  return (
    <div className={`p-3.5 rounded-lg border ${style.container} space-y-1.5`}>
      <div className="flex items-start gap-2">
        {style.icon}
        <div className="space-y-0.5 min-w-0">
          <p className="font-semibold text-slate-200 text-xs leading-snug">{item.title || item.publisher}</p>
          {item.publisher && item.title && (
            <p className="text-[10px] text-slate-400">{item.publisher}</p>
          )}
        </div>
      </div>
      <p className={`text-xs leading-relaxed ${style.verdictColor} pl-6`}>{item.verdict}</p>
      {/* Never render fake URLs — demo sources labeled accordingly */}
      {item.url && (
        <p className="text-[10px] text-slate-500 pl-6 italic">
          Curated demonstration source reference
        </p>
      )}
    </div>
  );
}

export default function TrustPassportCard({ data, isDemo = false }: TrustPassportProps) {
  const { t } = useI18n();
  // All sections open by default for screen recording visibility
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['claim', 'source', 'evidence', 'context', 'language'])
  );

  if (!data) return null;

  const {
    claim,
    source,
    evidence,
    context,
    language_analysis,
    assessment,
    confidence_level,
    uncertainty_notes,
    suggested_actions,
  } = data;

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(section) ? next.delete(section) : next.add(section);
      return next;
    });
  };

  const isExpanded = (section: string) => expandedSections.has(section);

  // Determine assessment visual treatment (never binary true/false)
  const assessmentCode = data.assessment_code || 'INSUFFICIENT_EVIDENCE';
  const assessmentVisualMap: Record<string, { border: string; bg: string; icon: React.ReactNode; badgeClass: string }> = {
    CORROBORATED: { border: 'border-l-teal-500', bg: 'from-teal-950/30', icon: <CheckCircle className="w-8 h-8 text-teal-400" />, badgeClass: 'text-teal-300 border-teal-500/30 bg-teal-500/10' },
    CONTRADICTED: { border: 'border-l-rose-500', bg: 'from-rose-950/20', icon: <XCircle className="w-8 h-8 text-rose-400" />, badgeClass: 'text-rose-300 border-rose-500/30 bg-rose-500/10' },
    MIXED_EVIDENCE: { border: 'border-l-amber-500', bg: 'from-amber-950/20', icon: <AlertTriangle className="w-8 h-8 text-amber-400" />, badgeClass: 'text-amber-300 border-amber-500/30 bg-amber-500/10' },
    INSUFFICIENT_EVIDENCE: { border: 'border-l-amber-500', bg: 'from-amber-950/20', icon: <AlertTriangle className="w-8 h-8 text-amber-400" />, badgeClass: 'text-amber-300 border-amber-500/30 bg-amber-500/10' },
  };
  const assessmentVisual = assessmentVisualMap[assessmentCode] ?? {
    border: 'border-l-amber-500', bg: 'from-amber-950/20',
    icon: <AlertTriangle className="w-8 h-8 text-amber-400" />,
    badgeClass: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
  };

  // Collapsible section header
  const SectionHeader = ({
    id,
    icon,
    label,
    iconColor,
  }: {
    id: string;
    icon: React.ReactNode;
    label: string;
    iconColor: string;
  }) => (
    <button
      onClick={() => toggleSection(id)}
      aria-expanded={isExpanded(id)}
      aria-controls={`tp-panel-${id}`}
      className="w-full p-4 flex items-center justify-between text-left bg-slate-900/60 hover:bg-slate-900 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-semibold text-slate-200 text-sm">{label}</span>
      </div>
      {isExpanded(id)
        ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
        : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
    </button>
  );

  return (
    <div className="space-y-5">

      {/* ── Hero: Assessment Banner ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass-card p-6 rounded-2xl border-l-4 ${assessmentVisual.border} bg-gradient-to-r ${assessmentVisual.bg} to-slate-950/90`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border ${assessmentVisual.badgeClass}`}>
                {t('tpAssessmentTitle')}
              </span>
              {isDemo && (
                <span className="demo-badge">
                  <Sparkles className="w-3 h-3" />
                  Demonstration Data
                </span>
              )}
            </div>

            {/* The assessment — calibrated, not binary */}
            <blockquote className="text-xl font-bold text-slate-100 text-editorial leading-snug border-l-2 border-slate-600 pl-3">
              {assessment}
            </blockquote>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Confidence</p>
                <p className="text-xs text-slate-300">{confidence_level}</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/20 space-y-1">
                <p className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">⚠ Uncertainty</p>
                <p className="text-xs text-amber-200/90">{uncertainty_notes}</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 shrink-0 hidden sm:block">
            {assessmentVisual.icon}
          </div>
        </div>
      </motion.div>

      {/* ── The Claim ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card rounded-xl overflow-hidden border border-slate-800"
      >
        <SectionHeader
          id="claim"
          icon={<FileText className="w-4.5 h-4.5" />}
          label="The Claim Under Investigation"
          iconColor="text-sky-400"
        />
        {isExpanded('claim') && (
          <div id="tp-panel-claim" className="p-5 bg-slate-950/50 space-y-4 border-t border-slate-800">
            {/* Claim text — prominently displayed */}
            <div className="p-4 rounded-xl bg-slate-900 border border-sky-500/20 shadow-inner shadow-sky-950/40">
              <p className="text-base font-medium text-slate-100 leading-relaxed">
                {claim}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-slate-400">
              {data.claim_summary?.domain && (
                <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg">
                  <strong className="text-slate-300">Domain:</strong> {data.claim_summary.domain}
                </span>
              )}
              {data.claim_summary?.virality_risk && (
                <span className="px-2.5 py-1 bg-rose-950/20 border border-rose-500/20 rounded-lg text-rose-300">
                  <strong>Virality Risk:</strong> {data.claim_summary.virality_risk}
                </span>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Source Analysis ────────────────────────────── */}
      {source && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass-card rounded-xl overflow-hidden border border-slate-800"
        >
          <SectionHeader
            id="source"
            icon={<Info className="w-4.5 h-4.5" />}
            label="Source & Origin Analysis"
            iconColor="text-teal-400"
          />
          {isExpanded('source') && (
            <div id="tp-panel-source" className="p-5 bg-slate-950/50 space-y-4 border-t border-slate-800">
              {isDemo && (
                <p className="text-[10px] text-amber-400/80 italic">
                  Source details are part of the curated demonstration scenario — not live internet data.
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Origin</div>
                  <div className="text-xs font-medium text-slate-200">{source.origin}</div>
                </div>
                <div className="p-3.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Publisher</div>
                  <div className="text-xs font-medium text-slate-200">{source.publisher}</div>
                </div>
                <div className="p-3.5 rounded-lg border space-y-1 bg-amber-950/10 border-amber-500/20">
                  <div className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">Transparency</div>
                  <div className="text-xs font-medium text-amber-300">{source.transparency_score}</div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Evidence Matrix ─────────────────────────────── */}
      {evidence && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.11 }}
          className="glass-card rounded-xl overflow-hidden border border-slate-800"
        >
          <SectionHeader
            id="evidence"
            icon={<ShieldCheck className="w-4.5 h-4.5" />}
            label="Evidence Matrix"
            iconColor="text-emerald-400"
          />
          {isExpanded('evidence') && (
            <div id="tp-panel-evidence" className="p-5 bg-slate-950/50 space-y-5 border-t border-slate-800">
              {/* Evidence count summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl border text-center space-y-1 border-teal-500/20 bg-teal-950/10">
                  <div className="text-2xl font-bold text-teal-400">{evidence.supporting_count}</div>
                  <div className="text-[10px] text-teal-400/80 uppercase tracking-wider font-semibold">Supporting</div>
                </div>
                <div className="p-3 rounded-xl border text-center space-y-1 border-rose-500/20 bg-rose-950/10">
                  <div className="text-2xl font-bold text-rose-400">{evidence.conflicting_count}</div>
                  <div className="text-[10px] text-rose-400/80 uppercase tracking-wider font-semibold">Conflicting</div>
                </div>
                <div className="p-3 rounded-xl border text-center space-y-1 border-amber-500/20 bg-amber-950/10">
                  <div className="text-2xl font-bold text-amber-400">{evidence.unverified_count}</div>
                  <div className="text-[10px] text-amber-400/80 uppercase tracking-wider font-semibold">Unverified</div>
                </div>
              </div>

              {/* Supporting items */}
              {evidence.supporting_items && evidence.supporting_items.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Supporting Sources</h5>
                  <div className="space-y-2">
                    {evidence.supporting_items.map((item: any, idx: number) => (
                      <EvidenceItem key={idx} item={item} type="supporting" />
                    ))}
                  </div>
                </div>
              )}

              {/* Conflicting items */}
              {evidence.conflicting_items && evidence.conflicting_items.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                    Conflicting Sources ({evidence.conflicting_items.length})
                  </h5>
                  <div className="space-y-2">
                    {evidence.conflicting_items.map((item: any, idx: number) => (
                      <EvidenceItem key={idx} item={item} type="conflicting" />
                    ))}
                  </div>
                </div>
              )}

              {/* Unverified items */}
              {evidence.unverified_items && evidence.unverified_items.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Unverified Signals</h5>
                  <div className="space-y-2">
                    {evidence.unverified_items.map((item: any, idx: number) => (
                      <EvidenceItem key={idx} item={item} type="unverified" />
                    ))}
                  </div>
                </div>
              )}

              {/* If no supporting and conflicting exist from old schema */}
              {!evidence.supporting_items && !evidence.unverified_items && evidence.conflicting_items?.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Conflicting Sources</h5>
                  <div className="space-y-2">
                    {evidence.conflicting_items.map((item: any, idx: number) => (
                      <EvidenceItem key={idx} item={item} type="conflicting" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* ── Context & Historical Precedent ─────────────── */}
      {context && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="glass-card rounded-xl overflow-hidden border border-slate-800"
        >
          <SectionHeader
            id="context"
            icon={<HelpCircle className="w-4.5 h-4.5" />}
            label="Context & Historical Precedent"
            iconColor="text-amber-400"
          />
          {isExpanded('context') && (
            <div id="tp-panel-context" className="p-5 bg-slate-950/50 space-y-4 border-t border-slate-800">
              {context.missing_context && context.missing_context.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Missing Critical Context</h5>
                  <ul className="space-y-2">
                    {context.missing_context.map((item: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 p-2.5 rounded-lg bg-amber-950/10 border border-amber-500/15 text-xs text-slate-300"
                      >
                        <span className="text-amber-400 shrink-0 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {context.historical_precedent && (
                <div className="p-3.5 bg-slate-900/80 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5">Historical Pattern</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{context.historical_precedent}</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* ── Language & Emotional Framing ──────────────── */}
      {language_analysis && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.17 }}
          className="glass-card rounded-xl overflow-hidden border border-slate-800"
        >
          <SectionHeader
            id="language"
            icon={<Sparkles className="w-4.5 h-4.5" />}
            label="Language & Emotional Framing"
            iconColor="text-purple-400"
          />
          {isExpanded('language') && (
            <div id="tp-panel-language" className="p-5 bg-slate-950/50 space-y-4 border-t border-slate-800">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400 font-medium">Sensationalism Index</span>
                  <span className="text-rose-400 font-semibold font-mono-code">
                    {language_analysis.sensationalism_score}/100
                    {language_analysis.sensationalism_score >= 70 ? ' — HIGH' : language_analysis.sensationalism_score >= 40 ? ' — MEDIUM' : ' — LOW'}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${language_analysis.sensationalism_score}%`,
                      background: language_analysis.sensationalism_score >= 70
                        ? 'linear-gradient(90deg, #F43F5E, #FB7185)'
                        : language_analysis.sensationalism_score >= 40
                        ? 'linear-gradient(90deg, #F59E0B, #FCD34D)'
                        : 'linear-gradient(90deg, #14B8A6, #5EEAD4)',
                    }}
                  />
                </div>
              </div>

              {language_analysis.loaded_words && language_analysis.loaded_words.length > 0 && (
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2">Trigger Words Detected</p>
                  <div className="flex flex-wrap gap-2">
                    {language_analysis.loaded_words.map((word: string, i: number) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 text-xs border border-rose-500/20 font-mono-code"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {language_analysis.tone && (
                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Tone: </span>
                  <span className="text-xs text-slate-300">{language_analysis.tone}</span>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* ── Recommended Verification Steps ─────────────── */}
      {suggested_actions && suggested_actions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5 rounded-xl border border-sky-500/20 bg-sky-950/10 space-y-3"
        >
          <h4 className="text-sm font-bold text-sky-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-sky-400" />
            {t('tpSuggestedActions')}
          </h4>
          <p className="text-[10px] text-slate-500 italic">
            Use your own judgment to evaluate these recommended steps.
          </p>
          <ul className="space-y-2">
            {suggested_actions.map((action: string, i: number) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
