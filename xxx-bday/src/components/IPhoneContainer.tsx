import React, { useEffect, useState } from "react";

interface IPhoneContainerProps {
  children: React.ReactNode;
  activeColor: { from: string; via: string; to: string };
  dynamicIslandContent?: React.ReactNode;
  dynamicIslandActive?: boolean;
}

export default function IPhoneContainer({
  children,
  activeColor,
  dynamicIslandContent,
  dynamicIslandActive = false,
}: IPhoneContainerProps) {
  const [isMobile, setIsMobile] = useState(true);

  // Detect if screen width is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return <div className="w-full h-[100dvh] overflow-hidden bg-zinc-950 relative">{children}</div>;
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6 bg-zinc-950 relative overflow-hidden transition-all duration-1000 select-none"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, ${activeColor.via}22, #09090b 80%)`,
      }}
    >
      {/* Dynamic ambient backdrop glow */}
      <div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: activeColor.from }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: activeColor.to }}
      />

      {/* iPhone 16 Pro Frame */}
      <div className="relative mx-auto bg-zinc-900 rounded-[60px] p-[10px] shadow-[0_0_80px_rgba(0,0,0,0.8)] border-[5px] border-zinc-800 w-[393px] h-[852px] flex flex-col overflow-hidden ring-1 ring-white/10 scale-[0.9] lg:scale-[0.95] origin-center">
        {/* Screen Bezel and Glass */}
        <div className="relative w-full h-full rounded-[50px] overflow-hidden bg-zinc-950 flex flex-col ring-1 ring-zinc-900">
          
          {/* Dynamic Island Simulation */}
          <div className="absolute top-[14px] left-1/2 -translate-x-1/2 z-50 pointer-events-none flex items-center justify-center">
            <div
              className={`bg-black rounded-full transition-all duration-500 ease-out-back flex items-center justify-center ring-1 ring-white/5 ${
                dynamicIslandActive
                  ? "w-[240px] h-[36px] px-4 py-2"
                  : "w-[110px] h-[28px]"
              }`}
            >
              {dynamicIslandActive ? (
                <div className="w-full h-full flex items-center justify-between text-[11px] font-medium text-white/90 animate-fade-in">
                  {dynamicIslandContent}
                </div>
              ) : (
                <div className="flex gap-1.5 items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 ring-1 ring-white/5" />
                  <div className="w-1 h-1 rounded-full bg-blue-500/80" />
                </div>
              )}
            </div>
          </div>

          {/* iOS Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-[48px] px-8 flex items-end justify-between z-40 text-white/95 text-[12px] font-semibold select-none pointer-events-none">
            <span className="mb-[6px]">9:41</span>
            <div className="flex items-center gap-1.5 mb-[6px]">
              {/* Cellular */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <rect x="2" y="16" width="3" height="4" rx="0.5" />
                <rect x="7" y="12" width="3" height="8" rx="0.5" />
                <rect x="12" y="8" width="3" height="12" rx="0.5" />
                <rect x="17" y="4" width="3" height="16" rx="0.5" />
              </svg>
              {/* Wifi */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 21a2 2 0 1 1-2-2 2 2 0 0 1 2 2zm0-4a6 6 0 0 0-4.24-1.76l1.42-1.42A4 4 0 0 1 12 15a4 4 0 0 1 2.82-1.18l1.42 1.42A6 6 0 0 0 12 17zm0-4a10 10 0 0 0-7.07-2.93l1.42-1.42A8 8 0 0 1 12 11a8 8 0 0 1 5.65-2.35l1.42 1.42A10 10 0 0 0 12 13z" />
              </svg>
              {/* Battery */}
              <div className="w-[20px] h-[10px] rounded-[3px] border border-white/60 p-[1px] flex items-center relative">
                <div className="h-full w-[85%] bg-white/90 rounded-[1px]" />
                <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-[4px] bg-white/60 rounded-r-[1px]" />
              </div>
            </div>
          </div>

          {/* Actual Website content inside container */}
          <div className="w-full h-full relative pt-[48px] pb-[34px] flex flex-col">
            {children}
          </div>

          {/* iOS Home Indicator */}
          <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 z-40 pointer-events-none">
            <div className="w-[120px] h-[4.5px] rounded-full bg-white/40" />
          </div>

        </div>
      </div>

      {/* Small informative prompt to side for desktop developers */}
      <div className="absolute bottom-6 right-6 hidden xl:flex flex-col items-end gap-1 font-sans text-right text-zinc-500 pointer-events-none">
        <span className="text-xs font-semibold text-zinc-400">IPHONE 16 PRO SIMULATION</span>
        <span className="text-[10px]">Scrolling snaps automatically inside this viewport</span>
        <span className="text-[10px]">Resize window or load on mobile to view full screen</span>
      </div>
    </div>
  );
}
