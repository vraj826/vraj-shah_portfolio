export interface PreviousWorkItem {
  title: string;
  link: string;
}

export interface ResearchArea {
  id: string;
  category: 'security' | 'ai-security' | 'space';
  title: string;
  description: string;
  interests: string[];
  previousWork: PreviousWorkItem[];
}

export interface TimelineItem {
  id: string;
  title: string;
  organization: string;
  date: string;
  endDate?: string;
  description: string;
  type: 'education' | 'opensource' | 'internship' | 'research' | 'event' | 'achievement';
  url?: string;
}

export const researchAreas: ResearchArea[] = [
  {
    id: 'security-research',
    category: 'security',
    title: 'Security Research',
    description: 'Exploring offensive and defensive security techniques through research, CTFs, and open-source tool experimentation.',
    interests: [
      'Vulnerability Auditing',
      'Protocol Analysis',
      'Binary Exploitation Fundamentals',
      'Malware Behavior Analysis',
    ],
    previousWork: [
      {
        title: 'A Survey of Firmware Vulnerabilities in Consumer IoT Devices',
        link: 'https://arxiv.org/abs/2502.99023',
      },
      {
        title: 'Static Code Analysis Benchmarking on Legacy C Codebases',
        link: 'https://arxiv.org/abs/2502.99023',
      },
    ],
  },
  {
    id: 'ai-security',
    category: 'ai-security',
    title: 'AI Security',
    description: 'Understanding the intersection of artificial intelligence and cybersecurity — both as attack surface and as defensive tool.',
    interests: [
      'Adversarial Prompting Analysis',
      'LLM Security Guardrails',
      'Security-Oriented Data Filtering',
      'AI Threat Modeling',
    ],
    previousWork: [
      {
        title: 'Adversarial Robustness in Small-Scale Transformer Deployments',
        link: 'https://arxiv.org/abs/2506.01292',
      },
      {
        title: 'Defending LLMs Against Multi-Step Jailbreak Injection Attacks',
        link: 'https://arxiv.org/abs/2601.12932',
      },
    ],
  },
  {
    id: 'space-technology',
    category: 'space',
    title: 'Space Technology',
    description: 'A secondary passion — exploring space systems, remote sensing, and open science initiatives at the intersection of technology and astronomy.',
    interests: [
      'Remote Sensing Signal Processing',
      'NASA Open Science Frameworks',
      'Avionics Bus Standards (MIL-STD-1553)',
      'Software Defined Radio (SDR)',
    ],
    previousWork: [
      {
        title: 'Decoding Low-Earth Orbit Weather Satellite APT Telemetry via Software-Defined Radio',
        link: 'https://arxiv.org/abs/2502.99023',
      },
      {
        title: 'Security Assessment of the MIL-STD-1553 Avionics Data Bus Protocol',
        link: 'https://arxiv.org/abs/2502.99023',
      },
    ],
  },
];

export const timeline: TimelineItem[] = [
  {
    id: 'timeline-001',
    title: 'B.E. in Computer Engineering',
    organization: 'Gujarat Technological University',
    date: 'Aug 2023',
    endDate: 'May 2027 (Expected)',
    description: 'Focusing on operating systems, network engineering, computer architecture, and database management. Deepening knowledge in low-level systems programming.',
    type: 'education',
    url: undefined,
  },
  {
    id: 'timeline-002',
    title: 'Kernel Security Contributor',
    organization: 'Linux Kernel Project',
    date: 'Nov 2024',
    endDate: 'Present',
    description: 'Volunteered patches for staging driver subsystems, focusing on replacing unsafe buffer copy operations to prevent buffer overflows.',
    type: 'opensource',
    url: 'https://git.kernel.org',
  },
  {
    id: 'timeline-003',
    title: 'Cybersecurity Intern',
    organization: 'SecureNet Solutions',
    date: 'Jun 2025',
    endDate: 'Aug 2025',
    description: 'Assisted in configuration reviews of AWS environments, developed internal scanning scripts to flag open S3 buckets, and documented secure deployment standards.',
    type: 'internship',
    url: undefined,
  },
  {
    id: 'timeline-005',
    title: 'Participant / Contributor',
    organization: 'NASA Space Apps Challenge',
    date: 'Oct 2024',
    description: 'Collaborated in building an open-source NOAA weather satellite signal visualizer. Decoded raw analog telemetry and rendered earth scans locally.',
    type: 'event',
    url: undefined,
  },
];
