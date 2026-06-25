'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket,
  Globe,
  BookOpen,
  FlaskConical,
  Star,
  ExternalLink,
  Calendar,
  Tag,
  ChevronDown,
  Radio,
  Compass,
  Cpu,
} from 'lucide-react';

/* ─────────────────────────── DATA ─────────────────────────────────────── */

const openSciencePrograms = [
  {
    id: 'nasa-open-science',
    icon: <FlaskConical size={22} />,
    name: 'NASA Open Science Initiative',
    org: 'NASA',
    role: 'Self-directed Participant',
    description:
      'Participating in NASA\'s Transform to Open Science (TOPS) mission by studying open-science principles, engaging with open-access astronomical datasets, and applying transparent, reproducible workflows to personal space-telemetry projects.',
    outcome:
      'Completed the TOPS OpenCore curriculum modules covering open data, open software, and open results frameworks.',
    link: 'https://science.nasa.gov/open-science/',
  },
  {
    id: 'noaa-weather-open',
    icon: <FlaskConical size={22} />,
    name: 'NOAA Open Data Dissemination',
    org: 'NOAA / NESDIS',
    role: 'Data Consumer & Experimenter',
    description:
      'Accessing NOAA\'s open telemetry streams and APT signal archives to cross-validate locally decoded satellite imagery. Using the NOAA CLASS data archive for historical pass comparison.',
    outcome:
      'Successfully reconstructed NOAA-18 weather imagery from raw SDR captures and validated against NOAA open archive frames.',
    link: 'https://www.noaa.gov/information-technology/open-data-dissemination',
  },
];

const researchLogs = [
  {
    id: 'log-001',
    number: 'LOG 001',
    title: 'NOAA APT Signal Decoding via SDR & SciPy',
    date: '18 Jun 2026',
    content:
      'Configured a RTL-SDR dongle with a bandpass filter to capture 137 MHz NOAA-18 APT transmissions. Used SciPy\'s signal processing pipeline in Python to demodulate the FM signal, extract line sync pulses, and reconstruct two-channel (visible + infrared) weather imagery. Identified frame-sync corruption at low elevation angles — likely multipath interference.',
    tags: ['SDR', 'Signal Processing', 'NOAA', 'Python'],
  },
  {
    id: 'log-002',
    number: 'LOG 002',
    title: 'MIL-STD-1553 Bus Vulnerability Analysis',
    date: '29 Apr 2026',
    content:
      'Examined the Manchester II biphase coding scheme used in spacecraft avionics buses (MIL-STD-1553B). Simulated a noisy transceiver environment and injected controlled bit-flip errors into command frames. Demonstrated how missing checksum validation in legacy implementations allows undetected command corruption — a critical finding for avionics security posture reviews.',
    tags: ['Avionics', 'Cybersecurity', 'Bus Protocols', 'RTOS'],
  },
  {
    id: 'log-003',
    number: 'LOG 003',
    title: 'Orbital Mechanics: Deriving Kepler\'s Third Law Numerically',
    date: '12 Mar 2026',
    content:
      'Implemented a numerical integrator (RK4) in Python to simulate two-body orbital dynamics under gravitational influence. Verified results against TLE data from Celestrak for the ISS and a selection of GPS Block IIF satellites. Explored how atmospheric drag at LEO altitudes causes measurable orbital decay over simulation windows of 30+ days.',
    tags: ['Orbital Mechanics', 'Simulation', 'Python', 'TLE'],
  },
];

