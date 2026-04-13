import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { HubSpokeBg } from "../../../components/marketing/hub-spoke-bg";

export const metadata: Metadata = {
  title: "Orgo Sync for Builders — Build on Real Scheduling Data",
  description: "One authenticated integration. Apply once, access every approved platform. Rich, structured, real-time scheduling data.",
  openGraph: {
    title: "Orgo Sync for Builders — Build on Real Scheduling Data",
    description: "One authenticated integration. Apply once, access every approved platform. Rich, structured, real-time scheduling data.",
    images: [{ url: "/builders-og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Orgo Sync for Builders — Build on Real Scheduling Data",
    description: "One authenticated integration. Apply once, access every approved platform.",
    images: ["/builders-og.png"],
  },
};

const MONO: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains),'JetBrains Mono',monospace",
};
const BG = "#07080c";
const BG2 = "#0c0e18";
const W90 = "rgba(255,255,255,0.90)";
const W75 = "rgba(255,255,255,0.75)";
const W40 = "rgba(255,255,255,0.40)";
const PURPLE = "#b04dff";
const PURPLE_T = "#c470ff";
const PURPLE_G = "rgba(176,77,255,0.35)";
const ORANGE = "#FF3E00";
const BORDER = "rgba(255,255,255,0.08)";
const BORDER_L = "rgba(255,255,255,0.05)";

const wrap: React.CSSProperties = {
  padding: "90px max(60px, calc((100% - 1200px) / 2))",
};
const inner: React.CSSProperties = { maxWidth: 1200, margin: "0 auto" };
const eyebrow: React.CSSProperties = {
  ...MONO,
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: PURPLE_T,
  marginBottom: 20,
};
const h2: React.CSSProperties = {
  fontFamily: "var(--font-bebas),'Bebas Neue',sans-serif",
  fontSize: "clamp(32px,4vw,52px)",
  fontWeight: 700,
  lineHeight: 1.05,
  color: "#fff",
  marginBottom: 20,
};
const body: React.CSSProperties = { fontSize: 17, color: W90, lineHeight: 1.8 };

