'use client';

import { motion } from 'framer-motion';
import { BookOpen, Target, Compass } from 'lucide-react';
import { profile } from '@/data/profile';

const cards = [
  {
    id: 'journey',
    icon: BookOpen,
    title: 'My Journey',
    content: profile.journey,
    accentColor: 'text-hub-green',
    borderColor: 'border-hub-green/20',
    bgColor: 'bg-hub-green/5',
  },
  {
    id: 'current-focus',
    icon: Target,
    title: 'Current Focus',
    content: profile.currentFocus,
    accentColor: 'text-hub-blue',
    borderColor: 'border-hub-blue/20',
    bgColor: 'bg-hub-blue/5',
  },
  {
    id: 'career-goals',
    icon: Compass,
    title: 'Career Goals',
    content: profile.careerGoals,
    accentColor: 'text-hub-green',
    borderColor: 'border-hub-green/20',
    bgColor: 'bg-hub-green/5',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

export default function About() {
  return (
    <section
      id="about"
      className="section-padding relative z-10"
      aria-label="About section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-semibold text-hub-green/70 tracking-widest uppercase font-jetbrains" style={{ fontFamily: 'var(--font-jetbrains)' }}>
              01 / About
            </span>
            <div className="flex-1 h-px bg-white/6 max-w-[80px]" />
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-hub-text"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Who I Am
          </h2>
          <p className="text-hub-muted mt-3 max-w-2xl leading-relaxed">
            {profile.summary}
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.id}
                variants={cardVariants}
                className={`glass-card rounded-xl p-6 hover:border-white/10 transition-all duration-300 group`}
                id={`about-${card.id}`}
              >
                <div className={`w-10 h-10 rounded-lg ${card.bgColor} border ${card.borderColor} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                  <Icon size={18} className={card.accentColor} aria-hidden="true" />
                </div>
                <h3
                  className="font-semibold text-hub-text mb-3"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {card.title}
                </h3>
                <p className="text-hub-muted text-sm leading-relaxed">
                  {card.content}
                </p>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Location / University chip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          {[
            profile.university,
            profile.degree,
            profile.location,
          ].map((item, i) => (
            <span
              key={i}
              className="text-xs text-hub-muted border border-white/8 rounded-full px-3 py-1 font-jetbrains"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
