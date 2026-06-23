'use client';

import { motion } from 'framer-motion';
import { BookOpen, Clock, Tag } from 'lucide-react';
import { notebookEntries } from '@/data/notebook';

const categoryColors: Record<string, string> = {
  security: 'text-hub-green bg-hub-green/10 border-hub-green/20',
  cloud: 'text-hub-blue bg-hub-blue/10 border-hub-blue/20',
  ai: 'text-hub-blue bg-hub-blue/10 border-hub-blue/20',
  devops: 'text-hub-muted bg-white/5 border-white/10',
  research: 'text-hub-green bg-hub-green/10 border-hub-green/20',
  opensource: 'text-hub-blue bg-hub-blue/10 border-hub-blue/20',
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function Notebook() {
  return (
    <section
      id="notebook"
      className="section-padding relative z-10"
      aria-label="Research Notebook"
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
              08 / Notebook
            </span>
            <div className="flex-1 h-px bg-white/6 max-w-[80px]" />
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-hub-text"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Research Notebook
          </h2>
          <p className="text-hub-muted mt-3 max-w-2xl leading-relaxed">
            Engineering logs and research entries documenting what I am learning, building, and thinking about.
          </p>
        </motion.div>

        {/* Entries */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {notebookEntries.map((entry) => {
            const catColor = categoryColors[entry.category] || 'text-hub-muted bg-white/5 border-white/10';
            return (
              <motion.article
                key={entry.id}
                variants={cardVariants}
                className="glass-card rounded-xl p-6 flex flex-col hover:border-white/10 hover:-translate-y-0.5 transition-all duration-300 group"
                id={`notebook-${entry.id}`}
              >
                {/* Log ID badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-xs font-bold text-hub-green tracking-widest font-jetbrains"
                    style={{ fontFamily: 'var(--font-jetbrains)' }}
                  >
                    {entry.logId}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-hub-muted-2 font-jetbrains" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                    <Clock size={11} aria-hidden="true" />
                    {entry.readTime}
                  </div>
                </div>

                {/* Icon */}
                <div className="w-8 h-8 rounded-lg bg-hub-green/8 border border-hub-green/20 flex items-center justify-center mb-4">
                  <BookOpen size={15} className="text-hub-green" aria-hidden="true" />
                </div>

                <h3
                  className="font-semibold text-hub-text text-sm leading-snug mb-3 group-hover:text-hub-green transition-colors"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {entry.title}
                </h3>

                <p className="text-hub-muted text-xs leading-relaxed flex-1 mb-4">
                  {entry.summary}
                </p>

                {/* Footer */}
                <div className="flex flex-col gap-2 pt-3 border-t border-white/5">
                  <span className="text-hub-muted-2 text-xs font-jetbrains" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                    {entry.date}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-1.5 py-0.5 rounded border ${catColor}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Coming soon note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-hub-muted-2 text-xs font-jetbrains mt-8"
          style={{ fontFamily: 'var(--font-jetbrains)' }}
        >
          More entries coming soon
        </motion.p>
      </div>
    </section>
  );
}
