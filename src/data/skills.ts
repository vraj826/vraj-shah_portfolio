export type SkillLevel = 'exploring' | 'learning' | 'comfortable';

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface SkillZone {
  category: string;
  description: string;
  skills: Skill[];
}

export const skillLevelConfig: Record<SkillLevel, { label: string; color: string }> = {
  exploring: { label: 'Exploring', color: 'skill-exploring' },
  learning: { label: 'Learning', color: 'skill-learning' },
  comfortable: { label: 'Comfortable', color: 'skill-comfortable' },
};

export const skillZones: SkillZone[] = [
  {
    category: 'Cybersecurity',
    description: 'Core security concepts, tools, and methodologies I actively study.',
    skills: [
      { name: 'Vulnerability Analysis', level: 'learning' },
      { name: 'OWASP Top 10', level: 'comfortable' },
      { name: 'Cryptography', level: 'exploring' },
      { name: 'Reverse Engineering', level: 'exploring' },
      { name: 'Wireshark Analysis', level: 'comfortable' },
    ],
  },
  {
    category: 'Cloud Security',
    description: 'Cloud platforms and security configurations I am learning.',
    skills: [
      { name: 'AWS IAM Hardening', level: 'learning' },
      { name: 'VPC Configuration', level: 'learning' },
      { name: 'Container Security', level: 'comfortable' },
      { name: 'Trivy Scanning', level: 'comfortable' },
    ],
  },
  {
    category: 'Networking',
    description: 'Network protocols, analysis, and security fundamentals.',
    skills: [
      { name: 'TCP/IP Suite', level: 'comfortable' },
      { name: 'Firewall Configurations', level: 'learning' },
      { name: 'DNSSEC', level: 'exploring' },
      { name: 'SSH & PKI', level: 'comfortable' },
    ],
  },
  {
    category: 'Linux & Systems',
    description: 'Operating systems, shell scripting, and system administration.',
    skills: [
      { name: 'Bash Scripting', level: 'comfortable' },
      { name: 'Arch Linux Admin', level: 'comfortable' },
      { name: 'Linux Kernel Compilation', level: 'learning' },
      { name: 'Systemd Configuration', level: 'comfortable' },
    ],
  },
  {
    category: 'AI Security',
    description: 'Securing artificial intelligence and LLM execution paths against adversarial threat vectors.',
    skills: [
      { name: 'LLM Jailbreaking', level: 'learning' },
      { name: 'Model Poisoning Analysis', level: 'exploring' },
      { name: 'Adversarial Prompting', level: 'comfortable' },
      { name: 'Guardrail Engineering', level: 'learning' },
    ],
  },
  {
    category: 'Programming',
    description: 'Languages and frameworks I use to build security tools and projects.',
    skills: [
      { name: 'Python', level: 'comfortable' },
      { name: 'Go', level: 'comfortable' },
      { name: 'TypeScript', level: 'learning' },
      { name: 'C++', level: 'learning' },
    ],
  },
  {
    category: 'Tools & Technologies',
    description: 'Security tools, platforms, and environments in my workflow.',
    skills: [
      { name: 'Git & Version Control', level: 'comfortable' },
      { name: 'Burp Suite', level: 'learning' },
      { name: 'Nmap Scanner', level: 'comfortable' },
      { name: 'VS Code IDE', level: 'comfortable' },
      { name: 'Linux Terminal', level: 'comfortable' },
    ],
  },
];
