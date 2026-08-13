'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Target, BookOpen, Sparkles, CheckCircle2, Info, Eye, Search, GitBranch } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface ProfileProps {
  quizScore?: number;
  totalQuizzes?: number;
  hasInvestigated?: boolean;
}

const SESSION_SKILLS = [
  {
    icon: <Search className="w-4 h-4 text-sky-400" />,
    name: 'Source Evaluation',
    desc: 'Assessed where the claim originated and the publisher\'s credibility.',
    practiced: true,
  },
  {
    icon: <Eye className="w-4 h-4 text-teal-400" />,
    name: 'Evidence Reasoning',
    desc: 'Examined supporting, conflicting, and unverified evidence signals.',
    practiced: true,
  },
  {
    icon: <Target className="w-4 h-4 text-amber-400" />,
    name: 'Context Checking',
    desc: 'Identified missing context and historical precedents for the claim.',
    practiced: true,
  },
  {
    icon: <GitBranch className="w-4 h-4 text-purple-400" />,
    name: 'Perspective Analysis',
    desc: 'Compared how different source types frame the same information.',
    practiced: true,
  },
  {
    icon: <Eye className="w-4 h-4 text-rose-400" />,
    name: 'Framing Recognition',
    desc: 'Recognized emotional trigger words and sensationalism patterns.',
    practiced: true,
  },
];

export default function MediaLiteracyProfile({
  quizScore = 0,
  totalQuizzes = 1,
  hasInvestigated = true,
}: ProfileProps) {
  const { t } = useI18n();
  const completedQuiz = quizScore > 0;
  const hasBadges = hasInvestigated || completedQuiz;

  return (
    <div className="space-y-6">

      {/* ── Profile Header ────────────────────────────── */}
      <div className="glass-card p-6 rounded-2xl border border-sky-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg shadow-sky-500/20 shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100 text-editorial">{t('profileTitle')}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Session-based skills from this investigation</p>
            </div>
          </div>

          {completedQuiz && (
            <div className="px-4 py-2 rounded-xl bg-teal-950/30 border border-teal-500/20 text-right">
              <div className="text-[10px] text-teal-400 uppercase tracking-wider font-semibold">Quiz Result</div>
              <div className="text-lg font-bold text-teal-300">{quizScore} / {totalQuizzes || 2} correct</div>
            </div>
          )}
        </div>
      </div>

      {/* ── Important Transparency Notice ─────────────── */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/60 border border-amber-500/20">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-semibold text-amber-300">About This Profile</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            This profile shows skills practiced in this session — not a scientifically measured competency score.
            Genuine media literacy develops over time through repeated practice across many types of content.
            No percentage scores are shown because one investigation cannot reliably measure your overall proficiency.
          </p>
        </div>
      </div>

      {/* ── Session Skills Practiced ──────────────────── */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          Skills Practiced in This Investigation
        </h4>

        <div className="space-y-3">
          {SESSION_SKILLS.map((skill, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800"
            >
              <div className="mt-0.5 shrink-0">{skill.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-slate-200">{skill.name}</span>
                  {skill.practiced && (
                    <span className="flex items-center gap-1 text-[10px] text-teal-400 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Practiced
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{skill.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── What Builds Real Media Literacy ──────────── */}
      <div className="glass-card p-5 rounded-xl border border-slate-800 space-y-4">
        <h5 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Target className="w-4 h-4 text-amber-400" />
          What Builds Real Media Literacy
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="font-semibold text-slate-200">Repeated Practice</div>
            <p className="text-slate-400 text-[11px]">Investigating many different types of claims across topics and formats.</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="font-semibold text-slate-200">Source Diversity</div>
            <p className="text-slate-400 text-[11px]">Exposure to academic, journalistic, activist, and community sources.</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="font-semibold text-slate-200">Reflection</div>
            <p className="text-slate-400 text-[11px]">Asking why you believed or doubted something, not just what is true.</p>
          </div>
        </div>
      </div>

      {/* ── Badges ────────────────────────────────────── */}
      <div className="glass-card p-5 rounded-xl border border-slate-800 space-y-3">
        <h5 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Session Achievements
        </h5>
        {hasBadges ? (
          <div className="flex flex-wrap gap-3">
            {hasInvestigated && (
              <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-sky-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                First Investigation
              </div>
            )}
            {completedQuiz && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="px-3.5 py-2 rounded-xl bg-teal-950/30 border border-teal-500/30 text-xs font-semibold text-teal-300 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-teal-400" />
                Critical Thinking Pioneer
              </motion.div>
            )}
            {hasInvestigated && (
              <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-purple-300 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                UNESCO MIL Investigator
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">
            Complete an investigation or learning challenge to earn session badges.
          </p>
        )}
        <p className="text-[10px] text-slate-600 italic">
          Badges recognize session participation — not measured competency levels.
        </p>
      </div>
    </div>
  );
}
