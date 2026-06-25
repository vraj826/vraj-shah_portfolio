'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, ArrowLeft, Terminal, Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import { useTerminal } from '@/contexts/TerminalContext';
import StarField from '@/components/background/StarField';
import { profile } from '@/data/profile';

const missionNavLinks = [
  { href: '#mission-brief', label: 'Mission Brief' },
  { href: '#telemetry-tracking', label: 'Telemetry & Tracking' },
  { href: '#open-science', label: 'Open Science' },
  { href: '#research-logs', label: 'Research Logs' },
  { href: '#space-notes', label: 'Space Notes' },
  { href: '#future-aspirations', label: 'Future Aspirations' },
];

const tickerWords = ['Exploring...', 'Orbiting...', 'Scanning...', 'Transmitting...'];

export default function MissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { openTerminal } = useTerminal();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
  const [mounted, setMounted] = useState(false);
  const year = new Date().getFullYear();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Q key → back to security hub
  useEffect(() => {
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

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = missionNavLinks.map((l) => l.href.slice(1));
      let current = '';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) current = id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ticker animation
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState('out');
      setTimeout(() => {
        setTickerIndex((prev) => (prev + 1) % tickerWords.length);
        setFadeState('in');
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-mission-bg text-mission-text relative overflow-x-hidden font-inter selection:bg-mission-gold/30">
      {/* Star Field canvas */}
      <StarField />

      {/* Grid Overlay for technical space look */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(212,175,55,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.015)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,8,22,0.85)_100%)] pointer-events-none z-0" />

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? 'bg-mission-surface/90 backdrop-blur-xl border-b border-mission-border shadow-lg shadow-black/20'
            : 'bg-transparent'
          }`}
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
          aria-label="Mission control navigation"
        >
          {/* Logo / Brand */}
          <Link
            href="/mission"
            className="flex items-center gap-2 group"
            aria-label="mission-control home"
          >
            <div className="w-8 h-8 rounded-lg bg-mission-gold/10 border border-mission-gold/30 flex items-center justify-center group-hover:bg-mission-gold/20 transition-colors">
              <Rocket size={16} className="text-mission-gold group-hover:scale-110 transition-transform" />
            </div>
            <span
              className="font-space-grotesk font-semibold text-sm tracking-wide text-mission-gold/90 group-hover:text-mission-gold transition-colors"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              mission-control
            </span>
          </Link>

          {/* Desktop section nav links */}
          <div className="hidden lg:flex items-center gap-0.5" role="list">
            {missionNavLinks.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  role="listitem"
                  className={`relative px-2.5 py-1 text-[11px] font-medium tracking-wide transition-all duration-200 rounded-md ${isActive
                      ? 'text-mission-gold'
                      : 'text-mission-muted hover:text-mission-text'
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="mission-nav-active"
                      className="absolute inset-0 bg-mission-gold/8 rounded-md border border-mission-gold/20"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Security Hub back link */}
            <Link
              href="/"
              id="mission-nav-hub-btn"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase text-mission-amber/70 hover:text-mission-amber border border-mission-gold/20 hover:border-mission-gold/50 hover:bg-mission-gold/8 rounded-full transition-all duration-200 hover:shadow-[0_0_8px_rgba(212,175,55,0.15)]"
              aria-label="Return to Security Hub — press Q"
              title="Security Hub (Q)"
            >
              <ArrowLeft size={12} aria-hidden="true" />
              <span className="hidden md:inline">Security Hub</span>
              <span className="hidden md:inline text-mission-amber/40 font-mono text-[10px]">Q</span>
            </Link>

            {/* Terminal button */}
            <button
              id="mission-nav-terminal-btn"
              onClick={openTerminal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase text-mission-gold/70 hover:text-mission-gold border border-mission-gold/20 hover:border-mission-gold/50 hover:bg-mission-gold/8 rounded-full transition-all duration-200 hover:shadow-[0_0_8px_rgba(212,175,55,0.15)]"
              aria-label="Open terminal — press T"
              title="Terminal (T)"
            >
              <Terminal size={12} aria-hidden="true" />
              <span className="hidden md:inline">Terminal</span>
              <span className="hidden md:inline text-mission-amber/40 font-mono text-[10px]">[T]</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 text-mission-muted hover:text-mission-text transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden bg-mission-surface/95 backdrop-blur-xl border-b border-mission-border"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {missionNavLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === link.href.slice(1)
                        ? 'text-mission-gold bg-mission-gold/8'
                        : 'text-mission-muted hover:text-mission-text hover:bg-mission-gold/4'
                      }`}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="border-t border-mission-border mt-2 pt-2 flex gap-2">
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-mission-muted hover:text-mission-amber rounded-lg transition-colors"
                  >
                    <ArrowLeft size={14} />
                    Security Hub
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ── CONTENT WRAPPER ────────────────────────────────────────────── */}
      <div className="relative z-10 pt-16 min-h-screen flex flex-col">
        <main className="flex-1 w-full">
          {children}
        </main>

        {/* ── FOOTER ─────────────────────────────────────────────────────── */}
        <footer className="border-t border-mission-border bg-mission-surface/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-mission-gold/10 border border-mission-gold/30 flex items-center justify-center">
                    <Rocket size={14} className="text-mission-gold" />
                  </div>
                  <span
                    className="font-semibold text-sm text-mission-text/85"
                    style={{ fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    mission-control by Vrajkumar Shah
                  </span>
                </div>

                {/* Animated ticker */}
                <div className="h-6 flex items-center font-jetbrains text-xs mt-1">
                  <span
                    className={`transition-opacity duration-500 text-mission-gold font-semibold tracking-wider ${fadeState === 'in' ? 'opacity-100' : 'opacity-0'
                      }`}
                  >
                    {tickerWords[tickerIndex]}
                  </span>
                  <span className="terminal-cursor w-1.5 h-3 ml-1" style={{ backgroundColor: 'var(--mission-gold)' }} />
                </div>
                <p className="text-mission-muted text-xs mt-1">
                  © {year} {profile.name}. All rights reserved.
                </p>
              </div>

              {/* Connect */}
              <div className="md:text-right flex flex-col md:items-end gap-3">
                <h3
                  className="text-xs font-semibold text-mission-gold/80 uppercase tracking-widest"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  Connect
                </h3>
                <div className="flex gap-3">
                  <a
                    href={profile.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg border border-mission-border flex items-center justify-center text-mission-muted hover:text-mission-amber hover:border-mission-gold/30 hover:bg-mission-gold/5 transition-all duration-200"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={16} />
                  </a>
                  <a
                    href={profile.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg border border-mission-border flex items-center justify-center text-mission-muted hover:text-mission-text hover:border-mission-gold/20 hover:bg-mission-gold/5 transition-all duration-200"
                    aria-label="GitHub"
                  >
                    <Github size={16} />
                  </a>
                  <a
                    href={`mailto:${profile.socials.email}`}
                    className="w-9 h-9 rounded-lg border border-mission-border flex items-center justify-center text-mission-muted hover:text-mission-gold hover:border-mission-gold/30 hover:bg-mission-gold/5 transition-all duration-200"
                    aria-label="Email"
                  >
                    <Mail size={16} />
                  </a>
                </div>
              </div>
            </div>

            {/* Mission complete tagline */}
            <div className="border-t border-mission-border pt-4 text-center">
              <p className="text-mission-muted/50 text-xs font-jetbrains tracking-widest">
                · Mission complete. Return to base.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Keyboard hint */}
      <div className="fixed bottom-4 right-4 z-40 hidden lg:flex flex-col gap-1 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="text-xs text-mission-muted font-jetbrains bg-mission-surface/80 px-2 py-1 rounded border border-mission-border">
          <kbd className="text-mission-gold">T</kbd> Terminal &nbsp;·&nbsp; <kbd className="text-mission-gold">Q</kbd> Exit
        </div>
      </div>
    </div>
  );
}
