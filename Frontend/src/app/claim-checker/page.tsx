'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Link, FileText, CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';

interface ClaimResult {
  claim_text: string;
  status: string;
  confidence: string;
  reasoning: string;
  sources: Array<{ name: string; url: string; date: string; relevance: number }>;
}

export default function ClaimChecker() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ClaimResult[] | null>(null);

  const handleAnalyze = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      toast.error('Please enter text or a URL');
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/claims/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmedInput }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      const normalizedClaims = Array.isArray(data?.claims)
        ? data.claims
        : Array.isArray(data)
          ? data
          : data?.claim
            ? [data.claim]
            : null;

      if (normalizedClaims && normalizedClaims.length > 0) {
        setResults(normalizedClaims as ClaimResult[]);
      } else {
        throw new Error(data?.detail || 'Analysis failed');
      }
    } catch (err) {
      console.error('Claim check failed', err);
      toast.error('Using demo mode while the service is unavailable.');
      setResults([
        {
          claim_text: trimmedInput.slice(0, 100),
          status: 'unverified',
          confidence: 'Insufficient verified evidence',
          reasoning: 'No live sources found. This is a demo fallback. In production, ATHENA queries NewsAPI and cached RSS feeds.',
          sources: [{ name: 'Demo Mode', url: '', date: '', relevance: 0 }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig: Record<string, { icon: any; badgeClass: string }> = {
    corroborated: { icon: CheckCircle, badgeClass: 'badge-green' },
    contradicted: { icon: XCircle, badgeClass: 'badge-red' },
    unverified: { icon: AlertCircle, badgeClass: 'badge-gold' },
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-main)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-100 text-editorial mb-2">Claim Checker</h1>
          <p className="text-slate-400">Paste text or a URL. ATHENA cross-references credible sources — no binary verdicts.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste a claim, headline, or article text here..."
              className="w-full h-40 p-4 pr-14 rounded-xl glass-card bg-slate-900/80 border border-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none resize-none text-sm text-slate-100 placeholder-slate-500"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400" title="Paste URL">
                <Link className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400" title="Upload file">
                <FileText className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-4 w-full py-3 rounded-xl bg-teal-500 text-slate-950 font-bold hover:bg-teal-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-teal-500/10"
          >
            {loading ? <><Spinner /> Analyzing...</> : <><Search className="w-5 h-5" /> Investigate Claim</>}
          </button>
        </motion.div>

        <AnimatePresence>
          {results && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
              {results.map((claim, i) => {
                const normalizedClaim = {
                  claim_text: claim?.claim_text || 'Claim unavailable',
                  status: claim?.status || 'unverified',
                  confidence: claim?.confidence || 'No confidence score provided',
                  reasoning: claim?.reasoning || 'No explanation provided.',
                  sources: Array.isArray(claim?.sources) ? claim.sources : [],
                };
                const config = statusConfig[normalizedClaim.status] || statusConfig.unverified;
                const StatusIcon = config.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-2xl glass-card border border-slate-800 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-3 rounded-xl ${config.badgeClass}`}>
                          <StatusIcon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-100 mb-1">{normalizedClaim.claim_text}</h3>
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${config.badgeClass}`}>
                            {normalizedClaim.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                        <p className="text-sm text-slate-200 mb-2"><strong>Confidence:</strong> {normalizedClaim.confidence}</p>
                        <p className="text-sm text-slate-400">{normalizedClaim.reasoning}</p>
                      </div>

                      {normalizedClaim.sources.length > 0 && normalizedClaim.sources[0].name !== 'No live sources found' && (
                        <div>
                          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Sources Consulted</h4>
                          <div className="space-y-2">
                            {normalizedClaim.sources.map((source, j) => (
                              <div key={j} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-sm">
                                <div>
                                  <span className="font-medium text-slate-200">{source.name}</span>
                                  {source.date && <span className="text-slate-400 ml-2 font-mono-code text-xs">{source.date}</span>}
                                </div>
                                {source.url && (
                                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline flex items-center gap-1 text-xs">
                                    View <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}