'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShieldCheck, Compass, Clock, Brain, ArrowRight, Play, Sparkles, CheckCircle, Globe2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useI18n } from '@/lib/i18n';

const Scene3D = dynamic(() => import('@/components/Scene3D'), { ssr: false });

export default function Home() {
  const { t } = useI18n();

  const features = [
    {
      icon: ShieldCheck,
      title: 'INVESTIGATE',
      desc: 'Generate Trust Passports with multi-source evidence, context evaluation, and explicit uncertainty indicators.',
      color: 'text-sky-400',
      borderColor: 'border-sky-500/20',
    },
    {
      icon: Compass,
      title: 'COMPARE',
      desc: 'Explore perspectives across academic, fact-checking, international media, and local community sources.',
      color: 'text-teal-400',
      borderColor: 'border-teal-500/20',
    },
    {
      icon: Clock,
      title: 'TRACE',
      desc: 'Visualize narrative evolution over time to see how original claims mutate into viral misinformation.',
      color: 'text-amber-400',
      borderColor: 'border-amber-500/20',
    },
    {
      icon: Brain,
      title: 'LEARN',
      desc: 'Engage with AI Media Literacy Tutors and interactive challenges that build lifelong critical thinking skills.',
      color: 'text-purple-400',
      borderColor: 'border-purple-500/20',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-[#0B0F19] text-[#F8FAFC]">
      <Scene3D />

      <div className="relative z-10 min-h-screen">
        {/* Hero Section */}
        <section className="min-h-[85vh] flex items-center justify-center px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              {/* UNESCO Hackathon Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-cyan text-xs font-semibold uppercase tracking-wider shadow-lg shadow-sky-500/10">
                <Sparkles className="w-3.5 h-3.5" />
                {t('unescoBadge')}
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-editorial leading-[1.1] text-slate-100">
                ATHENA
                <br />
                <span className="text-gradient-cyan">AI-Powered Media Literacy Platform</span>
              </h1>

              {/* Tagline */}
              <p className="text-lg sm:text-2xl text-slate-300 font-medium max-w-2xl mx-auto text-editorial italic">
                "{t('tagline')}"
              </p>

              {/* Mission text */}
              <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
                ATHENA empowers young people to investigate digital information, trace narrative evolution, understand multiple perspectives, and develop critical-thinking skills.
              </p>

              {/* Primary Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href="/investigate"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 group"
                >
                  {t('investigateCTA')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/investigate?demo=true"
                  className="px-8 py-4 rounded-xl glass-card hover:bg-slate-900 text-amber-300 border-amber-500/30 hover:border-amber-500/60 text-sm font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {t('tryDemoCTA')}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Four Pillars Section */}
        <section className="py-24 px-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="max-w-6xl mx-auto space-y-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center space-y-3"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 text-editorial">
                {t('howItWorks')}
              </h2>
              <p className="text-sm text-slate-400 max-w-xl mx-auto">
                Designed around educational impact, epistemological transparency, and ethical AI.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-6 rounded-2xl glass-card border ${feature.borderColor} hover:border-sky-500/40 transition-all space-y-4 group`}
                >
                  <div className={`p-3 rounded-xl bg-slate-900/80 w-fit ${feature.color} border border-slate-800 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-100 tracking-wide font-mono-code">{feature.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pitch Philosophy Footer Callout */}
        <section className="py-20 px-4 border-t border-slate-800/80">
          <div className="max-w-3xl mx-auto text-center space-y-6 glass-card p-10 rounded-3xl border border-sky-500/20 bg-gradient-to-br from-slate-900 to-sky-950/30">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 text-editorial">
              "We never tell you what to believe. We teach you how to evaluate."
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prepared for UNESCO Youth Hackathon 2026: "Play Your Part: Youth Designing the Future of Media and Information Literacy."
            </p>
            <Link
              href="/investigate?demo=true"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-sky-500/20"
            >
              Start 60–90 Second Pitch Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}