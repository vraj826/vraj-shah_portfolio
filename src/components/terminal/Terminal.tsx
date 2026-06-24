'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTerminal } from '@/contexts/TerminalContext';
import { profile } from '@/data/profile';

interface Line {
  text: string;
  type: 'input' | 'output' | 'error' | 'link';
}

const COMMAND_LIST = [
  'help',
  'about',
  'skills',
  'journey',
  'projects',
  'opensource',
  'certifications',
  'research',
  'notebook',
  'contact',
  'resume',
  'mission',
  'clear',
  'exit',
  'whoami',
  'uptime',
  'coffee',
  'nasa',
  'isro',
  '42',
  'hacktheplanet',
  'interstellar',
];

export default function Terminal() {
  const { isOpen, closeTerminal } = useTerminal();
  const router = useRouter();
  const [history, setHistory] = useState<Line[]>([
    { text: 'security-hub terminal v1.0.0', type: 'output' },
    { text: '', type: 'output' },
    { text: 'Type "help" to see available commands.', type: 'output' },
    { text: '', type: 'output' },
    { text: 'Tip:', type: 'output' },
    { text: 'Use "mission" to enter Mission Control.', type: 'output' },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

    const command = trimmed.toLowerCase();
    const newHistory = [...history, { text: `user@security-hub:~$ ${trimmed}`, type: 'input' as const }];

    // Add to command history list
    setCmdHistory((prev) => [trimmed, ...prev.filter((c) => c !== trimmed)].slice(0, 50));
    setHistoryIdx(-1);

    const addLines = (lines: { text: string; type: Line['type'] }[]) => {
      setHistory([...newHistory, ...lines]);
    };

    const navigateToSection = (sectionId: string, message: string) => {
      addLines([{ text: message, type: 'output' }]);
      setTimeout(() => {
        closeTerminal();
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', `/#${sectionId}`);
        } else {
          router.push(`/#${sectionId}`);
        }
      }, 500);
    };

    switch (command) {
      case 'help':
        addLines([
          {
            text: `AVAILABLE COMMANDS\n\nabout\t\t\tView profile overview\nskills\t\t\tOpen learning areas\njourney\t\t\tView my journey\nprojects\t\tBrowse featured projects\nopensource\t\tExplore OSS contributions\ncertifications\tView certifications\nresearch\t\tView research works\nnotebook\t\tView research notebook\ncontact\t\t\tOpen secure connection panel\nresume\t\t\tDownload resume\nmission\t\t\tEnter Mission Control\nclear\t\t\tClear terminal\nexit\t\t\tClose terminal\n\nTip: For a surprise, try 'whoami', 'uptime', 'coffee', 'nasa', 'isro', '42', 'hacktheplanet', 'interstellar'`,
            type: 'output',
          },
        ]);
        break;

      case 'about':
        navigateToSection('about', 'Navigating to About...');
        break;

      case 'skills':
        navigateToSection('skills', 'Opening Learning Areas...');
        break;

      case 'journey':
        navigateToSection('timeline', 'Navigating to Journey...');
        break;

      case 'projects':
        navigateToSection('projects', 'Opening Projects...');
        break;

      case 'opensource':
        navigateToSection('opensource', 'Opening Open Source Observatory...');
        break;

      case 'certifications':
        navigateToSection('certifications', 'Navigating to Certifications...');
        break;

      case 'research':
        navigateToSection('research', 'Opening Research Section...');
        break;

      case 'notebook':
        navigateToSection('notebook', 'Opening Research Notebook...');
        break;

      case 'contact':
        navigateToSection('contact', 'Opening Secure Connection Panel...');
        break;

      case 'resume':
        addLines([{ text: 'Preparing Resume Download...\n\nDownload Completed Successfully!!!', type: 'output' }]);
        // Trigger PDF Download
        const link = document.createElement('a');
        link.href = profile.resumeUrl;
        link.download = 'Vrajkumar_Shah_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;

      case 'mission':
        addLines([{ text: 'Connecting to Mission Control...', type: 'output' }]);
        setTimeout(() => {
          closeTerminal();
          router.push('/mission');
        }, 1000);
        break;

      case 'clear':
        setHistory([]);
        break;

      case 'exit':
        addLines([{ text: 'Closing terminal...', type: 'output' }]);
        setTimeout(() => {
          closeTerminal();
        }, 500);
        break;

      case 'whoami':
        addLines([
          {
            text: `IDENTITY REPORT\n\nName\t\t\tVrajkumar Shah\nRole\t\t\tComputer Engineering Student\nAlignment\t\tCurious Neutral\n\nCurrent Build:\nCybersecurity Learner | Open Source Contributor | Research-Oriented Builder\n\nKnown Behavior:\nBreaks things | Learns why they broke | Writes about it`,
            type: 'output',
          },
        ]);
        break;

      case 'uptime':
        addLines([
          {
            text: `SYSTEM STATUS\n\nSleep Schedule\t\tDEGRADED\nCuriosity\t\t\tRUNNING\nOpen Source\t\t\tACTIVE\nCybersecurity\t\tACTIVE\nProcrastination\t\tCONTAINED\n\nLast Reboot:\nUnknown\n\nStatus:\nSurprisingly operational.`,
            type: 'output',
          },
        ]);
        break;

      case 'coffee':
        addLines([
          {
            text: `CAFFEINE DIAGNOSTICS\n\nCoffee Levels\tOPTIMAL\nMotivation\t\t+25\nDebugging\t\t+10\nPatience\t\t+15\n\nWarning:\nDependency exceeds recommended limits.\n\nRecommendation:\nIgnored successfully.`,
            type: 'output',
          },
        ]);
        break;

      case 'nasa':
        addLines([
          {
            text: `MISSION LOG DETECTED\n\nCurrent Location\tEarth\nResearch Status\t\tACTIVE\nCuriosity Level\t\tMAXIMUM\n\nInterests:\n• Space Technology\n• Open Science\n• Remote Sensing\n• Scientific Research\n\nTry typing 'mission'.`,
            type: 'output',
          },
        ]);
        break;

      case 'isro':
        addLines([
          {
            text: `TRAJECTORY ANALYSIS\n\nCurrent Orbit\t\tStudent\nTarget Orbit\t\tEngineer\n\nNavigation System:\n• Learning\n• Research\n• Open Source\n• Persistence\n\nTry typing 'mission'.`,
            type: 'output',
          },
        ]);
        break;

      case '42':
        addLines([
          {
            text: `UNIVERSAL CONSTANT DETECTED\n\nAnswer\t\t\t42\n\nSearching for:\nThe actual question\n\nProgress:\nStill loading after several billion years.`,
            type: 'output',
          },
        ]);
        break;

      case 'hacktheplanet':
        addLines([
          {
            text: `ACCESS REQUEST RECEIVED\n\nTarget:\nEntire Planet\n\nPermission:\nDENIED\n\nSuggested Roadmap:\n1. Learn Linux\n2. Learn Networking\n3. Learn Security\n4. Touch Grass\n\nThen try again.`,
            type: 'output',
          },
        ]);
        break;

      case 'interstellar':
        addLines([
          {
            text: `TIME DILATION ACTIVE\n\n5 minutes into fixing CSS\n\nElapsed Time:\n3 hours 47 minutes\n\nRelativity confirmed.`,
            type: 'output',
          },
        ]);
        break;

      default:
        addLines([
          {
            text: `Command not found: ${trimmed}\n\nType "help" to see available commands.`,
            type: 'error',
          },
        ]);
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
            className="w-full max-w-4xl h-[70vh] flex flex-col shadow-2xl rounded-xl border border-white/5 overflow-hidden bg-[#020617]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#020617] border-b border-white/5 select-none">
              <div className="flex items-center gap-4">
                {/* Mac-style controls */}
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  <span className="w-3 h-3 rounded-full bg-[#FBBF24]" />
                  <span className="w-3 h-3 rounded-full bg-[#22C55E]" />
                </div>
                {/* Title */}
                <span id="terminal-title" className="font-jetbrains text-xs text-[#CBD5E1] tracking-wide">
                  terminal@security-hub
                </span>
              </div>
              {/* Close/Exit Action label on Right */}
              <button
                onClick={closeTerminal}
                className="text-[10px] font-jetbrains text-hub-muted hover:text-[#CBD5E1] transition-colors uppercase tracking-wider"
                aria-label="Close terminal"
              >
                ESC to Exit
              </button>
            </div>

            {/* Terminal body */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#020617]">
              {/* Scrollable history area */}
              <div
                ref={containerRef}
                className="flex-1 overflow-y-auto p-6 font-jetbrains text-xs space-y-2 selection:bg-hub-green/30 select-text cursor-text text-[#CBD5E1]"
                onClick={() => inputRef.current?.focus()}
              >
                {history.map((line, idx) => {
                  let colorClass = 'text-[#CBD5E1]';
                  if (line.type === 'input') colorClass = 'text-[#00FF9D]';
                  else if (line.type === 'error') colorClass = 'text-[#EF4444]';
                  else if (line.type === 'link') colorClass = 'text-[#3B82F6] hover:underline';

                  return (
                    <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                      <span className={colorClass}>{line.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Input prompt — pinned to bottom, bordered */}
              <div
                className="mx-4 mb-4 flex items-center gap-2 px-4 py-3 rounded-lg font-jetbrains text-xs text-[#00FF9D] whitespace-nowrap cursor-text"
                style={{
                  border: '1px solid rgba(0, 255, 157, 0.25)',
                  background: 'rgba(0, 255, 157, 0.03)',
                }}
                onClick={() => inputRef.current?.focus()}
              >
                <span className="select-none shrink-0">user@security-hub:~$</span>
                <div className="relative flex-1 flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    className="w-full bg-transparent border-none outline-none text-[#00FF9D] text-xs font-jetbrains caret-transparent focus:ring-0 focus:outline-none focus-visible:!outline-none focus-visible:!ring-0 p-0"
                    style={{ outline: 'none', boxShadow: 'none' }}
                    aria-label="Terminal command input"
                    autoFocus
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                  <span
                    className="absolute pointer-events-none text-[#00FF9D] font-jetbrains leading-none flex items-center"
                    style={{ left: `${Math.max(0, input.length)}ch` }}
                  >
                    <span className={`terminal-cursor ${isInputFocused ? 'active' : ''}`} />
                  </span>
                </div>
              </div>
            </div>

            {/* Terminal Footer status info */}
            <div className="px-6 py-2 bg-[#020617] border-t border-white/5 flex justify-between items-center text-[10px] text-hub-muted-2 font-jetbrains">
              <span>HOST: vrajkumar-shah</span>
              <span>TAB to Autocomplete</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
