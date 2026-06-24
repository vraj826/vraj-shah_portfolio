'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Shield, Cloud, Code2, Brain, Globe } from 'lucide-react';
import { certifications, certificationCategories } from '@/data/certifications';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

export default function Certifications() {
  const [activeTab, setActiveTab] = useState('all');

  const certIconMap: Record<string, any> = {
    cybersecurity: Shield,
    cloud: Cloud,
    opensource: Code2,
    ai: Brain,
    space: Globe,
  };

  const filtered =
    activeTab === 'all'
      ? certifications
      : certifications.filter((c) => c.category === activeTab);

  return (
    <section
      id="certifications"
      className="section-padding relative z-10"
      aria-label="Certifications Command Center"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-semibold text-hub-green/70 tracking-widest uppercase font-jetbrains" style={{ fontFamily: 'var(--font-jetbrains)' }}>
              06 / Certifications
            </span>
            <div className="flex-1 h-px bg-white/6 max-w-[80px]" />
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-hub-text"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Certifications Command Center
          </h2>
          <p className="text-hub-muted mt-3 max-w-2xl leading-relaxed">
            Formal credentials and learning achievements across cybersecurity, cloud, open source, AI, and space science.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Filter certifications by category">
          <button
            role="tab"
            aria-selected={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
            id="cert-tab-all"
            className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
              activeTab === 'all'
                ? 'border-hub-green/40 bg-hub-green/10 text-hub-green'
                : 'border-white/8 text-hub-muted hover:text-hub-text hover:border-white/15'
            }`}
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            All
          </button>
          {certificationCategories.map((cat) => {
            const Icon = certIconMap[cat.id] || Award;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeTab === cat.id}
                onClick={() => setActiveTab(cat.id)}
                id={`cert-tab-${cat.id}`}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                  activeTab === cat.id
                    ? 'border-hub-green/40 bg-hub-green/10 text-hub-green'
                    : 'border-white/8 text-hub-muted hover:text-hub-text hover:border-white/15'
                }`}
                style={{ fontFamily: 'var(--font-jetbrains)' }}
              >
                <Icon size={14} className="inline-block mr-1" aria-hidden="true" /> {cat.label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((cert) => (
            <motion.article
              key={cert.id}
              variants={cardVariants}
              className="glass-card rounded-xl p-5 flex flex-col hover:border-white/10 transition-all duration-300 group"
              id={`cert-${cert.id}`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-hub-green/8 border border-hub-green/20 flex items-center justify-center shrink-0">
                  <Award size={16} className="text-hub-green" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3
                    className="font-semibold text-hub-text text-sm leading-snug group-hover:text-hub-green transition-colors"
                    style={{ fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    {cert.name}
                  </h3>
                  <p className="text-hub-muted text-xs mt-0.5">{cert.issuer}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-hub-muted-2 font-jetbrains" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                    {cert.date}
                  </span>
                  {cert.credentialId && (
                    <span className="text-xs text-hub-muted-2 font-jetbrains truncate max-w-[80px]" title={cert.credentialId} style={{ fontFamily: 'var(--font-jetbrains)' }}>
                      · {cert.credentialId}
                    </span>
                  )}
                </div>
                <a
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-hub-muted hover:text-hub-green transition-colors"
                  aria-label={`Verify ${cert.name} certification`}
                >
                  <ExternalLink size={12} />
                  Verify
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
