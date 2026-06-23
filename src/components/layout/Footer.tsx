import Link from 'next/link';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { profile } from '@/data/profile';

const footerLinks = [
  { label: 'Cybersecurity', href: '#skills' },
  { label: 'Open Source', href: '#opensource' },
  { label: 'Research', href: '#research' },
  { label: 'Space Technology', href: '/mission' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-hub-surface/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-hub-green/10 border border-hub-green/30 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="#00FF9D" strokeWidth="1.2" fill="none"/>
                  <rect x="6" y="9" width="4" height="1.5" rx="0.5" fill="#00FF9D"/>
                  <rect x="5.5" y="6" width="1.5" height="4" rx="0.5" fill="#00FF9D"/>
                </svg>
              </div>
              <span
                className="font-semibold text-sm text-hub-text/80"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                {profile.shortName !== '[INSERT NAME]' ? profile.shortName : '[INSERT NAME]'}
              </span>
            </div>
            <p className="text-hub-muted text-sm leading-relaxed max-w-xs">
              Secure Connection Established
            </p>
            <p className="text-hub-muted-2 text-xs mt-1">
              Computer Engineering Undergraduate · Cybersecurity Learner
            </p>
          </div>

          {/* Focus areas */}
          <div>
            <h3
              className="text-xs font-semibold text-hub-green/80 uppercase tracking-widest mb-4"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Focus Areas
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-hub-muted hover:text-hub-text transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3
              className="text-xs font-semibold text-hub-green/80 uppercase tracking-widest mb-4"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Connect
            </h3>
            <div className="flex gap-3">
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-white/8 flex items-center justify-center text-hub-muted hover:text-hub-blue hover:border-hub-blue/30 hover:bg-hub-blue/5 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-white/8 flex items-center justify-center text-hub-muted hover:text-hub-text hover:border-white/20 hover:bg-white/5 transition-all duration-200"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
              <a
                href={profile.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-white/8 flex items-center justify-center text-hub-muted hover:text-hub-text hover:border-white/20 hover:bg-white/5 transition-all duration-200"
                aria-label="X / Twitter"
              >
                <Twitter size={16} />
              </a>
              <a
                href={`mailto:${profile.socials.email}`}
                className="w-9 h-9 rounded-lg border border-white/8 flex items-center justify-center text-hub-muted hover:text-hub-green hover:border-hub-green/30 hover:bg-hub-green/5 transition-all duration-200"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-hub-muted-2 text-xs">
            © {year}{' '}
            {profile.shortName !== '[INSERT NAME]' ? profile.shortName : '[INSERT NAME]'}.
            All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-hub-muted-2 text-xs font-jetbrains">
            <span className="w-1.5 h-1.5 rounded-full bg-hub-green inline-block animate-pulse" />
            <span>Secure Connection Established</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
