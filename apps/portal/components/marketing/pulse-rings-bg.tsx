"use client";

import { useEffect, useRef } from "react";

const BRAND = { r: 255, g: 62, b: 0 };
const RING_COUNT = 3;
const CYCLE_DURATION = 16000; // ms for a ring to fully expand and fade

export function PulseRingsBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, animId: number;
    let startTime = performance.now();

    function resize() {
      W = canvas!.width = canvas!.offsetWidth;
      H = canvas!.height = canvas!.offsetHeight;
    }

    function draw(now: number) {
      ctx!.clearRect(0, 0, W, H);

      // Background
      const bg = ctx!.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.75);
      bg.addColorStop(0, "#140600");
      bg.addColorStop(0.5, "#0a0400");
      bg.addColorStop(1, "#080808");
      ctx!.fillStyle = bg;
      ctx!.fillRect(0, 0, W, H);

      const cx = W * 0.5;
      const cy = H * 0.5;
      const maxR = Math.sqrt(cx * cx + cy * cy) * 1.1;
      const { r, g, b } = BRAND;

      for (let i = 0; i < RING_COUNT; i++) {
        // Each ring is offset in time
        const offset = (i / RING_COUNT) * CYCLE_DURATION;
        const elapsed = (now - startTime + offset) % CYCLE_DURATION;
        const progress = elapsed / CYCLE_DURATION; // 0 → 1

        const radius = progress * maxR;
        const alpha = Math.sin(progress * Math.PI) * 0.3;
        const lineWidth = (1 - progress) * 2.5 + 0.5;

        ctx!.beginPath();
        ctx!.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx!.lineWidth = lineWidth;
        ctx!.stroke();
      }

      // Soft central glow
      const glow = ctx!.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.35);
      glow.addColorStop(0, `rgba(${r},${g},${b},0.12)`);
      glow.addColorStop(0.5, `rgba(255,100,0,0.05)`);
      glow.addColorStop(1, "transparent");
      ctx!.fillStyle = glow;
      ctx!.fillRect(0, 0, W, H);

      animId = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    resize();
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden
      />
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)" }} aria-hidden />
    </>
  );
}
