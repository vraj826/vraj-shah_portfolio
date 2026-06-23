'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Rocket, ArrowLeft, Terminal } from 'lucide-react';
import { useTerminal } from '@/contexts/TerminalContext';
import StarField from '@/components/background/StarField';

export default function MissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { openTerminal } = useTerminal();
  const router = useRouter();
  const pathname = usePathname();

  // Escape key returning to "/" is handled at the page level or keyboard shortcuts hook,
  // but let's make sure we also support keypress 'Q' to go back.
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if (e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        router.push('/');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return (
    <div className="min-h-screen bg-mission-bg text-mission-text relative overflow-x-hidden font-inter selection:bg-mission-gold/30">
      {/* Star Field canvas */}
      <StarField />

      {/* Grid Overlay for technical space look */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(212,175,55,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.015)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,8,22,0.85)_100%)] pointer-events-none z-0" />

      {/* Header / Mission Control Panel Nav */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-mission-surface/85 backdrop-blur-md border-b border-mission-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group" aria-label="Return to Security Hub">
              <div className="w-8 h-8 rounded-lg bg-mission-gold/10 border border-mission-gold/30 flex items-center justify-center group-hover:bg-mission-gold/20 transition-all">
                <ArrowLeft size={16} className="text-mission-gold group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <span className="font-space-grotesk font-semibold text-xs tracking-wider text-mission-gold uppercase group-hover:text-mission-amber transition-colors hidden sm:inline">
                Exit telemetry
              </span>
            </Link>

            <div className="h-6 w-px bg-mission-border hidden sm:block" />

            <div className="flex items-center gap-2">
              <Rocket className="text-mission-gold animate-pulse" size={18} />
              <span className="font-space-grotesk text-sm font-bold tracking-wider uppercase text-mission-text">
                Mission Control Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Terminal activator */}
            <button
              onClick={openTerminal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-mission-gold hover:text-mission-amber border border-mission-border hover:bg-mission-gold/5 rounded transition-all duration-200"
              title="Activate shell (T)"
            >
              <Terminal size={14} />
              <span className="hidden md:inline">Command Line (T)</span>
            </button>
            <div className="text-[10px] text-mission-gold/60 font-jetbrains hidden lg:block">
              SYS STATUS: ACTIVE [Q to Exit]
            </div>
          </div>
        </div>
      </header>

      {/* Content wrapper */}
      <div className="relative z-10 pt-16 min-h-screen flex flex-col">
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Space style footer */}
        <footer className="border-t border-mission-border bg-mission-surface/60 py-6 text-center text-xs text-mission-muted">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} Vrajkumar Shah. Aerospace & Spacecraft Avionics telemetry stream.</p>
            <p className="font-jetbrains text-[10px] tracking-wide text-mission-gold/40">
              ORBITAL STATE: COMM_OK // TELEMETRY_STABLE
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
