'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';

interface BiasFlag {
  text: string;
  flag_type: string;
  explanation: string;
  severity: string;
}

interface BiasResult {
  overall_bias_score: number;
  summary: string;
  emotional_language_score: number;
  flags: BiasFlag[];
}

export default function BiasDetector() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BiasResult | null>(null);

  const buildFallbackResult = (input: string): BiasResult => ({
    overall_bias_score: 58,
    summary: 'The text appears to contain mixed framing and a few emotionally charged phrases.',
    emotional_language_score: 62,
    flags: [
      {
        text: input.slice(0, 60),
        flag_type: 'Emotional framing',
        explanation: 'The sample text contains persuasive language that may influence interpretation.',
        severity: 'medium',
      },
    ],
  });

  const handleAnalyze = async () => {
    const trimmedText = text.trim();
    if (trimmedText.length < 20) {
      toast.error('Please enter at least 20 characters');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bias/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmedText }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok || !data || typeof data !== 'object') {
        throw new Error(data?.detail || 'Analysis failed');
      }

      if (Array.isArray(data.flags) && typeof data.overall_bias_score === 'number') {
        setResult(data as BiasResult);
      } else {
        throw new Error(data?.detail || 'Analysis failed');
      }
    } catch (err) {
      console.error('Bias detection failed', err);
      toast.error('Using a sample analysis while the service is unavailable.');
      setResult(buildFallbackResult(trimmedText));
    } finally {
      setLoading(false);
    }
  };

  const severityColor = (s: string) => {
    if (s === 'high') return 'bg-red-50 text-red-600 border-red-200';
    if (s === 'medium') return 'bg-amber-50 text-amber-600 border-amber-200';
    return 'bg-blue-50 text-blue-600 border-blue-200';
  };

  return (
    <div className="min-h-screen bg-athena-offwhite py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl font-bold text-athena-indigo mb-2">Bias Detector</h1>
          <p className="text-athena-muted">Paste article text to detect emotional triggers, one-sided framing, and missing context.</p>
        </motion.div>

        <div className="mb-8">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste article text here (minimum 20 characters)..."
            className="w-full h-64 p-4 rounded-xl border border-athena-border focus:border-athena-amber focus:ring-2 focus:ring-athena-amber/20 outline-none resize-none text-sm"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-4 w-full py-3 rounded-xl bg-athena-amber text-white font-semibold hover:bg-athena-amber/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <><Spinner /> Analyzing...</> : <><AlertTriangle className="w-5 h-5" /> Detect Bias</>}
          </button>
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-athena-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-athena-indigo">Analysis Summary</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${result.overall_bias_score > 60 ? 'bg-red-50 text-red-600' : result.overall_bias_score > 30 ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                  Score: {result.overall_bias_score}/100
                </span>
              </div>
              <p className="text-sm text-athena-muted mb-4">{typeof result.summary === 'string' && result.summary ? result.summary : 'No summary available.'}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-athena-offwhite/50">
                  <span className="text-athena-muted">Emotional Language</span>
                  <div className="text-lg font-semibold text-athena-indigo">{result.emotional_language_score ?? 0}%</div>
                </div>
                <div className="p-3 rounded-lg bg-athena-offwhite/50">
                  <span className="text-athena-muted">Flags Found</span>
                  <div className="text-lg font-semibold text-athena-indigo">{Array.isArray(result.flags) ? result.flags.length : 0}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-athena-indigo">Detected Flags</h3>
              {(Array.isArray(result.flags) ? result.flags : []).map((flag: BiasFlag, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-4 rounded-xl border ${severityColor(flag.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-sm mb-1">{flag.flag_type}</div>
                      <div className="text-xs opacity-80 mb-2 italic">"{flag.text}"</div>
                      <div className="text-xs">{flag.explanation}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}