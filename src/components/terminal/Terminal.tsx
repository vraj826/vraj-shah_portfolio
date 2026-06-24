'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal as TerminalIcon } from 'lucide-react';
import { useTerminal } from '@/contexts/TerminalContext';
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

export default function Terminal() {
  const { isOpen, closeTerminal } = useTerminal();
  const router = useRouter();
  const [history, setHistory] = useState<Line[]>([
    { text: 'SYSTEM: Initializing secure shell...', type: 'system' },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (isOpen) {
      setHistory([{ text: 'SYSTEM: Initializing secure shell...', type: 'system' }]);
      timer = setTimeout(() => {
        setHistory([
          {
            text: 'SYSTEM: Connection established. Type "help" to see available commands.',
            type: 'system',
          },
        ]);
      }, 1100);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen]);

  // Focus input whenever terminal is open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Auto scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history, isOpen]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const newHistory = [...history, { text: `visitor@security-hub:~$ ${trimmed}`, type: 'input' as const }];
    const parts = trimmed.split(' ');
    const primaryCmd = parts[0].toLowerCase();

    // Add to command history list
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
          { text: '  mission      - Launch Mission Control UI (/mission)', type: 'success' },
          { text: '  hub          - Return to homepage (/)', type: 'output' },
          { text: '  clear        - Clear screen buffer', type: 'output' },
          { text: '  exit         - Terminate terminal session', type: 'output' },
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
          closeTerminal();
          router.push('/mission');
        }, 800);
        break;

      case 'hub':
        addLines([{ text: 'Returning to Security Hub...', type: 'system' }]);
        setTimeout(() => {
          closeTerminal();
          router.push('/');
        }, 800);
        break;

      case 'clear':
        setHistory([]);
        break;

      case 'exit':
        addLines([{ text: 'Closing session...', type: 'system' }]);
        setTimeout(() => {
          closeTerminal();
        }, 500);
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
      e.preventDefault();
      handleCommand(input);
      setInput('');
    }
    // Arrow Up: Command history back
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx < cmdHistory.length) {
        setHistoryIdx(nextIdx);
        setInput(cmdHistory[nextIdx]);
      }
    }
    // Arrow Down: Command history forward
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = historyIdx - 1;
      if (nextIdx >= 0) {
        setHistoryIdx(nextIdx);
        setInput(cmdHistory[nextIdx]);
      } else {
        setHistoryIdx(-1);
        setInput('');
      }
    }
    // Tab: Autocomplete command
    else if (e.key === 'Tab') {
      e.preventDefault();
      const match = COMMAND_LIST.find((c) => c.startsWith(input.toLowerCase()));
      if (match) {
        setInput(match);
      }
    }
    // Escape: Close
    else if (e.key === 'Escape') {
      e.preventDefault();
      closeTerminal();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-hub-bg/85 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="terminal-title"
          onClick={closeTerminal}
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full max-w-4xl h-[70vh] flex flex-col shadow-2xl rounded-xl border border-hub-green/20 overflow-hidden bg-[#08121f]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0d1a2f] border-b border-hub-green/10">
              <div className="flex items-center gap-2">
                <TerminalIcon size={16} className="text-hub-green" />
                <span id="terminal-title" className="font-space-grotesk text-xs font-semibold tracking-wider text-hub-text/90 uppercase">
                  terminal@security-hub
                </span>
              </div>
              <button
                onClick={closeTerminal}
                className="p-1 hover:bg-white/5 rounded text-hub-muted hover:text-hub-text transition-colors"
                aria-label="Close terminal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Terminal body */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div
                ref={containerRef}
                className="flex-1 overflow-y-auto p-6 font-jetbrains text-xs space-y-2 selection:bg-hub-green/30 select-text cursor-text"
                onClick={() => inputRef.current?.focus()}
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
              </div>

              {/* Input prompt line */}
              <div className="flex items-center gap-2 px-6 py-3 bg-[#0d1a2f] border border-white/10 rounded-md">
                <span className="text-hub-blue shrink-0 text-xs">visitor@security-hub:~$</span>
                <div className="relative flex-1 flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    className="w-full bg-transparent border-none outline-none text-hub-green text-xs font-jetbrains caret-transparent focus:ring-0 focus:outline-none p-0"
                    aria-label="Terminal command input"
                    autoFocus
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                  <span
                    className="absolute pointer-events-none text-hub-green font-jetbrains leading-none flex items-center"
                    style={{
                      left: `${input.length * 8.4}px`,
                    }}
                  >
                    <span className={`terminal-cursor ${isInputFocused ? 'active' : ''}`} />
                  </span>
                </div>
              </div>
            </div>

            {/* Terminal Footer status info */}
            <div className="px-4 py-2 bg-[#0d1a2f]/90 border-t border-hub-green/10 flex justify-between items-center text-[10px] text-hub-muted-2 font-jetbrains">
              <span>HOST: vrajkumar-shah</span>
              <span>ESC: Exit &nbsp;|&nbsp; TAB: Autocomplete</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
