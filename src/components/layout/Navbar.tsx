'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Rocket, Menu, X } from 'lucide-react';
import { useTerminal } from '@/contexts/TerminalContext';
import { profile } from '@/data/profile';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#timeline', label: 'Journey' },
  { href: '#projects', label: 'Projects' },
  { href: '#opensource', label: 'Open Source' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#research', label: 'Research' },
  { href: '#notebook', label: 'Notebook' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const { openTerminal } = useTerminal();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Active section detection
      const sections = navLinks.map((l) => l.href.slice(1));
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

  // Only show section-scroll nav on homepage
  const isHub = pathname === '/';

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-hub-surface/90 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label={`${profile.shortName} — Home`}
          >
            <div className="w-8 h-8 rounded-lg bg-hub-green/10 border border-hub-green/30 flex items-center justify-center group-hover:bg-hub-green/20 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-hub-green" aria-hidden="true">
                <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <ellipse cx="12" cy="12" rx="9" ry="3" stroke="#D4AF37" strokeWidth="1.2" transform="rotate(-30 12 12)" strokeDasharray="3,2" />
                <circle cx="12" cy="12" r="2.5" fill="currentColor" />
              </svg>
            </div>
            <span
              className="font-space-grotesk font-semibold text-sm tracking-wide text-hub-text/90 group-hover:text-hub-green transition-colors"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              {profile.shortName !== '[INSERT NAME]' ? profile.shortName : 'SECURITY HUB'}
            </span>
          </Link>

          {/* Desktop nav links */}
          {isHub && (
            <div className="hidden lg:flex items-center gap-1" role="list">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.slice(1);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    role="listitem"
                    className={`relative px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-md ${
                      isActive
                        ? 'text-hub-green'
                        : 'text-hub-muted hover:text-hub-text'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 bg-hub-green/8 rounded-md border border-hub-green/20"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </a>
                );
              })}
            </div>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Mission Control link */}
            <Link
              href="/mission"
              id="nav-mission-btn"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm text-hub-muted hover:text-mission-amber border border-transparent hover:border-mission-gold/20 hover:bg-mission-gold/5 rounded-md transition-all duration-200"
              aria-label="Open Mission Control — press M"
              title="Mission Control (M)"
            >
              <Rocket size={14} aria-hidden="true" />
              <span className="hidden md:inline">Mission [M]</span>
            </Link>

            {/* Terminal button */}
            <button
              id="nav-terminal-btn"
              onClick={openTerminal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-hub-muted hover:text-hub-green border border-transparent hover:border-hub-green/20 hover:bg-hub-green/5 rounded-md transition-all duration-200"
              aria-label="Open terminal — press T"
              title="Terminal (T)"
            >
              <Terminal size={14} aria-hidden="true" />
              <span className="hidden md:inline">Terminal [T]</span>
            </button>

            {/* Mobile menu toggle */}
            {isHub && (
              <button
                className="lg:hidden p-2 text-hub-muted hover:text-hub-text transition-colors"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && isHub && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden bg-hub-surface/95 backdrop-blur-xl border-b border-white/5"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === link.href.slice(1)
                        ? 'text-hub-green bg-hub-green/8'
                        : 'text-hub-muted hover:text-hub-text hover:bg-white/4'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="border-t border-white/5 mt-2 pt-2 flex gap-2">
                  <Link
                    href="/mission"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-hub-muted hover:text-mission-amber rounded-lg transition-colors"
                  >
                    <Rocket size={14} />
                    Mission Control
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Keyboard hint */}
      <div className="fixed bottom-4 right-4 z-40 hidden lg:flex flex-col gap-1 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="text-xs text-hub-muted-2 font-jetbrains bg-hub-surface/80 px-2 py-1 rounded border border-white/5">
          <kbd className="text-hub-green">T</kbd> Terminal &nbsp;·&nbsp; <kbd className="text-hub-green">M</kbd> Mission
        </div>
      </div>
    </>
  );
}