export default function BuildersPage() {
  return (
    <>
      {/* HERO */}
      <section className="mkt-hero mkt-hero--pillar">
        <HubSpokeBg
          centerX={0.75}
          centerY={0.55}
          scale={0.38}
          overlay={false}
          color={{ r: 176, g: 77, b: 255 }}
        />
        <div
          className="mkt-hero-eyebrow"
          style={
            {
              color: PURPLE_T,
              background: "rgba(176,77,255,0.1)",
              borderColor: "rgba(176,77,255,0.22)",
            } as React.CSSProperties
          }
        >
          For Builders and Developers
        </div>
        <h1 className="mkt-hero-headline">
          The scheduling data you need to build on.
          <br />
          <span style={{ color: PURPLE, textShadow: `0 0 40px ${PURPLE_G}` }}>
            Now you can build on it.
          </span>
        </h1>
        <p className="mkt-hero-sub">
          One authenticated integration. Apply for platform approval and build
          whatever comes next.
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

      {/* THE CEILING */}
      <section className="mkt-wrap" style={{ background: BG }}>
        <div style={inner}>
          <div style={eyebrow}>The Ceiling You Have Been Hitting</div>
          <h2 style={h2}>
            Scheduling data exists.
            <br />
            <span style={{ color: PURPLE }}>Getting to it is the problem.</span>
          </h2>
          <p style={{ ...body, maxWidth: 700, marginBottom: 48 }}>
            Sometimes there is an API. More often there is not. Either way,
            getting structured, real-time, authenticated scheduling data across
            multiple platforms has always required more effort than it should.
            Builders have made it work. Orgo Sync makes it effortless.
          </p>
          <div className="mkt-split" style={{ gap: 28 }}>
            {/* WITHOUT */}
            <div
              style={{
                borderRadius: 12,
                padding: 36,
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{
                  ...MONO,
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: W40,
                  marginBottom: 12,
                }}
              >
                What you are dealing with today
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: W75,
                  marginBottom: 8,
                }}
              >
                Fragmented, inconsistent, and brittle
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontStyle: "italic",
                  color: W75,
                  marginBottom: 24,
                  paddingBottom: 20,
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                However you are getting the data, it is harder than it needs to
                be.
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                {[
                  "Every platform is a separate negotiation, a separate integration, a separate maintenance burden.",
                  "Data structures differ across platforms. Normalizing them falls on you every time.",
                  "Stale data. Changes take hours to propagate. Your users see the wrong information.",
                  "No standardized access layer. No audit trail. No legitimate foundation that scales with your product.",
                  "AI needs clean real-time data to reason well. What is available today is neither.",
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      fontSize: 16,
                      lineHeight: 1.6,
                      color: W75,
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.06)",
                        color: W40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        marginTop: 2,
                      }}
                    >
                      ✕
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            {/* WITH */}
            <div
              style={{
                borderRadius: 12,
                padding: 36,
                background: "rgba(176,77,255,0.05)",
                border: "1px solid rgba(176,77,255,0.28)",
              }}
            >
              <div
                style={{
                  ...MONO,
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: PURPLE_T,
                  marginBottom: 12,
                }}
              >
                With Orgo Sync
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 8,
                }}
              >
                Rich, structured, real-time data
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontStyle: "italic",
                  color: PURPLE_T,
                  marginBottom: 24,
                  paddingBottom: 20,
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                  opacity: 0.9,
                }}
              >
                Authenticated. Real-time. One standard. Any approved platform.
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                {[
                  "One integration. Build once. Access every platform that approves you without rebuilding.",
                  "Full structured payloads normalized to a single standard. The richness platforms actually hold.",
                  "Real-time webhooks. Changes reach your product in seconds, not hours.",
                  "Authenticated. Permissioned. Audited. A legitimate data foundation you can build a real business on.",
                  "Clean, standardized, real-time data your AI can reason over accurately.",
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      fontSize: 16,
                      lineHeight: 1.6,
                      color: W90,
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: "rgba(176,77,255,0.15)",
                        color: PURPLE,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        marginTop: 2,
                      }}
                    >
                      ✓
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW YOU GET ACCESS */}
      <section
        className="mkt-wrap"
        style={{
          background: BG2,
          borderTop: `1px solid ${BORDER_L}`,
          borderBottom: `1px solid ${BORDER_L}`,
        }}
        id="how"
      >
        <div style={inner}>
          <div style={eyebrow}>How You Get Access</div>
          <h2 style={h2}>
            Four steps.
            <br />
            <span style={{ color: PURPLE }}>Minutes, not months.</span>
          </h2>
          <p style={{ ...body, maxWidth: 680, marginBottom: 48 }}>
            No bilateral negotiations. No custom integrations. Apply once and
            access every platform that approves you through a single
            authenticated API.
          </p>
          <div className="mkt-g4" style={{ gap: 20 }}>
            {[
              {
                n: "01",
                t: "Apply via the developer portal",
                d: "Tell us what you are building and which platforms you need data from. Takes minutes. No lengthy forms, no legal review to start.",
              },
              {
                n: "02",
                t: "Platforms approve your access",
                d: "Each platform reviews and approves your request on their own terms. You get access to the data they authorize. Typically 24 to 48 hours.",
              },
              {
                n: "03",
                t: "One API. Every approved source.",
                d: "One standardized integration. Build once. Access any platform you are approved for through the same authenticated endpoint.",
              },
              {
                n: "04",
                t: "Pay per usage as you grow",
                d: "No upfront commitments. Your monthly plan includes a generous call bundle. Pay a small overage only when you grow beyond it.",
              },
            ].map((s) => (
              <div
                key={s.n}
                style={{
                  background: BG,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 12,
                  padding: 28,
                }}
              >
                <div
                  style={{
                    ...MONO,
                    fontSize: 12,
                    color: ORANGE,
                    letterSpacing: "0.1em",
                    marginBottom: 14,
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 10,
                    color: "#fff",
                  }}
                >
                  {s.t}
                </div>
                <div style={{ fontSize: 16, color: W90, lineHeight: 1.7 }}>
                  {s.d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="mkt-wrap" style={{ background: BG }} id="usecases">
        <div style={inner}>
          <div style={eyebrow}>What You Can Build</div>
          <h2 style={h2}>
            Your product. Your UX.
            <br />
            <span style={{ color: PURPLE }}>Our infrastructure.</span>
          </h2>
          <p style={{ ...body, maxWidth: 680, marginBottom: 48 }}>
            Orgo Sync provides the data layer. What you build on top is entirely
            up to you.
          </p>
          <div className="mkt-g3" style={{ gap: 20 }}>
            {[
              {
                t: "Fan and game day experiences",
                d: "Pull live schedule data and venue information into your product. Trigger real-time updates tied to actual events as they happen. Build the fan experience platforms have never been able to deliver themselves.",
                why: "Real-time authenticated data. Not a stale feed.",
              },
              {
                t: "Unified scheduling views",
                d: "Connect approved platforms and assemble a complete scheduling picture across every platform a participant or family touches. Academic, club, tournament — all through one authenticated API.",
                why: "The only infrastructure that sees across platforms.",
              },
              {
                t: "AI scheduling intelligence",
                d: "Power your AI with authenticated real-time data from the platforms users actually live in. Conflict detection, pattern recognition, predictive scheduling — all possible when your model has reliable data to work from.",
                why: "AI does not hallucinate when it has real-time structured data.",
              },
              {
                t: "Recruiting and analytics tools",
                d: "Access program structures, team rosters, and event histories from connected platforms. Build the recruiting intelligence layer that scouts, coaches, and athletes have been waiting for.",
                why: "Structured data that goes far beyond a calendar event.",
              },
              {
                t: "Notification and logistics apps",
                d: "Build the apps that turn a calendar event into a full logistics workflow. Real-time updates, carpool coordination, travel planning — all triggered by authenticated scheduling data the moment anything changes.",
                why: "Real-time webhooks. Changes in seconds, not hours.",
              },
              {
                t: "Anything you can imagine",
                d: "Scheduling data touches every part of how people spend their time. The platforms are connected. The data is structured. The infrastructure is live. What you build on top is only limited by your imagination.",
                why: "The data layer that was always supposed to exist.",
              },
            ].map((c) => (
              <div
                key={c.t}
                style={{
                  borderRadius: 12,
                  padding: 28,
                  background: "rgba(176,77,255,0.04)",
                  border: "1px solid rgba(176,77,255,0.18)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>
                  {c.t}
                </div>
                <div style={{ fontSize: 16, color: W90, lineHeight: 1.7 }}>
                  {c.d}
                </div>
                <div
                  style={{
                    ...MONO,
                    fontSize: 13,
                    color: PURPLE_T,
                    marginTop: 4,
                  }}
                >
                  {c.why}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI ERA */}
      <section
        className="mkt-wrap"
        style={{
          background: "rgba(176,77,255,0.02)",
          borderTop: "1px solid rgba(176,77,255,0.1)",
          borderBottom: "1px solid rgba(176,77,255,0.1)",
        }}
      >
        <div style={inner}>
          <div style={eyebrow}>Built for the AI Era</div>
          <h2 style={h2}>
            We are not building AI.
            <br />
            <span style={{ color: PURPLE }}>
              We are building what scheduling AI runs on.
            </span>
          </h2>
          <p style={{ ...body, maxWidth: 680, marginBottom: 48 }}>
            Every AI scheduling assistant hits the same wall — fragmented,
            stale, unstructured data. Orgo Sync removes it.
          </p>
          <div className="mkt-g3" style={{ gap: 20 }}>
            {[
              {
                t: "Agentic AI needs real-time authenticated data",
                d: "Scheduling agents need real-time authenticated access across every platform a user touches. Orgo Sync makes that possible without bilateral integrations for every platform in your users' lives.",
              },
              {
                t: "Clean structured data AI can trust",
                d: "AI does not hallucinate when it has reliable data. We produce clean, standardized, real-time scheduling data your models can reason over accurately.",
              },
              {
                t: "Own the integration before it is table stakes",
                d: "Build on the scheduling data infrastructure early. The builders who get access first get the deepest platform relationships and the strongest position as the ecosystem matures.",
              },
            ].map((c) => (
              <div
                key={c.t}
                style={{
                  borderRadius: 12,
                  padding: 32,
                  background: BG2,
                  border: `1px solid ${BORDER}`,
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: 10,
                  }}
                >
                  {c.t}
                </div>
                <div style={{ fontSize: 16, color: W90, lineHeight: 1.7 }}>
                  {c.d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section
        className="mkt-wrap"
        style={{
          background: BG2,
          borderTop: `1px solid ${BORDER_L}`,
          borderBottom: `1px solid ${BORDER_L}`,
        }}
        id="pricing"
      >
        <div style={inner}>
          <div style={eyebrow}>Pricing</div>
          <h2 style={h2}>
            Simple monthly pricing.
            <br />
            <span style={{ color: PURPLE }}>
              Generous included calls. Low overage.
            </span>
          </h2>
          <p style={{ ...body, maxWidth: 680, marginBottom: 48 }}>
            Pick the tier that matches your number of platform connections. Each
            plan includes a generous monthly call bundle. Pay a small per-call
            overage only when you exceed it.
          </p>
          <div className="mkt-g4" style={{ gap: 16 }}>
            {[
              {
                tier: "Starter",
                price: "$99",
                unit: "/mo",
                volume: "1–3 platform connections",
                desc: "500K calls included per month. $0.002 per call above that. Build and prove your product before you scale.",
                featured: true,
              },
              {
                tier: "Growth",
                price: "$179",
                unit: "/mo",
                volume: "4–6 platform connections",
                desc: "2.5M calls included per month. $0.0015 per call above that. For growing products expanding their platform reach.",
                featured: false,
              },
              {
                tier: "Scale",
                price: "$299",
                unit: "/mo",
                volume: "7+ platform connections",
                desc: "10M calls included per month. $0.001 per call above that. For established products at meaningful volume.",
                featured: false,
              },
              {
                tier: "Enterprise",
                price: "Custom",
                unit: "",
                volume: "Unlimited connections",
                desc: "Custom call bundles, dedicated support, SLA guarantees, and negotiated overage rates. Talk to us.",
                featured: false,
              },
            ].map((c) => (
              <div
                key={c.tier}
                style={{
                  borderRadius: 12,
                  padding: 28,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  background: c.featured ? "rgba(176,77,255,0.06)" : BG,
                  border: c.featured
                    ? "1.5px solid rgba(176,77,255,0.35)"
                    : `1px solid ${BORDER}`,
                }}
              >
                <div
                  style={{
                    ...MONO,
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: c.featured ? PURPLE_T : W40,
                  }}
                >
                  {c.tier}
                </div>
                <div style={{ fontSize: 30, fontWeight: 700, color: "#fff" }}>
                  {c.price}
                  <span style={{ fontSize: 15, fontWeight: 400, color: W40 }}>
                    {c.unit}
                  </span>
                </div>
                <div style={{ fontSize: 15, color: W75 }}>{c.volume}</div>
                <div
                  style={{ height: 1, background: "rgba(255,255,255,0.07)" }}
                />
                <div style={{ fontSize: 16, color: W90, lineHeight: 1.65 }}>
                  {c.desc}
                </div>
              </div>
            ))}
          </div>
          <p
            style={{
              ...MONO,
              fontSize: 12,
              color: W40,
              letterSpacing: "0.06em",
              marginTop: 20,
              textAlign: "center",
            }}
          >
            pricing confirmed on your access call · no setup fees · no minimums
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="mkt-wrap"
        style={{
          background: "rgba(176,77,255,0.03)",
          borderTop: "1px solid rgba(176,77,255,0.12)",
          textAlign: "center",
        }}
        id="getstarted"
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ ...h2, marginBottom: 18 }}>
            Ready to build on{" "}
            <span style={{ color: PURPLE }}>real scheduling data?</span>
          </h2>
          <p
            style={{
              ...body,
              marginBottom: 40,
              maxWidth: 520,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Developer portal is live. Apply in minutes. Book a call and we will
            walk you through the marketplace, available platforms, and get your
            access set up.
          </p>
          <Link
            href="/getstarted"
            className="mkt-btn-tint"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "16px 36px",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: "none",
              background: "rgba(176,77,255,0.12)",
              color: PURPLE,
              border: "1.5px solid rgba(176,77,255,0.4)",
            }}
          >
            Apply for Access →
          </Link>
        </div>
      </section>
    </>
  );
}
