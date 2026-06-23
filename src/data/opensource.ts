export interface OpenSourceMetrics {
  prs: string;
  issues: string;
  repos: string;
  organizations: string;
}

export interface Contribution {
  id: string;
  organization: string;
  orgUrl: string;
  role: string;
  description: string;
  techStack: string[];
  period: string;
  status: 'active' | 'completed' | 'ongoing';
  type: 'gsoc' | 'outreachy' | 'lgmsoc' | 'personal' | 'other';
}

export interface ActivityItem {
  date: string;
  description: string;
  url: string;
  type: 'pr' | 'issue' | 'review' | 'contribution';
}

export const openSourceMetrics: OpenSourceMetrics = {
  prs: '18',
  issues: '24',
  repos: '15',
  organizations: '4',
};

export const contributions: Contribution[] = [
  {
    id: 'contrib-001',
    organization: 'Linux Kernel Staging',
    orgUrl: 'https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git',
    role: 'Hardening Contributor',
    description: 'Submitted refactoring patches for legacy device staging drivers to replace unsafe string copy procedures and improve system memory boundary integrity.',
    techStack: ['C', 'Linux Kernel', 'Git'],
    period: 'Nov 2024 – Present',
    status: 'ongoing',
    type: 'other',
  },
  {
    id: 'contrib-002',
    organization: 'OWASP Cheat Sheet Series',
    orgUrl: 'https://github.com/OWASP/CheatSheetSeries',
    role: 'Security Contributor',
    description: 'Reviewed and expanded guidelines on container execution security. Provided concrete tips for securing secrets in high-performance cloud environments.',
    techStack: ['Markdown', 'Docker', 'Kubernetes'],
    period: 'Aug 2024',
    status: 'completed',
    type: 'personal',
  },
  {
    id: 'contrib-003',
    organization: 'Scapy Packet Tool',
    orgUrl: 'https://github.com/secdev/scapy',
    role: 'Open Source Contributor',
    description: 'Helped implement decoding handlers for satellite telemetry packets and updated protocol parsers to match newer RFC specifications.',
    techStack: ['Python', 'Scapy', 'Network Protocols'],
    period: 'May 2024',
    status: 'completed',
    type: 'other',
  },
];

export const recentActivity: ActivityItem[] = [
  {
    date: 'June 2026',
    description: 'Merged PR into Linux Staging: Replace deprecated strcpy usage with strscpy in staging driver buffers.',
    url: 'https://github.com/torvalds/linux',
    type: 'pr',
  },
  {
    date: 'April 2026',
    description: 'Reported issue: Security parameter mismatch in Scapy radio telemetry demultiplexing protocol.',
    url: 'https://github.com/secdev/scapy',
    type: 'issue',
  },
  {
    date: 'March 2026',
    description: 'Reviewed documentation PR: Update OWASP cloud deployment compliance recommendations.',
    url: 'https://github.com/OWASP/CheatSheetSeries',
    type: 'review',
  },
  {
    date: 'January 2026',
    description: 'Contributed: Refactored packet parsing routines in space flight open simulation utilities.',
    url: 'https://github.com',
    type: 'contribution',
  },
];
