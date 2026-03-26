import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Orgo Sync for Builders — Build on Real Scheduling Data",
};

export default function BuildersPage() {
  return (
    <>
      {/* HERO */}
      <section className="mkt-hero">
        <div className="mkt-hero-eyebrow">For Builders</div>
        <h1 className="mkt-hero-headline">
          The scheduling data<br />you need to build on<br />
          <span>has been locked. Until now.</span>
        </h1>
        <p className="mkt-hero-sub">
          One authenticated API. Real-time access to{" "}
          <strong>standardized scheduling data</strong> from every connected
          platform. Apply once. Get approved. Build whatever experience your
          users need.
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
          Every scheduling platform is a silo. No unified access layer. No
          authenticated API. No real-time data. You have been building on stale
          public calendar feeds with five fields and no standard. That ends here.
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
          ICS was never built for developers. Five stale fields and a public URL
          is not a data layer. Orgo Sync is what the scheduling ecosystem has
          been missing.
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
                Public ICS feeds with no authentication and no structured data.
                Title, time, location and an empty description. That is
                everything you have to build on.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✕</div>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                Stale data. Changes happen in the platform. Your product never
                finds out until the next refresh cycle — hours later.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✕</div>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                Every platform is a separate bilateral negotiation. Custom
                integration per platform. You build the same thing repeatedly.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✕</div>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                No permissioned access. No audit trail. No legitimate
                authenticated data layer to build on with confidence.
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
                Authenticated real-time API access to structured scheduling data
                from every platform that approves you. One standard format
                regardless of source.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✓</div>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                Real-time updates via webhook. Changes in the platform reach your
                product in seconds. Always current. Always accurate.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✓</div>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                One API. Build once. Access any platform that approves you. No
                custom integrations. No bilateral negotiations. Ever again.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✓</div>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                Fully authenticated. Permissioned. Audited. Build on data you
                have legitimate access to with a complete audit trail.
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
          Orgo Sync provides the data layer. What you build on top is entirely up
          to you. No prescribed use case. No product category constraints.
        </p>
        <div className="mkt-usecases-grid">
          <div className="mkt-usecase-card">
            <div className="mkt-usecase-tag">Fan and game day experiences</div>
            <div className="mkt-usecase-title">
              Live schedule data. Real-time fan engagement.
            </div>
            <div className="mkt-usecase-body">
              Pull structured game schedules, venue data and event information
              directly into your product. Trigger push notifications, live
              updates and contextual experiences tied to real scheduling events as
              they happen — not hours later.
            </div>
            <div className="mkt-usecase-why">
              <span>Why Orgo Sync:</span> Real-time authenticated data from the
              platform. Not a stale ICS feed that refreshed six hours ago.
            </div>
          </div>
          <div className="mkt-usecase-card">
            <div className="mkt-usecase-tag">Unified participant profiles</div>
            <div className="mkt-usecase-title">
              A complete scheduling view across every platform a participant
              touches.
            </div>
            <div className="mkt-usecase-body">
              Connect to multiple approved platforms and assemble a unified
              scheduling picture of any participant. Academic schedule. Club
              schedule. Tournament schedule. All accessible through one API. Your
              product assembles the profile — Orgo Sync provides the data.
            </div>
            <div className="mkt-usecase-why">
              <span>Why Orgo Sync:</span> The only infrastructure that sees
              across platforms. No single platform has this view.
            </div>
          </div>
          <div className="mkt-usecase-card">
            <div className="mkt-usecase-tag">AI scheduling intelligence</div>
            <div className="mkt-usecase-title">
              Real structured data for your AI to reason over accurately.
            </div>
            <div className="mkt-usecase-body">
              Stop building AI on stale public feeds. Power your scheduling
              intelligence with authenticated real-time structured data from the
              platforms your users actually live in. Conflict detection. Load
              management. Pattern recognition. All possible now.
            </div>
            <div className="mkt-usecase-why">
              <span>Why Orgo Sync:</span> AI doesn&apos;t hallucinate when it has
              reliable real-time data. We provide that foundation.
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
          access every platform that approves you through a single authenticated
          API.
        </p>
        <div className="mkt-access-grid">
          <div className="mkt-access-card">
            <div className="mkt-access-num">01</div>
            <div className="mkt-access-title">
              Apply via the developer portal
            </div>
            <div className="mkt-access-body">
              Visit <strong>sync.orgohq.com.</strong> Tell us what you are
              building and which platforms you want access to. Takes minutes.
            </div>
          </div>
          <div className="mkt-access-card">
            <div className="mkt-access-num">02</div>
            <div className="mkt-access-title">
              Platform approves your access
            </div>
            <div className="mkt-access-body">
              Each platform reviews and approves your request.{" "}
              <strong>They own their data.</strong> You get authenticated access
              to what they authorize.
            </div>
          </div>
          <div className="mkt-access-card">
            <div className="mkt-access-num">03</div>
            <div className="mkt-access-title">
              One API. Every approved source.
            </div>
            <div className="mkt-access-body">
              All approved platform data through{" "}
              <strong>one standardized authenticated API.</strong> Build once.
              Access any platform you have approval for.
            </div>
          </div>
          <div className="mkt-access-card">
            <div className="mkt-access-num">04</div>
            <div className="mkt-access-title">
              Pay per API call. Scale freely.
            </div>
            <div className="mkt-access-body">
              No flat fees. No minimums. <strong>Pure consumption.</strong> Costs
              scale only with your product&apos;s actual usage. Start free.
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
          Your first 500 API calls are free. After that you pay only for what
          your product actually uses. Costs scale with your growth — not before
          it.
        </p>
        <div className="mkt-pricing-grid">
          <div className="mkt-pricing-card">
            <div className="mkt-pricing-name">Sandbox</div>
            <div className="mkt-pricing-price">Free</div>
            <div className="mkt-pricing-unit">first 500 API calls</div>
            <div className="mkt-pricing-volume">Build and test</div>
            <div className="mkt-pricing-desc">
              Full API access to integrate and validate your product at zero
              cost. No credit card required.
            </div>
          </div>
          <div className="mkt-pricing-card highlight">
            <div className="mkt-pricing-name">Growth</div>
            <div className="mkt-pricing-price">$0.075</div>
            <div className="mkt-pricing-unit">per API call</div>
            <div className="mkt-pricing-volume">Up to 10K calls/mo</div>
            <div className="mkt-pricing-desc">
              Early production. Growing products with their first real users
              finding traction.
            </div>
          </div>
          <div className="mkt-pricing-card">
            <div className="mkt-pricing-name">Scale</div>
            <div className="mkt-pricing-price">$0.065</div>
            <div className="mkt-pricing-unit">per API call</div>
            <div className="mkt-pricing-volume">10K to 100K calls/mo</div>
            <div className="mkt-pricing-desc">
              Established products with predictable and growing call volume.
            </div>
          </div>
          <div className="mkt-pricing-card">
            <div className="mkt-pricing-name">Enterprise</div>
            <div className="mkt-pricing-price">$0.055</div>
            <div className="mkt-pricing-unit">per API call</div>
            <div className="mkt-pricing-volume">100K+ calls/mo</div>
            <div className="mkt-pricing-desc">
              High-volume solutions. Custom SLA. Dedicated support available.
            </div>
          </div>
        </div>
        <div className="mkt-pricing-note">
          No setup fees. No monthly minimums. Your first 500 API calls are
          always free.
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
          Every AI scheduling assistant being built today hits the same wall —
          fragmented, stale, inaccessible data. Orgo Sync is the infrastructure
          that removes it.
        </p>
        <div className="mkt-ai-grid">
          <div className="mkt-ai-card">
            <div className="mkt-ai-icon">⚡</div>
            <div className="mkt-ai-title">
              Agentic AI needs real-time authenticated data
            </div>
            <div className="mkt-ai-body">
              The next wave of AI takes actions on your behalf. Scheduling agents
              need{" "}
              <strong>
                real-time authenticated access across every platform a user
                touches.
              </strong>{" "}
              Orgo Sync is the layer that makes that possible without building
              bilateral integrations for every platform.
            </div>
          </div>
          <div className="mkt-ai-card">
            <div className="mkt-ai-icon">🧠</div>
            <div className="mkt-ai-title">
              Clean structured data AI can trust
            </div>
            <div className="mkt-ai-body">
              AI doesn&apos;t hallucinate when it has reliable data. Orgo Sync
              produces{" "}
              <strong>clean standardized real-time scheduling data</strong> that
              your AI models can reason over accurately. Not a stale ICS feed
              from six hours ago.
            </div>
          </div>
          <div className="mkt-ai-card">
            <div className="mkt-ai-icon">🔗</div>
            <div className="mkt-ai-title">
              The standard connection point for scheduling AI
            </div>
            <div className="mkt-ai-body">
              Orgo Sync is positioned to become the{" "}
              <strong>
                default data layer every scheduling AI connects to
              </strong>{" "}
              — the MCP server for the scheduling universe. Build on the standard
              early. Own the integration before it becomes table stakes.
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
          The scheduling data layer has been missing for 30 years. The products
          that get built on top of it first will define the category. That window
          is open right now.
        </p>
        <div className="mkt-unlock-grid">
          <div className="mkt-unlock-card">
            <div className="mkt-unlock-title">
              <span>Build once.</span> Access everywhere.
            </div>
            <div className="mkt-unlock-body">
              One API integration gives you access to every platform that
              approves you. As new platforms join Orgo Sync your product
              automatically gains access to their data without writing a single
              new line of integration code.
            </div>
          </div>
          <div className="mkt-unlock-card">
            <div className="mkt-unlock-title">
              <span>The network</span> grows around you.
            </div>
            <div className="mkt-unlock-body">
              Every new platform that connects to Orgo Sync expands what your
              product can do. You build once. The data layer compounds around
              you. The more connected the ecosystem becomes the more powerful
              your product becomes automatically.
            </div>
          </div>
          <div className="mkt-unlock-card">
            <div className="mkt-unlock-title">
              <span>First movers</span> define the category.
            </div>
            <div className="mkt-unlock-body">
              The scheduling data standard is being set right now. The builders
              who integrate early will have the deepest data access, the most
              established platform relationships and the strongest position as
              the ecosystem scales. The window is open. Not forever.
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
          Developer portal is live. First 500 API calls are free. Apply in
          minutes.
        </p>
        <Link href="/getstarted" className="mkt-btn-white">
          Apply for Access →
        </Link>
      </section>
    </>
  );
}
