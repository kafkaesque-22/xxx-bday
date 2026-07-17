import React from "react";

interface IPhoneContainerProps {
  children: React.ReactNode;
  activeColor: { from: string; via: string; to: string };
}

export default function IPhoneContainer({
  children,
  activeColor,
}: IPhoneContainerProps) {
  return (
    <div
      className="min-h-[100dvh] w-full flex flex-col bg-zinc-950 relative overflow-hidden transition-all duration-1000 select-none"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, ${activeColor.via}20, #09090b 80%)`,
      }}
    >
      {/* Dynamic ambient backdrop glow */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[100px] opacity-15 pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: activeColor.from }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full blur-[100px] opacity-15 pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: activeColor.to }}
      />

      {/* Full screen main application content - no pt-12 phone status bar offset */}
      <div className="w-full h-[100dvh] relative flex flex-col pt-0">
        {children}
      </div>
    </div>
  );
}


