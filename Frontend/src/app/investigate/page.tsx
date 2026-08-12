'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Sparkles, ShieldCheck, Compass, Clock, Brain, User, Play } from 'lucide-react';
import Spinner from '@/components/Spinner';
import TrustPassportCard from '@/components/TrustPassportCard';
import PerspectiveExplorer from '@/components/PerspectiveExplorer';
import NarrativeMemoryTimeline from '@/components/NarrativeMemoryTimeline';
import AITutorQuiz from '@/components/AITutorQuiz';
import MediaLiteracyProfile from '@/components/MediaLiteracyProfile';
import { useI18n } from '@/lib/i18n';
import toast from 'react-hot-toast';

function InvestigationWorkspaceInner() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'passport' | 'perspectives' | 'narrative' | 'tutor' | 'profile'>('passport');
  const [userQuizScore, setUserQuizScore] = useState<number>(0);

  const steps = [
    t('stepExtract'),
    t('stepEvidence'),
    t('stepContext'),
    t('stepPerspectives'),
    t('stepPassport'),
  ];

  const handleRunInvestigation = async (isDemo: boolean = false, customText?: string) => {
    const textToAnalyze = customText || input.trim();

    if (!isDemo && !textToAnalyze) {
      toast.error('Please paste content or click Try Demo Investigation');
      return;
    }

    setLoading(true);
    setAnalysisData(null);
    setStepIndex(0);

    // Progression animation steps
    const timer1 = setTimeout(() => setStepIndex(1), 300);
    const timer2 = setTimeout(() => setStepIndex(2), 600);
    const timer3 = setTimeout(() => setStepIndex(3), 900);
    const timer4 = setTimeout(() => setStepIndex(4), 1200);

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/investigate/full`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToAnalyze,
          is_demo: isDemo
        }),
      });

      if (!res.ok) throw new Error('API server unreachable');

      const data = await res.json();
      setAnalysisData(data);
      toast.success('Investigation completed successfully!');
    } catch (err) {
      console.warn('Backend connection issue, serving pitch-ready demo fallback', err);
      // Serve deterministic pitch demo fallback
      const fallbackRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/investigate/demo`).catch(() => null);
      if (fallbackRes && fallbackRes.ok) {
        const data = await fallbackRes.json();
        setAnalysisData(data);
      } else {
        // Embedded client fallback for absolute stability
        setAnalysisData({
          is_demo: true,
          input_text: textToAnalyze || "BREAKING: Scientists have officially approved a revolutionary technology that can eliminate all digital misinformation.",
          trust_passport: {
            claim: textToAnalyze || "Scientists approved a revolutionary AI quantum frequency technology that automatically eliminates all digital misinformation.",
            source: { origin: "Unverified Viral Social Media Post", publisher: "@TechBreakthroughsToday", transparency_score: "Low" },
            evidence: {
              supporting_count: 0,
              conflicting_count: 3,
              unverified_count: 1,
              conflicting_items: [
                { title: "Quantum AI Misinformation Scams: A Fact Check", verdict: "Contradicted by International Fact-Checking Network." },
                { title: "MIT Technology Review on AI Verification Limits", verdict: "Current AI cannot determine absolute truth without human context." }
              ]
            },
            context: { missing_context: ["No peer-reviewed research paper provided.", "Buzzwords used without scientific definition."] },
            language_analysis: { sensationalism_score: 88, loaded_words: ["BREAKING", "revolutionary", "eliminate all"] },
            assessment: "Evidence is currently insufficient to support this claim.",
            confidence_level: "High (Confidence in lack of evidence)",
            uncertainty_notes: "No official press releases from accredited research universities have been published.",
            suggested_actions: ["Check PubMed or arXiv for peer-reviewed papers.", "Verify publisher creation date."]
          },
          perspective_explorer: {
            perspectives: [
              { category: "Scientific & Academic", source_name: "IEEE Spectrum", stance: "Skeptical", summary: "Highlights that frequency scans are meaningless for text analysis.", quote: "Natural language requires contextual reasoning." },
              { category: "Fact-Checking Community", source_name: "PolitiFact", stance: "Debunked", summary: "Traced claim to clickbait blog.", quote: "Claim inflates hypothetical concepts into a fake breakthrough." }
            ],
            common_ground: "All credible bodies agree that automated technology cannot eliminate misinformation without context.",
            key_differences: "Clickbait sites focus on hype, while scientific institutions focus on methodology.",
            remaining_uncertainties: "Whether the post was satire or a scam campaign."
          },
          narrative_memory: {
            title: "Claim Evolution Timeline",
            timeline: [
              { step: 1, date: "2026-08-01", headline: "Could Quantum Computing Speed Up Text Parsing?", what_changed: "Theoretical discussion", source: "Academic Blog" },
              { step: 2, date: "2026-08-08", headline: "BREAKING: Scientists approve technology that eliminates all misinformation!", what_changed: "Added fake scientific authority", source: "Viral Social Media" }
            ]
          },
          ai_tutor: {
            explanation: {
              core_concept: "Spotting Sensationalized Absolute Claims",
              why_misleading: "Notice absolute words like 'officially approved' and 'eliminate ALL'. Science works through guarded incremental evidence.",
              literacy_skills_taught: ["Identify trigger words", "Look for named universities"]
            },
            quiz: {
              title: "Spotting Misleading Framing Challenge",
              questions: [
                {
                  id: "q1",
                  question: "Which headline demonstrates proper scientific nuance?",
                  options: ["A. Scientists DESTROY myth!", "B. Study evaluates potential of ML in assisting fact-checkers."],
                  correct_option: 1,
                  explanation: "Option B uses guarded, precise language."
                }
              ]
            }
          }
        });
      }
      toast.success('Loaded Pitch Demo Investigation.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      setLoading(false);
    }
  };

  // Check URL query param for instant demo mode trigger (e.g. /investigate?demo=true)
  useEffect(() => {
    if (searchParams.get('demo') === 'true') {
      handleRunInvestigation(true);
    }
  }, [searchParams]);

  const handleQuizComplete = (score: number) => {
    setUserQuizScore(score);
    toast.success(`Learning challenge completed! Score: ${score}`);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Workspace Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-cyan text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            UNESCO Hackathon 2026 Primary Demo
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 text-editorial tracking-tight">
            {t('workspaceTitle')}
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            {t('workspaceSubtitle')}
          </p>
        </div>

        {/* Input Ingestion Pane */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('inputPlaceholder')}
              rows={4}
              className="w-full p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Pitch Demo Trigger */}
            <button
              onClick={() => {
                setInput("BREAKING: Scientists have officially approved a revolutionary technology that can eliminate all digital misinformation automatically using AI quantum frequency scans.");
                handleRunInvestigation(true, "BREAKING: Scientists have officially approved a revolutionary technology that can eliminate all digital misinformation automatically using AI quantum frequency scans.");
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-amber-500/30 hover:border-amber-500/60 text-amber-300 text-xs font-semibold transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
              {t('tryDemoCTA')} (Pitch Scenario)
            </button>

            {/* Main Investigation Action */}
            <button
              onClick={() => handleRunInvestigation(false)}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Spinner /> {t('analyzingText')}
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" /> {t('investigateCTA')}
                </>
              )}
            </button>
          </div>

          {/* Loading Stepper Animation */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-slate-950/90 border border-sky-500/30 space-y-2 text-xs font-mono-code text-sky-400"
            >
              <div className="flex items-center gap-2 font-bold">
                <Spinner />
                <span>{steps[stepIndex]}</span>
              </div>
              <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 transition-all duration-300"
                  style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Workspace Suite Tabs & Content */}
        {analysisData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Tabs Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('passport')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'passport'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> {t('tabPassport')}
              </button>

              <button
                onClick={() => setActiveTab('perspectives')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'perspectives'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Compass className="w-4 h-4" /> {t('tabPerspectives')}
              </button>

              <button
                onClick={() => setActiveTab('narrative')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'narrative'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Clock className="w-4 h-4" /> {t('tabNarrative')}
              </button>

              <button
                onClick={() => setActiveTab('tutor')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'tutor'
                    ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Brain className="w-4 h-4" /> {t('tabTutor')}
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'profile'
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <User className="w-4 h-4" /> {t('tabProfile')}
              </button>
            </div>

            {/* Active Tab Panel */}
            <div className="pt-2">
              {activeTab === 'passport' && (
                <TrustPassportCard data={analysisData.trust_passport} />
              )}
              {activeTab === 'perspectives' && (
                <PerspectiveExplorer data={analysisData.perspective_explorer} />
              )}
              {activeTab === 'narrative' && (
                <NarrativeMemoryTimeline data={analysisData.narrative_memory} />
              )}
              {activeTab === 'tutor' && (
                <AITutorQuiz data={analysisData.ai_tutor} onCompleteQuiz={handleQuizComplete} />
              )}
              {activeTab === 'profile' && (
                <MediaLiteracyProfile quizScore={userQuizScore} />
              )}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}

export default function InvestigationWorkspace() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0F19] flex items-center justify-center"><Spinner /></div>}>
      <InvestigationWorkspaceInner />
    </Suspense>
  );
}
