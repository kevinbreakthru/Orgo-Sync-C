"use client";

import dynamic from "next/dynamic";

const LightPillar = dynamic(() => import("./light-pillar"), { ssr: false });

interface BackdropProps {
  subtle?: boolean;
}

export default function Backdrop({ subtle = false }: BackdropProps) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-background" />
      <LightPillar
        topColor="#FFC000"
        bottomColor="#FF4500"
        intensity={subtle ? 0.8 : 1.1}
        rotationSpeed={0.2}
        glowAmount={subtle ? 0.004 : 0.006}
        pillarWidth={4.0}
        pillarHeight={0.35}
        noiseIntensity={0.35}
        quality="high"
        className={
          subtle
            ? "absolute inset-0 opacity-45"
            : "absolute inset-0 opacity-60"
        }
      />
    </div>
  );
}
