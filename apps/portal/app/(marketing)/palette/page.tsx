export default function PalettePage() {
  const accents = [
    {
      name: "Current — Electric Orange",
      hex: "#FF3E00",
      bg: "#0D0D0D",
      label: "LIVE",
      tagline: "The scheduling data standard.",
      pill: "Apply for Access →",
      glow: "rgba(255,62,0,0.18)",
      border: "rgba(255,62,0,0.25)",
      tag: "#FF3E00",
    },
    {
      name: "Neon Green",
      hex: "#39FF6A",
      bg: "#0A0F0C",
      label: "OPTION A",
      tagline: "The scheduling data standard.",
      pill: "Apply for Access →",
      glow: "rgba(57,255,106,0.12)",
      border: "rgba(57,255,106,0.2)",
      tag: "#39FF6A",
    },
    {
      name: "Acid Green",
      hex: "#BFFF00",
      bg: "#0C0D08",
      label: "OPTION B",
      tagline: "The scheduling data standard.",
      pill: "Apply for Access →",
      glow: "rgba(191,255,0,0.12)",
      border: "rgba(191,255,0,0.2)",
      tag: "#BFFF00",
    },
    {
      name: "Neon Purple",
      hex: "#BF00FF",
      bg: "#0D080F",
      label: "OPTION C",
      tagline: "The scheduling data standard.",
      pill: "Apply for Access →",
      glow: "rgba(191,0,255,0.14)",
      border: "rgba(191,0,255,0.22)",
      tag: "#BF00FF",
    },
    {
      name: "Electric Violet",
      hex: "#7C3AFF",
      bg: "#090810",
      label: "OPTION D",
      tagline: "The scheduling data standard.",
      pill: "Apply for Access →",
      glow: "rgba(124,58,255,0.14)",
      border: "rgba(124,58,255,0.22)",
      tag: "#7C3AFF",
    },
  ];

  return (
    <div style={{ background: "#080808", minHeight: "100vh", padding: "80px 40px 120px", fontFamily: "var(--font-outfit), Outfit, sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 72, borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>
            Color Exploration
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.1 }}>
            Accent options
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", marginTop: 12, fontSize: 16, fontWeight: 300 }}>
            Dark background. Five accent directions.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {accents.map((a) => (
            <div
              key={a.name}
              style={{
                background: a.bg,
                border: `1px solid ${a.border}`,
                borderRadius: 12,
                padding: "48px 52px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 40,
                boxShadow: `0 0 60px ${a.glow}`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Glow blob */}
              <div style={{
                position: "absolute",
                top: -60,
                right: -60,
                width: 240,
                height: 240,
                borderRadius: "50%",
                background: a.glow,
                filter: "blur(60px)",
                pointerEvents: "none",
              }} />

              {/* Left — label + name */}
              <div style={{ minWidth: 200 }}>
                <div style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
                  textTransform: "uppercase", color: a.hex, marginBottom: 8,
                }}>
                  {a.label}
                </div>
                <div style={{ fontSize: 22, fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>
                  {a.name}
                </div>
                <div style={{
                  display: "inline-block", marginTop: 12,
                  fontSize: 12, fontWeight: 500, letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.05)",
                  padding: "4px 10px", borderRadius: 4, fontFamily: "monospace",
                }}>
                  {a.hex}
                </div>
              </div>

              {/* Center — mini hero preview */}
              <div style={{ flex: 1, borderLeft: "1px solid rgba(255,255,255,0.06)", paddingLeft: 40 }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
                  textTransform: "uppercase", color: a.hex, marginBottom: 12,
                }}>
                  For Scheduling Platforms
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 10 }}>
                  Three lines of code.<br />
                  <span style={{ color: a.hex }}>Three value chains.</span>
                </div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", margin: 0, fontWeight: 300, maxWidth: 340 }}>
                  Replace your ICS link with a secure, real-time, white-labeled API.
                </p>
              </div>

              {/* Right — button + tag samples */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-end", minWidth: 180 }}>
                <button style={{
                  background: a.hex,
                  color: a.bg === "#0D0D0D" ? "#fff" : "#000",
                  border: "none", borderRadius: 4,
                  padding: "12px 24px", fontSize: 13, fontWeight: 700,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  cursor: "pointer", whiteSpace: "nowrap",
                }}>
                  {a.pill}
                </button>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{
                    fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
                    color: a.hex, background: `${a.glow}`,
                    border: `1px solid ${a.border}`, borderRadius: 20,
                    padding: "4px 12px", whiteSpace: "nowrap",
                  }}>
                    Platforms
                  </div>
                  <div style={{
                    fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
                    color: a.hex, background: `${a.glow}`,
                    border: `1px solid ${a.border}`, borderRadius: 20,
                    padding: "4px 12px", whiteSpace: "nowrap",
                  }}>
                    Builders
                  </div>
                </div>
                <div style={{
                  fontSize: 11, color: "rgba(255,255,255,0.25)",
                  textAlign: "right", lineHeight: 1.5, fontWeight: 300,
                }}>
                  nav · tags · links<br />eyebrows · CTAs
                </div>
              </div>
            </div>
          ))}
        </div>

        <p style={{ color: "rgba(255,255,255,0.18)", fontSize: 12, marginTop: 48, textAlign: "center" }}>
          /palette — internal only
        </p>
      </div>
    </div>
  );
}
