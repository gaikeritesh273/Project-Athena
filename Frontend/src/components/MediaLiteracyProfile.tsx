'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Target, TrendingUp, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface ProfileProps {
  quizScore?: number;
  totalQuizzes?: number;
}

export default function MediaLiteracyProfile({ quizScore = 1, totalQuizzes = 1 }: ProfileProps) {
  const { t } = useI18n();

  const skills = [
    { name: 'Source Evaluation', score: 78, color: 'bg-sky-500' },
    { name: 'Context Checking', score: 85, color: 'bg-teal-500' },
    { name: 'Evidence Evaluation', score: 72, color: 'bg-indigo-500' },
    { name: 'Emotional Framing Awareness', score: 90, color: 'bg-purple-500' },
    { name: 'Image/Media Forensics', score: 65, color: 'bg-amber-500' },
  ];

  const bonusXP = quizScore * 50;
  const currentLevel = Math.floor((350 + bonusXP) / 200) + 1;

  return (
    <div className="space-y-8">
      {/* Header Profile Summary */}
      <div className="glass-card p-6 rounded-2xl border border-sky-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg shadow-sky-500/20">
              L{currentLevel}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100 text-editorial">{t('profileTitle')}</h3>
              <p className="text-xs text-slate-400">{t('profileSubtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-right">
              <div className="text-xs text-slate-400 font-mono-code">Experience Points</div>
              <div className="text-lg font-bold text-sky-400">{350 + bonusXP} XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Matrix */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-400" />
            Core Media Literacy Competencies
          </h4>
          <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full font-medium">
            Illustrative example — full profile scoring is a planned feature
          </span>
        </div>

        <div className="space-y-4">
          {skills.map((skill, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">{skill.name}</span>
                <span className="font-mono-code text-slate-400">{skill.score}%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.score}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  className={`h-full ${skill.color} rounded-full`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Practice Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="glass-card p-5 rounded-xl border border-emerald-500/20 bg-emerald-950/10 space-y-3">
          <h5 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Key Strengths
          </h5>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Spotting emotional trigger words in breaking headlines.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Cross-referencing claims against academic fact-checkers.</span>
            </li>
          </ul>
        </div>

        {/* Practice Areas */}
        <div className="glass-card p-5 rounded-xl border border-amber-500/20 bg-amber-950/10 space-y-3">
          <h5 className="text-sm font-bold text-amber-300 flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400" />
            Recommended Practice Area
          </h5>
          <p className="text-xs text-slate-300 leading-relaxed">
            Practice identifying manipulated digital media and checking reverse-image metadata to improve Image/Media Forensics skills.
          </p>
        </div>
      </div>

      {/* Badges Earned */}
      <div className="glass-card p-5 rounded-xl border border-slate-800 space-y-3">
        <h5 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Badges Earned
        </h5>
        <div className="flex flex-wrap gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-sky-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            UNESCO MIL Investigator
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-teal-300 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-400" />
            Critical Thinking Pioneer
          </div>
        </div>
      </div>
    </div>
  );
}
