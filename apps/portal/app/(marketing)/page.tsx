import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroRoutingShowcase } from "../../components/marketing/hero-routing-showcase";
import { NetworkNodesBg } from "../../components/marketing/network-nodes-bg";

const MONO: React.CSSProperties = { fontFamily: "var(--font-jetbrains),'JetBrains Mono',monospace" };
const BG  = "#07080c";
const BG2 = "#0c0e18";
const W90 = "rgba(255,255,255,0.90)";
const W75 = "rgba(255,255,255,0.75)";
const W40 = "rgba(255,255,255,0.40)";
const BLUE   = "#4d9fff"; const BLUE_T   = "#70b8ff";
const GREEN  = "#00ff7f"; const GREEN_T  = "#00e070";
const PURPLE = "#b04dff"; const PURPLE_T = "#c470ff";
const ORANGE = "#FF3E00";
const BORDER = "rgba(255,255,255,0.08)";
const BORDER_L = "rgba(255,255,255,0.05)";

const wrap: React.CSSProperties = {
  padding: "90px max(60px, calc((100% - 1200px) / 2))",
};

const eyebrow = (color: string): React.CSSProperties => ({
  ...MONO, fontSize: 12, fontWeight: 500, letterSpacing: "0.18em",
  textTransform: "uppercase", color, marginBottom: 20,
});

const h2style: React.CSSProperties = {
  fontFamily: "var(--font-bebas),'Bebas Neue',sans-serif",
  fontSize: "clamp(32px,4vw,52px)", fontWeight: 700,
  lineHeight: 1.05, color: "#fff", marginBottom: 20,
};

const bodyText: React.CSSProperties = { fontSize: 17, color: W90, lineHeight: 1.8 };

