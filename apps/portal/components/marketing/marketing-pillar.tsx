"use client";

import dynamic from "next/dynamic";

const LightPillar = dynamic(() => import("../light-pillar"), { ssr: false });

interface MarketingPillarProps {
  opacity?: number;
  className?: string;
}

export function MarketingPillar({
  opacity = 0.5,
  className = "",
}: MarketingPillarProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden
    >
      <LightPillar
        topColor="#FFC000"
        bottomColor="#FF4500"
        intensity={1.0}
        rotationSpeed={0.2}
        glowAmount={0.005}
        pillarWidth={3.5}
        pillarHeight={0.35}
        noiseIntensity={0.35}
        quality="medium"
        className={`absolute inset-0`}
        mixBlendMode="screen"
      />
      <div
        className="absolute inset-0"
        style={{ opacity: 1 - opacity, background: "var(--m-black)" }}
      />
    </div>
  );
}
