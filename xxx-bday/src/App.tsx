import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { 
  Heart, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Gift, 
  BookOpen, 
  ChevronRight, 
  X,
  Flame,
  Cake,
  CornerRightDown,
  Music
} from "lucide-react";
import IPhoneContainer from "./components/IPhoneContainer";
import CelebrationConfetti from "./components/CelebrationConfetti";
import IntroCanvas3D from "./components/IntroCanvas3D";
import { CURATED_REASONS, CuratedReason } from "./data/reasons";
import { audio } from "./utils/audio";
import { extractPastelColor } from "./utils/colorExtractor";

// Hex helper for smooth high-performance color morphing
function parseHex(hex: string) {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return { r, g, b };
}

function interpolateColor(color1: string, color2: string, factor: number): string {
  try {
    const c1 = parseHex(color1);
    const c2 = parseHex(color2);
    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);
    return `rgb(${r}, ${g}, ${b})`;
  } catch (e) {
    return color1;
  }
}

// Scattered collage image items (Group 1 mockups)
const SCATTERED_IMAGES = [
  {
    id: 1,
    url: "assets/ZawaRahman_20240205.jpg?auto=format&fit=crop&q=80&w=600", // Diver/underwater
    style: { top: "12%", left: "6%", width: "115px", height: "160px" },
    disperse: { x: -160, y: -160, rotate: -25 }
  },
  {
    id: 2,
    url: "assets/ZawaRahman_20240411_03.jpg?auto=format&fit=crop&q=80&w=600", // Blue face
    style: { top: "42%", left: "15%", width: "130px", height: "185px" },
    disperse: { x: -200, y: 50, rotate: -15 }
  },
  {
    id: 3,
    url: "assets/ZawaRahman_20240414_16.jpg?auto=format&fit=crop&q=80&w=600", // Meditation
    style: { top: "68%", left: "54%", width: "135px", height: "190px" },
    disperse: { x: 180, y: 220, rotate: 20 }
  },
  {
    id: 4,
    url: "assets/ZawaRahman_20240628_03.jpg?auto=format&fit=crop&q=80&w=600", // Flower holding
    style: { top: "6%", left: "48%", width: "140px", height: "195px" },
    disperse: { x: 150, y: -240, rotate: 25 }
  },
  {
    id: 5,
    url: "assets/ZawaRahman_20241007_01.jpg?auto=format&fit=crop&q=80&w=600", // Small bubbles
    style: { top: "32%", left: "70%", width: "85px", height: "125px" },
    disperse: { x: 220, y: -50, rotate: -10 }
  },
  {
    id: 6,
    url: "assets/ZawaRahman_20241221_04.jpg?auto=format&fit=crop&q=80&w=600", // Sparklers/joy
    style: { top: "72%", left: "8%", width: "120px", height: "165px" },
    disperse: { x: -180, y: 180, rotate: -30 }
  }
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0); // 0.0 to 33.0 (Gallery = 0-1, Intro = 1-2, Reasons = 2-32, Finale = 32-33)
  const [candleLit, setCandleLit] = useState(true);
  const [confettiActive, setConfettiActive] = useState(false);
  const [wished, setWished] = useState(false);
  const [showQuickJump, setShowQuickJump] = useState(false);
  const [scrollConfettiTriggered, setScrollConfettiTriggered] = useState(false);
  const [extractedColors, setExtractedColors] = useState<Record<number, string>>({});

  // Asynchronously extract and cache highly readable, dynamic pastel colors from images on mount
  useEffect(() => {
    CURATED_REASONS.forEach((reason) => {
      extractPastelColor(reason.image).then((color) => {
        if (color) {
          setExtractedColors((prev) => ({
            ...prev,
            [reason.id]: color,
          }));
        }
      });
    });
  }, []);

  useEffect(() => {
    if (scrollProgress >= 32.0) {
      if (!scrollConfettiTriggered) {
        setScrollConfettiTriggered(true);
        setConfettiActive(true);
      }
    } else {
      if (scrollConfettiTriggered) {
        setScrollConfettiTriggered(false);
        setConfettiActive(false);
      }
    }
  }, [scrollProgress, scrollConfettiTriggered]);

  const [dynamicIslandText, setDynamicIslandText] = useState("Tap Start to play 🎵");
  const [dynamicIslandActive, setDynamicIslandActive] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastActiveReasonRef = useRef<number>(1);
  const prevDisplayActiveIdRef = useRef<number>(1);
  const directionRef = useRef<"up" | "down">("down");

  // Initialize and unlock audio context
  const handleStart = () => {
    audio.init();
    audio.setMute(false);
    setIsMuted(false);
    setStarted(true);
    triggerDynamicIsland("Scroll Down Gently ❤️");
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audio.setMute(nextMuted);
    triggerDynamicIsland(nextMuted ? "Sound Off 🔇" : "Sound On 🔊");
  };

  const triggerDynamicIsland = (text: string) => {
    setDynamicIslandText(text);
    setDynamicIslandActive(true);
    setTimeout(() => {
      setDynamicIslandActive(false);
    }, 4000);
  };

  // Capture high-performance scroll progress natively
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const clientHeight = container.clientHeight || 1;
    const progress = scrollTop / clientHeight;
    setScrollProgress(progress);

    // Chime feedback on active page crosses
    if (progress >= 2.0 && progress <= 32.0) {
      const activeIdx = Math.floor(progress) - 1; // 1 to 30
      if (activeIdx !== lastActiveReasonRef.current) {
        lastActiveReasonRef.current = activeIdx;
        audio.playTransitionChime(activeIdx);
        
        if (activeIdx === 30) {
          triggerDynamicIsland("Make a Wish! 🎂");
        } else if (activeIdx % 5 === 0) {
          triggerDynamicIsland(`Quality ${activeIdx} of 30 ✨`);
        }
      }
    }
  };

  // Slide Jump Handler
  const jumpToProgress = (idx: number) => {
    if (scrollContainerRef.current) {
      const targetScroll = idx * scrollContainerRef.current.clientHeight;
      scrollContainerRef.current.scrollTo({
        top: targetScroll,
        behavior: "smooth"
      });
      setScrollProgress(idx);
      setShowQuickJump(false);
      audio.playTransitionChime(idx);
      if (idx === 0) {
        triggerDynamicIsland("Gallery 📸");
      } else if (idx === 1) {
        triggerDynamicIsland("Intro ✨");
      } else if (idx >= 2 && idx <= 31) {
        triggerDynamicIsland(`Reason ${idx - 1} ❤️`);
      } else {
        triggerDynamicIsland("Wish 🎂");
      }
    }
  };

  const handleBlowCandle = () => {
    if (!candleLit) return;
    setCandleLit(false);
    setConfettiActive(true);
    setWished(true);
    audio.playTriumphantChord();
    triggerDynamicIsland("Happy 30th Birthday! 🥳✨");
  };

  // Compute background color morphing based on scroll progress
  const getBackgroundColor = (): string => {
    const p = scrollProgress;

    // Opening range (0.0 to 1.5) is white background (covers Gallery and Intro)
    if (p <= 1.5) {
      return "#ffffff";
    }

    const getReasonColor = (idx: number): string => {
      // idx is 1-based (1 to 30)
      const reason = CURATED_REASONS[idx - 1];
      if (reason.bgColorOverride) {
        return reason.bgColorOverride;
      }
      if (reason.overrideColor) {
        return reason.overrideColor;
      }
      return extractedColors[idx] || reason.bgColor;
    };

    // Blend from white to Reason 1 color as the first image scrolls up
    if (p > 1.5 && p < 2.0) {
      const factor = (p - 1.5) / 0.5;
      return interpolateColor("#ffffff", getReasonColor(1), factor);
    }

    // Blend between active and next reason colors (2.0 to 31.0)
    if (p >= 2.0 && p < 31.0) {
      const activeIdx = Math.floor(p) - 1; // 1 to 29
      const nextIdx = Math.min(activeIdx + 1, 30);
      const factor = p - Math.floor(p);

      const activeColor = getReasonColor(activeIdx);
      const nextColor = getReasonColor(nextIdx);

      return interpolateColor(activeColor, nextColor, factor);
    }

    // Blend from Reason 30 color to white for the Finale (31.0 to 32.0)
    if (p >= 31.0) {
      const factor = Math.min((p - 31.0), 1.0);
      const lastColor = getReasonColor(30);
      return interpolateColor(lastColor, "#ffffff", factor);
    }

    return "#ffffff";
  };

  const activeBgColor = getBackgroundColor();

  const snappedIdx = Math.round(scrollProgress);

  // Helper to determine active slide index for display
  const displayActiveId = snappedIdx < 2 ? 1 : Math.min(snappedIdx - 1, 30);

  if (displayActiveId !== prevDisplayActiveIdRef.current) {
    directionRef.current = displayActiveId > prevDisplayActiveIdRef.current ? "down" : "up";
    prevDisplayActiveIdRef.current = displayActiveId;
  }

  return (
    <IPhoneContainer
      activeColor={{ from: activeBgColor, via: activeBgColor, to: activeBgColor }}
      dynamicIslandContent={
        <div className="flex items-center gap-2 justify-center w-full px-2">
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-400" /> : <Volume2 className="w-3.5 h-3.5 text-rose-500 animate-pulse" />}
          <span className="text-[11px] truncate font-sans font-medium tracking-tight text-white/90">
            {dynamicIslandText}
          </span>
          <div className="flex gap-0.5 items-center ml-auto">
            <span className="w-1 h-3 rounded-full bg-rose-500 animate-bounce" style={{ animationDelay: '0.1s' }} />
            <span className="w-1 h-4 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
            <span className="w-1 h-2.5 rounded-full bg-rose-300 animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
      }
      dynamicIslandActive={dynamicIslandActive}
    >
      <div 
        id="app-viewport" 
        className="w-full h-full relative overflow-hidden flex flex-col font-sans select-none transition-colors duration-150 ease-out-quad"
        style={{ backgroundColor: activeBgColor }}
      >
        
        {/* Subtle high-fashion page ambient lighting vignette */}
        <div className="absolute inset-0 bg-radial-gradient(circle_at_center, rgba(255,255,255,0.15), rgba(0,0,0,0.02)) pointer-events-none z-10" />

        <AnimatePresence mode="wait">
          {!started ? (
            /* INTRO START ACTION */
            <motion.div
              key="intro-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col justify-between px-8 py-12 z-30 bg-zinc-950 overflow-hidden text-center"
            >
              {/* Interactive 3D Canvas Background */}
              <IntroCanvas3D />

              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-rose-500/10 blur-[80px] pointer-events-none" />
              
              <div className="flex justify-between items-center z-10 pt-4 pointer-events-auto">
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">18 July 2026</span>
                <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
              </div>

              <div className="flex flex-col gap-5 z-10 my-auto text-left pointer-events-none select-none">
                <h1 className="text-4xl font-extrabold tracking-tighter text-white leading-none">
                  <div className="overflow-hidden py-1">
                    <motion.div
                      initial={{ y: "105%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    >
                      Hello, Zawa.
                    </motion.div>
                  </div>
                  <div className="overflow-hidden py-1">
                    <motion.div
                      initial={{ y: "105%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      Happy Birthday!
                    </motion.div>
                  </div>
                </h1>

                <div className="overflow-hidden py-0.5">
                  <motion.p 
                    initial={{ y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="text-sm leading-relaxed text-zinc-400"
                  >
                    10,957 days / 360 months / 30 years.
                  </motion.p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 z-10 pb-4 w-full pointer-events-auto">
                <div className="w-full overflow-hidden rounded-2xl">
                  <motion.button
                    id="open-tribute-action"
                    onClick={handleStart}
                    initial={{ y: "105%" }}
                    animate={{ y: 0 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full py-4 bg-white rounded-2xl flex items-center justify-center gap-2 shadow-lg cursor-pointer group"
                  >
                    <span className="text-sm font-bold text-zinc-950">Enter</span>
                    <ChevronRight className="w-4 h-4 text-zinc-950 transition-transform group-hover:translate-x-0.5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ACTIVE CONTINUOUS EXPERIENCE GRAPHICS */
            <motion.div
              key="scroll-canvas"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col justify-between"
            >
              {/* Confetti Overlay */}
              <CelebrationConfetti active={confettiActive} onComplete={() => setConfettiActive(false)} />

              {/* STAGE A: SCATTERED COLLAGE (Only rendered while scrollProgress < 1.5) */}
              {scrollProgress < 1.5 && (
                <div className="absolute inset-0 pointer-events-none z-15">
                  
                  {/* Collage Images dispersing outwards based on progress */}
                  {SCATTERED_IMAGES.map((img) => {
                    const factor = Math.min(scrollProgress / 0.8, 1.0); // complete dispersal by 0.8 progress
                    const opacity = 1.0 - factor;
                    const tx = img.disperse.x * factor;
                    const ty = img.disperse.y * factor;
                    const rot = img.disperse.rotate * factor;

                    return (
                      <div
                        key={img.id}
                        className="absolute rounded-none overflow-hidden border-2 border-white shadow-xl transition-all duration-75"
                        style={{
                          ...img.style,
                          opacity,
                          transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg)`,
                        }}
                      >
                        <img
                          src={img.url}
                          alt="Scattered"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover select-none"
                        />
                      </div>
                    );
                  })}

                </div>
              )}

              {/* STAGE A2: INTRO TEXT (Rendered centered on Section 2, progress 1.0 to 2.0) */}
              <AnimatePresence>
                {snappedIdx === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center pointer-events-none z-15"
                  >
                    <div className="overflow-hidden py-1">
                      <motion.h2
                        initial={{ y: "105%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-105%" }}
                        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                        className="text-3xl font-black tracking-tight text-zinc-950 font-sans leading-snug"
                      >
                        You are awesome!
                      </motion.h2>
                    </div>
                    <div className="overflow-hidden py-0.5 mt-2">
                      <motion.p
                        initial={{ y: "105%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-105%" }}
                        transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                        className="text-lg font-bold text-zinc-800 tracking-tight"
                      >
                        Here are 30 reasons why.
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* STAGE B: 30 REASONS PINNED VIEW (Visible when 1.5 <= scrollProgress <= 32.3) */}
              {scrollProgress >= 1.5 && scrollProgress < 32.3 && (
                <div className="absolute inset-0 flex flex-col justify-center items-center px-8 pb-16 pointer-events-none z-12">
                  
                  {(() => {
                    const p = scrollProgress;
                    
                    // Determine entering and exiting reasons
                    // Slide up transition for first image
                    let activeIdx = 1;
                    let factor = 0;
                    
                    if (p < 2.0) {
                      activeIdx = 1;
                      factor = 0; // lock first slide properties
                    } else {
                      activeIdx = Math.min(Math.floor(p) - 1, 30); // Clamp to max 30 to avoid indexing undefined CURATED_REASONS
                      factor = p - Math.floor(p);
                    }

                    const activeReason = CURATED_REASONS[activeIdx - 1];
                    const nextReason = CURATED_REASONS[Math.min(activeIdx, 29)]; // reason at activeIdx is reason index (idx + 1)

                    let stageBOpacity = 1.0;
                    if (p >= 32.0) {
                      stageBOpacity = Math.max(0, 1.0 - (p - 32.0) / 0.3); // Fade out completely by 32.3
                    }

                    // Compute vertical position for entering image 1
                    let mainContainerY = "translateY(0px)";
                    if (p < 2.0) {
                      const scrollInFactor = (2.0 - p) / 0.5; // 1.5 to 2.0
                      const yOffset = scrollInFactor * 320;
                      mainContainerY = `translateY(${yOffset}px)`;
                    }

                    return (
                      <div 
                        className="w-[285px] flex flex-col items-center relative transition-transform duration-[120ms] ease-out"
                        style={{ transform: mainContainerY, opacity: stageBOpacity }}
                      >
                        
                        {/* Huge overlapping ordinal number (Group 4, 5, 6 mockups) */}
                        <div className="absolute -top-[74px] -left-[14px] w-full h-[120px] pointer-events-none z-20 overflow-hidden">
                          <AnimatePresence mode="popLayout" custom={directionRef.current}>
                            <motion.div
                              key={displayActiveId}
                              custom={directionRef.current}
                              variants={{
                                enter: (dir) => ({
                                  y: dir === "down" ? "110%" : "-110%",
                                  opacity: 0
                                }),
                                center: {
                                  y: 0,
                                  opacity: 1
                                },
                                exit: (dir) => ({
                                  y: dir === "down" ? "-110%" : "110%",
                                  opacity: 0
                                })
                              }}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              transition={{
                                duration: 0.75,
                                ease: [0.16, 1, 0.3, 1] // Ultimate clean iOS-like curve
                              }}
                              className="absolute inset-0 flex items-end text-[100px] font-black tracking-tighter text-zinc-950 font-sans leading-none"
                            >
                              <span>{CURATED_REASONS[displayActiveId - 1]?.ordinal.slice(0, -2)}</span>
                              <span className="text-[26px] font-bold tracking-tight mb-[64px] ml-0.5 font-sans">
                                {CURATED_REASONS[displayActiveId - 1]?.ordinal.slice(-2)}
                              </span>
                            </motion.div>
                          </AnimatePresence>
                        </div>

                        {/* Image rounded card display with slide-in and slide-out animations */}
                        <div className="w-[285px] h-[360px] rounded-none overflow-hidden bg-zinc-900/10 shadow-[0_12px_40px_rgba(0,0,0,0.12)] relative z-10 border border-white/5">
                          <AnimatePresence mode="popLayout" custom={directionRef.current}>
                            <motion.img
                              key={displayActiveId}
                              src={CURATED_REASONS[displayActiveId - 1]?.image}
                              alt="Reason card"
                              referrerPolicy="no-referrer"
                              custom={directionRef.current}
                              variants={{
                                enter: (dir) => ({
                                  y: dir === "down" ? "100%" : "-100%",
                                }),
                                center: {
                                  y: 0,
                                },
                                exit: (dir) => ({
                                  y: dir === "down" ? "-100%" : "100%",
                                })
                              }}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              transition={{
                                duration: 0.75,
                                ease: [0.16, 1, 0.3, 1] // Ultimate clean iOS-like curve, same as text and ordinal
                              }}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </AnimatePresence>
                        </div>

                         {/* Reason caption texts revealed with elegant curtain animation */}
                        <div className="w-full min-h-[80px] mt-6 text-center px-2 relative overflow-hidden">
                          <AnimatePresence mode="popLayout" custom={directionRef.current}>
                            <motion.div
                              key={displayActiveId}
                              custom={directionRef.current}
                              variants={{
                                enter: (dir) => ({
                                  y: dir === "down" ? "110%" : "-110%",
                                  opacity: 0
                                }),
                                center: {
                                  y: 0,
                                  opacity: 1
                                },
                                exit: (dir) => ({
                                  y: dir === "down" ? "-110%" : "110%",
                                  opacity: 0
                                })
                              }}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              transition={{
                                duration: 0.75,
                                ease: [0.16, 1, 0.3, 1] // Ultimate clean iOS-like curve
                              }}
                              className="text-[15px] font-bold tracking-tight text-zinc-950 font-sans px-2 leading-relaxed"
                            >
                              {CURATED_REASONS[displayActiveId - 1]?.text}
                            </motion.div>
                          </AnimatePresence>
                        </div>

                      </div>
                    );
                  })()}

                </div>
              )}

              {/* STAGE C: FINALE TRIBUTE WRAPPER (Visible when scrollProgress >= 31.5) */}
              {scrollProgress >= 31.5 && (
                <div className="absolute inset-0 flex flex-col justify-center items-center px-6 text-center pointer-events-none z-15 bg-white select-none">
                  
                  <div className="flex flex-col items-center w-full max-w-[320px] pointer-events-auto">
                    
                    {/* 3D Cake Image with clean floating animation */}
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="mb-8 flex justify-center items-center"
                    >
                      <img
                        src="https://em-content.zobj.net/source/apple/391/birthday-cake_1f382.png"
                        alt="3D Birthday Cake"
                        className="w-[180px] h-[180px] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = document.getElementById('cake-emoji-fallback');
                          if (fallback) fallback.style.display = 'block';
                        }}
                      />
                      <div 
                        id="cake-emoji-fallback" 
                        className="hidden text-[120px] filter drop-shadow-xl select-none animate-bounce"
                      >
                        🎂
                      </div>
                    </motion.div>

                    {/* Happy */}
                    <motion.h2
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="text-[32px] font-bold text-black tracking-tight font-sans leading-tight"
                    >
                      Happy
                    </motion.h2>

                    {/* XXX */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="text-[120px] font-black tracking-tight text-black font-sans leading-none my-1 select-none"
                    >
                      XXX
                    </motion.div>

                    {/* Birthday */}
                    <motion.h2
                      initial={{ opacity: 0, y: -15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="text-[32px] font-bold text-black tracking-tight font-sans leading-tight mb-8"
                    >
                      Birthday
                    </motion.h2>

                    {/* Message Paragraph */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="text-[15px] leading-relaxed font-semibold text-zinc-900 tracking-tight max-w-[280px]"
                    >
                      You’re my most favorite human being,<br />
                      and I love you with all my heart!
                    </motion.p>

                  </div>
                </div>
              )}

              {/* OVERLAY DYNAMIC CONTROLS (Floating dock at bottom) */}
              <div className="absolute bottom-[24px] left-1/2 -translate-x-1/2 z-30 w-[88%] max-w-[340px] flex justify-between items-center p-1.5 bg-zinc-900/90 border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl pointer-events-auto">
                {/* Sound Button */}
                <button
                  id="mute-toggle"
                  onClick={handleMuteToggle}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-950/60 border border-white/5 active:scale-90 transition-transform cursor-pointer"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-rose-500 animate-pulse" />
                  )}
                </button>

                {/* Progress Grid Trigger */}
                <button
                  id="jump-trigger"
                  onClick={() => setShowQuickJump(true)}
                  className="px-5 py-2 flex items-center gap-1.5 rounded-full hover:bg-white/5 active:scale-95 transition-all text-xs font-semibold tracking-tight text-zinc-300 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                  <span>
                    {snappedIdx === 0 ? "Gallery" : snappedIdx === 1 ? "Intro" : snappedIdx >= 32 ? "Wish" : `${displayActiveId} of 30`}
                  </span>
                </button>

                {/* Love Trigger Widget */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-rose-500/15 border border-rose-500/20 active:scale-90 transition-transform cursor-pointer animate-pulse"
                  onClick={() => triggerDynamicIsland("Love you endlessly Zawa! 💖")}
                >
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                </div>
              </div>

              {/* SLIDE-UP DOCK DRAWER (Quick Navigation) */}
              <AnimatePresence>
                {showQuickJump && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowQuickJump(false)}
                      className="absolute inset-0 bg-black z-40"
                    />

                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ type: "spring", damping: 25, stiffness: 220 }}
                      className="absolute bottom-0 left-0 right-0 h-[65%] rounded-t-[32px] bg-zinc-900 border-t border-white/10 z-50 p-6 flex flex-col justify-between pointer-events-auto"
                    >
                      <div className="flex justify-between items-center pb-4 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-amber-400" />
                          <h3 className="text-sm font-bold tracking-tight text-white">Navigate to:</h3>
                        </div>
                        <button
                          id="close-jump"
                          onClick={() => setShowQuickJump(false)}
                          className="p-1.5 rounded-full bg-zinc-800 border border-white/5 text-zinc-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Reasons Grid selection */}
                      <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-3.5 grid grid-cols-5 gap-3.5">
                        <button
                          onClick={() => jumpToProgress(0)}
                          className={`aspect-square rounded-xl flex flex-col items-center justify-center text-[11px] font-bold transition-all relative ${
                            snappedIdx === 0
                              ? "bg-rose-500 text-white ring-2 ring-white shadow-lg scale-105"
                              : "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-white/5"
                          }`}
                        >
                          <span>Gallery</span>
                        </button>

                        <button
                          onClick={() => jumpToProgress(1)}
                          className={`aspect-square rounded-xl flex flex-col items-center justify-center text-[11px] font-bold transition-all relative ${
                            snappedIdx === 1
                              ? "bg-rose-500 text-white ring-2 ring-white shadow-lg scale-105"
                              : "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-white/5"
                          }`}
                        >
                          <span>Intro</span>
                        </button>

                        {CURATED_REASONS.map((reason) => {
                          const isVisited = reason.id <= displayActiveId;
                          const isCurrent = reason.id === displayActiveId && snappedIdx >= 2 && snappedIdx <= 31;

                          return (
                            <button
                              key={reason.id}
                              onClick={() => jumpToProgress(reason.id + 1)}
                              className={`aspect-square rounded-xl flex flex-col items-center justify-center text-[12px] font-bold transition-all relative ${
                                isCurrent
                                  ? "bg-rose-500 text-white ring-2 ring-white shadow-lg scale-105"
                                  : isVisited
                                  ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-white/5"
                                  : "bg-zinc-950/40 text-zinc-600 border border-dashed border-zinc-800"
                              }`}
                            >
                              <span>{reason.id}</span>
                              <span className="text-[10px] mt-0.5 opacity-90">{reason.emoji}</span>
                            </button>
                          );
                        })}

                        <button
                          onClick={() => jumpToProgress(32)}
                          className={`aspect-square rounded-xl flex flex-col items-center justify-center text-[11px] font-bold transition-all relative ${
                            snappedIdx >= 32
                              ? "bg-rose-500 text-white ring-2 ring-white shadow-lg scale-105"
                              : "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-white/5"
                          }`}
                        >
                          <span>Wish</span>
                        </button>
                      </div>

                      <div className="pt-3 text-center border-t border-white/5">
                        <span className="text-[10px] font-mono tracking-wide text-zinc-500 uppercase">
                          18 July 2026
                        </span>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* ACTUAL NATIVE CAPTURING SCROLL TRACKER LAYER */}
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="absolute inset-0 overflow-y-scroll no-scrollbar select-none z-20 pointer-events-auto snap-y-mandatory"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {/* 33 Native full-screen sections. When scrolled on iOS, standard scrolling momentum drives scrollProgress beautifully */}
                {Array.from({ length: 33 }).map((_, i) => (
                  <div key={i} className="w-full h-full flex-shrink-0 pointer-events-none snap-start" />
                ))}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </IPhoneContainer>
  );
}
