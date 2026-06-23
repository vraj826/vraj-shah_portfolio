'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Wrench } from 'lucide-react';
import { projects, type Project } from '@/data/projects';

const categoryLabels: Record<Project['category'], string> = {
  security: 'Security',
  cloud: 'Cloud',
  ai: 'AI / ML',
  devops: 'DevOps',
  other: 'Other',
};

const statusConfig: Record<Project['status'], { label: string; color: string }> = {
  active: { label: 'Active', color: 'text-hub-green' },
  completed: { label: 'Completed', color: 'text-hub-muted' },
  wip: { label: 'WIP', color: 'text-hub-blue' },
};

const categories = ['all', 'security', 'cloud', 'ai', 'devops', 'other'] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function Projects() {
  const [filter, setFilter] = useState<'all' | Project['category']>('all');

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section
      id="projects"
      className="section-padding relative z-10"
      aria-label="Projects section"
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
              04 / Projects
            </span>
            <div className="flex-1 h-px bg-white/6 max-w-[80px]" />
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-hub-text"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Engineering Projects
          </h2>
          <p className="text-hub-muted mt-3 max-w-2xl leading-relaxed">
            Projects I have built to learn, experiment, and solve real problems. All work in progress is honest — engineering is never finished.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-2 mb-8"
          role="tablist"
          aria-label="Filter projects by category"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={filter === cat}
              onClick={() => setFilter(cat)}
              id={`project-filter-${cat}`}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                filter === cat
                  ? 'border-hub-green/40 bg-hub-green/10 text-hub-green'
                  : 'border-white/8 text-hub-muted hover:text-hub-text hover:border-white/15'
              }`}
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              {cat === 'all' ? 'All' : categoryLabels[cat]}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map((project) => {
            const status = statusConfig[project.status];
            return (
              <motion.article
                key={project.id}
                variants={cardVariants}
                className="glass-card rounded-xl p-5 flex flex-col hover:border-white/10 hover:-translate-y-0.5 transition-all duration-300 group"
                id={`project-${project.id}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs text-hub-green/70 border border-hub-green/20 rounded px-1.5 py-0.5 font-jetbrains" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                        {categoryLabels[project.category]}
                      </span>
                      <span className={`text-xs font-jetbrains ${status.color}`} style={{ fontFamily: 'var(--font-jetbrains)' }}>
                        · {status.label}
                      </span>
                    </div>
                    <h3
                      className="font-semibold text-hub-text text-base leading-snug group-hover:text-hub-green transition-colors"
                      style={{ fontFamily: 'var(--font-space-grotesk)' }}
                    >
                      {project.name}
                    </h3>
                  </div>
                  <Wrench size={16} className="text-hub-muted-2 shrink-0 mt-0.5" aria-hidden="true" />
                </div>

                <p className="text-hub-muted text-sm leading-relaxed flex-1 mb-4">
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-hub-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-hub-muted hover:text-hub-text transition-colors"
                    aria-label={`View ${project.name} on GitHub`}
                  >
                    <Github size={14} />
                    GitHub
                  </a>
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-hub-muted hover:text-hub-green transition-colors"
                      aria-label={`View ${project.name} live demo`}
                    >
                      <ExternalLink size={14} />
                      Live Demo
                    </a>
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
