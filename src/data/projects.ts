export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  techStack: string[];
  githubUrl: string;
  demoUrl?: string;
  featured: boolean;
  category: 'security' | 'cloud' | 'ai' | 'devops' | 'other';
  status: 'active' | 'completed' | 'wip';
}

export const projects: Project[] = [
  {
    id: 'project-001',
    name: 'GuardianEye: IoT Packet Analyzer',
    description: 'A network security tool built to capture, inspect, and alert on suspicious traffic from smart home devices.',
    longDescription: 'GuardianEye utilizes low-level packet capture hooks to intercept local IoT device communications. It inspects payloads against threat signatures, flags unencrypted transmissions, and generates alert streams via a dashboard.',
    techStack: ['Python', 'Scapy', 'SQLite', 'Docker'],
    githubUrl: 'https://github.com/vraj826/guardian-eye',
    demoUrl: 'https://guardian-eye.vrajkumar.space',
    featured: true,
    category: 'security',
    status: 'completed',
  },
  {
    id: 'project-002',
    name: 'CloudGuard: Terraform AWS Hardener',
    description: 'Static analysis parser designed to scan IAC configuration files and audit them against AWS CIS benchmarks.',
    longDescription: 'CloudGuard scans Terraform configuration directories for vulnerable cloud settings like wide-open security groups, unencrypted S3 buckets, and overly permissive IAM roles, outputting actionable markdown remediation reports.',
    techStack: ['Go', 'Terraform', 'AWS CLI', 'GitHub Actions'],
    githubUrl: 'https://github.com/vraj826/cloud-guard',
    demoUrl: 'https://cloudguard.vrajkumar.space',
    featured: true,
    category: 'cloud',
    status: 'completed',
  },
  {
    id: 'project-003',
    name: 'PromptDefense: LLM Injection Filter',
    description: 'Middleware utility designed to sanitize and protect Large Language Model prompt payloads from injection attacks.',
    longDescription: 'PromptDefense uses a lightweight token check classifier to evaluate incoming prompts for typical injection patterns (e.g. system instruction overrides, jailbreaks) before passing them to backend LLM models.',
    techStack: ['Python', 'FastAPI', 'PyTorch', 'HuggingFace'],
    githubUrl: 'https://github.com/vraj826/prompt-defense',
    demoUrl: undefined,
    featured: true,
    category: 'ai',
    status: 'wip',
  },
  {
    id: 'project-004',
    name: 'SecurePipeline: Container Scan Action',
    description: 'Custom reusable GitHub Action that builds, signs, and scans Docker container images for CVEs in CI workflows.',
    longDescription: 'Integrating Trivy and Cosign, this workflow automates vulnerability scans and cryptographically signs images during the build stage. If high-severity issues are found, the build fails and alerts developers.',
    techStack: ['GitHub Actions', 'Docker', 'Trivy', 'Cosign', 'Bash'],
    githubUrl: 'https://github.com/vraj826/secure-pipeline',
    demoUrl: undefined,
    featured: false,
    category: 'devops',
    status: 'completed',
  },
  {
    id: 'project-005',
    name: 'KeyShield: Secret Scanner CLI',
    description: 'Extremely fast command line tool written in Go to audit local directories for leaked API keys, tokens, and credentials.',
    longDescription: 'Using regex signature matching and Shannon entropy scoring, KeyShield scans code repositories before commit to identify potential sensitive strings. It provides interactive warnings directly in the console.',
    techStack: ['Go', 'Regex', 'Shell scripting'],
    githubUrl: 'https://github.com/vraj826/keyshield',
    demoUrl: undefined,
    featured: false,
    category: 'security',
    status: 'active',
  },
  {
    id: 'project-006',
    name: 'SDRDecoder: NOAA Telemetry Parser',
    description: 'A tool to demultiplex and decode raw telemetry signals captured from orbiting NOAA weather satellites.',
    longDescription: 'SDRDecoder takes baseband IQ radio signals recorded via RTL-SDR dongles, applies demodulation algorithms, and parses telemetry headers to reconstruct weather images and orbital health statistics.',
    techStack: ['Python', 'SciPy', 'RTL-SDR', 'Matplotlib'],
    githubUrl: 'https://github.com/vraj826/sdr-decoder',
    demoUrl: undefined,
    featured: false,
    category: 'other',
    status: 'completed',
  },
];
