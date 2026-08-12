'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Menu, X, LogOut, User, Globe, Compass } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { lang, setLang, t } = useI18n();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch {
      router.replace('/login');
    }
  };

  const navLinks = [
    { href: '/investigate', label: t('navInvestigate') },
    { href: '/dashboard', label: t('navDashboard') },
    { href: '/claim-checker', label: t('navClaimChecker') },
    { href: '/bias-detector', label: t('navBiasDetector') },
    { href: '/source-scorer', label: t('navSourceScorer') },
    { href: '/trainer', label: t('navTrainer') },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 p-0.5 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-100 tracking-wide font-mono-code flex items-center gap-1.5">
                ATHENA
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-normal">
                  UNESCO 2026
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-semibold text-slate-300 hover:text-sky-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions: Language Switcher & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  lang === 'en' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  lang === 'hi' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-slate-300 font-medium flex items-center gap-1 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                  <User className="w-3.5 h-3.5 text-sky-400" />
                  {user.full_name || user.email?.split('@')[0]}
                </span>
                <button
                  onClick={() => void handleSignOut()}
                  className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-xs font-semibold text-slate-300 hover:text-slate-100 px-3 py-1.5">
                  Sign In
                </Link>
                <Link
                  href="/investigate"
                  className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-sky-500/20"
                >
                  Investigate Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-slate-300"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs text-slate-400">Language:</span>
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
                <button onClick={() => setLang('en')} className={`px-2 py-0.5 rounded ${lang === 'en' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400'}`}>EN</button>
                <button onClick={() => setLang('hi')} className={`px-2 py-0.5 rounded ${lang === 'hi' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400'}`}>हिन्दी</button>
              </div>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-semibold text-slate-300 hover:text-sky-400"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <button
                onClick={() => { void handleSignOut(); setMobileOpen(false); }}
                className="flex items-center gap-2 text-xs font-semibold text-rose-400 pt-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="text-xs font-semibold text-slate-300">Sign In</Link>
                <Link href="/investigate" onClick={() => setMobileOpen(false)} className="text-xs font-bold text-sky-400">Investigate Now</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}