'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Download, ExternalLink } from 'lucide-react';
import { profile } from '@/data/profile';

const statusItems = [
  { label: 'Academic Progress', status: 'ONLINE', color: 'text-hub-green' },
  { label: 'Open Source', status: 'ACTIVE', color: 'text-hub-green' },
  { label: 'Cybersecurity', status: 'LEARNING', color: 'text-hub-blue' },
  { label: 'Research', status: 'ACTIVE', color: 'text-hub-green' },
  { label: 'Mission Control', status: 'STANDBY', color: 'text-hub-muted' },
];

export default function Hero() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTaglineIndex((i) => (i + 1) % profile.taglines.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center pt-16"
      aria-label="Hero section"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-4rem)] py-20">

          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col gap-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 w-fit"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hub-green opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-hub-green" />
              </span>
              <span className="text-xs text-hub-green font-jetbrains tracking-widest uppercase" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                Security Hub · Active
              </span>
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-hub-text leading-tight tracking-tight"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                {profile.name !== '[INSERT FULL NAME]' ? (
                  profile.name
                ) : (
                  <>
                    <span className="text-hub-muted">[</span>
                    INSERT NAME
                    <span className="text-hub-muted">]</span>
                  </>
                )}
              </h1>
              <p className="text-hub-muted text-lg mt-2" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                {profile.title}
              </p>
            </motion.div>

            {/* Rotating tagline */}
            <div className="h-8 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={taglineIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="text-hub-green font-medium text-lg"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {profile.taglines[taglineIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Short summary */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-hub-muted leading-relaxed max-w-lg text-base"
            >
              {profile.summary}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <a
                href="#projects"
                id="hero-explore-btn"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-hub-green text-hub-bg font-semibold text-sm rounded-lg hover:bg-hub-green/90 hover:shadow-lg hover:shadow-hub-green/20 transition-all duration-200 active:scale-95"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                <ExternalLink size={16} aria-hidden="true" />
                Explore My Work
              </a>
              <a
                href={profile.resumeUrl}
                id="hero-resume-btn"
                download
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/12 text-hub-text font-medium text-sm rounded-lg hover:border-hub-green/30 hover:bg-hub-green/5 hover:text-hub-green transition-all duration-200 active:scale-95"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                <Download size={16} aria-hidden="true" />
                Download Resume
              </a>
            </motion.div>
          </motion.div>

          {/* Right column — Live Status Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="glass-card rounded-2xl p-6 w-full max-w-sm glow-green">
              {/* Panel header */}
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-hub-green status-dot-active" />
                  <span
                    className="text-xs font-semibold text-hub-green tracking-widest uppercase"
                    style={{ fontFamily: 'var(--font-jetbrains)' }}
                  >
                    SYSTEM STATUS
                  </span>
                </div>
                {mounted && (
                  <span className="text-xs text-hub-muted-2 font-jetbrains" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                    {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>

              {/* Status items */}
              <ul className="space-y-3.5" role="list">
                {statusItems.map((item, i) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-hub-muted">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`relative flex h-1.5 w-1.5`}
                      >
                        {item.status !== 'STANDBY' && (
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-50 ${item.status === 'ONLINE' || item.status === 'ACTIVE' ? 'bg-hub-green' : 'bg-hub-blue'}`} />
                        )}
                        <span
                          className={`relative inline-flex rounded-full h-1.5 w-1.5 ${item.status === 'STANDBY' ? 'bg-hub-muted-2' : item.status === 'ONLINE' || item.status === 'ACTIVE' ? 'bg-hub-green' : 'bg-hub-blue'
                            }`}
                        />
                      </span>
                      <span
                        className={`text-xs font-semibold tracking-widest font-jetbrains ${item.color}`}
                        style={{ fontFamily: 'var(--font-jetbrains)' }}
                      >
                        {item.status}
                      </span>
                    </div>
                  </motion.li>
                ))}
              </ul>

              {/* Divider */}
              <div className="border-t border-white/6 mt-5 pt-4">
                <div className="flex items-center justify-between text-xs text-hub-muted-2 font-jetbrains" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                  <span>{profile.university !== '[INSERT UNIVERSITY NAME]' ? profile.university : '[INSERT UNIVERSITY]'}</span>
                  <span className="text-hub-green/60">{profile.graduationYear !== '[INSERT EXPECTED GRADUATION YEAR]' ? profile.graduationYear : 'Expected [YEAR]'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
