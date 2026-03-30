import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { HubSpokeBg } from "../../../components/marketing/hub-spoke-bg";

export const metadata: Metadata = {
  title: "Orgo Sync for Builders — Build on Real Scheduling Data",
};

export default function BuildersPage() {
  return (
    <>
      {/* HERO */}
      <section className="mkt-hero mkt-hero--pillar">
        <HubSpokeBg centerX={0.75} centerY={0.55} scale={0.38} overlay={false} />
        <div className="mkt-hero-eyebrow" style={{ color: "#7C3AFF", background: "rgba(124,58,255,0.1)", borderColor: "rgba(124,58,255,0.22)", "--m-accent": "#7C3AFF" } as React.CSSProperties}>For Builders</div>
        <h1 className="mkt-hero-headline">
          The scheduling data<br />you need to build on<br />
          <span>has been locked. Until now.</span>
        </h1>
        <p className="mkt-hero-sub">
          One authenticated API. Real-time access to{" "}
          <strong>standardized scheduling data</strong> from every connected
          platform. Apply once. Build anything.
        </p>
        <div className="mkt-hero-actions">
          <Link href="/getstarted" className="mkt-btn-primary">
            Apply for Access →
          </Link>
          <a href="#usecases" className="mkt-btn-secondary">
            See What You Can Build ↓
          </a>
        </div>
      </section>

      {/* CONSTRAINT BAND */}
      <div className="mkt-band">
        <div className="mkt-band-label">The constraint today</div>
        <div className="mkt-band-divider" />
        <div className="mkt-band-text">
          Every platform is a silo. No unified API. No real-time data. You&apos;ve been
          building on stale public feeds. That ends here.
        </div>
      </div>

      {/* BEFORE AFTER */}
      <section className="mkt-section" style={{ background: "var(--m-black)" }}>
        <div className="mkt-section-eyebrow">Building on scheduling data</div>
        <h2 className="mkt-section-h1" style={{ color: "var(--m-white)" }}>
          Without Orgo Sync<br />
          <span>vs. with Orgo Sync.</span>
        </h2>
        <p className="mkt-section-h2" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 56 }}>
          Five stale fields and a public URL is not a data layer. Orgo Sync fills the gap.
        </p>
        <div className="mkt-ba-grid">
          <div className="mkt-card bad" style={{ borderRadius: 4 }}>
            <div className="mkt-card-label">Without Orgo Sync</div>
            <div className="mkt-card-title">
              Five stale fields. No standard. No real time. No access layer.
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✕</div>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                Public ICS feeds. Title, time, location. That&apos;s all you have.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✕</div>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                Stale. Changes take hours to reach your product.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✕</div>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                Every platform is a custom bilateral negotiation. You rebuild every time.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✕</div>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                No permissioned access. No audit trail. No legitimate foundation.
              </span>
            </div>
          </div>
          <div className="mkt-vs-col">VS</div>
          <div className="mkt-card good" style={{ borderRadius: 4 }}>
            <div className="mkt-card-label">With Orgo Sync</div>
            <div className="mkt-card-title">
              Rich structured data. Real time. One API. Any approved platform.
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✓</div>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                Authenticated real-time access. One standard format, any approved platform.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✓</div>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                Real-time webhooks. Changes reach your product in seconds.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✓</div>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                One API. Build once. No custom integrations ever again.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✓</div>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                Authenticated. Permissioned. Audited.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="mkt-section mkt-usecases-section" id="usecases">
        <div className="mkt-section-eyebrow">What you can build</div>
        <h2 className="mkt-section-h1">
          Your product.<br />
          <span>Your UX. Our infrastructure.</span>
        </h2>
        <p className="mkt-section-h2" style={{ color: "var(--m-gray)" }}>
          Orgo Sync provides the data layer. What you build on top is up to you.
        </p>
        <div className="mkt-usecases-grid">
          <div className="mkt-usecase-card">
            <div className="mkt-usecase-tag">Fan and game day experiences</div>
            <div className="mkt-usecase-title">
              Live schedule data. Real-time fan engagement.
            </div>
            <div className="mkt-usecase-body">
              Pull game schedules and venue data into your product. Trigger live
              updates tied to real events as they happen.
            </div>
            <div className="mkt-usecase-why">
              <span>Why Orgo Sync:</span> Real-time authenticated data. Not a stale ICS feed.
            </div>
          </div>
          <div className="mkt-usecase-card">
            <div className="mkt-usecase-tag">Unified participant profiles</div>
            <div className="mkt-usecase-title">
              A complete scheduling view across every platform a participant
              touches.
            </div>
            <div className="mkt-usecase-body">
              Connect approved platforms and assemble a unified schedule for any
              participant. Academic, club, tournament — all in one API.
            </div>
            <div className="mkt-usecase-why">
              <span>Why Orgo Sync:</span> The only infrastructure that sees across platforms.
            </div>
          </div>
          <div className="mkt-usecase-card">
            <div className="mkt-usecase-tag">AI scheduling intelligence</div>
            <div className="mkt-usecase-title">
              Real structured data for your AI to reason over accurately.
            </div>
            <div className="mkt-usecase-body">
              Power your AI with authenticated real-time data from the platforms
              users actually live in. Conflict detection. Pattern recognition. All possible now.
            </div>
            <div className="mkt-usecase-why">
              <span>Why Orgo Sync:</span> AI doesn&apos;t hallucinate when it has reliable real-time data.
            </div>
          </div>
        </div>
      </section>

      {/* HOW ACCESS WORKS */}
      <section className="mkt-section" id="how" style={{ background: "var(--m-white)" }}>
        <div className="mkt-section-eyebrow">How you get access</div>
        <h2 className="mkt-section-h1">
          Four steps.<br />
          <span>Minutes not months.</span>
        </h2>
        <p className="mkt-section-h2" style={{ color: "var(--m-gray)" }}>
          No bilateral negotiations. No custom integrations. Apply once and
          access every platform that approves you.
        </p>
        <div className="mkt-access-grid">
          <div className="mkt-access-card">
            <div className="mkt-access-num">01</div>
            <div className="mkt-access-title">
              Apply via the developer portal
            </div>
            <div className="mkt-access-body">
              Tell us what you&apos;re building. <strong>Takes minutes.</strong>
            </div>
          </div>
          <div className="mkt-access-card">
            <div className="mkt-access-num">02</div>
            <div className="mkt-access-title">
              Platform approves your access
            </div>
            <div className="mkt-access-body">
              Each platform approves your request.{" "}
              <strong>You get access to what they authorize.</strong>
            </div>
          </div>
          <div className="mkt-access-card">
            <div className="mkt-access-num">03</div>
            <div className="mkt-access-title">
              One API. Every approved source.
            </div>
            <div className="mkt-access-body">
              One standardized API.{" "}
              <strong>Build once. Access any platform you&apos;re approved for.</strong>
            </div>
          </div>
          <div className="mkt-access-card">
            <div className="mkt-access-num">04</div>
            <div className="mkt-access-title">
              Pay per API call. Scale freely.
            </div>
            <div className="mkt-access-body">
              No flat fees. No minimums. <strong>Pay per call. Start free.</strong>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="mkt-section mkt-pricing-section">
        <div className="mkt-section-eyebrow">Pricing</div>
        <h2 className="mkt-section-h1" style={{ color: "var(--m-white)" }}>
          Pay per API call.<br />
          <span>No minimums. No surprises.</span>
        </h2>
        <p className="mkt-section-h2" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 56 }}>
          500 free calls to start. Pay only for what you use.
        </p>
        <div className="mkt-pricing-grid">
          <div className="mkt-pricing-card">
            <div className="mkt-pricing-name">Sandbox</div>
            <div className="mkt-pricing-price">Free</div>
            <div className="mkt-pricing-unit">first 500 API calls</div>
            <div className="mkt-pricing-volume">Build and test</div>
            <div className="mkt-pricing-desc">
              Full API access. No credit card.
            </div>
          </div>
          <div className="mkt-pricing-card highlight">
            <div className="mkt-pricing-name">Growth</div>
            <div className="mkt-pricing-price">$0.075</div>
            <div className="mkt-pricing-unit">per API call</div>
            <div className="mkt-pricing-volume">Up to 10K calls/mo</div>
            <div className="mkt-pricing-desc">
              Early production.
            </div>
          </div>
          <div className="mkt-pricing-card">
            <div className="mkt-pricing-name">Scale</div>
            <div className="mkt-pricing-price">$0.065</div>
            <div className="mkt-pricing-unit">per API call</div>
            <div className="mkt-pricing-volume">10K to 100K calls/mo</div>
            <div className="mkt-pricing-desc">
              Established products with growing volume.
            </div>
          </div>
          <div className="mkt-pricing-card">
            <div className="mkt-pricing-name">Enterprise</div>
            <div className="mkt-pricing-price">$0.055</div>
            <div className="mkt-pricing-unit">per API call</div>
            <div className="mkt-pricing-volume">100K+ calls/mo</div>
            <div className="mkt-pricing-desc">
              High-volume. Custom SLA.
            </div>
          </div>
        </div>
        <div className="mkt-pricing-note">
          No setup fees. No monthly minimums. First 500 calls always free.
        </div>
      </section>

      {/* AI SECTION */}
      <section className="mkt-section" style={{ background: "var(--m-gray-light)" }}>
        <div className="mkt-section-eyebrow">Built for the AI era</div>
        <h2 className="mkt-section-h1">
          We are not building AI.<br />
          <span>We are building what scheduling AI runs on.</span>
        </h2>
        <p className="mkt-section-h2" style={{ color: "var(--m-gray)" }}>
          Every AI scheduling assistant hits the same wall — fragmented, stale
          data. Orgo Sync removes it.
        </p>
        <div className="mkt-ai-grid">
          <div className="mkt-ai-card">
            <div className="mkt-ai-icon">⚡</div>
            <div className="mkt-ai-title">
              Agentic AI needs real-time authenticated data
            </div>
            <div className="mkt-ai-body">
              Scheduling agents need{" "}
              <strong>real-time authenticated access across every platform a user touches.</strong>{" "}
              Orgo Sync makes that possible without bilateral integrations.
            </div>
          </div>
          <div className="mkt-ai-card">
            <div className="mkt-ai-icon">🧠</div>
            <div className="mkt-ai-title">
              Clean structured data AI can trust
            </div>
            <div className="mkt-ai-body">
              AI doesn&apos;t hallucinate when it has reliable data. We produce{" "}
              <strong>clean standardized real-time scheduling data</strong> your
              models can reason over accurately.
            </div>
          </div>
          <div className="mkt-ai-card">
            <div className="mkt-ai-icon">🔗</div>
            <div className="mkt-ai-title">
              The standard connection point for scheduling AI
            </div>
            <div className="mkt-ai-body">
              Build on the scheduling data standard early.{" "}
              <strong>Own the integration before it&apos;s table stakes.</strong>
            </div>
          </div>
        </div>
      </section>

      {/* UNLOCK */}
      <section className="mkt-section" style={{ background: "var(--m-black)" }}>
        <div className="mkt-section-eyebrow">The bigger picture</div>
        <h2 className="mkt-section-h1" style={{ color: "var(--m-white)" }}>
          Ready to unlock<br />
          <span>what you can actually build?</span>
        </h2>
        <p className="mkt-section-h2" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 56 }}>
          The scheduling data layer has been missing for 30 years. The window is
          open right now.
        </p>
        <div className="mkt-unlock-grid">
          <div className="mkt-unlock-card">
            <div className="mkt-unlock-title">
              <span>Build once.</span> Access everywhere.
            </div>
            <div className="mkt-unlock-body">
              One API. As platforms join, your product gains access
              automatically — no new integrations.
            </div>
          </div>
          <div className="mkt-unlock-card">
            <div className="mkt-unlock-title">
              <span>The network</span> grows around you.
            </div>
            <div className="mkt-unlock-body">
              Every platform that connects expands your product&apos;s reach.
              Build once. The network compounds.
            </div>
          </div>
          <div className="mkt-unlock-card">
            <div className="mkt-unlock-title">
              <span>First movers</span> define the category.
            </div>
            <div className="mkt-unlock-body">
              The standard is being set now. Early builders get the deepest
              access and strongest position. The window is open.
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mkt-cta-orange">
        <h2 className="mkt-cta-h1">
          Ready to build on<br />real scheduling data?
        </h2>
        <p className="mkt-cta-h2">
          Developer portal is live. First 500 calls free. Apply in minutes.
        </p>
        <Link href="/getstarted" className="mkt-btn-white">
          Apply for Access →
        </Link>
      </section>
    </>
  );
}
