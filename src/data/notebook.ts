export interface NotebookEntry {
  id: string;
  logId: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  readTime: string;
  category: 'security' | 'cloud' | 'ai' | 'devops' | 'research' | 'opensource';
}

export const notebookEntries: NotebookEntry[] = [
  {
    id: 'log-001',
    logId: 'LOG 001',
    title: 'Adversarial Jailbreaking of LLM Security Policies',
    date: '2026-02-12',
    summary: 'Analyzing structural patterns of adversarial prompting methods that bypass model policies. Explored defensive filtering middleware on local models using token classification.',
    tags: ['AI Security', 'Jailbreak', 'Python'],
    readTime: '5 min read',
    category: 'security',
  },
  {
    id: 'log-002',
    logId: 'LOG 002',
    title: 'Hardening Firmware on Embedded Controllers',
    date: '2026-04-05',
    summary: 'An investigation into memory protection on microcontrollers. Documented strategies for restricting serial debugging access and securing telemetry interfaces.',
    tags: ['Embedded Systems', 'Firmware', 'C++'],
    readTime: '7 min read',
    category: 'opensource',
  },
  {
    id: 'log-003',
    logId: 'LOG 003',
    title: 'Remote Sensing & CubeSat Telemetry Parsing',
    date: '2026-06-18',
    summary: 'Exploring satellite telemetry structures. Wrote Python script to process simulated IQ signals from atmospheric sensors and extract telemetry packets.',
    tags: ['Space Systems', 'SDR', 'Python'],
    readTime: '8 min read',
    category: 'research',
  },
];
