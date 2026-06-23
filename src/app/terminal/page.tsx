'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Terminal as TerminalIcon, ArrowLeft } from 'lucide-react';
import { profile } from '@/data/profile';
import { skillZones } from '@/data/skills';
import { projects } from '@/data/projects';
import { openSourceMetrics } from '@/data/opensource';
import { researchAreas } from '@/data/research';

interface Line {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
}

const COMMAND_LIST = [
  'help',
  'about',
  'skills',
  'projects',
  'opensource',
  'research',
  'notebook',
  'contact',
  'resume',
  'mission',
  'hub',
  'clear',
  'exit',
  'sudo',
  'flag',
];

export default function TerminalPage() {
  const router = useRouter();
  const [history, setHistory] = useState<Line[]>([
    { text: 'SYSTEM: Booting secure standalone telemetry terminal...', type: 'system' },
    { text: 'SYSTEM: Secure tunnel established. Type "help" to display available systems.', type: 'system' },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const newHistory = [...history, { text: `visitor@vrajkumar-shah:~$ ${trimmed}`, type: 'input' as const }];
    const parts = trimmed.split(' ');
    const primaryCmd = parts[0].toLowerCase();

    setCmdHistory((prev) => [trimmed, ...prev.filter((c) => c !== trimmed)].slice(0, 50));
    setHistoryIdx(-1);

    const addLines = (lines: { text: string; type: Line['type'] }[]) => {
      setHistory([...newHistory, ...lines]);
    };

    switch (primaryCmd) {
      case 'help':
        addLines([
          { text: 'Available commands:', type: 'system' },
          { text: '  about        - View personal summary & background info', type: 'output' },
          { text: '  skills       - List cybersecurity, development, and research focus areas', type: 'output' },
          { text: '  projects     - View active & completed engineering projects', type: 'output' },
          { text: '  opensource   - Show open source contributions and metrics', type: 'output' },
          { text: '  research     - View academic research areas (Cyber, AI, Space)', type: 'output' },
          { text: '  notebook     - List recent engineering notebook entries', type: 'output' },
          { text: '  contact      - Get contact details & social channels', type: 'output' },
          { text: '  resume       - Open resume in a new tab', type: 'output' },
          { text: '  mission      - Launch Mission Control UI (/mission)', type: 'success' },
          { text: '  hub          - Return to homepage (/)', type: 'output' },
          { text: '  clear        - Clear screen buffer', type: 'output' },
          { text: '  exit         - Return to main hub', type: 'output' },
          { text: 'Try typing: "sudo", "flag" or "resume"', type: 'system' },
        ]);
        break;

      case 'about':
        addLines([
          { text: `Name: ${profile.name}`, type: 'success' },
          { text: `Title: ${profile.title}`, type: 'output' },
          { text: `Degree: ${profile.degree}`, type: 'output' },
          { text: `University: ${profile.university}`, type: 'output' },
          { text: `Location: ${profile.location}`, type: 'output' },
          { text: '----------------------------------------', type: 'system' },
          { text: profile.summary.replace(/\[INSERT.*?\]/g, 'Undergraduate explorer of computer engineering, secure systems, and spacecraft avionics.'), type: 'output' },
        ]);
        break;

      case 'skills': {
        const skillLines = skillZones.flatMap((zone) => [
          { text: `\n[${zone.category.toUpperCase()}]`, type: 'success' as const },
          ...zone.skills.map((item) => ({
            text: `  - ${item.name} (${item.level})`,
            type: 'output' as const,
          })),
        ]);
        addLines(skillLines);
        break;
      }

      case 'projects': {
        const projectLines = projects.map((p) => ({
          text: `• [${p.status.toUpperCase()}] ${p.name} - ${p.description}\n  Stack: ${p.techStack.join(', ')}\n  GitHub: ${p.githubUrl}`,
          type: 'output' as const,
        }));
        addLines([
          { text: 'Engineering Projects:', type: 'success' },
          ...projectLines,
        ]);
        break;
      }

      case 'opensource':
        addLines([
          { text: 'Open Source Observatory Metrics:', type: 'success' },
          { text: `  PRs Merged:   ${openSourceMetrics.prs}`, type: 'output' },
          { text: `  Issues Filed: ${openSourceMetrics.issues}`, type: 'output' },
          { text: `  Repositories: ${openSourceMetrics.repos}`, type: 'output' },
          { text: `  Organizations:${openSourceMetrics.organizations}`, type: 'output' },
          { text: '----------------------------------------', type: 'system' },
          { text: 'Featured Contribution: Linux Kernel Staging, security hardening, and avionics bus simulators.', type: 'output' },
        ]);
        break;

      case 'research': {
        const researchLines = researchAreas.map((r) => ({
          text: `• [${r.title}] - ${r.description}`,
          type: 'output' as const,
        }));
        addLines([
          { text: 'Core Research Fields:', type: 'success' },
          ...researchLines,
        ]);
        break;
      }

      case 'notebook':
        addLines([
          { text: 'Engineering Logs / Research Notebook:', type: 'success' },
          { text: '  - LOG 003: Remote Sensing & CubeSat Telemetry Parsing (2026-06)', type: 'output' },
          { text: '  - LOG 002: Hardening Firmware on Embedded Controllers (2026-04)', type: 'output' },
          { text: '  - LOG 001: Adversarial Jailbreaking of LLM Security Policies (2026-02)', type: 'output' },
        ]);
        break;

      case 'contact':
        addLines([
          { text: 'Establish Secure Connection:', type: 'success' },
          { text: `  Email:    ${profile.socials.email.replace(/\[INSERT.*?\]/g, 'vraj@example.com')}`, type: 'output' },
          { text: `  LinkedIn: ${profile.socials.linkedin.replace(/\[INSERT.*?\]/g, 'vrajkumar-shah')}`, type: 'output' },
          { text: `  GitHub:   ${profile.socials.github.replace(/\[INSERT.*?\]/g, 'vraj826')}`, type: 'output' },
          { text: `  Medium:   ${profile.socials.medium}`, type: 'output' },
        ]);
        break;

      case 'resume':
        window.open(profile.resumeUrl, '_blank');
        addLines([{ text: 'Opening resume in new window...', type: 'success' }]);
        break;

      case 'mission':
        addLines([{ text: 'Redirecting to Mission Control terminal...', type: 'success' }]);
        setTimeout(() => {
          router.push('/mission');
        }, 800);
        break;

      case 'hub':
      case 'exit':
        addLines([{ text: 'Redirecting to Security Hub homepage...', type: 'system' }]);
        setTimeout(() => {
          router.push('/');
        }, 800);
        break;

      case 'clear':
        setHistory([]);
        break;

      case 'sudo':
        addLines([{ text: 'Permission denied. This incident has been logged and reported to NASA telemetry.', type: 'error' }]);
        break;

      case 'flag':
        addLines([{ text: 'VRAJ{c0st_0f_e4rth_1s_l1k3_a_p1x3l_in_spac3}', type: 'success' }]);
        break;

      default:
        addLines([{ text: `Command not found: "${primaryCmd}". Type "help" to see available options.`, type: 'error' }]);
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx < cmdHistory.length) {
        setHistoryIdx(nextIdx);
        setInput(cmdHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = historyIdx - 1;
      if (nextIdx >= 0) {
        setHistoryIdx(nextIdx);
        setInput(cmdHistory[nextIdx]);
      } else {
        setHistoryIdx(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const match = COMMAND_LIST.find((c) => c.startsWith(input.toLowerCase()));
      if (match) {
        setInput(match);
      }
    }
  };

  return (
    <main className="min-h-screen bg-hub-bg text-hub-text font-jetbrains p-4 flex flex-col justify-between select-text">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-hub-green/10 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <TerminalIcon size={20} className="text-hub-green animate-pulse" />
          <h1 className="font-space-grotesk text-lg tracking-wider font-semibold uppercase text-hub-text">
            Autonomous Command Shell v1.0.4
          </h1>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-hub-muted hover:text-hub-green border border-white/5 hover:border-hub-green/20 hover:bg-hub-green/5 rounded transition-all duration-200"
        >
          <ArrowLeft size={14} />
          Return to Hub
        </Link>
      </div>

      {/* Terminal Viewport */}
      <div
        ref={containerRef}
        onClick={() => inputRef.current?.focus()}
        className="flex-1 overflow-y-auto mb-4 bg-hub-surface/40 border border-hub-green/5 rounded-xl p-6 shadow-inner space-y-2 cursor-text"
      >
        {history.map((line, idx) => {
          let colorClass = 'text-hub-text/90';
          if (line.type === 'input') colorClass = 'text-hub-green';
          else if (line.type === 'error') colorClass = 'text-red-400 font-semibold';
          else if (line.type === 'success') colorClass = 'text-hub-green font-semibold';
          else if (line.type === 'system') colorClass = 'text-hub-blue/80';

          return (
            <div key={idx} className="whitespace-pre-wrap leading-relaxed">
              <span className={colorClass}>{line.text}</span>
            </div>
          );
        })}

        {/* Command Line */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-hub-blue shrink-0">visitor@vrajkumar-shah:~$</span>
          <div className="relative flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none outline-none text-hub-green font-jetbrains caret-transparent focus:ring-0 focus:outline-none p-0"
              aria-label="Terminal command input"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            {/* Blinking cursor */}
            <span
              className="absolute pointer-events-none text-hub-green font-jetbrains leading-none flex items-center"
              style={{
                left: `${input.length * 8.4}px`,
              }}
            >
              <span className="terminal-cursor" />
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center text-xs text-hub-muted-2 border-t border-hub-green/10 pt-4 mt-auto">
        <span>STATUS: Connected</span>
        <span>Keyboard Shortcuts: Tab to autocomplete, Esc to exit</span>
      </div>
    </main>
  );
}
