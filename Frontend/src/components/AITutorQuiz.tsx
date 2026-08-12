'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Brain, CheckCircle, XCircle, Award, Lightbulb, ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface TutorProps {
  data: any;
  onCompleteQuiz?: (score: number, total: number) => void;
}

export default function AITutorQuiz({ data, onCompleteQuiz }: TutorProps) {
  const { t } = useI18n();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!data) return null;

  const { explanation, quiz } = data;

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    let correctCount = 0;
    quiz?.questions?.forEach((q: any) => {
      if (selectedAnswers[q.id] === q.correct_option) {
        correctCount++;
      }
    });
    if (onCompleteQuiz) {
      onCompleteQuiz(correctCount, quiz?.questions?.length || 2);
    }
  };

  return (
    <div className="space-y-8">
      {/* Educational Concept Header */}
      <div className="glass-card p-6 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-slate-900 to-purple-950/30 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100 text-editorial">{t('tutorTitle')}</h3>
            <p className="text-xs text-slate-400">{t('tutorSubtitle')}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-2">
          <h4 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            {explanation?.core_concept}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {explanation?.why_misleading}
          </p>
        </div>

        <div className="space-y-1.5">
          <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Media Literacy Lessons:</h5>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {explanation?.literacy_skills_taught?.map((skill: string, idx: number) => (
              <li key={idx} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0"></span>
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mini Quiz Challenge */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            {quiz?.title}
          </h4>
          <span className="text-xs font-mono-code text-slate-400">
            {Object.keys(selectedAnswers).length} / {quiz?.questions?.length || 0} Answered
          </span>
        </div>

        <div className="space-y-6">
          {quiz?.questions?.map((q: any, qIdx: number) => {
            const chosen = selectedAnswers[q.id];
            const isCorrect = chosen === q.correct_option;

            return (
              <div key={q.id} className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h5 className="text-sm font-semibold text-slate-200">
                  {qIdx + 1}. {q.question}
                </h5>

                <div className="space-y-2">
                  {q.options?.map((opt: string, optIdx: number) => {
                    const isSelected = chosen === optIdx;
                    let optionStyle = 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700';

                    if (submitted) {
                      if (optIdx === q.correct_option) {
                        optionStyle = 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'border-rose-500/50 bg-rose-950/30 text-rose-300';
                      }
                    } else if (isSelected) {
                      optionStyle = 'border-purple-500 bg-purple-950/30 text-purple-200';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelect(q.id, optIdx)}
                        className={`w-full p-3 rounded-lg border text-left text-xs font-medium transition-all ${optionStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation text after submission */}
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`p-3.5 rounded-lg text-xs space-y-1 ${
                      isCorrect ? 'bg-emerald-950/20 border border-emerald-500/20 text-emerald-300' : 'bg-amber-950/20 border border-amber-500/20 text-amber-300'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      {isCorrect ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-amber-400" />}
                      {isCorrect ? t('quizCorrect') : t('quizIncorrect')}
                    </div>
                    <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Quiz Action */}
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length < (quiz?.questions?.length || 0)}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-600/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Submit Learning Challenge Answers <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center space-y-1">
            <div className="text-sm font-bold text-emerald-300 flex items-center justify-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              Challenge Complete! Media Literacy Profile Updated (+50 XP)
            </div>
            <p className="text-xs text-slate-400">View your progress in the Media Literacy Profile tab.</p>
          </div>
        )}
      </div>
    </div>
  );
}
