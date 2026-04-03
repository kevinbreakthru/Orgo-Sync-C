"use client";

import { useEffect, useRef } from "react";

const BRAND_RGB = { r: 255, g: 62, b: 0 };
const NODE_COUNT = 70;
const SPEED = 2.2;
const MAX_DIST = 550;

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  pulse: number;
  pulseSpeed: number;
}

export function NetworkNodesBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    let nodes: Node[] = [];
    let animId: number;

    function resize() {
      W = canvas!.width = canvas!.offsetWidth;
      H = canvas!.height = canvas!.offsetHeight;
    }

    function createNode(): Node {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * SPEED * 0.5,
        vy: (Math.random() - 0.5) * SPEED * 0.5,
        r: Math.random() * 3 + 2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
      };
    }

    function init() {
      const count = W < 768 ? 20 : W < 1024 ? 40 : NODE_COUNT;
      nodes = Array.from({ length: count }, createNode);
    }

    function drawBackground() {
      ctx!.clearRect(0, 0, W, H);

      const bg = ctx!.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.45, Math.max(W, H) * 0.8);
      bg.addColorStop(0, "#120800");
      bg.addColorStop(0.5, "#0a0500");
      bg.addColorStop(1, "#080808");
      ctx!.fillStyle = bg;
      ctx!.fillRect(0, 0, W, H);

      const g1 = ctx!.createRadialGradient(W * 0.2, H * 0.3, 0, W * 0.2, H * 0.3, W * 0.4);
      g1.addColorStop(0, "rgba(255,62,0,0.07)");
      g1.addColorStop(1, "transparent");
      ctx!.fillStyle = g1;
      ctx!.fillRect(0, 0, W, H);

      const g2 = ctx!.createRadialGradient(W * 0.8, H * 0.7, 0, W * 0.8, H * 0.7, W * 0.45);
      g2.addColorStop(0, "rgba(255,120,0,0.05)");
      g2.addColorStop(1, "transparent");
      ctx!.fillStyle = g2;
      ctx!.fillRect(0, 0, W, H);
    }

    function draw() {
      drawBackground();

      const { r, g, b } = BRAND_RGB;

      const effectiveDist = W < 768 ? 180 : MAX_DIST;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < effectiveDist) {
            const t = 1 - d / effectiveDist;
            const grad = ctx!.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            grad.addColorStop(0, `rgba(${r},${g},${b},${t * 1.0})`);
            grad.addColorStop(0.5, `rgba(255,120,30,${t * 0.85})`);
            grad.addColorStop(1, `rgba(${r},${g},${b},${t * 1.0})`);
            ctx!.beginPath();
            ctx!.strokeStyle = grad;
            ctx!.lineWidth = t * 2.0;
            ctx!.moveTo(nodes[i].x, nodes[i].y);
            ctx!.lineTo(nodes[j].x, nodes[j].y);
            ctx!.stroke();
          }
        }
      }

      for (const n of nodes) {
        n.pulse += n.pulseSpeed;
        const pf = 1 + Math.sin(n.pulse) * 0.3;

        const glow = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 10 * pf);
        glow.addColorStop(0, `rgba(${r},${g},${b},0.35)`);
        glow.addColorStop(0.4, `rgba(255,100,0,0.14)`);
        glow.addColorStop(1, "transparent");
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r * 8 * pf, 0, Math.PI * 2);
        ctx!.fillStyle = glow;
        ctx!.fill();

        const dot = ctx!.createRadialGradient(n.x - n.r * 0.3, n.y - n.r * 0.3, 0, n.x, n.y, n.r * pf);
        dot.addColorStop(0, "#FFB080");
        dot.addColorStop(0.5, "#FF3E00");
        dot.addColorStop(1, "#AA2200");
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r * pf, 0, Math.PI * 2);
        ctx!.fillStyle = dot;
        ctx!.fill();

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }

      animId = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(() => {
      resize();
      init();
    });
    ro.observe(canvas);

    resize();
    init();
    draw();

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
        style={{ animation: "hubSpokeFadeIn 1.2s 0.3s ease both" }}
        aria-hidden
      />
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }} aria-hidden />
    </>
  );
}
