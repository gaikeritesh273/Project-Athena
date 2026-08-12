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

interface TabButtonProps {
  id: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  activeColor: string;
}

function TabButton({ id, active, onClick, icon, label, activeColor }: TabButtonProps) {
  return (
    <button
      role="tab"
      id={`tab-${id}`}
      aria-selected={active}
      aria-controls={`panel-${id}`}
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
        active
          ? `${activeColor} text-slate-950 shadow-md`
          : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
      }`}
    >
      {icon} {label}
    </button>
  );
}

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

    // Dynamic request-bound stepper timer
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => (prev < 3 ? prev + 1 : prev));
    }, 250);

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
        // Minimum client-side offline fallback shape
        // NOTE: Keep minimal structure synchronized with Backend/app/services/ai_service.py DEMO_INVESTIGATION_PAYLOAD
        setAnalysisData({
          is_demo: true,
          input_text: textToAnalyze || "BREAKING: Scientists approve quantum frequency AI tool.",
          trust_passport: {
            claim: textToAnalyze || "Scientists approved a revolutionary AI quantum frequency technology.",
            source: { origin: "Unverified Viral Social Media Post", publisher: "@TechBreakthroughsToday", transparency_score: "Low" },
            evidence: { supporting_count: 0, conflicting_count: 3, unverified_count: 1, conflicting_items: [{ title: "Quantum AI Fact Check", verdict: "Contradicted." }] },
            context: { missing_context: ["No peer-reviewed paper provided."], historical_precedent: "Sensationalized claims surface during tech summits." },
            language_analysis: { sensationalism_score: 88, loaded_words: ["BREAKING", "revolutionary"] },
            assessment: "Evidence is currently insufficient to support this claim.",
            confidence_level: "High (Confidence in lack of evidence)",
            uncertainty_notes: "No official press release found.",
            suggested_actions: ["Check peer-reviewed databases."]
          },
          perspective_explorer: {
            perspectives: [{ category: "Scientific & Academic", source_name: "IEEE Spectrum", stance: "Skeptical", summary: "Frequency scans are invalid for text.", quote: "Requires contextual reasoning." }],
            common_ground: "Credible bodies agree context is required.", key_differences: "Hype vs empirical science.", remaining_uncertainties: "Satire vs scam."
          },
          narrative_memory: { title: "Claim Evolution Timeline", timeline: [{ step: 1, date: "2026-08-01", headline: "Quantum parsing paper", what_changed: "Theoretical idea", source: "Blog" }] },
          ai_tutor: {
            explanation: { core_concept: "Spotting Sensational Claims", why_misleading: "Look for absolute claims.", literacy_skills_taught: ["Identify trigger words"] },
            quiz: { title: "Spotting Misleading Framing", questions: [{ id: "q1", question: "Which headline demonstrates scientific nuance?", options: ["A. Scientists DESTROY myth!", "B. Study evaluates ML potential."], correct_option: 1, explanation: "Guarded language." }] }
          }
        });
      }
      toast.success('Loaded Pitch Demo Investigation.');
    } finally {
      clearInterval(stepInterval);
      setStepIndex(4);
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
            <div role="tablist" aria-label="Investigation pillars" className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-800 pb-3">
              <TabButton
                id="passport"
                active={activeTab === 'passport'}
                onClick={() => setActiveTab('passport')}
                icon={<ShieldCheck className="w-4 h-4" />}
                label={t('tabPassport')}
                activeColor="bg-sky-500"
              />
              <TabButton
                id="perspectives"
                active={activeTab === 'perspectives'}
                onClick={() => setActiveTab('perspectives')}
                icon={<Compass className="w-4 h-4" />}
                label={t('tabPerspectives')}
                activeColor="bg-sky-500"
              />
              <TabButton
                id="narrative"
                active={activeTab === 'narrative'}
                onClick={() => setActiveTab('narrative')}
                icon={<Clock className="w-4 h-4" />}
                label={t('tabNarrative')}
                activeColor="bg-sky-500"
              />
              <TabButton
                id="tutor"
                active={activeTab === 'tutor'}
                onClick={() => setActiveTab('tutor')}
                icon={<Brain className="w-4 h-4" />}
                label={t('tabTutor')}
                activeColor="bg-purple-500"
              />
              <TabButton
                id="profile"
                active={activeTab === 'profile'}
                onClick={() => setActiveTab('profile')}
                icon={<User className="w-4 h-4" />}
                label={t('tabProfile')}
                activeColor="bg-teal-500"
              />
            </div>

            {/* Active Tab Panel */}
            <div className="pt-2">
              {activeTab === 'passport' && (
                <div role="tabpanel" id="panel-passport" aria-labelledby="tab-passport">
                  <TrustPassportCard data={analysisData.trust_passport} />
                </div>
              )}
              {activeTab === 'perspectives' && (
                <div role="tabpanel" id="panel-perspectives" aria-labelledby="tab-perspectives">
                  <PerspectiveExplorer data={analysisData.perspective_explorer} />
                </div>
              )}
              {activeTab === 'narrative' && (
                <div role="tabpanel" id="panel-narrative" aria-labelledby="tab-narrative">
                  <NarrativeMemoryTimeline data={analysisData.narrative_memory} />
                </div>
              )}
              {activeTab === 'tutor' && (
                <div role="tabpanel" id="panel-tutor" aria-labelledby="tab-tutor">
                  <AITutorQuiz data={analysisData.ai_tutor} onCompleteQuiz={handleQuizComplete} />
                </div>
              )}
              {activeTab === 'profile' && (
                <div role="tabpanel" id="panel-profile" aria-labelledby="tab-profile">
                  <MediaLiteracyProfile quizScore={userQuizScore} />
                </div>
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
