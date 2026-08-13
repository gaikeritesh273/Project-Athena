'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Sparkles, ShieldCheck, Compass, Clock, Brain, User, Play,
  CheckCircle, AlertTriangle, HelpCircle, ArrowRight, FlaskConical
} from 'lucide-react';
import Spinner from '@/components/Spinner';
import TrustPassportCard from '@/components/TrustPassportCard';
import PerspectiveExplorer from '@/components/PerspectiveExplorer';
import NarrativeMemoryTimeline from '@/components/NarrativeMemoryTimeline';
import AITutorQuiz from '@/components/AITutorQuiz';
import MediaLiteracyProfile from '@/components/MediaLiteracyProfile';
import AthenaLogo from '@/components/AthenaLogo';
import { useI18n } from '@/lib/i18n';
import toast from 'react-hot-toast';

// ─── Stage Configuration ──────────────────────────────────────
type TabId = 'passport' | 'perspectives' | 'narrative' | 'tutor' | 'profile';

const STAGES = [
  {
    id: 'passport' as TabId,
    number: '01',
    label: 'Investigate',
    icon: ShieldCheck,
    color: 'text-sky-400',
    activeColor: 'bg-sky-500',
    question: 'What is the claim? What evidence exists?',
  },
  {
    id: 'perspectives' as TabId,
    number: '02',
    label: 'Compare',
    icon: Compass,
    color: 'text-teal-400',
    activeColor: 'bg-teal-500',
    question: 'How do different sources frame it?',
  },
  {
    id: 'narrative' as TabId,
    number: '03',
    label: 'Trace',
    icon: Clock,
    color: 'text-amber-400',
    activeColor: 'bg-amber-500',
    question: 'How did this narrative evolve?',
  },
  {
    id: 'tutor' as TabId,
    number: '04',
    label: 'Learn',
    icon: Brain,
    color: 'text-purple-400',
    activeColor: 'bg-purple-500',
    question: 'What can I apply next time?',
  },
];

