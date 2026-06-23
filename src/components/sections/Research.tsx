'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Brain, Telescope, ArrowRight, ChevronRight, ExternalLink } from 'lucide-react';
import { researchAreas } from '@/data/research';

const categoryConfig = {
  security: {
    icon: Shield,
    accentClass: 'text-hub-green',
    borderClass: 'border-hub-green/20',
    bgClass: 'bg-hub-green/8',
    glowClass: 'hover:shadow-hub-green/10',
  },
  'ai-security': {
    icon: Brain,
    accentClass: 'text-hub-blue',
    borderClass: 'border-hub-blue/20',
    bgClass: 'bg-hub-blue/8',
    glowClass: 'hover:shadow-hub-blue/10',
  },
  space: {
    icon: Telescope,
    accentClass: 'text-mission-gold',
    borderClass: 'border-mission-gold/20',
    bgClass: 'bg-mission-gold/8',
    glowClass: 'hover:shadow-mission-gold/10',
  },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

export default function Research() {
  return (
    <section
      id="research"
      className="section-padding relative z-10"
      aria-label="Research section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-semibold text-hub-green/70 tracking-widest uppercase font-jetbrains" style={{ fontFamily: 'var(--font-jetbrains)' }}>
              07 / Research
            </span>
            <div className="flex-1 h-px bg-white/6 max-w-[80px]" />
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-hub-text"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Research Interests
          </h2>
          <p className="text-hub-muted mt-3 max-w-2xl leading-relaxed">
            Areas I actively read about, experiment with, and aspire to contribute to through research and engineering.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-5"
        >
          {researchAreas.map((area) => {
            const cfg = categoryConfig[area.category];
            const Icon = cfg.icon;
            const isSpace = area.category === 'space';

            return (
              <motion.article
                key={area.id}
                variants={cardVariants}
                className={`glass-card rounded-xl p-6 flex flex-col hover:border-white/10 hover:shadow-lg transition-all duration-300 ${cfg.glowClass} ${isSpace ? 'relative overflow-hidden' : ''}`}
                id={`research-${area.id}`}
              >
                {/* Space card ambient glow */}
                {isSpace && (
                  <div className="absolute inset-0 bg-gradient-to-br from-mission-gold/5 to-transparent pointer-events-none" aria-hidden="true" />
                )}

                <div className="relative">
                  <div className={`w-10 h-10 rounded-xl ${cfg.bgClass} border ${cfg.borderClass} flex items-center justify-center mb-4`}>
                    <Icon size={18} className={cfg.accentClass} aria-hidden="true" />
                  </div>

                  <h3
                    className="font-semibold text-hub-text mb-2"
                    style={{ fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    {area.title}
                  </h3>
                  <p className="text-hub-muted text-sm leading-relaxed mb-5">
                    {area.description}
                  </p>

                  {/* Interests */}
                  <div className="mb-4">
                    <p className="text-xs text-hub-muted-2 uppercase tracking-widest mb-2 font-jetbrains" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                      Current Interests
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {area.interests.slice(0, 4).map((interest, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-hub-muted">
                          <ChevronRight size={10} className={cfg.accentClass} aria-hidden="true" />
                          {interest}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Previous Work */}
                  <div className="mb-5 flex-1">
                    <p className="text-xs text-hub-muted-2 uppercase tracking-widest mb-2 font-jetbrains" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                      Previous Work
                    </p>
                    <ul className="flex flex-col gap-2">
                      {area.previousWork.map((paper, i) => (
                        <li key={i}>
                          <a
                            href={paper.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link flex items-start gap-1 text-xs text-hub-muted hover:text-hub-text transition-colors leading-relaxed"
                          >
                            <span className={`${cfg.accentClass} shrink-0 mt-0.5`}>•</span>
                            <span className="underline decoration-white/10 group-hover/link:decoration-current transition-colors">
                              {paper.title}
                            </span>
                            <ExternalLink size={10} className="shrink-0 mt-1 opacity-60 group-hover/link:opacity-100 transition-opacity" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Space card CTA */}
                  {isSpace && (
                    <Link
                      href="/mission"
                      id="research-mission-cta"
                      className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-mission-gold/30 bg-mission-gold/8 text-mission-gold text-sm font-medium hover:bg-mission-gold/15 transition-all duration-200"
                      style={{ fontFamily: 'var(--font-space-grotesk)' }}
                    >
                      Enter Mission Control
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
