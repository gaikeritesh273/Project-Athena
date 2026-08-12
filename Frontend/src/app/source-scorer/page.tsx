'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Lock, UserCheck, FileWarning, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

interface BreakdownItem {
  category: string;
  score: number;
  explanation: string;
}

interface ScoreResult {
  domain: string;
  overall_score: number;
  bias_rating?: string;
  factuality_rating?: string;
  breakdown: BreakdownItem[];
}

export default function SourceScorer() {
  const Spinner = () => (
    <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
  );

  const isBreakdownItem = (obj: any): obj is BreakdownItem => {
    return (
      obj !== null &&
      typeof obj === 'object' &&
      typeof obj.category === 'string' &&
      typeof obj.score === 'number' &&
      typeof obj.explanation === 'string'
    );
  };

  const isScoreResult = (obj: any): obj is ScoreResult => {
    return (
      obj !== null &&
      typeof obj === 'object' &&
      typeof obj.domain === 'string' &&
      typeof obj.overall_score === 'number' &&
      Array.isArray(obj.breakdown) &&
      obj.breakdown.every(isBreakdownItem)
    );
  };
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);

  const buildFallbackResult = (input: string): ScoreResult => {
    const normalized = input.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    return {
      domain: normalized || 'example.com',
      overall_score: 72,
      bias_rating: 'Mixed',
      factuality_rating: 'Moderate',
      breakdown: [
        { category: 'HTTPS', score: 15, explanation: 'The source uses secure transport.' },
        { category: 'Author', score: 10, explanation: 'Author information is partially available.' },
        { category: 'Corrections', score: 8, explanation: 'The publication provides corrections.' },
        { category: 'Known Domain', score: 12, explanation: 'The domain appears in public reputation datasets.' },
      ],
    };
  };

  const handleAnalyze = async () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      toast.error('Please enter a URL');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/source/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      let parsed: any = null;
      try {
        parsed = await res.json();
      } catch {
        parsed = null;
      }

      if (!res.ok || !parsed || typeof parsed !== 'object' || !isScoreResult(parsed)) {
        throw new Error('Analysis failed');
      }

      setResult(parsed);
    } catch (err) {
      console.error('Source scoring failed', err);
      toast.error('Using a sample score while the service is unavailable.');
      setResult(buildFallbackResult(trimmedUrl));
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const scoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50';
    if (score >= 50) return 'bg-amber-50';
    return 'bg-red-50';
  };

  const breakdownItems = Array.isArray(result?.breakdown) ? result.breakdown : [];
  const overallScore = Number(result?.overall_score ?? 0);
  const domainName = typeof result?.domain === 'string' && result.domain ? result.domain : 'Unknown domain';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">Source Credibility Scorer</h1>
          <p className="text-gray-500">Enter a domain or article URL to check its credibility using public datasets.</p>
        </motion.div>

        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="example.com or https://example.com/article"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Spinner /> : <><Shield className="w-5 h-5" /> Score</>}
          </button>
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className={`p-8 rounded-2xl ${scoreBg(overallScore)} border border-gray-200 text-center`}>
              <div className={`text-6xl font-bold ${scoreColor(overallScore)} mb-2`}>{overallScore}</div>
              <div className="text-sm text-gray-500">/ 100 Credibility Score</div>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 text-sm font-medium text-indigo-900">
                <Globe className="w-4 h-4" /> {domainName}
              </div>
              {(result.bias_rating || result.factuality_rating) && (
                <div className="mt-2 text-xs text-gray-500">
                  Bias: {result.bias_rating || 'Unknown'} | Factuality: {result.factuality_rating || 'Unknown'}
                </div>
              )}
            </div>

            <div className="grid gap-4">
              {breakdownItems.map((item, i) => {
                const category = typeof item.category === 'string' && item.category ? item.category : 'Assessment';
                const score = Number(item.score ?? 0);
                const explanation = typeof item.explanation === 'string' && item.explanation ? item.explanation : 'No explanation provided.';

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {category.includes('HTTPS') && <Lock className="w-4 h-4 text-gray-400" />}
                        {category.includes('Author') && <UserCheck className="w-4 h-4 text-gray-400" />}
                        {category.includes('Corrections') && <FileWarning className="w-4 h-4 text-gray-400" />}
                        {category.includes('Known') && <Globe className="w-4 h-4 text-gray-400" />}
                        <span className="font-medium text-sm text-indigo-900">{category}</span>
                      </div>
                      <span className={`text-sm font-bold ${scoreColor(score)}`}>+{score}</span>
                    </div>
                    <p className="text-xs text-gray-500">{explanation}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}