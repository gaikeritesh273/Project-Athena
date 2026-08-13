'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShieldCheck, Compass, Clock, Brain, ArrowRight, Play, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';

import AthenaLogo from '@/components/AthenaLogo';
const Scene3D = dynamic(() => import('@/components/Scene3D'), { ssr: false });

export default function Home() {

  const features = [
    {
      icon: ShieldCheck,
      title: 'INVESTIGATE',
      number: '01',
      desc: 'Generate Trust Passports — assess evidence, source credibility, context gaps, and emotional framing.',
      color: 'text-sky-400',
      borderColor: 'border-sky-500/20',
    },
    {
      icon: Compass,
      title: 'COMPARE',
      number: '02',
      desc: 'Explore how the same claim is framed across academic, fact-checking, international media, and social sources.',
      color: 'text-teal-400',
      borderColor: 'border-teal-500/20',
    },
    {
      icon: Clock,
      title: 'TRACE',
      number: '03',
      desc: 'Visualize how original claims mutate — from speculation to sensationalism to viral misinformation.',
      color: 'text-amber-400',
      borderColor: 'border-amber-500/20',
    },
    {
      icon: Brain,
      title: 'LEARN',
      number: '04',
      desc: 'Build transferable critical-thinking skills through AI-guided analysis and interactive challenges.',
      color: 'text-purple-400',
      borderColor: 'border-purple-500/20',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-main)]">
      <Scene3D />

      <div className="relative z-10 min-h-screen">

        {/* ── Hero Section ───────────────────────────────── */}
        <section className="min-h-[88vh] flex items-center justify-center px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8 flex flex-col items-center">
            <AthenaLogo size="lg" className="mb-2" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 flex flex-col items-center"
            >
              {/* UNESCO Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-cyan text-xs font-semibold uppercase tracking-wider shadow-lg shadow-sky-500/10">
                <Sparkles className="w-3.5 h-3.5" />
                UNESCO Youth Hackathon 2026
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-editorial leading-[1.1] text-slate-100">
                ATHENA
                <br />
                <span className="text-gradient-cyan text-4xl sm:text-5xl">AI-Powered Media Literacy</span>
              </h1>

              {/* Primary tagline — fixed, no literal quotes */}
              <p className="text-xl sm:text-2xl text-slate-200 font-semibold max-w-xl mx-auto text-editorial">
                Don&rsquo;t just know what to believe.
                <br />
                <span className="text-slate-400 font-normal">Learn how to evaluate.</span>
              </p>

              {/* Supporting mission line */}
              <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                AI-assisted media and information literacy for young digital citizens.
                Evidence, context, uncertainty — and your judgment.
              </p>

              {/* Primary Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Link
                  href="/investigate"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 group"
                >
                  Start an Investigation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/investigate?demo=true"
                  className="px-8 py-4 rounded-xl glass-card hover:bg-slate-900 text-amber-300 border-amber-500/30 hover:border-amber-500/60 text-sm font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                  Try the Demo
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Four Pillars Section ───────────────────────── */}
        <section className="py-24 px-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="max-w-6xl mx-auto space-y-14">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 text-editorial">
                Four Pillars of Media Literacy
              </h2>
              <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                Not a fact-checking tool. A media literacy platform that turns every information encounter into a learning opportunity.
              </p>
              {/* Pillar progression hint */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {features.map((f, i) => (
                  <React.Fragment key={f.title}>
                    <span className={`text-xs font-mono-code font-bold ${f.color}`}>
                      {f.number} {f.title}
                    </span>
                    {i < features.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-slate-700" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-6 rounded-2xl glass-card border ${feature.borderColor} hover:border-sky-500/30 transition-all space-y-4 group`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-3 rounded-xl bg-slate-900/80 w-fit ${feature.color} border border-slate-800 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-mono-code font-bold ${feature.color} opacity-60`}>
                      {feature.number}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 tracking-wide font-mono-code">{feature.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Philosophy Callout ─────────────────────────── */}
        <section className="py-20 px-4 border-t border-slate-800/80">
          <div className="max-w-3xl mx-auto text-center space-y-6 glass-card p-10 rounded-3xl border border-sky-500/20 bg-gradient-to-br from-slate-900 to-sky-950/30 flex flex-col items-center">
            <AthenaLogo size="lg" className="mb-2" />
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 text-editorial">
              We never tell you what to believe.
              <br />
              <span className="text-gradient-cyan">We teach you how to evaluate.</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              ATHENA is built on the principle that human judgment — informed by evidence, context, and honest uncertainty — is the foundation of media literacy.
            </p>
            <p className="text-[10px] text-slate-500">
              Prepared for UNESCO Youth Hackathon 2026: &ldquo;Play Your Part: Youth Designing the Future of Media and Information Literacy.&rdquo;
            </p>
            <Link
              href="/investigate?demo=true"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all shadow-md shadow-sky-500/20"
            >
              Start the 90-Second Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
