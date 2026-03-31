"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { NetworkNodesBg } from "../../components/marketing/network-nodes-bg";
import { HeroRoutingShowcase } from "../../components/marketing/hero-routing-showcase";
import "../(marketing)/marketing.css";

export default function GraphicPage() {
  return (
    <div
      className="mkt"
      style={{
        width: "100vmin",
        height: "100vmin",
        maxWidth: "100vw",
        maxHeight: "100vh",
        margin: "0 auto",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Logo — top center */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <Image src="/orgosynclogo.svg" alt="Orgo Sync" width={140} height={35} priority />
      </div>

      {/* Hero — reuse exact homepage classes */}
      <section
        className="mkt-hero mkt-hero--pillar mkt-hero--split"
        style={{
          minHeight: "100%", height: "100%", padding: "14% 6% 6%",
          "--headline-size": "clamp(52px, 9vmin, 110px)",
          "--sub-size": "clamp(14px, 2.4vmin, 22px)",
          "--cta-who-size": "clamp(9px, 1.2vmin, 13px)",
          "--cta-action-size": "clamp(13px, 2vmin, 18px)",
          "--cta-detail-size": "clamp(11px, 1.6vmin, 15px)",
        } as React.CSSProperties}
      >
        <NetworkNodesBg />

        <div className="mkt-hero-content">
          <h1 className="mkt-hero-headline" style={{ fontSize: "clamp(52px, 9vmin, 110px)" }}>
            The API for<br /><span>scheduling data</span>
          </h1>
          <p className="mkt-hero-sub" style={{ fontSize: "clamp(14px, 2.4vmin, 22px)" }}>
            A scheduling data API that makes every platform{" "}
            <strong>interoperable, secure and real-time.</strong>
          </p>

          <div className="mkt-hero-ctas">
            <Link href="/platform" className="mkt-hero-cta-card mkt-hero-cta-card--green">
              <div className="mkt-cta-card-who mkt-cta-card-who--green" style={{ fontSize: "clamp(9px, 1.2vmin, 13px)" }}>Scheduling Platforms</div>
              <div className="mkt-cta-card-action mkt-cta-card-action--green" style={{ fontSize: "clamp(13px, 2vmin, 18px)" }}>I&apos;m a platform →</div>
              <div className="mkt-cta-card-detail" style={{ fontSize: "clamp(11px, 1.6vmin, 15px)" }}>Own your data. Earn passive revenue. Free to connect.</div>
            </Link>
            <Link href="/builder" className="mkt-hero-cta-card mkt-hero-cta-card--purple">
              <div className="mkt-cta-card-who mkt-cta-card-who--purple" style={{ fontSize: "clamp(9px, 1.2vmin, 13px)" }}>Builders</div>
              <div className="mkt-cta-card-action mkt-cta-card-action--purple" style={{ fontSize: "clamp(13px, 2vmin, 18px)" }}>I want scheduling data →</div>
              <div className="mkt-cta-card-detail" style={{ fontSize: "clamp(11px, 1.6vmin, 15px)" }}>One API. Real-time access. Apply for access.</div>
            </Link>
          </div>
        </div>

        <HeroRoutingShowcase />
      </section>
    </div>
  );
}
