'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTerminal } from '@/contexts/TerminalContext';

export function useKeyboardShortcuts() {
  const { isOpen, openTerminal, closeTerminal } = useTerminal();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focused on an input, textarea, or select
      const target = e.target as HTMLElement;
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      if (isTyping) return;

      // T → Open terminal
      if (e.key === 't' || e.key === 'T') {
        if (!isOpen) {
          e.preventDefault();
          openTerminal();
        }
        return;
      }

      // M → Open Mission Control
      if ((e.key === 'm' || e.key === 'M') && !isOpen) {
        e.preventDefault();
        router.push('/mission');
        return;
      }

      // ESC → Close terminal
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        closeTerminal();
        return;
      }

      // Q → Return from Mission Control (handled in mission page)
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, openTerminal, closeTerminal, router]);
}