// ─── Investigation Stage Progress Bar ─────────────────────────
function InvestigationStageBar({
  activeTab,
  onStageClick,
  completedStages,
}: {
  activeTab: TabId;
  onStageClick: (id: TabId) => void;
  completedStages: Set<TabId>;
}) {
  const activeIndex = STAGES.findIndex((s) => s.id === activeTab);

  return (
    <div className="glass-card rounded-2xl border border-slate-800 p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Stage steps */}
        <div className="flex items-center flex-wrap gap-1 justify-center sm:justify-start">
          {STAGES.map((stage, idx) => {
            const isActive = activeTab === stage.id;
            const isCompleted = completedStages.has(stage.id) && !isActive;
            const Icon = stage.icon;

            return (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => onStageClick(stage.id)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`stage-step ${isActive ? 'stage-active' : isCompleted ? 'stage-completed' : ''}`}
                >
                  <span className={`text-[10px] font-mono-code ${isActive ? 'text-sky-400' : isCompleted ? 'text-teal-500' : 'text-slate-600'}`}>
                    {stage.number}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : isCompleted ? 'text-teal-400' : 'text-slate-600'}`} />
                  <span>{stage.label}</span>
                  {isCompleted && <CheckCircle className="w-3 h-3 text-teal-500" />}
                </button>
                {idx < STAGES.length - 1 && (
                  <div className={`stage-connector ${idx < activeIndex ? 'stage-connector-done' : ''}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Active stage question */}
        <AnimatePresence mode="wait">
          <motion.p
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-slate-400 italic text-right hidden md:block max-w-xs"
          >
            {STAGES.find((s) => s.id === activeTab)?.question}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Investigation Summary Banner ─────────────────────────────
function InvestigationSummaryBanner({ data }: { data: any }) {
  if (!data?.trust_passport) return null;
  const tp = data.trust_passport;

  const evidenceLabel =
    tp.evidence?.conflicting_count > 0 && tp.evidence?.supporting_count === 0
      ? 'Conflicting evidence found'
      : tp.evidence?.supporting_count > 0 && tp.evidence?.conflicting_count === 0
      ? 'Supporting evidence found'
      : tp.evidence?.supporting_count > 0 && tp.evidence?.conflicting_count > 0
      ? 'Mixed evidence — further review needed'
      : 'Evidence is currently insufficient';

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="investigation-summary glass-card rounded-2xl p-5 border border-slate-800 space-y-4"
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm font-bold text-sky-300 uppercase tracking-widest flex items-center gap-2">
          <FlaskConical className="w-4 h-4" />
          Investigation Summary
        </h2>
        {data.is_demo && (
          <span className="demo-badge">
            <Sparkles className="w-3 h-3" />
            Demonstration Scenario
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Claim */}
        <div className="space-y-1">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Claim</div>
          <p className="text-xs text-slate-200 leading-relaxed line-clamp-3">
            {tp.claim}
          </p>
        </div>

        {/* Evidence */}
        <div className="space-y-1">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Evidence</div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {evidenceLabel}
            <span className="block text-slate-400 mt-0.5">
              {tp.evidence?.supporting_count ?? 0} supporting · {tp.evidence?.conflicting_count ?? 0} conflicting · {tp.evidence?.unverified_count ?? 0} unverified
            </span>
          </p>
        </div>

        {/* Uncertainty */}
        <div className="space-y-1">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Uncertainty</div>
          <p className="text-xs text-amber-300/90 leading-relaxed line-clamp-3">
            {tp.uncertainty_notes || 'Further verification recommended.'}
          </p>
        </div>

        {/* Assessment */}
        <div className="space-y-1">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Assessment</div>
          <p className="text-xs text-slate-200 leading-relaxed line-clamp-3">
            {tp.assessment}
          </p>
          {tp.suggested_actions?.[0] && (
            <p className="text-[10px] text-sky-400 flex items-center gap-1 mt-1">
              <ArrowRight className="w-3 h-3 shrink-0" />
              {tp.suggested_actions[0]}
            </p>
          )}
        </div>
      </div>

      {/* ATHENA philosophy line */}
      <div className="pt-2 border-t border-slate-800/80">
        <p className="text-[10px] text-slate-500 italic">
          ATHENA provides AI-assisted analysis to support your evaluation — not to replace your judgment.
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────
function InvestigationWorkspaceInner() {
  const { t } = useI18n();
  const searchParams = useSearchParams();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabId>('passport');
  const [userQuizScore, setUserQuizScore] = useState<number>(0);
  const [completedStages, setCompletedStages] = useState<Set<TabId>>(new Set());

  // Slower step progression for video-readable loading experience
  const steps = [
    'Extracting the central claim...',
    'Examining available evidence...',
    'Checking context and framing...',
    'Comparing perspectives...',
    'Preparing your investigation...',
  ];

  const handleRunInvestigation = async (isDemo: boolean = false, customText?: string) => {
    const textToAnalyze = customText || input.trim();

    if (!isDemo && !textToAnalyze) {
      toast.error('Please paste content or click "Load Demonstration Scenario"');
      return;
    }

    setLoading(true);
    setAnalysisData(null);
    setStepIndex(0);
    setCompletedStages(new Set());
    setActiveTab('passport');

    // 800ms per step — readable in a screen recording
    let currentStep = 0;
    const stepInterval = setInterval(() => {
      currentStep = currentStep < steps.length - 2 ? currentStep + 1 : currentStep;
      setStepIndex(currentStep);
    }, 800);

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/investigate/full`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToAnalyze,
          is_demo: isDemo,
        }),
      });

      if (!res.ok) throw new Error('API server unreachable');

      const data = await res.json();
      setAnalysisData(data);
      toast.success('Investigation ready.');
    } catch (err) {
      console.warn('Backend unreachable — loading demonstration scenario', err);

      // Try backend demo endpoint first
      const fallbackRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/investigate/demo`
      ).catch(() => null);

      if (fallbackRes && fallbackRes.ok) {
        const data = await fallbackRes.json();
        setAnalysisData(data);
      } else {
        // Client-side offline fallback — mirrors DEMO_INVESTIGATION_PAYLOAD structure
        setAnalysisData({
          is_demo: true,
          input_text:
            'BREAKING: Scientists have officially approved a revolutionary technology that can eliminate all digital misinformation automatically using AI quantum frequency scans.',
          trust_passport: {
            claim:
              'Scientists approved an automated quantum AI system that eradicates digital misinformation.',
            source: {
              origin: 'Unverified Viral Social Media Post (x.com / Telegram)',
              publisher: "Unknown Digital Account ('@TechBreakthroughsToday')",
              transparency_score: 'Low',
            },
            evidence: {
              supporting_count: 0,
              conflicting_count: 4,
              unverified_count: 2,
              supporting_items: [],
              conflicting_items: [
                {
                  title: 'Quantum AI Misinformation Scams: A Fact Check',
                  publisher: 'International Fact-Checking Network (IFCN)',
                  verdict:
                    'Contradicted — No peer-reviewed paper or official scientific body supports this claim.',
                },
                {
                  title: 'MIT Technology Review on Automated Misinformation Detection Limits',
                  publisher: 'MIT Technology Review',
                  verdict:
                    'Contradicted — Current AI systems cannot determine absolute truth without context.',
                },
                {
                  title: 'UNESCO Statement on MIL and AI Verification Tools',
                  publisher: 'UNESCO Communication and Information',
                  verdict:
                    'Context — Media literacy emphasizes critical thinking over automated censorship.',
                },
              ],
              unverified_items: [
                {
                  title: 'Patented Quantum Wave Scanner Concept Draft',
                  publisher: 'Unverified Patent Application',
                  verdict: 'Unverified draft patent without peer evaluation.',
                },
              ],
            },
            context: {
              missing_context: [
                'No specific research institution or lead scientist is named.',
                '"Quantum AI Frequency Scan" uses buzzwords not recognized in peer-reviewed CS literature.',
                'Automated text moderation cannot infer real-world intent or offline context.',
              ],
              historical_precedent:
                'Similar sensationalized tech claims surface frequently around high-profile global summits.',
            },
            language_analysis: {
              emotional_framing: 'High',
              sensationalism_score: 88,
              loaded_words: ['BREAKING', 'officially approved', 'revolutionary', 'eliminate all', 'automatically'],
              tone: 'Urgent, sensational, authoritative without citation',
            },
            assessment: 'Evidence is currently insufficient to support this claim. Key scientific context is missing.',
            confidence_level: 'High (Confidence in lack of evidence)',
            uncertainty_notes:
              'No official press releases from accredited universities have been published regarding this technology.',
            suggested_actions: [
              'Verify whether a peer-reviewed paper exists in PubMed, arXiv, or Nature.',
              'Check if major scientific bodies (IEEE, ACM, UNESCO) have released statements.',
              'Inspect the publisher account history for patterns of sensational posts.',
            ],
          },
          perspective_explorer: {
            perspectives: [
              {
                category: 'Scientific & Academic',
                source_name: 'IEEE Spectrum / Computer Science Faculty',
                stance: 'Skeptical',
                summary:
                  "Highlights that 'quantum frequency scanning' is technically meaningless for digital text analysis.",
                quote:
                  'Natural language processing requires contextual understanding, not physics-based frequency scans.',
              },
              {
                category: 'Fact-Checking Community',
                source_name: 'PolitiFact & Snopes Joint Brief',
                stance: 'Debunked',
                summary: 'Traced the claim back to a clickbait technology blog selling crypto tokens.',
                quote: 'The claim inflates hypothetical research concepts into a fabricated breakthrough.',
              },
              {
                category: 'International Organizations',
                source_name: 'UNESCO Media & Information Literacy Expert Group',
                stance: 'Educational',
                summary: 'Stresses that media literacy cannot be replaced by automated black-box software.',
                quote:
                  'Empowering citizens with critical evaluation skills is the key to resilient information ecosystems.',
              },
              {
                category: 'Social Media Community',
                source_name: 'Reddit r/Technology & Tech Twitter',
                stance: 'Mixed / Viral Concern',
                summary: 'Viral interest with top comments questioning the lack of peer review.',
                quote: 'Sounds like another hype campaign — where is the GitHub repository or whitepaper?',
              },
            ],
            common_ground:
              'All credible scientific and educational bodies agree that no fully automated technology can eliminate misinformation without human context.',
            key_differences:
              'Tech blogs focus on hype and virality, whereas academic and fact-checking institutions focus on empirical methodology.',
            remaining_uncertainties:
              'Whether the post was an intentional satire piece or a commercial scam campaign.',
          },
          narrative_memory: {
            title: "Evolution of the 'Quantum AI Misinformation Cure' Narrative",
            timeline: [
              {
                step: 1,
                date: '2026-08-01',
                event_type: 'ORIGINAL_PAPER_CONCEPT',
                source: 'Speculative Computer Science Blog',
                headline: 'Could Quantum Computing Hypothetically Speed Up Text Parsing?',
                what_changed: 'Theoretical academic discussion on computing speed.',
                details: 'A speculative article discussed theoretical quantum algorithms — no product claim made.',
              },
              {
                step: 2,
                date: '2026-08-05',
                event_type: 'HEADLINE_MANIPULATION',
                source: "Tech Buzz Site ('FutureTechDaily')",
                headline: 'Quantum AI Breakthrough Set to Scan All Web Content!',
                what_changed: 'Hypothetical concept framed as an imminent commercial product.',
                details: 'Sensationalized headline added to attract clicks. No methodology cited.',
              },
              {
                step: 3,
                date: '2026-08-08',
                event_type: 'VIRAL_AMPLIFICATION',
                source: 'Social Media Bots & Influencers',
                headline: 'BREAKING: Scientists approve technology that eliminates all digital misinformation!',
                what_changed: "Added fake scientific approval authority and absolute claim ('eliminate all').",
                details: 'Shared 45,000+ times across platforms with engagement-bait framing.',
              },
              {
                step: 4,
                date: '2026-08-11',
                event_type: 'FACT_CHECK_CORRECTION',
                source: 'ATHENA & Independent Fact-Checkers',
                headline: 'Fact Check: No Quantum AI Tool Has Been Approved to Eliminate Misinformation',
                what_changed: 'Debunking articles published providing missing context and source tracing.',
                details: 'Clarified that no such technology exists or has been validated by any scientific body.',
              },
            ],
          },
          ai_tutor: {
            explanation: {
              core_concept: 'Recognizing Sensationalized Absolute Claims',
              why_misleading:
                "Notice the use of absolute words like 'officially approved' and 'eliminate ALL misinformation'. Real scientific advances are communicated with specific methodology, peer review details, and nuanced limitations — not sweeping promises.",
              literacy_skills_taught: [
                "Identify loaded emotional trigger words ('BREAKING', 'revolutionary').",
                "Look for named scientific institutions rather than generic 'Scientists'.",
                "Be wary of technical buzzword mashups ('Quantum AI Frequency').",
              ],
            },
            quiz: {
              title: 'Mini Learning Challenge: Spotting Misleading Framing',
              questions: [
                {
                  id: 'q1',
                  question: 'Which of these headlines demonstrates proper scientific nuance?',
                  options: [
                    "A. 'Scientists DESTROY shocking myth with magic new AI tool!'",
                    "B. 'Study evaluates potential of machine learning in assisting fact-checkers.'",
                    "C. 'New invention officially cures all online fake news overnight!'",
                  ],
                  correct_option: 1,
                  explanation:
                    "Option B uses guarded, precise language ('evaluates potential', 'assisting'). Science rarely claims absolute overnight cures.",
                },
                {
                  id: 'q2',
                  question: "When a claim mentions 'Scientists have approved...', what is the best immediate step?",
                  options: [
                    'A. Share it immediately so friends stay safe.',
                    "B. Assume it is true because the word 'Scientists' is used.",
                    'C. Check which specific institution published the peer-reviewed paper.',
                  ],
                  correct_option: 2,
                  explanation:
                    'Always verify which university or journal published the research. Anonymous authority claims are a classic red flag.',
                },
              ],
            },
          },
        });
      }
      toast.success('Demonstration scenario loaded.');
    } finally {
      clearInterval(stepInterval);
      setStepIndex(steps.length - 1);
      setLoading(false);
    }
  };

  // Auto-trigger demo from URL
  useEffect(() => {
    if (searchParams.get('demo') === 'true') {
      handleRunInvestigation(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    setCompletedStages((prev) => new Set(prev).add(activeTab));
  };

  const handleQuizComplete = (score: number, _total?: number) => {
    setUserQuizScore(score);
    setCompletedStages((prev) => new Set(prev).add('tutor'));
    toast.success(`Learning challenge complete!`);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-main)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Workspace Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto flex flex-col items-center">
          <AthenaLogo size="lg" className="mb-2" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-cyan text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            UNESCO Youth Hackathon 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 text-editorial tracking-tight">
            Investigation Workspace
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
            Paste content to investigate, or load the demonstration scenario to see the full four-stage media literacy workflow.
          </p>
        </div>

        {/* Input Ingestion Pane */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste an article headline, viral social media post, or digital claim here..."
              rows={3}
              className="w-full p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Demo Scenario Trigger */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleRunInvestigation(true)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/30 hover:border-amber-500/60 text-amber-300 text-xs font-semibold transition-all flex items-center gap-2 group"
            >
              <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
              Load Demonstration Scenario
            </motion.button>

            {/* Primary Investigate Action */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              onClick={() => handleRunInvestigation(false)}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Spinner /> Investigating...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" /> Investigate
                </>
              )}
            </motion.button>
          </div>

          {/* Loading State — readable speed for recording */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-slate-950/90 border border-sky-500/30 space-y-3"
            >
              <div className="flex items-center gap-3 text-sm text-sky-300 font-semibold">
                <Spinner />
                <span>{steps[stepIndex]}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-sky-500 to-teal-500 rounded-full"
                  animate={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono-code pt-1">
                {steps.map((s, i) => {
                  const isDone = i < stepIndex;
                  const isCurrent = i === stepIndex;
                  return (
                    <div key={i} className="flex items-center gap-1">
                      {isDone ? (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-[9px]">
                          ✓
                        </motion.span>
                      ) : isCurrent ? (
                        <motion.span
                          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="w-4 h-4 rounded-full bg-sky-500/30 text-sky-300 border border-sky-400 flex items-center justify-center font-bold text-[9px]"
                        >
                          {i + 1}
                        </motion.span>
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-slate-900 text-slate-600 flex items-center justify-center text-[9px]">
                          {i + 1}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* Investigation Results */}
        {analysisData && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Investigation Summary */}
            <InvestigationSummaryBanner data={analysisData} />

            {/* Stage Progress Bar */}
            <InvestigationStageBar
              activeTab={activeTab}
              onStageClick={handleTabChange}
              completedStages={completedStages}
            />

            {/* Tab Panels */}
            <div className="pt-1">
              <AnimatePresence mode="wait">
                {activeTab === 'passport' && (
                  <motion.div
                    key="passport"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.18, ease: 'easeInOut' }}
                    role="tabpanel"
                    id="panel-passport"
                    aria-labelledby="tab-passport"
                  >
                    <TrustPassportCard data={analysisData.trust_passport} isDemo={analysisData.is_demo} />
                  </motion.div>
                )}
                {activeTab === 'perspectives' && (
                  <motion.div
                    key="perspectives"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.18, ease: 'easeInOut' }}
                    role="tabpanel"
                    id="panel-perspectives"
                    aria-labelledby="tab-perspectives"
                  >
                    <PerspectiveExplorer data={analysisData.perspective_explorer} isDemo={analysisData.is_demo} />
                  </motion.div>
                )}
                {activeTab === 'narrative' && (
                  <motion.div
                    key="narrative"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.18, ease: 'easeInOut' }}
                    role="tabpanel"
                    id="panel-narrative"
                    aria-labelledby="tab-narrative"
                  >
                    <NarrativeMemoryTimeline data={analysisData.narrative_memory} isDemo={analysisData.is_demo} />
                  </motion.div>
                )}
                {activeTab === 'tutor' && (
                  <motion.div
                    key="tutor"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.18, ease: 'easeInOut' }}
                    role="tabpanel"
                    id="panel-tutor"
                    aria-labelledby="tab-tutor"
                  >
                    <AITutorQuiz
                      data={analysisData.ai_tutor}
                      claim={analysisData.trust_passport?.claim}
                      onCompleteQuiz={handleQuizComplete}
                    />
                  </motion.div>
                )}
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.18, ease: 'easeInOut' }}
                    role="tabpanel"
                    id="panel-profile"
                    aria-labelledby="tab-profile"
                  >
                    <MediaLiteracyProfile quizScore={userQuizScore} hasInvestigated={Boolean(analysisData)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile / next step */}
            {activeTab === 'tutor' && userQuizScore > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-end"
              >
                <button
                  onClick={() => handleTabChange('profile')}
                  className="text-xs text-slate-400 hover:text-sky-400 flex items-center gap-1.5 transition-colors"
                >
                  View your learning profile <ArrowRight className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function InvestigationWorkspace() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <InvestigationWorkspaceInner />
    </Suspense>
  );
}