function OppSection({ color, label, h2, body, points, cta, href, tint }: {
  color: string; label: string; h2: React.ReactNode; body: string;
  points: { title: string; desc: string }[]; cta: string; href: string; tint: string;
}) {
  return (
    <section className="mkt-wrap" style={{ background: tint, borderTop: `1px solid ${color}1e`, borderBottom: `1px solid ${color}1e` }}>
      <div className="mkt-split" style={{ maxWidth: 1200, margin: "0 auto", gap: 64, alignItems: "start" }}>
        <div>
          <div style={eyebrow(color)}>{label}</div>
          <h2 style={{ ...h2style }}>{h2}</h2>
          <p style={{ ...bodyText, marginBottom: 32 }}>{body}</p>
          <Link href={href} className="mkt-btn-tint" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 26px", borderRadius: 12, fontSize: 16, fontWeight: 600, textDecoration: "none", background: `${color}1a`, color, border: `1px solid ${color}59` }}>{cta}</Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {points.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "18px 20px", borderRadius: 12, background: `${color}0d`, border: `1px solid ${color}26` }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0, marginTop: 7, display: "block" }} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color, marginBottom: 4 }}>{p.title}</div>
                <div style={{ fontSize: 16, color: W75, lineHeight: 1.65 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="mkt-hero mkt-hero--pillar" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <NetworkNodesBg />
        {/* Row 1: text + showcase */}
        <div className="mkt-hero-main">
          <div className="mkt-hero-main-text">
            <h1 className="mkt-hero-headline">
              Orgo Sync makes <span>scheduling data</span> intelligent, interoperable, and secure.
            </h1>
            <p className="mkt-hero-sub">Connect your platforms. Own your data. Build on it.</p>
          </div>
          <div className="mkt-hero-main-showcase">
            <HeroRoutingShowcase />
          </div>
        </div>
        {/* Row 2: CTAs */}
        <div className="mkt-hero-cta-row">
          {[
            { href: "/operator", cls: "blue",   color: BLUE, text: BLUE_T, bg: "rgba(7,8,18,0.82)", bd: "rgba(77,159,255,0.35)", who: "Operators", action: "I want to unify my systems", detail: "One view across every platform you run." },
            { href: "/platform", cls: "green",  color: GREEN, text: GREEN_T, bg: "rgba(7,8,18,0.82)", bd: "rgba(0,255,127,0.35)", who: "Platforms", action: "I want to be interoperable", detail: "Your data is your most valuable asset." },
            { href: "/builder",  cls: "purple", color: PURPLE, text: PURPLE_T, bg: "rgba(7,8,18,0.82)", bd: "rgba(176,77,255,0.35)", who: "Builders", action: "I want scheduling data", detail: "One API. Any approved platform." },
          ].map((c) => (
            <Link key={c.href} href={c.href} className={`mkt-audience-card mkt-audience-card--${c.cls}`} style={{ flex: 1, background: c.bg, border: `1.5px solid ${c.bd}` }}>
              <div className="mkt-card-arrow" style={{ background: `${c.color}22`, border: `1.5px solid ${c.bd}`, color: c.color }}><ArrowRight size={16} /></div>
              <div style={{ ...MONO, fontSize: 12, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: c.text }}>{c.who}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: c.color, lineHeight: 1.2, paddingRight: 40 }}>{c.action}</div>
              <div style={{ fontSize: 16, color: W75, lineHeight: 1.5 }}>{c.detail}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* OPERATOR */}
      <OppSection color={BLUE} tint="rgba(77,159,255,0.03)" label="For Operators"
        h2={<>Your platforms do not talk to each other. <span style={{ color: BLUE }}>They should.</span></>}
        body="You run multiple scheduling systems. None of them share data. The result is manual reconciliation, conflicts discovered too late, and decisions made on incomplete information. Orgo Sync unifies them into one intelligent view. No migration. No new software. Connect once."
        points={[
          { title: "One unified view across every system", desc: "The single source of scheduling truth across every platform you run." },
          { title: "Conflicts caught before they happen", desc: "When a change in one system creates a conflict in another, Orgo Sync flags it immediately." },
          { title: "Ask anything in plain language", desc: "\"Are we clear at the Field House this weekend?\" Get an answer drawn from every system simultaneously." },
          { title: "Zero technical lift", desc: "We ingest, normalize, and unify your existing data. No developer required." },
        ]}
        cta="I want to unify my systems →" href="/operator"
      />

      {/* PLATFORM */}
      <OppSection color={GREEN} tint="rgba(0,255,127,0.03)" label="For Platforms"
        h2={<>Your data is your <span style={{ color: GREEN }}>most valuable untapped asset.</span></>}
        body="Your scheduling data leaves your platform unprotected, unmonetized, and untracked. No authenticated layer. No revenue. No control. Orgo Sync makes your data interoperable, permissioned, and revenue-generating. Free to connect. We build and maintain everything."
        points={[
          { title: "Authenticated access only", desc: "You approve every builder who accesses your data. Full control stays with you." },
          { title: "Earn passive revenue from day one", desc: "Revenue share on every builder API call. Flows to you automatically. No ongoing work." },
          { title: "Free to connect", desc: "No cost. Three lines of code. We build the API and maintain it on your behalf." },
          { title: "First movers own the ecosystem", desc: "Platforms that connect first own the builder relationships. The standard is being set now." },
        ]}
        cta="I want to be interoperable →" href="/platform"
      />

      {/* BUILDER */}
      <OppSection color={PURPLE} tint="rgba(176,77,255,0.03)" label="For Builders"
        h2={<>The data exists. <span style={{ color: PURPLE }}>Now you can build on it.</span></>}
        body="Every builder hits the same ceiling: proprietary formats, no authenticated access, no standard. The scheduling data is there. The rails are not. Orgo Sync fills that gap. One integration. Authenticated, structured, real-time data from every platform that approves you."
        points={[
          { title: "One integration. Every platform that approves you.", desc: "Apply once. No bilateral deals. No custom builds. One standard everywhere." },
          { title: "Rich, structured, real-time data", desc: "Full payloads with the richness platforms actually hold. Authenticated and always current." },
          { title: "Permissioned access is a feature", desc: "The data you build on is legitimate, licensed, and defensible. A real foundation for a real product." },
          { title: "Pay per usage as you grow", desc: "No upfront commitments. Pricing that moves with your product." },
        ]}
        cta="I want access to scheduling data →" href="/builder"
      />

      {/* SO WHAT */}
      <section className="mkt-wrap" style={{ background: BG }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={eyebrow(ORANGE)}>The So What</div>
          <h2 style={{ ...h2style, marginBottom: 48 }}>
            What interoperability <span style={{ color: ORANGE }}>actually means.</span>
          </h2>
          <div className="mkt-g3" style={{ gap: 20 }}>
            {[
              { n: "01", t: "Organizations finally have clarity", d: "When all your systems speak the same language, change management becomes manageable. Every department works from the same data. Decisions get made with confidence." },
              { n: "02", t: "Platform data becomes infrastructure", d: "Platforms that connect do not just share data. They become the foundation other products are built on. That is a moat, not a vulnerability." },
              { n: "03", t: "Builders get real data", d: "Developers finally get authenticated, structured, scheduling data they can build a real product on. The experiences they create are only limited by their imagination." },
              { n: "04", t: "Staff hours get reclaimed", d: "The manual reconciliation tax that organizations pay every week disappears. Skilled people stop doing clerical work and start doing the jobs they were hired for." },
              { n: "05", t: "Passive revenue for platforms", d: "Every API call a builder makes generates revenue share back to the platform. No ongoing work. The data you already own starts earning." },
              { n: "06", t: "First movers own the ecosystem", d: "Operators who connect first get unified intelligence before their competitors. Platforms who connect first own the builder relationships. The standard is being set right now." },
            ].map((c) => (
              <div key={c.n} style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 28 }}>
                <div style={{ ...MONO, fontSize: 12, fontWeight: 500, color: ORANGE, letterSpacing: "0.1em", marginBottom: 10 }}>{c.n}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{c.t}</div>
                <div style={{ fontSize: 16, color: W90, lineHeight: 1.7 }}>{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRECEDENT */}
      <section className="mkt-wrap" style={{ background: BG }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={eyebrow(ORANGE)}>This Is a Proven Playbook</div>
          <h2 style={{ ...h2style, marginBottom: 16 }}>
            This has happened before.<br />Every time it did, <span style={{ color: ORANGE }}>an ecosystem was born.</span>
          </h2>
          <p style={{ ...bodyText, maxWidth: 620, marginBottom: 48 }}>The infrastructure layer that unlocks a data category defines the standard for an entire industry. Platforms that move first own the ecosystem.</p>
          <div className="mkt-g4" style={{ gap: 2 }}>
            {[
              { co: "Stripe",     unlocked: "Unlocked payments",          result: "Banks that connected became infrastructure. Banks that waited became legacy.", active: false },
              { co: "Plaid",      unlocked: "Unlocked banking data",       result: "Institutions that opened their data became the foundation. Those that stayed closed became irrelevant.", active: false },
              { co: "Twilio",     unlocked: "Unlocked communications",     result: "Carriers that participated became essential. The ones that didn't became dumb pipes.", active: false },
              { co: "Orgo Sync",  unlocked: "Unlocking scheduling data",   result: "The platforms that connect now will own the builder relationships and the ecosystem built on top of their data.", active: true },
            ].map((p, i) => (
              <div key={i} style={{ padding: "28px 24px", background: p.active ? "rgba(255,107,0,0.05)" : BG2, border: `1px solid ${p.active ? "rgba(255,107,0,0.25)" : BORDER}`, borderRadius: i === 0 ? "14px 0 0 14px" : i === 3 ? "0 14px 14px 0" : 0, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ ...MONO, fontSize: 12, fontWeight: 500, color: p.active ? ORANGE : W40, letterSpacing: "0.08em" }}>{p.co}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: p.active ? "#fff" : W75 }}>{p.unlocked}</div>
                <div style={{ fontSize: 15, color: p.active ? W75 : W40, lineHeight: 1.6 }}>{p.result}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mkt-wrap" style={{ background: BG2, borderTop: `1px solid ${BORDER_L}`, textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontSize: 16, color: "#fff", marginBottom: 12 }}>The standard is being set now.</div>
          <h2 style={{ fontFamily: "var(--font-bebas),'Bebas Neue',sans-serif", fontSize: "clamp(36px,5vw,64px)", fontWeight: 700, lineHeight: 1.05, marginBottom: 20, color: ORANGE }}>Which side are you on?</h2>
          <p style={{ ...bodyText, marginBottom: 56, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            Operators who connect first get unified intelligence before their competitors. Platforms who connect first own the builder relationships. Builders who apply first get the data advantage.
          </p>
          <div className="mkt-g3" style={{ gap: 20 }}>
            {[
              { color: BLUE, text: BLUE_T, tint: "rgba(77,159,255,0.05)", bd: "rgba(77,159,255,0.22)", btnBg: "rgba(77,159,255,0.12)", btnBd: "rgba(77,159,255,0.35)", label: "Operators", title: "I want to unify my systems.", desc: "Your platforms do not talk to each other. Connect once and get a unified intelligent view across everything you run.", href: "/operator" },
              { color: GREEN, text: GREEN_T, tint: "rgba(0,255,127,0.04)", bd: "rgba(0,255,127,0.22)", btnBg: "rgba(0,255,127,0.1)", btnBd: "rgba(0,255,127,0.35)", label: "Scheduling platforms", title: "I want to be interoperable.", desc: "Free to connect. We build the API, maintain it, and act as the neutral intermediary. Earn passively from every builder who accesses your data.", href: "/platform" },
              { color: PURPLE, text: PURPLE_T, tint: "rgba(176,77,255,0.04)", bd: "rgba(176,77,255,0.22)", btnBg: "rgba(176,77,255,0.1)", btnBd: "rgba(176,77,255,0.35)", label: "Builders and developers", title: "I want access to scheduling data.", desc: "Apply once. One integration across every platform that approves you. Rich, structured, real-time scheduling data to build anything.", href: "/builder" },
            ].map((c) => (
              <div key={c.href} style={{ borderRadius: 12, padding: "32px 28px", textAlign: "left", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 14, background: c.tint, border: `1.5px solid ${c.bd}` }}>
                <div>
                  <div style={{ ...MONO, fontSize: 11, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: c.text, marginBottom: 14 }}>{c.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{c.title}</div>
                  <p style={{ fontSize: 16, color: W90, lineHeight: 1.65 }}>{c.desc}</p>
                </div>
                <Link href={c.href} className="mkt-btn-tint" style={{ display: "inline-block", padding: "12px 22px", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none", background: c.btnBg, color: c.color, border: `1px solid ${c.btnBd}`, alignSelf: "flex-start" }}>Get Started →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
