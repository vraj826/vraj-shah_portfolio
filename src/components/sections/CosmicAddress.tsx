'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Shield, Terminal as TerminalIcon, Globe } from 'lucide-react';

interface LocationData {
  city: string;
  region: string;
  country: string;
}

interface StageInfo {
  label: string;
  subLabel: string;
  details: { label: string; value: string }[];
}

export default function CosmicAddress() {
  const [stage, setStage] = useState<'STANDBY' | 'BOOT' | 'CARD' | 'ZOOM' | 'FINAL' | 'OBJECTIVE'>('STANDBY');
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [bootProgress, setBootProgress] = useState(0);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [zoomIndex, setZoomIndex] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);

  // Play sci-fi synth sound effects using Web Audio API (low impact, no files needed)
  const playBeep = useCallback((frequency = 800, duration = 0.05, type: OscillatorType = 'sine') => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Ignored if audio blocked by browser policy
    }
  }, []);

  // Play complex sci-fi hum or scan sound
  const playSweep = useCallback((startFreq = 200, endFreq = 800, duration = 0.5) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);

      // Lowpass filter to make it sound cybernetic & warm
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1000;

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Ignored
    }
  }, []);

  const bootSequence = [
    'MISSION CONTROL ONLINE',
    'Initializing orbital uplink...',
    'Establishing telemetry...',
    'Scanning public network metadata...',
    'Acquiring approximate location...',
    'Signal Locked'
  ];

  // IP Geolocation fetch
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          if (data.city) {
            setLocation({
              city: data.city,
              region: data.region || 'Earth Sector',
              country: data.country_name || 'Observable Universe'
            });
            return;
          }
        }
      } catch (e) {
        console.warn("ipapi.co failed, trying ipwho.is:", e);
      }

      try {
        const response = await fetch('https://ipwho.is/');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.city) {
            setLocation({
              city: data.city,
              region: data.region || 'Earth Sector',
              country: data.country || 'Observable Universe'
            });
            return;
          }
        }
      } catch (e) {
        console.warn("ipwho.is failed, using fallback:", e);
      }

      // Default Fallback
      setLocation({
        city: 'Unknown Location',
        region: 'Earth',
        country: 'Earth'
      });
    };

    fetchLocation();
  }, []);

  // Boot sequence animation
  useEffect(() => {
    if (stage !== 'BOOT') return;

    let textIndex = 0;
    const currentLine = bootSequence[currentLineIndex];
    let intervalId: NodeJS.Timeout;

    // Fast-typing effect
    const typeCharacter = () => {
      if (textIndex < currentLine.length) {
        setTypedText(prev => prev + currentLine[textIndex]);
        textIndex++;
        if (textIndex % 3 === 0) playBeep(900, 0.02, 'sine');
      } else {
        clearInterval(intervalId);
        // Completed this line
        setBootLines(prev => [...prev, currentLine]);
        setTypedText('');

        // Progress bar steps up
        setBootProgress(Math.min(100, Math.floor(((currentLineIndex + 1) / bootSequence.length) * 100)));

        if (currentLineIndex < bootSequence.length - 1) {
          setTimeout(() => {
            setCurrentLineIndex(prev => prev + 1);
          }, 350);
        } else {
          // Finished boot sequence
          setTimeout(() => {
            playBeep(440, 0.3, 'sine');
            setStage('CARD');
          }, 800);
        }
      }
    };

    intervalId = setInterval(typeCharacter, 25);
    return () => clearInterval(intervalId);
  }, [currentLineIndex, stage, playBeep]);

  // Cosmic Zoom levels
  const getZoomLevels = (): StageInfo[] => {
    const userCity = location?.city || 'Unknown Location';
    const userRegion = location?.region || 'Earth';
    const userCountry = location?.country || 'Earth';

    return [
      {
        label: userCity,
        subLabel: 'Terrestrial Coordinates',
        details: [
          { label: 'Classification', value: 'Local Base Node' },
          { label: 'Telemetry Source', value: 'IP Network Metadata' }
        ]
      },
      {
        label: userRegion,
        subLabel: 'Administrative Sector',
        details: [
          { label: 'Geopolitical Zone', value: 'Regional Perimeter' },
          { label: 'Signal Vector', value: 'Sub-National Relay' }
        ]
      },
      {
        label: userCountry,
        subLabel: 'Sovereign Domain',
        details: [
          { label: 'Political Division', value: 'National Territory' },
          { label: 'Continental Sector', value: 'Terrestrial Segment' }
        ]
      },
      {
        label: 'Planet Earth',
        subLabel: 'Sector 001',
        details: [
          { label: 'Age', value: '4.54 Billion Years' },
          { label: 'Diameter', value: '12,742 km' },
          { label: 'Satellites', value: '1 (Luna)' },
          { label: 'Population', value: '8+ Billion' }
        ]
      },
      {
        label: 'Solar System',
        subLabel: 'Sol System',
        details: [
          { label: 'Star Type', value: 'G-type Main-Sequence (Sun)' },
          { label: 'Total Planets', value: '8 Major Planets' },
          { label: 'Orbital Speed', value: '220 km/s' }
        ]
      },
      {
        label: 'Orion Arm',
        subLabel: 'Milky Way Spur',
        details: [
          { label: 'Structure', value: 'Minor Spiral Arm' },
          { label: 'Width', value: '3,500 Light Years' },
          { label: 'Distance to Core', value: '26,000 Light Years' }
        ]
      },
      {
        label: 'Milky Way Galaxy',
        subLabel: 'Laniakea Cluster 42',
        details: [
          { label: 'Galaxy Type', value: 'Barred Spiral' },
          { label: 'Total Stars', value: '100–400 Billion' },
          { label: 'Diameter', value: '~105,700 Light Years' }
        ]
      },
      {
        label: 'Local Group',
        subLabel: 'Galactic Cluster',
        details: [
          { label: 'Total Galaxies', value: '80+ Identified' },
          { label: 'Dominants', value: 'Andromeda, Milky Way, Triangulum' },
          { label: 'Gravitational Radius', value: '10 Million Light Years' }
        ]
      },
      {
        label: 'Virgo Supercluster',
        subLabel: 'Laniakea Subdivision',
        details: [
          { label: 'Containment', value: 'Local Group + 100 Cluster Sets' },
          { label: 'Total Diameter', value: '110 Million Light Years' },
          { label: 'Mass Equivalent', value: '10^15 Solar Masses' }
        ]
      },
      {
        label: 'Laniakea Supercluster',
        subLabel: 'Immeasurable Heaven',
        details: [
          { label: 'Galaxy Volume', value: '100,000+ Galaxies' },
          { label: 'Total Diameter', value: '520 Million Light Years' },
          { label: 'Gravitational Basin', value: 'Great Attractor Core' }
        ]
      },
      {
        label: 'Observable Universe',
        subLabel: 'The Horizon',
        details: [
          { label: 'Est. Galaxies', value: '2+ Trillion (Upper Bounds)' },
          { label: 'Diameter', value: '93 Billion Light Years' },
          { label: 'Structure', value: 'Cosmic Web Filament Network' }
        ]
      }
    ];
  };

  const zoomLevels = getZoomLevels();

  // Handles progression of state from Card display to zoom start, and then stages of zoom
  useEffect(() => {
    if (stage === 'CARD') {
      const timer = setTimeout(() => {
        setStage('ZOOM');
        playSweep(200, 600, 0.4);
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (stage === 'ZOOM') {
      const interval = setInterval(() => {
        setZoomIndex(prev => {
          if (prev < zoomLevels.length - 1) {
            playBeep(600 + prev * 50, 0.08, 'sawtooth');
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(() => {
              playSweep(800, 300, 0.8);
              setStage('FINAL');
            }, 1000);
            return prev;
          }
        });
      }, 4500);
      return () => clearInterval(interval);
    }
  }, [stage, zoomLevels.length, playBeep, playSweep]);

  // Transition from final zoom state to mission objective
  useEffect(() => {
    if (stage === 'FINAL') {
      const timer = setTimeout(() => {
        setStage('OBJECTIVE');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleRestart = () => {
    setStage('BOOT');
    setBootLines([]);
    setCurrentLineIndex(0);
    setTypedText('');
    setBootProgress(0);
    setZoomIndex(0);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto min-h-[520px] bg-black border border-mission-gold/20 rounded-2xl overflow-hidden font-mono shadow-[0_0_30px_rgba(212,175,55,0.05)] p-4 sm:p-8 flex flex-col justify-between selection:bg-mission-gold/20 selection:text-mission-amber">

      {/* Visual Effects Overlay */}
      {/* Subtle Scan Lines */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,100,0,0.03),rgba(212,175,55,0.02),rgba(59,130,246,0.03))] bg-[size:100%_4px,6px_100%] opacity-35 z-20" />

      {/* Subtle CRT Flicker & Glow */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent via-transparent to-black/40 z-20 animate-[flicker_0.15s_infinite]" />

      {/* Holographic Radar Line sweep */}
      <div className="absolute inset-x-0 h-px bg-mission-gold/10 shadow-[0_0_10px_#D4AF37] animate-[sweep_6s_linear_infinite] pointer-events-none z-10" />

      {/* Header HUD Bar */}
      <div className="w-full flex items-center justify-between border-b border-mission-gold/15 pb-4 mb-6 text-xs text-mission-muted">
        <div className="flex items-center gap-2">
          <TerminalIcon size={14} className="text-mission-gold animate-pulse" />
          <span className="font-semibold uppercase tracking-widest">Sys_Status: {stage === 'STANDBY' ? 'Standby' : 'Active'}</span>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <span>UPLINK: SECURE_NET_SSH</span>
          <span className="hidden sm:inline">COSMIC_REF_SYS: J2000</span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${stage === 'STANDBY' ? 'bg-orange-400' : 'bg-mission-gold animate-ping'}`} />
            <span className="text-mission-gold font-bold">{stage === 'STANDBY' ? 'STANDBY' : 'LOCK_STABLE'}</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Screen */}
      <div className="flex-1 flex flex-col justify-center items-center relative z-10 w-full">

        {/* STANDBY STAGE */}
        {stage === 'STANDBY' && (
          <div className="text-center space-y-6 max-w-md py-12">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center border border-mission-gold/30 rounded-full bg-mission-gold/5 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
              <Globe size={40} className="text-mission-gold animate-pulse" />
              <div className="absolute inset-0 border-2 border-dashed border-mission-amber/30 rounded-full animate-[spin_10s_linear_infinite]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xs text-mission-muted uppercase tracking-widest font-bold">Signal Standby</h3>
              <h2 className="text-base sm:text-lg font-bold text-mission-text uppercase tracking-wider leading-relaxed">
                Ready to map your position in the cosmic hierarchy
              </h2>
              <p className="text-[10px] text-mission-muted/70 max-w-xs mx-auto leading-relaxed">
                Uses approximate network IP geolocation only. No browser GPS or permissions requested. Strictly privacy-respecting.
              </p>
            </div>

            <button
              onClick={() => {
                playBeep(440, 0.1, 'sine');
                setStage('BOOT');
              }}
              className="px-6 py-3 rounded-lg border border-mission-gold/40 bg-mission-gold/10 hover:bg-mission-gold/25 text-mission-gold hover:text-mission-text text-xs font-bold tracking-widest uppercase transition-all duration-300 active:scale-95 shadow-[0_0_15px_rgba(212,175,55,0.05)] cursor-pointer"
            >
              Initiate Reconnaissance
            </button>
          </div>
        )}

        {/* BOOT STAGE */}
        {stage === 'BOOT' && (
          <div className="w-full max-w-md space-y-6">
            <div className="h-44 text-left font-mono text-mission-gold text-xs sm:text-sm leading-relaxed space-y-1 bg-black/60 p-4 border border-mission-gold/15 rounded-lg shadow-inner relative overflow-hidden">
              {bootLines.map((line, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span>{line}</span>
                </div>
              ))}
              <div className="flex items-center">
                <span>{typedText}</span>
                {/* Blinking gold block cursor */}
                <span className="w-2 h-4 bg-mission-gold ml-1 animate-blink inline-block" />
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] text-mission-muted/65 font-semibold">
                <span>ACQUIRING SIGNAL...</span>
                <span>{bootProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-mission-gold/20">
                <motion.div
                  className="h-full bg-mission-gold shadow-[0_0_8px_#D4AF37]"
                  initial={{ width: 0 }}
                  animate={{ width: `${bootProgress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
          </div>
        )}

        {/* MISSION CARD STAGE */}
        {stage === 'CARD' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm glass-card-mission border border-mission-gold/30 rounded-xl p-6 shadow-[0_0_20px_rgba(212,175,55,0.1)] relative"
          >
            {/* Minimal orange corner accent */}
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-orange-500/80" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-orange-500/80" />

            <div className="text-center space-y-4">
              <div className="inline-flex p-2 bg-mission-gold/10 rounded-full border border-mission-gold/20 text-mission-gold">
                <Globe size={24} className="animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-[10px] text-mission-muted/60 uppercase tracking-widest">Mission Recon</h3>
                <h2 className="text-lg font-bold text-mission-gold mt-1 uppercase tracking-wide">Approximate Position</h2>
              </div>

              <div className="py-3 px-4 bg-black/60 rounded-lg border border-mission-gold/15 font-mono text-sm space-y-1">
                <p className="text-mission-text font-bold">{location?.city}</p>
                <p className="text-mission-gold/80 text-xs">{location?.region}</p>
                <p className="text-mission-muted/70 text-[10px] uppercase tracking-wider">{location?.country}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-left pt-2 border-t border-mission-gold/15">
                <div>
                  <span className="text-mission-muted/50 block uppercase">Confidence</span>
                  <span className="text-orange-400/90 font-medium">Public Net IP Est</span>
                </div>
                <div className="text-right">
                  <span className="text-mission-muted/50 block uppercase">Status</span>
                  <span className="text-mission-gold font-bold">Signal Locked</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* COSMIC ZOOM STAGE */}
        {stage === 'ZOOM' && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[350px]">

            {/* Visual list with moving node dot */}
            <div className="relative pl-6 sm:pl-10 space-y-2 flex flex-col justify-center min-h-[340px] max-h-[360px] overflow-y-auto">

              {/* Vertical connector line */}
              <div className="absolute left-[34px] sm:left-[50px] top-6 bottom-6 w-[2px] bg-mission-gold/10 border-l border-mission-gold/15" />

              {/* Active Glowing Dot travelling up */}
              <motion.div
                className="absolute left-[31px] sm:left-[47px] w-2.5 h-2.5 rounded-full bg-mission-gold shadow-[0_0_10px_#D4AF37] border border-white z-10"
                animate={{
                  y: `${(zoomLevels.length - 1 - zoomIndex) * 24}px`
                }}
                transition={{ type: 'spring', stiffness: 90, damping: 15 }}
                style={{ top: '30px' }}
              />

              {zoomLevels.map((lvl, idx) => {
                const isActive = idx === zoomIndex;
                const isVisited = idx <= zoomIndex;

                return (
                  <motion.div
                    key={lvl.label}
                    className="flex items-center gap-3 text-left"
                    initial={{ opacity: 0.2, x: -5 }}
                    animate={{
                      opacity: isActive ? 1 : isVisited ? 0.5 : 0.12,
                      x: isActive ? 5 : 0
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* Level Number */}
                    <span className="w-5 text-[8px] text-mission-muted/50 text-right font-jetbrains">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    {/* Ring indicator */}
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center border transition-all duration-300 ${isActive
                      ? 'border-mission-gold bg-black shadow-[0_0_6px_#D4AF37]'
                      : isVisited
                        ? 'border-mission-gold/40 bg-black'
                        : 'border-mission-gold/10 bg-black'
                      }`}>
                      {isVisited && <div className="w-1.5 h-1.5 rounded-full bg-mission-gold" />}
                    </div>

                    {/* Name */}
                    <span className={`text-xs sm:text-xs font-semibold tracking-wide ${isActive ? 'text-mission-gold font-bold' : 'text-mission-text/60 font-normal'
                      }`}>
                      {lvl.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Stage Detail Card */}
            <div className="flex items-center justify-center min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={zoomIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                  className="w-full max-w-xs glass-card-mission border border-mission-gold/20 rounded-xl p-5 shadow-[0_0_15px_rgba(212,175,55,0.05)] relative"
                >
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-mission-gold/40" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-mission-gold/40" />

                  <span className="text-[8px] font-bold text-mission-muted/60 uppercase tracking-widest font-jetbrains block mb-1">
                    {zoomLevels[zoomIndex]?.subLabel}
                  </span>
                  <h4 className="text-sm font-bold text-mission-gold uppercase tracking-wider mb-3">
                    {zoomLevels[zoomIndex]?.label}
                  </h4>

                  <div className="space-y-3 pt-2 border-t border-mission-gold/15 text-xs">
                    {zoomLevels[zoomIndex]?.details.map((detail, idx) => (
                      <div key={idx} className="flex justify-between items-start gap-2">
                        <span className="text-mission-muted/50 uppercase tracking-wide text-[9px]">
                          {detail.label}
                        </span>
                        <span className="text-mission-text text-right font-medium">
                          {detail.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        )}

        {/* CINEMATIC ENDING STAGE */}
        {stage === 'FINAL' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-lg text-center space-y-4 py-10"
          >
            <div className="space-y-2.5 font-mono text-mission-gold text-sm sm:text-base leading-relaxed tracking-wider">
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>You are here.</motion.p>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>One civilization.</motion.p>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9 }}>One planet.</motion.p>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.6 }}>One galaxy.</motion.p>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.3 }}>One universe.</motion.p>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 4.0 }} className="text-orange-400 font-bold mt-4">Your journey has only begun.</motion.p>
            </div>
          </motion.div>
        )}

        {/* MISSION OBJECTIVE FINAL STAGE */}
        {stage === 'OBJECTIVE' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md text-center space-y-8 py-10"
          >
            <div className="glass-card-mission border border-mission-gold/30 rounded-xl p-8 shadow-[0_0_25px_rgba(212,175,55,0.15)] relative">
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-mission-gold/40" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-mission-gold/40" />

              <div className="flex justify-center mb-4 text-mission-gold animate-pulse">
                <Shield size={36} />
              </div>

              <h3 className="text-[10px] text-mission-muted/50 uppercase tracking-widest font-bold mb-2">
                Mission Objective
              </h3>

              <h2 className="text-base sm:text-lg font-bold text-mission-text tracking-wide leading-relaxed font-sans">
                Building secure systems for the future of space technology.
              </h2>
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={handleRestart}
              className="px-5 py-2 rounded-lg border border-mission-gold/30 bg-mission-gold/5 hover:bg-mission-gold/15 text-mission-gold hover:text-mission-amber text-xs font-semibold tracking-widest uppercase transition-all duration-300 active:scale-95 cursor-pointer"
            >
              Restart Reconnaissance
            </motion.button>
          </motion.div>
        )}

      </div>

      {/* Footer System Log Status */}
      <div className="w-full border-t border-mission-gold/15 pt-4 mt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] text-mission-muted/50">
        <div>
          <span>HOST: vrajkumar@security-hub</span>
        </div>
        <div className="flex items-center gap-3">
          <span>LATENCY: 42ms</span>
          <span>SYS_VER: 04.992</span>
        </div>
      </div>

      {/* Embedded styles for scan lines and animations */}
      <style jsx global>{`
        @keyframes sweep {
          0% { transform: translateY(-10px); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(530px); opacity: 0; }
        }
        @keyframes flicker {
          0% { opacity: 0.965; }
          50% { opacity: 0.985; }
          100% { opacity: 0.965; }
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
