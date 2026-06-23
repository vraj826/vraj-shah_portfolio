'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { GitPullRequest, AlertCircle, FolderGit2, Building2, ExternalLink, Activity } from 'lucide-react';
import { openSourceMetrics, contributions, recentActivity } from '@/data/opensource';

// Animated counter for metrics
function Counter({ target }: { target: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState('0');

  useEffect(() => {
    if (!isInView) return;
    const num = parseInt(target.replace(/\D/g, ''), 10);
    if (isNaN(num)) { setDisplayed(target); return; }
    let start = 0;
    const step = Math.max(1, Math.floor(num / 40));
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setDisplayed(target); clearInterval(timer); }
      else setDisplayed(String(start));
    }, 40);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{displayed}</span>;
}

const metrics = [
  { icon: GitPullRequest, label: 'Pull Requests', value: openSourceMetrics.prs, color: 'text-hub-green' },
  { icon: AlertCircle, label: 'Issues', value: openSourceMetrics.issues, color: 'text-hub-blue' },
  { icon: FolderGit2, label: 'Repositories', value: openSourceMetrics.repos, color: 'text-hub-green' },
  { icon: Building2, label: 'Organizations', value: openSourceMetrics.organizations, color: 'text-hub-blue' },
];

const activityTypeConfig = {
  pr: { label: 'PR', color: 'text-hub-green', bg: 'bg-hub-green/10' },
  issue: { label: 'Issue', color: 'text-hub-blue', bg: 'bg-hub-blue/10' },
  review: { label: 'Review', color: 'text-hub-muted', bg: 'bg-white/5' },
  contribution: { label: 'Contrib', color: 'text-hub-green', bg: 'bg-hub-green/10' },
};

export default function OpenSource() {
  return (
    <section
      id="opensource"
      className="section-padding relative z-10"
      aria-label="Open Source Observatory"
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
              05 / Open Source
            </span>
            <div className="flex-1 h-px bg-white/6 max-w-[80px]" />
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-hub-text"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Open Source Observatory
          </h2>
          <p className="text-hub-muted mt-3 max-w-2xl leading-relaxed">
            Contributing to open source is how I learn in public, collaborate with real teams, and grow as a software engineer.
          </p>
        </motion.div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className="glass-card rounded-xl p-5 text-center"
                id={`metric-${m.label.toLowerCase().replace(/\s/g, '-')}`}
              >
                <Icon size={18} className={`${m.color} mx-auto mb-2`} aria-hidden="true" />
                <div
                  className={`text-2xl font-bold ${m.color} font-jetbrains`}
                  style={{ fontFamily: 'var(--font-jetbrains)' }}
                >
                  <Counter target={m.value} />
                </div>
                <p className="text-hub-muted-2 text-xs mt-1">{m.label}</p>
              </div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Contributions */}
          <div>
            <h3
              className="text-sm font-semibold text-hub-text mb-5 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              <span className="w-1 h-4 rounded-full bg-hub-green inline-block" aria-hidden="true" />
              Featured Contributions
            </h3>
            <div className="flex flex-col gap-4">
              {contributions.map((c, i) => (
                <motion.article
                  key={c.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                  className="glass-card rounded-xl p-5 hover:border-white/10 transition-all duration-300"
                  id={`contrib-${c.id}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4
                        className="font-semibold text-hub-text text-sm"
                        style={{ fontFamily: 'var(--font-space-grotesk)' }}
                      >
                        {c.organization}
                      </h4>
                      <p className="text-hub-green text-xs mt-0.5">{c.role}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded font-jetbrains ${
                          c.status === 'active' ? 'text-hub-green bg-hub-green/10' : 'text-hub-muted-2 bg-white/5'
                        }`}
                        style={{ fontFamily: 'var(--font-jetbrains)' }}
                      >
                        {c.status}
                      </span>
                      <a
                        href={c.orgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-hub-muted-2 hover:text-hub-green transition-colors"
                        aria-label={`View ${c.organization} on GitHub`}
                      >
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                  <p className="text-hub-muted text-xs leading-relaxed mb-3">{c.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {c.techStack.map((t) => (
                        <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-white/5 border border-white/8 text-hub-muted">{t}</span>
                      ))}
                    </div>
                    <span className="text-xs text-hub-muted-2 font-jetbrains shrink-0 ml-2" style={{ fontFamily: 'var(--font-jetbrains)' }}>{c.period}</span>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3
              className="text-sm font-semibold text-hub-text mb-5 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              <span className="w-1 h-4 rounded-full bg-hub-blue inline-block" aria-hidden="true" />
              Recent Activity
            </h3>
            <div className="glass-card rounded-xl p-5">
              <div className="flex flex-col gap-4">
                {recentActivity.map((item, i) => {
                  const cfg = activityTypeConfig[item.type];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06, duration: 0.4 }}
                      className="flex items-start gap-3"
                    >
                      <span className={`text-xs px-1.5 py-0.5 rounded font-jetbrains shrink-0 mt-0.5 ${cfg.color} ${cfg.bg}`} style={{ fontFamily: 'var(--font-jetbrains)' }}>
                        {cfg.label}
                      </span>
                      <div className="flex-1 min-w-0">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-hub-muted hover:text-hub-text transition-colors leading-relaxed"
                        >
                          {item.description}
                        </a>
                        <p className="text-hub-muted-2 text-xs mt-0.5 font-jetbrains" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                          {item.date}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* GitHub CTA */}
            <motion.a
              href={`https://github.com/[INSERT-GITHUB-HANDLE]`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-4 flex items-center justify-center gap-2 text-sm text-hub-muted hover:text-hub-green border border-white/8 hover:border-hub-green/30 rounded-xl py-3 transition-all duration-200"
              id="github-profile-link"
            >
              <Activity size={15} aria-hidden="true" />
              View GitHub Profile
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}
