'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Github, Linkedin, Mail, Twitter, CheckCircle2, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { profile } from '@/data/profile';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function downloadToExcel(data: FormData) {
  const timestamp = new Date().toISOString();
  const row = {
    Timestamp: timestamp,
    Name: data.name,
    Email: data.email,
    Subject: data.subject,
    Message: data.message,
  };

  const ws = XLSX.utils.json_to_sheet([row]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Messages');

  // Column widths
  ws['!cols'] = [
    { wch: 24 }, // Timestamp
    { wch: 20 }, // Name
    { wch: 30 }, // Email
    { wch: 30 }, // Subject
    { wch: 60 }, // Message
  ];

  XLSX.writeFile(wb, `contact-message-${Date.now()}.xlsx`);
}

const socials = [
  { icon: Linkedin, label: 'LinkedIn', href: profile.socials.linkedin, hoverClass: 'hover:text-hub-blue hover:border-hub-blue/30 hover:bg-hub-blue/5' },
  { icon: Github, label: 'GitHub', href: profile.socials.github, hoverClass: 'hover:text-hub-text hover:border-white/20 hover:bg-white/5' },
  { icon: Twitter, label: 'X / Twitter', href: profile.socials.twitter, hoverClass: 'hover:text-hub-text hover:border-white/20 hover:bg-white/5' },
  { icon: Mail, label: 'Email', href: `mailto:${profile.socials.email}`, hoverClass: 'hover:text-hub-green hover:border-hub-green/30 hover:bg-hub-green/5' },
];

export default function Contact() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', subject: '', message: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');

    // Simulate brief processing
    await new Promise((r) => setTimeout(r, 800));

    // Download Excel with form data
    downloadToExcel(form);

    setState('sent');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  return (
    <section
      id="contact"
      className="section-padding relative z-10"
      aria-label="Contact section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
          className="mb-12 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="flex-1 h-px bg-white/6 max-w-[80px]" />
            <span className="text-xs font-semibold text-hub-green/70 tracking-widest uppercase font-jetbrains" style={{ fontFamily: 'var(--font-jetbrains)' }}>
              09 / Contact
            </span>
            <div className="flex-1 h-px bg-white/6 max-w-[80px]" />
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-hub-text"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Establish Secure Connection
          </h2>
          <p className="text-hub-muted mt-3 max-w-xl mx-auto leading-relaxed">
            Got a question, collaboration idea, or just want to connect? I would love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            {state === 'sent' ? (
              <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center gap-4 text-center min-h-[400px]">
                <CheckCircle2 size={40} className="text-hub-green" aria-hidden="true" />
                <h3
                  className="font-semibold text-hub-text text-lg"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  Message Received
                </h3>
                <p className="text-hub-muted text-sm">
                  Your message has been saved. I will get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setState('idle')}
                  className="mt-2 text-xs text-hub-green hover:text-hub-green/70 transition-colors font-jetbrains"
                  style={{ fontFamily: 'var(--font-jetbrains)' }}
                >
                  Send another message →
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="glass-card rounded-2xl p-6 flex flex-col gap-4"
                aria-label="Contact form"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-name" className="text-xs text-hub-muted font-jetbrains" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                      Name <span className="text-hub-green" aria-label="required">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="bg-white/4 border border-white/8 rounded-lg px-3 py-2.5 text-sm text-hub-text placeholder:text-hub-muted-2 focus:outline-none focus:border-hub-green/40 focus:bg-hub-green/4 transition-all duration-200"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-email" className="text-xs text-hub-muted font-jetbrains" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                      Email <span className="text-hub-green" aria-label="required">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="bg-white/4 border border-white/8 rounded-lg px-3 py-2.5 text-sm text-hub-text placeholder:text-hub-muted-2 focus:outline-none focus:border-hub-green/40 focus:bg-hub-green/4 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-subject" className="text-xs text-hub-muted font-jetbrains" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                    Subject <span className="text-hub-green" aria-label="required">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What is this about?"
                    className="bg-white/4 border border-white/8 rounded-lg px-3 py-2.5 text-sm text-hub-text placeholder:text-hub-muted-2 focus:outline-none focus:border-hub-green/40 focus:bg-hub-green/4 transition-all duration-200"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-message" className="text-xs text-hub-muted font-jetbrains" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                    Message <span className="text-hub-green" aria-label="required">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Your message..."
                    className="bg-white/4 border border-white/8 rounded-lg px-3 py-2.5 text-sm text-hub-text placeholder:text-hub-muted-2 focus:outline-none focus:border-hub-green/40 focus:bg-hub-green/4 transition-all duration-200 resize-none"
                  />
                </div>

                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={state === 'sending'}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-hub-green text-hub-bg font-semibold text-sm rounded-lg hover:bg-hub-green/90 hover:shadow-lg hover:shadow-hub-green/20 transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {state === 'sending' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send size={16} aria-hidden="true" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <div className="glass-card rounded-2xl p-6">
              <h3
                className="font-semibold text-hub-text mb-4"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                Connect Directly
              </h3>
              <div className="flex gap-3 flex-wrap mb-6">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target={s.href.startsWith('mailto') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-xl border border-white/8 flex items-center justify-center text-hub-muted transition-all duration-200 ${s.hoverClass}`}
                      aria-label={s.label}
                    >
                      <Icon size={17} aria-hidden="true" />
                    </a>
                  );
                })}
              </div>

              <div className="border-t border-white/5 pt-4">
                <p className="text-xs text-hub-muted-2 leading-relaxed">
                  Open to research collaborations, open source discussions, internship opportunities, and general conversations about cybersecurity and technology.
                </p>
              </div>
            </div>

            {/* Response time note */}
            <div className="glass-card rounded-2xl p-5 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-hub-green mt-1.5 shrink-0 animate-pulse" aria-hidden="true" />
              <div>
                <p
                  className="text-sm font-medium text-hub-text mb-1"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  Usually responds within 48 hours
                </p>
                <p className="text-xs text-hub-muted-2 leading-relaxed">
                  [INSERT EMAIL ADDRESS] · Available for async collaboration across time zones.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
