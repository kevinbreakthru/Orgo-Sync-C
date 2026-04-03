"use client";

import { useEffect, useRef } from "react";

const SPOKE_COUNT = 8;

interface Particle {
  spokeIndex: number;
  progress: number;
  speed: number;
  inbound: boolean;
}

interface RGB { r: number; g: number; b: number; }

export function HubSpokeBg({
  centerX = 0.5,
  centerY = 0.5,
  scale = 1,
  overlay = true,
  color = { r: 255, g: 62, b: 0 },
}: {
  centerX?: number;
  centerY?: number;
  scale?: number;
  overlay?: boolean;
  color?: RGB;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, animId: number;
    let lastTime = performance.now();
    let tick = 0;

    const particles: Particle[] = [];

    function initParticles() {
      particles.length = 0;
      for (let s = 0; s < SPOKE_COUNT; s++) {
        particles.push({
          spokeIndex: s,
          progress: Math.random(),
          speed: 0.00012 + Math.random() * 0.00008,
          inbound: true,
        });
        if (Math.random() > 0.3) {
          particles.push({
            spokeIndex: (s + Math.floor(SPOKE_COUNT / 2)) % SPOKE_COUNT,
            progress: Math.random(),
            speed: 0.00012 + Math.random() * 0.00008,
            inbound: false,
          });
        }
      }
    }

    function resize() {
      W = canvas!.width = canvas!.offsetWidth;
      H = canvas!.height = canvas!.offsetHeight;
    }

    function draw(now: number) {
      const dt = now - lastTime;
      lastTime = now;
      tick += dt * 0.001;

      ctx!.clearRect(0, 0, W, H);

      const cx = W * (W < 768 ? 0.5 : centerX);
      const cy = H * centerY;

      function spokePos(i: number) {
        const angle = (i / SPOKE_COUNT) * Math.PI * 2 - Math.PI / 2;
        const radius = Math.max(W, H) * 0.38 * (W < 768 ? 1 : scale);
        return {
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
        };
      }

      const { r, g, b } = color;

      // Background — tinted toward the page color
      const bg = ctx!.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.75);
      bg.addColorStop(0, `rgba(${Math.round(r * 0.08)},${Math.round(g * 0.08)},${Math.round(b * 0.08)},1)`);
      bg.addColorStop(0.5, "#060608");
      bg.addColorStop(1, "#080808");
      ctx!.fillStyle = bg;
      ctx!.fillRect(0, 0, W, H);

      // Spoke lines
      for (let i = 0; i < SPOKE_COUNT; i++) {
        const sp = spokePos(i);
        const grad = ctx!.createLinearGradient(cx, cy, sp.x, sp.y);
        grad.addColorStop(0, `rgba(${r},${g},${b},0.3)`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0.06)`);
        ctx!.beginPath();
        ctx!.moveTo(cx, cy);
        ctx!.lineTo(sp.x, sp.y);
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();
      }

      // Particles
      for (const p of particles) {
        p.progress += p.speed * dt;
        if (p.progress > 1) p.progress = 0;

        const sp = spokePos(p.spokeIndex);
        const t = p.progress;
        const px = p.inbound ? sp.x + (cx - sp.x) * t : cx + (sp.x - cx) * t;
        const py = p.inbound ? sp.y + (cy - sp.y) * t : cy + (sp.y - cy) * t;

        // Trail
        for (let trail = 1; trail <= 5; trail++) {
          const tp = Math.max(0, t - trail * 0.018);
          const tpx = p.inbound ? sp.x + (cx - sp.x) * tp : cx + (sp.x - cx) * tp;
          const tpy = p.inbound ? sp.y + (cy - sp.y) * tp : cy + (sp.y - cy) * tp;
          ctx!.beginPath();
          ctx!.arc(tpx, tpy, 1.5, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${r},${g},${b},${0.12 - trail * 0.02})`;
          ctx!.fill();
        }

        // Particle glow
        const pglow = ctx!.createRadialGradient(px, py, 0, px, py, 7);
        pglow.addColorStop(0, `rgba(${Math.min(255, r + 80)},${Math.min(255, g + 80)},${Math.min(255, b + 80)},0.9)`);
        pglow.addColorStop(0.4, `rgba(${r},${g},${b},0.4)`);
        pglow.addColorStop(1, "transparent");
        ctx!.beginPath();
        ctx!.arc(px, py, 7, 0, Math.PI * 2);
        ctx!.fillStyle = pglow;
        ctx!.fill();

        // Core
        ctx!.beginPath();
        ctx!.arc(px, py, 2, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${Math.min(255, r + 100)},${Math.min(255, g + 100)},${Math.min(255, b + 100)},1)`;
        ctx!.fill();
      }

      // Spoke nodes
      for (let i = 0; i < SPOKE_COUNT; i++) {
        const sp = spokePos(i);
        const pf = 1 + Math.sin(tick + i * 0.9) * 0.25;

        const ng = ctx!.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, 20 * pf);
        ng.addColorStop(0, `rgba(${r},${g},${b},0.25)`);
        ng.addColorStop(1, "transparent");
        ctx!.beginPath();
        ctx!.arc(sp.x, sp.y, 20 * pf, 0, Math.PI * 2);
        ctx!.fillStyle = ng;
        ctx!.fill();

        const nd = ctx!.createRadialGradient(sp.x - 1.5, sp.y - 1.5, 0, sp.x, sp.y, 5 * pf);
        nd.addColorStop(0, `rgba(${Math.min(255, r + 100)},${Math.min(255, g + 100)},${Math.min(255, b + 100)},1)`);
        nd.addColorStop(0.5, `rgba(${r},${g},${b},1)`);
        nd.addColorStop(1, `rgba(${Math.round(r * 0.6)},${Math.round(g * 0.6)},${Math.round(b * 0.6)},1)`);
        ctx!.beginPath();
        ctx!.arc(sp.x, sp.y, 5 * pf, 0, Math.PI * 2);
        ctx!.fillStyle = nd;
        ctx!.fill();
      }

      // Hub glow
      const hpf = 1 + Math.sin(tick * 1.2) * 0.12;

      const hbig = ctx!.createRadialGradient(cx, cy, 0, cx, cy, 80 * hpf);
      hbig.addColorStop(0, `rgba(${r},${g},${b},0.3)`);
      hbig.addColorStop(0.45, `rgba(${r},${g},${b},0.06)`);
      hbig.addColorStop(1, "transparent");
      ctx!.beginPath();
      ctx!.arc(cx, cy, 80 * hpf, 0, Math.PI * 2);
      ctx!.fillStyle = hbig;
      ctx!.fill();

      // Hub ring
      ctx!.beginPath();
      ctx!.arc(cx, cy, 18 * hpf, 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(${r},${g},${b},0.6)`;
      ctx!.lineWidth = 1.5;
      ctx!.stroke();

      // Hub core
      const hcore = ctx!.createRadialGradient(cx - 4, cy - 4, 0, cx, cy, 14 * hpf);
      hcore.addColorStop(0, `rgba(${Math.min(255, r + 100)},${Math.min(255, g + 100)},${Math.min(255, b + 100)},1)`);
      hcore.addColorStop(0.5, `rgba(${r},${g},${b},1)`);
      hcore.addColorStop(1, `rgba(${Math.round(r * 0.5)},${Math.round(g * 0.5)},${Math.round(b * 0.5)},1)`);
      ctx!.beginPath();
      ctx!.arc(cx, cy, 14 * hpf, 0, Math.PI * 2);
      ctx!.fillStyle = hcore;
      ctx!.fill();

      animId = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    resize();
    initParticles();
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [centerX, centerY, scale, color.r, color.g, color.b]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ animation: "hubSpokeFadeIn 1.2s 0.3s ease both" }}
        aria-hidden
      />
      {overlay && <div className="absolute inset-0 hub-spoke-overlay-desktop" style={{ background: "rgba(0,0,0,0.52)" }} aria-hidden />}
      <div className="absolute inset-0 hub-spoke-overlay-mobile" style={{ background: "rgba(0,0,0,0.6)" }} aria-hidden />
    </>
  );
}
