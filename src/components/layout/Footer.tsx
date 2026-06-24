"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';
import { profile } from '@/data/profile';

const tickerWords = ['Learning...', 'Building...', 'Researching...', 'Securing...'];

export default function Footer() {
  const [tickerIndex, setTickerIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const isHub = pathname === '/';

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState('out');
      setTimeout(() => {
        setTickerIndex((prev) => (prev + 1) % tickerWords.length);
        setFadeState('in');
      }, 500); // wait for fade out
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="border-t border-white/5 bg-hub-surface/40 backdrop-blur-sm">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isHub ? 'py-3' : 'py-6'}`}>
        <div className={`grid grid-cols-1 md:grid-cols-2 ${isHub ? 'gap-2 mb-2' : 'gap-6 mb-6'}`}>
          {/* Brand */}
          <div>
            <div className={`flex items-center gap-2 ${isHub ? 'mb-1' : 'mb-3'}`}>
              <div className={`${isHub ? 'w-6 h-6' : 'w-7 h-7'} rounded-lg bg-hub-green/10 border border-hub-green/30 flex items-center justify-center`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-hub-green" aria-hidden="true">
                  <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <ellipse cx="12" cy="12" rx="9" ry="3" stroke="#D4AF37" strokeWidth="1.2" transform="rotate(-30 12 12)" strokeDasharray="3,2" />
                  <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                </svg>
              </div>
              <span
                className="font-semibold text-sm text-hub-text/85"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                {profile.shortName !== '[INSERT NAME]' ? profile.missionName : 'SECURITY HUB'}
              </span>
            </div>
            {/* Blinking & disappearing ticker word */}
            <div className={`${isHub ? 'h-5' : 'h-6'} flex items-center font-jetbrains text-xs ${isHub ? 'mt-0.5' : 'mt-1'}`}>
              <span 
                className={`transition-opacity duration-500 text-hub-green font-semibold tracking-wider ${
                  fadeState === 'in' ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {tickerWords[tickerIndex]}
              </span>
              <span className={`terminal-cursor w-1.5 ${isHub ? 'h-2 ml-1' : 'h-3 ml-1'} bg-hub-green`} />
            </div>
            <p className={`text-hub-muted-2 text-xs ${isHub ? 'mt-0.5' : 'mt-1'}`}>
              © {year}{' '}
              {profile.name}.
              All rights reserved.
            </p>
          </div>

          {/* Connect */}
          <div className={`md:text-right flex flex-col md:items-end ${isHub ? 'gap-2' : 'gap-3'}`}>
            <h3
              className="text-xs font-semibold text-hub-green/80 uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Connect
            </h3>
            <div className={`${isHub ? 'flex gap-2' : 'flex gap-3'}`}>
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`${isHub ? 'w-8 h-8' : 'w-9 h-9'} rounded-lg border border-white/8 flex items-center justify-center text-hub-muted hover:text-hub-blue hover:border-hub-blue/30 hover:bg-hub-blue/5 transition-all duration-200`}
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`${isHub ? 'w-8 h-8' : 'w-9 h-9'} rounded-lg border border-white/8 flex items-center justify-center text-hub-muted hover:text-hub-text hover:border-white/20 hover:bg-white/5 transition-all duration-200`}
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
              <a
                href={`mailto:${profile.socials.email}`}
                className={`${isHub ? 'w-8 h-8' : 'w-9 h-9'} rounded-lg border border-white/8 flex items-center justify-center text-hub-muted hover:text-hub-green hover:border-hub-green/30 hover:bg-hub-green/5 transition-all duration-200`}
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