const spaceNotes = [
  {
    id: 'note-remote-sensing',
    topic: 'Remote Sensing & Multispectral Imaging',
    content:
      'Exploring how satellite sensors capture reflected electromagnetic radiation across multiple spectral bands. Studying vegetation indices (NDVI), urban heat mapping, and change detection using Sentinel-2 imagery accessed through the Copernicus Open Access Hub.',
    source: 'ESA Copernicus, NASA Earthdata',
    sourceUrl: 'https://scihub.copernicus.eu/',
    tags: ['Remote Sensing', 'Sentinel-2'],
  },
  {
    id: 'note-orbital-mechanics',
    topic: 'Orbital Mechanics & Propagation',
    content:
      'Deep-diving into two-line element sets (TLE), SGP4/SDP4 propagators, and the physics of orbital maneuvers. Using Skyfield and Poliastro Python libraries to model satellite passes and compute ground-track intersections.',
    source: 'Celestrak, Poliastro Docs',
    sourceUrl: 'https://celestrak.org/',
    tags: ['TLE', 'SGP4', 'Python'],
  },
  {
    id: 'note-satellite-security',
    topic: 'Satellite Systems Security',
    content:
      'Researching the cybersecurity threat landscape for satellite infrastructure — ground station attacks, uplink spoofing, and command injection. Cross-referencing the MITRE ATT&CK for ICS matrix with space-specific threat actors and case studies.',
    source: 'MITRE ATT&CK for ICS, ESA SPACE-ISAC',
    sourceUrl: 'https://attack.mitre.org/matrices/ics/',
    tags: ['Cybersecurity', 'Space Systems', 'MITRE'],
  },
];

const futureAspirations = [
  {
    id: 'aspiration-space-cyber',
    number: '01',
    title: 'Cybersecurity for Space Systems',
    subtitle: 'Securing the Final Frontier',
    content:
      'My long-term vision is to specialise in the intersection of cybersecurity and aerospace — hardening satellite communication links, avionics software stacks, and ground-control networks against adversarial threats. As space becomes critical infrastructure, I want to be at the forefront of defining security standards and threat models for the next generation of orbital systems.',
  },
  {
    id: 'aspiration-open-space-data',
    number: '02',
    title: 'Open-Source Space Intelligence Tooling',
    subtitle: 'Democratising Space Data Access',
    content:
      'I aspire to contribute to open-source tooling that makes space-derived data — telemetry, imagery, orbital analytics — accessible to researchers and engineers worldwide. Bridging the gap between raw satellite feeds and actionable intelligence through transparent, reproducible software pipelines.',
  },
];

/* ─────────────────── SECTION BADGE COMPONENT ───────────────────────────── */
function SectionBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-mission-gold/25 bg-mission-gold/8 text-mission-gold text-[10px] font-semibold tracking-[0.15em] uppercase font-jetbrains mb-6">
      {icon}
      {label}
    </div>
  );
}

interface TelemetryData {
  altitude: number; // km
  velocity: number; // km/s
  period: number; // minutes
  lat: number;
  lng: number;
  snr: number; // dB
  signalStatus: 'Lock' | 'Searching' | 'Degraded';
}

