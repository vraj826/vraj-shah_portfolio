'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Code2, Briefcase, FlaskConical, Award, Calendar, ExternalLink } from 'lucide-react';
import { timeline, type TimelineItem } from '@/data/research';

const typeConfig: Record<TimelineItem['type'], { icon: typeof GraduationCap; color: string; bg: string; border: string }> = {
  education: { icon: GraduationCap, color: 'text-hub-green', bg: 'bg-hub-green/10', border: 'border-hub-green/30' },
  opensource: { icon: Code2, color: 'text-hub-blue', bg: 'bg-hub-blue/10', border: 'border-hub-blue/30' },
  internship: { icon: Briefcase, color: 'text-hub-green', bg: 'bg-hub-green/10', border: 'border-hub-green/30' },
  research: { icon: FlaskConical, color: 'text-hub-blue', bg: 'bg-hub-blue/10', border: 'border-hub-blue/30' },
  event: { icon: Calendar, color: 'text-hub-muted', bg: 'bg-white/5', border: 'border-white/15' },
  achievement: { icon: Award, color: 'text-hub-green', bg: 'bg-hub-green/10', border: 'border-hub-green/30' },
};

export default function Timeline() {
  return (
    <section
      id="timeline"
      className="section-padding relative z-10"
      aria-label="Journey timeline"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-semibold text-hub-green/70 tracking-widest uppercase font-jetbrains" style={{ fontFamily: 'var(--font-jetbrains)' }}>
              03 / Journey
            </span>
            <div className="flex-1 h-px bg-white/6 max-w-[80px]" />
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-hub-text"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            My Journey
          </h2>
          <p className="text-hub-muted mt-3 max-w-2xl leading-relaxed">
            Education, open source programs, research, and milestones that have shaped my engineering path.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-hub-green/30 via-white/8 to-transparent -translate-x-1/2 hidden sm:block" aria-hidden="true" />

          <div className="flex flex-col gap-8">
            {timeline.map((item, i) => {
              const cfg = typeConfig[item.type];
              const Icon = cfg.icon;
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, ease: 'easeOut' as const, delay: i * 0.05 }}
                  className={`relative flex items-start gap-6 ${
                    isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Icon node — desktop */}
                  <div className="absolute left-6 lg:left-1/2 -translate-x-1/2 hidden sm:flex">
                    <div className={`w-9 h-9 rounded-full ${cfg.bg} border ${cfg.border} flex items-center justify-center z-10 shadow-lg`}>
                      <Icon size={15} className={cfg.color} aria-hidden="true" />
                    </div>
                  </div>

                  {/* Card — takes up one half on desktop */}
                  <div className={`sm:w-1/2 ${isLeft ? 'lg:pr-10' : 'lg:pl-10 lg:ml-auto'} ml-10 sm:ml-0`}>
                    <article
                      className="glass-card rounded-xl p-5 hover:border-white/10 transition-all duration-300"
                      id={`timeline-${item.id}`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3
                            className="font-semibold text-hub-text text-sm leading-snug"
                            style={{ fontFamily: 'var(--font-space-grotesk)' }}
                          >
                            {item.title}
                          </h3>
                          <p className="text-hub-muted text-xs mt-0.5">{item.organization}</p>
                        </div>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-hub-muted-2 hover:text-hub-green transition-colors shrink-0"
                            aria-label={`View ${item.title} externally`}
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs px-2 py-0.5 rounded-md ${cfg.bg} ${cfg.color} font-jetbrains`} style={{ fontFamily: 'var(--font-jetbrains)' }}>
                          {item.type}
                        </span>
                        <span className="text-xs text-hub-muted-2 font-jetbrains" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                          {item.date}{item.endDate ? ` – ${item.endDate}` : ''}
                        </span>
                      </div>

                      <p className="text-hub-muted text-xs leading-relaxed">
                        {item.description}
                      </p>
                    </article>
                  </div>

                  {/* Spacer for the other half */}
                  <div className="hidden lg:block w-1/2" aria-hidden="true" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
