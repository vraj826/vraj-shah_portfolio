'use client';

import { motion } from 'framer-motion';
import { skillZones, skillLevelConfig, type SkillLevel } from '@/data/skills';

const levelOrder: SkillLevel[] = ['exploring', 'learning', 'building', 'comfortable'];

const chipClasses: Record<SkillLevel, string> = {
  exploring: 'skill-chip-exploring',
  learning: 'skill-chip-learning',
  building: 'skill-chip-building',
  comfortable: 'skill-chip-comfortable',
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function Skills() {
  return (
    <section
      id="skills"
      className="section-padding relative z-10"
      aria-label="Skills and learning radar"
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
              02 / Skills
            </span>
            <div className="flex-1 h-px bg-white/6 max-w-[80px]" />
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-hub-text"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Learning Radar
          </h2>
          <p className="text-hub-muted mt-3 max-w-2xl leading-relaxed">
            Technologies and concepts I am actively exploring, learning, and building with. No percentages — just honest signal.
          </p>
        </motion.div>

        {/* Level legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-2 mb-8"
          aria-label="Skill level legend"
        >
          {levelOrder.map((level) => (
            <span
              key={level}
              className={`text-xs px-2.5 py-1 rounded-full ${chipClasses[level]}`}
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              {skillLevelConfig[level].label}
            </span>
          ))}
        </motion.div>

        {/* Zone grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {skillZones.map((zone) => (
            <motion.article
              key={zone.category}
              variants={itemVariants}
              className="glass-card rounded-xl p-5 hover:border-white/10 transition-all duration-300 group hover:glow-green"
              id={`skill-zone-${zone.category.toLowerCase().replace(/[^a-z]+/g, '-')}`}
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="text-xl leading-none" aria-hidden="true">{zone.icon}</span>
                <div>
                  <h3
                    className="font-semibold text-hub-text text-sm leading-tight"
                    style={{ fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    {zone.category}
                  </h3>
                  <p className="text-hub-muted-2 text-xs mt-0.5 leading-relaxed">{zone.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {zone.skills.map((skill) => (
                  <span
                    key={`${zone.category}-${skill.name}`}
                    className={`text-xs px-2 py-0.5 rounded-md ${chipClasses[skill.level]}`}
                    title={skillLevelConfig[skill.level].label}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