/* ──────────────────────── PAGE COMPONENT ───────────────────────────────── */
export default function MissionControlPage() {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    altitude: 408, // LEO typical (ISS)
    velocity: 7.66,
    period: 92.8,
    lat: 34.0522,
    lng: -118.2437,
    snr: 24.3,
    signalStatus: 'Lock',
  });

  const [orbitMode, setOrbitMode] = useState<'LEO' | 'MEO' | 'GEO'>('LEO');
  const [orbitAngle, setOrbitAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        let deltaAngle = 0.05;
        if (orbitMode === 'MEO') deltaAngle = 0.02;
        if (orbitMode === 'GEO') deltaAngle = 0.002;

        const newAngle = (orbitAngle + deltaAngle) % 360;
        setOrbitAngle(newAngle);

        const lat = Math.sin((newAngle * Math.PI) / 180) * 51.6;
        const lng = ((prev.lng + 0.1 + 180) % 360) - 180;

        const snrJitter = (Math.random() - 0.5) * 0.4;
        const newSnr = Math.max(10, Math.min(30, prev.snr + snrJitter));

        return {
          ...prev,
          lat: parseFloat(lat.toFixed(4)),
          lng: parseFloat(lng.toFixed(4)),
          snr: parseFloat(newSnr.toFixed(1)),
          signalStatus: newSnr > 20 ? 'Lock' : newSnr > 15 ? 'Degraded' : 'Searching',
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [orbitAngle, orbitMode]);

  const handleOrbitModeChange = (mode: 'LEO' | 'MEO' | 'GEO') => {
    setOrbitMode(mode);
    if (mode === 'LEO') {
      setTelemetry((prev) => ({
        ...prev,
        altitude: 400,
        velocity: 7.67,
        period: 92.6,
      }));
    } else if (mode === 'MEO') {
      setTelemetry((prev) => ({
        ...prev,
        altitude: 20200,
        velocity: 3.87,
        period: 718,
      }));
    } else if (mode === 'GEO') {
      setTelemetry((prev) => ({
        ...prev,
        altitude: 35786,
        velocity: 3.07,
        period: 1436,
      }));
    }
  };

  const orbitRadius = orbitMode === 'LEO' ? 50 : orbitMode === 'MEO' ? 90 : 130;
  const satX = 150 + Math.cos((orbitAngle * Math.PI) / 180) * orbitRadius;
  const satY = 150 + Math.sin((orbitAngle * Math.PI) / 180) * orbitRadius;

  return (
    <div className="select-text">

      {/* ════════════ § 1 — MISSION BRIEF (HERO) ════════════════════════ */}
      <section
        id="mission-brief"
        className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 relative"
      >
        {/* Stars radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_40%,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto"
        >
          <SectionBadge icon={<Rocket size={12} />} label="Mission Brief" />

          <h1 className="font-space-grotesk text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gradient-gold leading-tight mb-6">
            Space Technology &amp; Cybersecurity Explorer
          </h1>

          <p className="text-mission-text/65 text-base sm:text-lg leading-relaxed mb-10">
            Where security meets the cosmos — a personal curiosity lab tracking my exploration of satellite telemetry, open science, and the cybersecurity challenges of orbital infrastructure.
          </p>

          {/* Personal statement card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-left glass-card-mission p-6 rounded-2xl border border-mission-gold/15 hover:border-mission-gold/30 transition-colors"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-mission-gold/10 border border-mission-gold/20 flex items-center justify-center">
                <Rocket size={16} className="text-mission-gold" />
              </div>
            </div>
            <p className="text-mission-text/80 text-sm leading-relaxed">
              I&apos;m a Computer Engineering undergraduate with a deep curiosity for the intersection of aerospace technology and cybersecurity. While my primary focus is securing digital systems here on Earth, I&apos;ve always been drawn to how those same principles apply — and are even more critical — in the unforgiving environment of space. This dashboard is my personal curiosity lab, not a second portfolio. It&apos;s where I track what I&apos;m learning, experimenting with, and envisioning for the future of secure space systems.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════ § 2 — TELEMETRY & TRACKING ════════════════════════ */}
      <section
        id="telemetry-tracking"
        className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <SectionBadge icon={<Compass size={12} />} label="Telemetry & Tracking" />
          <h2 className="font-space-grotesk text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
            Live Orbital Tracker &amp; Telemetry Deck
          </h2>
          <p className="text-mission-text/60 text-base max-w-2xl mx-auto">
            Interact with the simulation to propagate satellites across LEO, MEO, and GEO regions and observe real-time telemetry metrics.
          </p>
        </motion.div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Orbital Path Simulator */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 glass-card-mission p-6 rounded-2xl border border-mission-border hover:border-mission-gold/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="font-space-grotesk text-lg font-bold text-mission-text flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                    className="flex items-center justify-center text-mission-gold"
                  >
                    <Compass size={18} />
                  </motion.div>
                  Orbit Trajectory Simulator
                </h3>
                <div className="flex gap-1.5 bg-mission-gold/5 p-1 rounded-xl border border-mission-gold/20">
                  {(['LEO', 'MEO', 'GEO'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => handleOrbitModeChange(mode)}
                      className={`px-3.5 py-1 text-xs font-semibold rounded-lg font-jetbrains transition-all cursor-pointer ${
                        orbitMode === mode
                          ? 'bg-mission-gold text-mission-bg shadow-md font-bold'
                          : 'text-mission-muted hover:text-mission-text'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orbit Visual representation */}
              <div className="flex justify-center items-center py-8 bg-mission-bg/40 rounded-xl border border-mission-border/30 relative overflow-hidden">
                <svg width="300" height="300" className="max-w-full" aria-label="Visual orbit representation">
                  {/* Orbital Paths */}
                  <circle cx="150" cy="150" r="50" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3,3" opacity="0.2" />
                  <circle cx="150" cy="150" r="90" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="4,4" opacity="0.2" />
                  <circle cx="150" cy="150" r="130" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="5,5" opacity="0.2" />

                  {/* Active Highlight Path */}
                  <circle
                    cx="150"
                    cy="150"
                    r={orbitRadius}
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                    className="glow-gold"
                    opacity="0.75"
                  />

                  {/* Central Earth */}
                  <circle cx="150" cy="150" r="28" fill="#0B1120" stroke="#D4AF37" strokeWidth="1.5" />
                  <path d="M142,130 Q145,140 135,145 Q130,150 140,165 Q145,170 155,165 Q165,160 170,145 Q160,135 142,130 Z" fill="rgba(212,175,55,0.15)" />
                  <path d="M155,125 Q165,130 162,140 Q170,145 175,135 Z" fill="rgba(212,175,55,0.15)" />

                  {/* Satellite */}
                  <g transform={`translate(${satX}, ${satY})`}>
                    <circle cx="0" cy="0" r="6" fill="#D4AF37" className="animate-ping" style={{ animationDuration: '3s' }} />
                    <circle cx="0" cy="0" r="4.5" fill="#FBBF24" />
                    {/* Solar panels */}
                    <rect x="-10" y="-1.5" width="5" height="3" fill="#60A5FA" stroke="#D4AF37" strokeWidth="0.5" rx="0.5" />
                    <rect x="5" y="-1.5" width="5" height="3" fill="#60A5FA" stroke="#D4AF37" strokeWidth="0.5" rx="0.5" />
                  </g>

                  {/* Labels */}
                  <text x="150" y="153" fill="#C9A84C" fontSize="8" textAnchor="middle" fontFamily="var(--font-jetbrains)" fontWeight="bold">
                    EARTH
                  </text>
                  <text x={satX} y={satY - 10} fill="#FFF7E6" fontSize="8" textAnchor="middle" fontFamily="var(--font-jetbrains)" fontWeight="bold">
                    SAT_C1
                  </text>
                </svg>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-mission-border/30 text-xs font-jetbrains text-mission-muted">
              <span className="text-mission-gold font-semibold uppercase">Orbit Definition:</span>{' '}
              {orbitMode === 'LEO' && 'Low Earth Orbit (Approx. 400km Altitude) — Ideal for environmental sensors & imaging.'}
              {orbitMode === 'MEO' && 'Medium Earth Orbit (Approx. 20,200km Altitude) — Home to Global Positioning Systems (GPS).'}
              {orbitMode === 'GEO' && 'Geostationary Equatorial Orbit (Approx. 35,786km Altitude) — Synced with rotation for communications.'}
            </div>
          </motion.div>

          {/* Telemetry Stream Dashboard Panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card-mission p-6 rounded-2xl border border-mission-border hover:border-mission-gold/30 transition-all flex flex-col justify-between"
          >
            <div>
              <h3 className="font-space-grotesk text-lg font-bold text-mission-text mb-6 flex items-center gap-2">
                <Radio className="text-mission-gold animate-pulse" size={18} />
                Telemetry Stream [SAT_C1]
              </h3>

              <div className="space-y-4 font-jetbrains text-xs">
                {/* Status Bar */}
                <div className="bg-mission-bg/60 p-3.5 rounded-xl border border-mission-border/20 flex justify-between items-center">
                  <span className="text-mission-muted font-semibold uppercase">Signal Lock</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase font-jetbrains tracking-wider ${
                    telemetry.signalStatus === 'Lock'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                      : telemetry.signalStatus === 'Degraded'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-red-500/10 text-red-400 border border-red-500/30'
                  }`}>
                    {telemetry.signalStatus} ({telemetry.snr} dB)
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-mission-bg/30 p-3 rounded-xl border border-mission-border/10">
                    <div className="text-[9px] text-mission-muted uppercase tracking-wider mb-1 font-semibold">Altitude</div>
                    <div className="text-sm font-bold text-mission-text font-jetbrains">
                      {telemetry.altitude.toLocaleString()} km
                    </div>
                  </div>
                  <div className="bg-mission-bg/30 p-3 rounded-xl border border-mission-border/10">
                    <div className="text-[9px] text-mission-muted uppercase tracking-wider mb-1 font-semibold">Velocity</div>
                    <div className="text-sm font-bold text-mission-text font-jetbrains">
                      {telemetry.velocity} km/s
                    </div>
                  </div>
                  <div className="bg-mission-bg/30 p-3 rounded-xl border border-mission-border/10">
                    <div className="text-[9px] text-mission-muted uppercase tracking-wider mb-1 font-semibold">Period</div>
                    <div className="text-sm font-bold text-mission-text font-jetbrains">
                      {telemetry.period} min
                    </div>
                  </div>
                  <div className="bg-mission-bg/30 p-3 rounded-xl border border-mission-border/10">
                    <div className="text-[9px] text-mission-muted uppercase tracking-wider mb-1 font-semibold">Inclination</div>
                    <div className="text-sm font-bold text-mission-text font-jetbrains">
                      51.64°
                    </div>
                  </div>
                </div>

                {/* Geographic Sub-satellite position */}
                <div className="bg-mission-bg/30 p-3.5 rounded-xl border border-mission-border/10 space-y-2">
                  <div className="text-[9px] text-mission-muted uppercase tracking-wider font-semibold">Sub-satellite Position</div>
                  <div className="grid grid-cols-2 gap-1 text-xs text-mission-text font-bold">
                    <div>LAT: <span className="text-mission-gold">{telemetry.lat}° N</span></div>
                    <div>LNG: <span className="text-mission-gold">{telemetry.lng}° W</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => {
                  setTelemetry((prev) => ({ ...prev, signalStatus: 'Searching', snr: 11.2 }));
                  setTimeout(() => {
                    setTelemetry((prev) => ({ ...prev, signalStatus: 'Lock', snr: 26.4 }));
                  }, 1500);
                }}
                className="w-full py-2.5 bg-mission-gold/10 hover:bg-mission-gold/20 border border-mission-gold/30 hover:border-mission-gold/50 rounded-xl text-xs font-bold text-mission-gold transition-colors font-jetbrains cursor-pointer uppercase tracking-wider text-center"
              >
                Sync Receiver Antenna
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════ § 3 — OPEN SCIENCE ════════════════════════════════ */}
      <section
        id="open-science"
        className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        {/* Radial glow */}
        <div className="absolute left-0 right-0 h-96 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(212,175,55,0.04)_0%,transparent_70%)] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <SectionBadge icon={<Globe size={12} />} label="Open Science" />
          <h2 className="font-space-grotesk text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
            NASA Open Science Initiative
          </h2>
          <p className="text-mission-text/60 text-base max-w-2xl mx-auto">
            Participating in open science programs that democratize access to space research data and tools.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {openSciencePrograms.map((prog, i) => (
            <motion.div
              key={prog.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="glass-card-mission p-6 rounded-2xl border border-mission-border hover:border-mission-gold/30 transition-all group"
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-mission-gold/10 border border-mission-gold/20 flex items-center justify-center mb-5 text-mission-gold group-hover:bg-mission-gold/15 transition-colors">
                {prog.icon}
              </div>

              {/* Name & meta */}
              <h3 className="font-space-grotesk text-lg font-bold text-mission-text mb-2 leading-snug">
                {prog.name}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[10px] font-semibold tracking-wider text-mission-gold bg-mission-gold/10 border border-mission-gold/25 px-2 py-0.5 rounded font-jetbrains uppercase">
                  {prog.org}
                </span>
                <span className="text-mission-muted text-xs">· {prog.role}</span>
              </div>

              {/* Description */}
              <p className="text-mission-text/70 text-sm leading-relaxed mb-4">
                {prog.description}
              </p>

              {/* Outcome */}
              <div className="border-l-2 border-mission-gold/40 pl-3 py-1 mb-4">
                <p className="text-xs text-mission-text/60">
                  <span className="text-mission-gold font-semibold">Outcome:</span>{' '}
                  {prog.outcome}
                </p>
              </div>

              {/* Link */}
              <a
                href={prog.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-mission-gold/70 hover:text-mission-gold transition-colors"
              >
                <ExternalLink size={12} />
                View Program
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════ § 3 — RESEARCH LOGS (MISSION LOGS) ════════════════ */}
      <section
        id="research-logs"
        className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <SectionBadge icon={<BookOpen size={12} />} label="Research Logs" />
          <h2 className="font-space-grotesk text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
            Mission Logs
          </h2>
          <p className="text-mission-text/60 text-base max-w-2xl mx-auto">
            Personal field notes from explorations at the intersection of space technology, open science, and cybersecurity.
          </p>
        </motion.div>

        {/* Timeline-style log list */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-mission-gold/15 hidden md:block" />

          <div className="space-y-6">
            {researchLogs.map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative md:pl-16"
              >
                {/* Timeline dot */}
                <div className="absolute left-4 top-6 w-4 h-4 rounded-full bg-mission-bg border-2 border-mission-gold/50 hidden md:flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-mission-gold" />
                </div>

                <div className="glass-card-mission p-6 rounded-2xl border border-mission-border hover:border-mission-gold/25 transition-all group">
                  {/* Log number */}
                  <div className="text-[10px] font-semibold tracking-[0.15em] text-mission-gold font-jetbrains mb-2 uppercase">
                    {log.number}
                  </div>

                  <h3 className="font-space-grotesk text-xl font-bold text-mission-text mb-2">
                    {log.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-mission-muted text-xs mb-4 font-jetbrains">
                    <Calendar size={12} />
                    {log.date}
                  </div>

                  <p className="text-mission-text/70 text-sm leading-relaxed mb-4">
                    {log.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {log.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[10px] text-mission-muted/80 border border-mission-gold/20 bg-mission-gold/5 px-2 py-0.5 rounded-full font-jetbrains"
                      >
                        <Tag size={9} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ § 4 — SPACE NOTES (CURIOSITY LAB) ═════════════════ */}
      <section
        id="space-notes"
        className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <SectionBadge icon={<BookOpen size={12} />} label="Space Notes" />
          <h2 className="font-space-grotesk text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
            Curiosity Lab
          </h2>
          <p className="text-mission-text/60 text-base max-w-2xl mx-auto">
            Topics I&apos;ve been exploring, notes I&apos;ve taken, and ideas that are still brewing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {spaceNotes.map((note, i) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="glass-card-mission p-6 rounded-2xl border border-mission-border hover:border-mission-gold/30 transition-all flex flex-col justify-between group"
            >
              <div>
                <h3 className="font-space-grotesk text-base font-bold text-mission-text mb-3 leading-snug">
                  {note.topic}
                </h3>
                <p className="text-mission-text/65 text-sm leading-relaxed mb-4">
                  {note.content}
                </p>
              </div>

              <div>
                {/* Source */}
                <a
                  href={note.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-mission-gold/60 hover:text-mission-gold transition-colors mb-3"
                >
                  <ExternalLink size={11} />
                  {note.source}
                </a>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-mission-muted border border-mission-gold/15 bg-mission-gold/5 px-2 py-0.5 rounded font-jetbrains"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════ § 5 — FUTURE ASPIRATIONS ══════════════════════════ */}
      <section
        id="future-aspirations"
        className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <SectionBadge icon={<Star size={12} />} label="Future Aspirations" />
          <h2 className="font-space-grotesk text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
            Where I&apos;m Headed
          </h2>
          <p className="text-mission-text/60 text-base max-w-2xl mx-auto">
            Long-term visions for how my work in cybersecurity and space technology might one day converge.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {futureAspirations.map((asp, i) => (
            <motion.div
              key={asp.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="glass-card-mission p-7 rounded-2xl border border-mission-border hover:border-mission-gold/30 transition-all relative overflow-hidden group"
            >
              {/* Large faded number */}
              <div className="absolute top-4 right-6 text-6xl font-bold text-mission-gold/8 font-space-grotesk select-none pointer-events-none">
                {asp.number}
              </div>

              {/* Star icon */}
              <div className="text-mission-gold mb-4">
                <Star size={18} />
              </div>

              {/* Title */}
              <h3 className="font-space-grotesk text-xl font-bold text-mission-text mb-1 leading-snug">
                {asp.title}
              </h3>

              {/* Subtitle badge */}
              <span className="inline-block text-[10px] font-semibold tracking-wider text-mission-gold bg-mission-gold/10 border border-mission-gold/25 px-2 py-0.5 rounded font-jetbrains uppercase mb-4">
                {asp.subtitle}
              </span>

              {/* Content */}
              <p className="text-mission-text/70 text-sm leading-relaxed">
                {asp.content}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
