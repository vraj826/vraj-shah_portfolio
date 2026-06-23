'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Radio, Cpu, Compass, Telescope, Terminal, ArrowLeft } from 'lucide-react';

interface TelemetryData {
  altitude: number; // km
  velocity: number; // km/s
  period: number; // minutes
  lat: number;
  lng: number;
  snr: number; // dB
  signalStatus: 'Lock' | 'Searching' | 'Degraded';
}

export default function MissionControlPage() {
  // Telemetry state simulation
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    altitude: 408, // LEO typical (ISS)
    velocity: 7.66,
    period: 92.8,
    lat: 34.0522,
    lng: -118.2437,
    snr: 24.3,
    signalStatus: 'Lock',
  });

  // Orbital parameters state for interactive simulation
  const [orbitMode, setOrbitMode] = useState<'LEO' | 'MEO' | 'GEO'>('LEO');
  const [orbitAngle, setOrbitAngle] = useState(0);

  // Tick simulated telemetry lat/lng and jitter parameters
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        // Orbit angular speed approximation for LEO/MEO/GEO
        let deltaAngle = 0.05;
        if (orbitMode === 'MEO') deltaAngle = 0.02;
        if (orbitMode === 'GEO') deltaAngle = 0.002; // very slow

        const newAngle = (orbitAngle + deltaAngle) % 360;
        setOrbitAngle(newAngle);

        // Compute simulated position
        const radius = prev.altitude + 6371; // earth radius = 6371km
        const lat = Math.sin((newAngle * Math.PI) / 180) * 51.6; // 51.6 deg inclination
        const lng = ((prev.lng + 0.1 + 180) % 360) - 180;

        // Slight jitter on signal-to-noise ratio
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

  // Adjust telemetry constants based on user selecting orbit mode
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
        period: 718, // 12 hours
      }));
    } else if (mode === 'GEO') {
      setTelemetry((prev) => ({
        ...prev,
        altitude: 35786,
        velocity: 3.07,
        period: 1436, // 24 hours
      }));
    }
  };

  // Convert orbital angle to x/y coordinates for SVG rendering
  // Earth is at (150, 150)
  const orbitRadius = orbitMode === 'LEO' ? 50 : orbitMode === 'MEO' ? 90 : 130;
  const satX = 150 + Math.cos((orbitAngle * Math.PI) / 180) * orbitRadius;
  const satY = 150 + Math.sin((orbitAngle * Math.PI) / 180) * orbitRadius;

  return (
    <div className="space-y-8 select-text">
      {/* Overview/Brief Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card-mission p-8 rounded-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-mission-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-mission-gold text-xs font-semibold tracking-wider uppercase mb-2">
            <Globe size={14} className="animate-spin" />
            Active Exploration Hub
          </div>
          <h1 className="font-space-grotesk text-3xl md:text-4xl font-extrabold tracking-tight text-gradient-gold mb-4">
            Space Technology & Avionics Telemetry
          </h1>
          <p className="text-mission-text/80 text-sm md:text-base leading-relaxed">
            Exploring the intersection of aerospace, computing, and cybersecurity. This dashboard tracks real-time orbital mathematics, open satellite telemetry, and my interests in NASA open science programs, software-defined radio, and avionics bus architectures.
          </p>
        </div>
      </motion.div>

      {/* Grid of Interactive Simulator & Telemetry Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Interactive Orbit Simulator */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 glass-card-mission p-6 rounded-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-space-grotesk text-lg font-bold tracking-wider text-mission-text flex items-center gap-2">
                <Compass className="text-mission-gold" size={18} />
                Dynamic Orbit Trajectory Simulator
              </h2>
              <div className="flex gap-1.5 bg-mission-surface-2 p-1 rounded-lg border border-mission-border">
                {(['LEO', 'MEO', 'GEO'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleOrbitModeChange(mode)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      orbitMode === mode
                        ? 'bg-mission-gold text-mission-bg shadow-lg font-bold'
                        : 'text-mission-muted hover:text-mission-text'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Orbit Simulator Graph Display */}
            <div className="flex justify-center items-center py-6 bg-mission-bg/50 rounded-lg border border-mission-border/30 relative">
              <svg width="300" height="300" className="max-w-full" aria-label="Visual orbit representation">
                {/* Orbital Paths */}
                <circle cx="150" cy="150" r="50" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" />
                <circle cx="150" cy="150" r="90" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
                <circle cx="150" cy="150" r="130" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />
                
                {/* Active Mode Orbit Path Highlight */}
                <circle
                  cx="150"
                  cy="150"
                  r={orbitRadius}
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="1.5"
                  className="glow-gold"
                  opacity="0.8"
                />

                {/* Central Earth */}
                <circle cx="150" cy="150" r="30" fill="#0B1120" stroke="#D4AF37" strokeWidth="1.5" />
                {/* Earth continents abstract */}
                <path d="M142,130 Q145,140 135,145 Q130,150 140,165 Q145,170 155,165 Q165,160 170,145 Q160,135 142,130 Z" fill="rgba(212,175,55,0.15)" />
                <path d="M155,125 Q165,130 162,140 Q170,145 175,135 Z" fill="rgba(212,175,55,0.15)" />

                {/* Satellite node */}
                <g transform={`translate(${satX}, ${satY})`}>
                  <circle cx="0" cy="0" r="6" fill="#D4AF37" className="animate-ping" style={{ animationDuration: '3s' }} />
                  <circle cx="0" cy="0" r="5" fill="#FBBF24" />
                  {/* Solar panels */}
                  <rect x="-12" y="-2" width="6" height="4" fill="#60A5FA" stroke="#D4AF37" strokeWidth="0.5" rx="0.5" />
                  <rect x="6" y="-2" width="6" height="4" fill="#60A5FA" stroke="#D4AF37" strokeWidth="0.5" rx="0.5" />
                </g>

                {/* Labels */}
                <text x="150" y="154" fill="#C9A84C" fontSize="9" textAnchor="middle" fontFamily="var(--font-jetbrains)">
                  EARTH
                </text>
                <text x={satX} y={satY - 10} fill="#FFF7E6" fontSize="8" textAnchor="middle" fontFamily="var(--font-jetbrains)" fontWeight="bold">
                  SAT_C1
                </text>
              </svg>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-mission-border/30 flex flex-wrap gap-4 text-xs font-jetbrains text-mission-muted">
            <div>
              <span className="text-mission-gold">ORBIT MODEL:</span>{' '}
              {orbitMode === 'LEO' && 'Low Earth Orbit (Atmospheric Sensors / Imaging)'}
              {orbitMode === 'MEO' && 'Medium Earth Orbit (Global Positioning GPS)'}
              {orbitMode === 'GEO' && 'Geostationary Equatorial Orbit (Communications)'}
            </div>
          </div>
        </motion.div>

        {/* Real-time Telemetry Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card-mission p-6 rounded-xl flex flex-col justify-between"
        >
          <div>
            <h2 className="font-space-grotesk text-lg font-bold tracking-wider text-mission-text mb-6 flex items-center gap-2">
              <Radio className="text-mission-gold" size={18} />
              Telemetry Feed [SAT_C1]
            </h2>

            <div className="space-y-4 font-jetbrains text-xs">
              <div className="bg-mission-bg/60 p-3 rounded-lg border border-mission-border/20 flex justify-between">
                <span className="text-mission-muted">SIGNAL VALUE</span>
                <span className={`font-bold ${
                  telemetry.signalStatus === 'Lock' ? 'text-green-400' : 'text-amber-400'
                }`}>
                  {telemetry.signalStatus} ({telemetry.snr} dB)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-mission-bg/40 p-3 rounded-lg border border-mission-border/20">
                  <div className="text-[10px] text-mission-muted uppercase mb-1">ALTITUDE</div>
                  <div className="text-sm font-bold text-mission-text">
                    {telemetry.altitude.toLocaleString()} km
                  </div>
                </div>
                <div className="bg-mission-bg/40 p-3 rounded-lg border border-mission-border/20">
                  <div className="text-[10px] text-mission-muted uppercase mb-1">VELOCITY</div>
                  <div className="text-sm font-bold text-mission-text">
                    {telemetry.velocity} km/s
                  </div>
                </div>
                <div className="bg-mission-bg/40 p-3 rounded-lg border border-mission-border/20">
                  <div className="text-[10px] text-mission-muted uppercase mb-1">PERIOD</div>
                  <div className="text-sm font-bold text-mission-text">
                    {telemetry.period} min
                  </div>
                </div>
                <div className="bg-mission-bg/40 p-3 rounded-lg border border-mission-border/20">
                  <div className="text-[10px] text-mission-muted uppercase mb-1">INCLINATION</div>
                  <div className="text-sm font-bold text-mission-text">51.64°</div>
                </div>
              </div>

              <div className="bg-mission-bg/40 p-3 rounded-lg border border-mission-border/20 space-y-1">
                <div className="text-[10px] text-mission-muted uppercase">SUB-SATELLITE POSITION</div>
                <div className="flex justify-between text-xs text-mission-text font-bold">
                  <span>LAT: {telemetry.lat}° N</span>
                  <span>LNG: {telemetry.lng}° W</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-mission-border/30">
            <button
              onClick={() => {
                // simulate signal re-sync
                setTelemetry((prev) => ({ ...prev, signalStatus: 'Searching', snr: 12 }));
                setTimeout(() => {
                  setTelemetry((prev) => ({ ...prev, signalStatus: 'Lock', snr: 25.1 }));
                }, 1500);
              }}
              className="w-full py-2 bg-mission-gold/10 hover:bg-mission-gold/20 border border-mission-gold/30 rounded text-xs font-semibold text-mission-gold transition-colors font-jetbrains"
            >
              SYNC RECEIVER ANTENNA
            </button>
          </div>
        </motion.div>
      </div>

      {/* Grid for Open Science, Remote Sensing & Systems */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* NASA Open Science */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card-mission p-6 rounded-xl flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-mission-gold/10 flex items-center justify-center mb-4 border border-mission-gold/20">
              <Telescope className="text-mission-gold" size={20} />
            </div>
            <h3 className="font-space-grotesk text-lg font-bold text-mission-text mb-3">
              NASA Open Science Initiative
            </h3>
            <p className="text-xs text-mission-text/80 leading-relaxed mb-4">
              Advocating for transparent, collaborative scientific workflows. Participating in open telemetry standard definitions and utilizing astronomical data platforms to map satellite communications.
            </p>
          </div>
          <div className="text-[10px] font-jetbrains text-mission-muted border-t border-mission-border/20 pt-3">
            FOCUS: OPEN-SOURCE FLIGHT DATA & TELEMETRY
          </div>
        </motion.div>

        {/* Remote Sensing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card-mission p-6 rounded-xl flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-mission-gold/10 flex items-center justify-center mb-4 border border-mission-gold/20">
              <Globe className="text-mission-gold" size={20} />
            </div>
            <h3 className="font-space-grotesk text-lg font-bold text-mission-text mb-3">
              Remote Sensing Signal Capture
            </h3>
            <p className="text-xs text-mission-text/80 leading-relaxed mb-4">
              Experimenting with Software-Defined Radio (SDR) dongles to intercept and decode analog/digital weather signals (such as NOAA/METEOR series). Processing raw signal feeds to generate local multi-spectral maps.
            </p>
          </div>
          <div className="text-[10px] font-jetbrains text-mission-muted border-t border-mission-border/20 pt-3">
            FOCUS: RADIO WAVE DEMODULATION & IMAGERY
          </div>
        </motion.div>

        {/* Space Systems */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card-mission p-6 rounded-xl flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-mission-gold/10 flex items-center justify-center mb-4 border border-mission-gold/20">
              <Cpu className="text-mission-gold" size={20} />
            </div>
            <h3 className="font-space-grotesk text-lg font-bold text-mission-text mb-3">
              Spacecraft Avionics Security
            </h3>
            <p className="text-xs text-mission-text/80 leading-relaxed mb-4">
              Analyzing the cybersecurity postures of orbital avionics. Studying vulnerable points in classical communication standards (such as CAN bus, MIL-STD-1553 protocols) and real-time operating systems (RTOS).
            </p>
          </div>
          <div className="text-[10px] font-jetbrains text-mission-muted border-t border-mission-border/20 pt-3">
            FOCUS: BUS PROTOCOLS & HARDWARE INTEGRITY
          </div>
        </motion.div>

      </div>

      {/* Telemetry Research Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass-card-mission p-6 rounded-xl"
      >
        <h3 className="font-space-grotesk text-lg font-bold text-mission-text mb-6 flex items-center gap-2">
          <Terminal className="text-mission-gold animate-pulse" size={18} />
          Observatory Mission Logs
        </h3>

        <div className="space-y-4 font-jetbrains text-xs">
          <div className="p-4 bg-mission-bg/40 border border-mission-border/30 rounded-lg space-y-2">
            <div className="flex justify-between items-center text-mission-gold font-bold">
              <span>LOG #09A :: NOAA APT SIGNAL CONVERTER</span>
              <span>18-06-2026</span>
            </div>
            <p className="text-mission-text/80">
              Configured a bandpass filter to extract 137MHz NOAA satellite analog APT feeds. Used SciPy packages in Python to demodulate the signal, extracting line sync markers and reconstructing raw weather images. Next step: automate satellite pass tracking.
            </p>
          </div>

          <div className="p-4 bg-mission-bg/40 border border-mission-border/30 rounded-lg space-y-2">
            <div className="flex justify-between items-center text-mission-gold font-bold">
              <span>LOG #05F :: COMPARING MIL-STD-1553 ENCODING MECHANICS</span>
              <span>29-04-2026</span>
            </div>
            <p className="text-mission-text/80">
              Examined the Manchester II biphase coding protocol used by spacecraft avionics buses. Simulated a noisy transceiver bus and assessed how bit inversion injections can disrupt command frames. Demonstrated importance of checksum verification.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
