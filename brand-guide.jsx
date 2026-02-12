import { useState, useEffect } from "react";

/* ─── BRAND TOKENS ─── */
const COLORS = {
  parent: {
    primary:  { name: "Estate Charcoal",  hex: "#2C2C2A", use: "Primary text, headers, institutional authority" },
    secondary:{ name: "Aged Linen",       hex: "#F0EBE1", use: "Canvas, backgrounds, breathing space" },
    accent1:  { name: "Sage Moss",        hex: "#8B9A7E", use: "Botanical accent, CTAs, life" },
    accent2:  { name: "Burnished Gold",   hex: "#B8A88A", use: "Metallic details, prestige, borders" },
    accent3:  { name: "Deep Forest",      hex: "#3D4F3D", use: "Rich depth, sophistication" },
    neutral1: { name: "Warm Stone",       hex: "#C4B9A8", use: "Dividers, subtle backgrounds" },
    neutral2: { name: "Parchment",        hex: "#E8E0D0", use: "Cards, secondary surfaces" },
    neutral3: { name: "Fog",              hex: "#D5CFC5", use: "Muted elements, disabled states" },
  },
  product: {
    primary:  { name: "Dusk Ink",         hex: "#1E2823", use: "Deep anchor, hero backgrounds, night forest" },
    secondary:{ name: "Moth Light",       hex: "#F6F1E7", use: "Page canvas, essay backgrounds, the glow" },
    accent1:  { name: "Trace Olive",      hex: "#7A8B6F", use: "Section markers, author tags, growth" },
    accent2:  { name: "Impression Rust",  hex: "#A67C5B", use: "The mark itself — pull quotes, warm highlights" },
    accent3:  { name: "Wing Dust",        hex: "#C9BFA8", use: "Subtle textures, overlays, residue of contact" },
    accent4:  { name: "Compass Rose",     hex: "#8A7060", use: "Warm anchor, navigation, earthen grounding" },
    special:  { name: "Vellum",           hex: "#EDE6D6", use: "Textured overlays, essay cards, old paper" },
  },
};

const TYPOGRAPHY = {
  parent: {
    display:  { family: "Cormorant Garamond", weight: "300–700", use: "Wordmark, hero headings, prestige moments", style: "Elegant old-style serif with high contrast strokes" },
    body:     { family: "Libre Baskerville",  weight: "400, 700", use: "Body copy, long-form reading, editorial", style: "Readable transitional serif for literary credibility" },
    utility:  { family: "Darker Grotesque",   weight: "400–700", use: "Navigation, labels, metadata, UI", style: "Refined geometric sans for modern contrast" },
  },
  product: {
    display:  { family: "Cormorant Garamond", weight: "300–600", use: "Book title, chapter headings, the quiet mark", style: "Light-weight serif — a trace, not a shout" },
    accent:   { family: "Cormorant Garamond", weight: "300i", use: "Pull quotes, essay titles, interior voice", style: "Italic as the impression left behind — the wingmark itself" },
    body:     { family: "Source Serif 4",     weight: "300–600", use: "Essay text, immersive reading, contemplation", style: "Crisp optical-size serif optimized for long reading" },
    label:    { family: "DM Sans",            weight: "400–600", use: "Author names, tags, numbers, CTAs", style: "Clean geometric sans — contemporary, precise" },
  },
};

/* ─── SMALL COMPONENTS ─── */

function ColorSwatch({ color, size = "lg" }) {
  const [copied, setCopied] = useState(false);
  const isLight = ["#F0EBE1","#F6F1E7","#E8E0D0","#EDE6D6","#D5CFC5","#C9BFA8","#C4B9A8"].includes(color.hex);
  return (
    <div style={{ flex: size==="lg"?"1 1 130px":"0 0 auto", minWidth: size==="lg"?130:0, cursor:"pointer" }}
      onClick={() => { navigator.clipboard?.writeText(color.hex); setCopied(true); setTimeout(()=>setCopied(false),1200); }}>
      <div style={{
        background: color.hex, height: size==="lg"?96:52, borderRadius: 8,
        border: isLight ? "1px solid #C4B9A8" : "1px solid transparent",
        position:"relative", transition:"transform 0.25s ease, box-shadow 0.25s ease",
      }}
        onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.04)";e.currentTarget.style.boxShadow="0 6px 20px rgba(0,0,0,0.1)";}}
        onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="none";}}>
        {copied && <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
          background:"rgba(0,0,0,0.45)",borderRadius:8,color:"#fff",fontSize:11,fontFamily:"DM Sans,sans-serif",
          letterSpacing:"0.12em",textTransform:"uppercase" }}>Copied</div>}
      </div>
      <div style={{ marginTop:8 }}>
        <div style={{ fontSize:12, fontWeight:600, color:"#2C2C2A", fontFamily:"DM Sans,sans-serif" }}>{color.name}</div>
        <div style={{ fontSize:11, color:"#8B9A7E", fontFamily:"monospace", letterSpacing:"0.04em" }}>{color.hex}</div>
        {size==="lg" && <div style={{ fontSize:11, color:"#999", marginTop:2, fontFamily:"DM Sans,sans-serif", lineHeight:1.4 }}>{color.use}</div>}
      </div>
    </div>
  );
}

function TypeSample({ entry, sampleText, fontSize = 36 }) {
  const isItalic = entry.weight?.includes("i") || entry.family?.includes("Italic");
  return (
    <div style={{ marginBottom:24, padding:"20px 24px", background:"#FAFAF5", borderRadius:8, border:"1px solid #E8E0D0" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:12 }}>
        <span style={{ fontFamily:"DM Sans,sans-serif", fontSize:10, textTransform:"uppercase", letterSpacing:"0.16em", color:"#8B9A7E", fontWeight:600 }}>{entry.use}</span>
        <span style={{ fontFamily:"monospace", fontSize:11, color:"#B8A88A" }}>{entry.weight}</span>
      </div>
      <div style={{
        fontFamily:`"${entry.family.replace(/ Italic$/,"")}", serif`, fontSize, lineHeight:1.25, color:"#2C2C2A",
        fontStyle: isItalic?"italic":"normal", fontWeight: isItalic?300:400,
      }}>{sampleText || entry.family}</div>
      <div style={{ fontFamily:"DM Sans,sans-serif", fontSize:12, color:"#999", marginTop:8, fontStyle:"italic" }}>{entry.style}</div>
    </div>
  );
}

function Section({ title, subtitle, children, dark }) {
  return (
    <div style={{ marginBottom:64 }}>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontFamily:"DM Sans,sans-serif", fontSize:10, textTransform:"uppercase", letterSpacing:"0.22em", color: dark?"#7A8B6F":"#8B9A7E", marginBottom:6, fontWeight:600 }}>{subtitle}</div>
        <h2 style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:30, fontWeight:300, color: dark?"#F0EBE1":"#2C2C2A", margin:0, lineHeight:1.1 }}>{title}</h2>
        <div style={{ width:44, height:1, background: dark?"#A67C5B":"#B8A88A", marginTop:14 }} />
      </div>
      {children}
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */

export default function BrandGuide() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loaded, setLoaded] = useState(false);
  useEffect(()=>{ setTimeout(()=>setLoaded(true),100); },[]);

  const tabs = [
    { id:"overview", label:"Overview" },
    { id:"parent",   label:"Luminous Estates" },
    { id:"product",  label:"Wingmarks" },
    { id:"ui",       label:"UI System" },
    { id:"guidelines", label:"Guidelines" },
  ];

  return (
    <div style={{ background:"#F0EBE1", minHeight:"100vh", fontFamily:"DM Sans,sans-serif",
      opacity: loaded?1:0, transition:"opacity 0.6s ease" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,300;1,8..60,400&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Darker+Grotesque:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* ═══ HEADER ═══ */}
      <div style={{ background:"#1E2823", padding:"44px 48px 36px", position:"relative", overflow:"hidden" }}>
        {/* Subtle texture overlay */}
        <div style={{ position:"absolute", inset:0, opacity:0.04,
          backgroundImage:"radial-gradient(circle at 20% 50%, #8B9A7E 0%, transparent 50%), radial-gradient(circle at 80% 20%, #A67C5B 0%, transparent 40%)" }} />
        <div style={{ position:"relative", maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:6 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#A67C5B", boxShadow:"0 0 10px rgba(166,124,91,0.35)" }} />
            <span style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.28em", color:"#7A8B6F", fontWeight:600 }}>Brand System · 2026</span>
          </div>
          <h1 style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:46, fontWeight:300, color:"#F6F1E7", margin:"6px 0 2px", lineHeight:1, letterSpacing:"0.02em" }}>
            Luminous Estates
          </h1>
          <p style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:20, color:"#A67C5B", margin:0, fontWeight:300, fontStyle:"italic" }}>
            + Wingmarks — Visual Identity & Design System
          </p>
          <p style={{ fontFamily:"DM Sans,sans-serif", fontSize:12, color:"#6B7B68", marginTop:12, maxWidth:520, lineHeight:1.6 }}>
            The encounters that rearranged us. A brand system for a publisher and its debut essay collection about the marks left by contact.
          </p>
        </div>
      </div>

      {/* ═══ TAB NAV ═══ */}
      <div style={{ background:"#1E2823", borderBottom:"1px solid rgba(122,139,111,0.18)", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", gap:0, padding:"0 48px", overflowX:"auto" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{
              background:"none", border:"none", cursor:"pointer", padding:"13px 20px",
              fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase",
              color: activeTab===tab.id?"#F6F1E7":"#6B7B68",
              borderBottom: activeTab===tab.id?"2px solid #A67C5B":"2px solid transparent",
              fontFamily:"DM Sans,sans-serif", fontWeight:600, transition:"all 0.2s ease", whiteSpace:"nowrap",
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"48px 48px 80px" }}>

        {/* ══════════ OVERVIEW ══════════ */}
        {activeTab === "overview" && (<>

          <Section title="Brand Architecture" subtitle="Hierarchy">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:28 }}>
              {/* Parent */}
              <div style={{ background:"#2C2C2A", borderRadius:12, padding:36, color:"#F0EBE1" }}>
                <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.22em", color:"#8B9A7E", marginBottom:16, fontWeight:600 }}>Parent Publisher</div>
                <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:34, fontWeight:300, lineHeight:1.1, marginBottom:16, letterSpacing:"0.03em" }}>Luminous Estates</div>
                <p style={{ fontSize:13, lineHeight:1.7, color:"#C4B9A8", margin:0 }}>
                  The prestige house. Timeless, authoritative, literary. Luminous Estates is the institutional voice — the estate, the archive, the curator. It conveys permanence and literary weight. The container that gives shape to what lives inside.
                </p>
                <div style={{ marginTop:20, display:"flex", gap:8 }}>
                  {["#2C2C2A","#F0EBE1","#8B9A7E","#B8A88A","#3D4F3D"].map(c =>
                    <div key={c} style={{ width:26, height:26, borderRadius:"50%", background:c, border: c==="#F0EBE1"?"1px solid #C4B9A8":"1px solid transparent" }} />
                  )}
                </div>
              </div>
              {/* Product */}
              <div style={{ background:"#F6F1E7", borderRadius:12, padding:36, border:"1px solid #E8E0D0", position:"relative", overflow:"hidden" }}>
                {/* Faint wing-trace texture */}
                <div style={{ position:"absolute", top:-20, right:-20, width:160, height:160, borderRadius:"50%",
                  background:"radial-gradient(circle, rgba(166,124,91,0.06) 0%, transparent 70%)" }} />
                <div style={{ position:"relative" }}>
                  <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.22em", color:"#7A8B6F", marginBottom:16, fontWeight:600 }}>First Publication</div>
                  <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:34, fontWeight:300, lineHeight:1.05, marginBottom:16, color:"#1E2823", letterSpacing:"0.04em" }}>
                    Wingmarks
                  </div>
                  <p style={{ fontSize:13, lineHeight:1.7, color:"#666", margin:0 }}>
                    The debut voice. Contemplative, intimate, psychologically rich. A collection of essays about the encounters that rearranged us — the people, animals, and living systems that left lasting impressions. The name is the thesis: we carry the marks of everything that has touched us.
                  </p>
                  <div style={{ marginTop:20, display:"flex", gap:8 }}>
                    {["#1E2823","#F6F1E7","#7A8B6F","#A67C5B","#C9BFA8"].map(c =>
                      <div key={c} style={{ width:26, height:26, borderRadius:"50%", background:c, border: c==="#F6F1E7"?"1px solid #C4B9A8":"1px solid transparent" }} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section title="The Central Metaphor" subtitle="Concept">
            <div style={{ background:"#1E2823", borderRadius:12, padding:"44px 48px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", inset:0, opacity:0.035,
                backgroundImage:"radial-gradient(circle at 70% 30%, #A67C5B 0%, transparent 50%)" }} />
              <div style={{ position:"relative", maxWidth:680 }}>
                <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:11, fontWeight:400, textTransform:"uppercase", letterSpacing:"0.3em", color:"#7A8B6F", marginBottom:20 }}>Wingmarks</div>
                <p style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:22, fontWeight:300, fontStyle:"italic", color:"#F6F1E7", lineHeight:1.65, margin:"0 0 20px" }}>
                  When a moth lands on glass, it leaves a faint dusting of wing scales — a trace of contact so delicate you might miss it. But the mark is real. The encounter happened. Something was exchanged.
                </p>
                <p style={{ fontFamily:'"Source Serif 4",serif', fontSize:15, color:"#C9BFA8", lineHeight:1.7, margin:"0 0 24px" }}>
                  This is the brand's organizing metaphor. Every design choice should feel like a trace of contact — embossed textures (a mark pressed into paper), warm residue tones (Impression Rust, Wing Dust), photography of light through windows and shadows on walls. The aesthetic is what remains after something meaningful has passed through.
                </p>
                <div style={{ display:"flex", gap:24 }}>
                  {["Impression","Trace","Residue","Contact","Rearrangement"].map(w =>
                    <span key={w} style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.18em", color:"#A67C5B", fontFamily:"DM Sans,sans-serif", fontWeight:600 }}>{w}</span>
                  )}
                </div>
              </div>
            </div>
          </Section>

          <Section title="Brand Positioning" subtitle="Strategy">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20 }}>
              {[
                { label:"Audience", title:"The Combined Following", desc:"Each essayist brings their own community. The aggregate audience is literary-curious, digitally native, and values psychological depth over surface spectacle." },
                { label:"Differentiator", title:"Creator-Led Publishing", desc:"Not traditional publishing. Not self-publishing. A curated collective where social media voices become literary voices — with the credibility of a prestige house behind them." },
                { label:"Tone", title:"Contemplative Warmth", desc:"Luminous Estates speaks with quiet confidence. Wingmarks speaks with reflective intimacy. Together: gravitas without pretension, depth without exclusion. A book left open on a table." },
              ].map((item,i) => (
                <div key={i} style={{ padding:24, background:"#fff", borderRadius:10, border:"1px solid #E8E0D0" }}>
                  <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.2em", color:"#8B9A7E", marginBottom:10, fontWeight:600 }}>{item.label}</div>
                  <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:19, fontWeight:500, color:"#2C2C2A", marginBottom:8 }}>{item.title}</div>
                  <p style={{ fontSize:13, lineHeight:1.65, color:"#777", margin:0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Design Principles" subtitle="Philosophy">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
              {[
                { num:"01", title:"Literary Materiality", desc:"Design should feel like it has weight — embossed paper, aged book spines, letterpress texture. Digital design that honors the physical book. Wingmarks adds a layer: the materiality of impression itself." },
                { num:"02", title:"The Aesthetics of Trace", desc:"Where the previous concept was about assembling fragments, Wingmarks is about what remains after contact. Subtle shadows, soft overlays, warm residue tones. Design that feels like something meaningful was just here." },
                { num:"03", title:"Diverse Voices, Unified Quiet", desc:"Each author has their own presence, but the visual system holds them in contemplative unity. Not a loud mosaic — a shared hush. Distinct marks creating one surface." },
                { num:"04", title:"Modern Antiquarian", desc:"The mood board's core tension remains: misty forests and gothic doorways meet clean digital UI. Old-world gravitas with contemporary accessibility. But now warmer, more intimate, less architectural." },
              ].map((p,i) => (
                <div key={i} style={{ display:"flex", gap:16, padding:20, background: i%2===0?"#FAFAF5":"#fff", borderRadius:8, border:"1px solid #E8E0D0" }}>
                  <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:30, fontWeight:300, color:"#C4B9A8", lineHeight:1, minWidth:36 }}>{p.num}</div>
                  <div>
                    <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:17, fontWeight:600, color:"#2C2C2A", marginBottom:4 }}>{p.title}</div>
                    <p style={{ fontSize:13, lineHeight:1.6, color:"#777", margin:0 }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Tagline Directions" subtitle="Language">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
              {[
                { line:"The encounters that rearranged us.", note:"Direct, mirrors the call for submissions" },
                { line:"Marked by contact.", note:"Minimal, evocative, brand-name-adjacent" },
                { line:"What touched you, changed you.", note:"Personal, second-person, warm" },
                { line:"There is no permanent self.", note:"Bold thesis statement from the brief" },
                { line:"Essays on being rearranged.", note:"Casual, specific, genre-clear" },
                { line:"The impressions we carry.", note:"Quiet, interior, psychologically resonant" },
              ].map((t,i) => (
                <div key={i} style={{ padding:"18px 20px", background:"#fff", borderRadius:8, border:"1px solid #E8E0D0" }}>
                  <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:17, fontStyle:"italic", color:"#2C2C2A", marginBottom:6, lineHeight:1.3 }}>{t.line}</div>
                  <div style={{ fontSize:11, color:"#999" }}>{t.note}</div>
                </div>
              ))}
            </div>
          </Section>
        </>)}

        {/* ══════════ LUMINOUS ESTATES ══════════ */}
        {activeTab === "parent" && (<>
          <Section title="Color Palette" subtitle="Luminous Estates">
            <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:28 }}>
              {Object.values(COLORS.parent).map((c,i) => <ColorSwatch key={i} color={c} />)}
            </div>
            <div style={{ background:"#2C2C2A", borderRadius:12, padding:28, marginTop:20 }}>
              <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.2em", color:"#8B9A7E", marginBottom:16, fontWeight:600 }}>Palette in Context</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
                <div style={{ background:"#F0EBE1", borderRadius:8, padding:24, textAlign:"center" }}>
                  <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:26, color:"#2C2C2A", fontWeight:300 }}>Light</div>
                  <div style={{ fontSize:11, color:"#8B9A7E", marginTop:4 }}>Aged Linen base</div>
                </div>
                <div style={{ background:"#3D4F3D", borderRadius:8, padding:24, textAlign:"center" }}>
                  <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:26, color:"#F0EBE1", fontWeight:300 }}>Forest</div>
                  <div style={{ fontSize:11, color:"#9BAF8E", marginTop:4 }}>Deep Forest base</div>
                </div>
                <div style={{ background:"#2C2C2A", borderRadius:8, padding:24, textAlign:"center", border:"1px solid #3D4F3D" }}>
                  <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:26, color:"#B8A88A", fontWeight:300 }}>Dark</div>
                  <div style={{ fontSize:11, color:"#666", marginTop:4 }}>Charcoal base</div>
                </div>
              </div>
            </div>
          </Section>

          <Section title="Typography" subtitle="Luminous Estates">
            <TypeSample entry={TYPOGRAPHY.parent.display} sampleText="Luminous Estates" fontSize={42} />
            <TypeSample entry={TYPOGRAPHY.parent.body} sampleText="Stories illuminate the corridors of experience, casting light on what we thought we knew." fontSize={21} />
            <TypeSample entry={TYPOGRAPHY.parent.utility} sampleText="NAVIGATION · METADATA · LABELS · 2026" fontSize={17} />
          </Section>

          <Section title="Wordmark" subtitle="Luminous Estates">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
              <div style={{ background:"#2C2C2A", borderRadius:12, padding:48, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:200 }}>
                <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:38, fontWeight:300, color:"#F0EBE1", letterSpacing:"0.1em", textAlign:"center", lineHeight:1 }}>LUMINOUS</div>
                <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:13, fontWeight:400, color:"#B8A88A", letterSpacing:"0.5em", textTransform:"uppercase", marginTop:5 }}>ESTATES</div>
                <div style={{ width:36, height:1, background:"#B8A88A", marginTop:12 }} />
                <div style={{ fontSize:9, color:"#666", letterSpacing:"0.3em", marginTop:8, textTransform:"uppercase" }}>Publishers</div>
              </div>
              <div style={{ background:"#F0EBE1", borderRadius:12, padding:48, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", border:"1px solid #E8E0D0", minHeight:200 }}>
                <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:38, fontWeight:300, color:"#2C2C2A", letterSpacing:"0.1em", textAlign:"center", lineHeight:1 }}>LUMINOUS</div>
                <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:13, fontWeight:400, color:"#8B9A7E", letterSpacing:"0.5em", textTransform:"uppercase", marginTop:5 }}>ESTATES</div>
                <div style={{ width:36, height:1, background:"#8B9A7E", marginTop:12 }} />
                <div style={{ fontSize:9, color:"#999", letterSpacing:"0.3em", marginTop:8, textTransform:"uppercase" }}>Publishers</div>
              </div>
            </div>
            <p style={{ fontSize:13, color:"#888", marginTop:16, lineHeight:1.6, fontStyle:"italic" }}>
              Cormorant Garamond Light, generous letter-spacing. "LUMINOUS" carries the weight; "ESTATES" sits beneath in spaced small-caps. A thin gold rule and the descriptor "Publishers" anchor the mark. Consider an embossed "LE" monogram or a key icon for favicon/social.
            </p>
          </Section>
        </>)}

        {/* ══════════ WINGMARKS ══════════ */}
        {activeTab === "product" && (<>
          <Section title="Color Palette" subtitle="Wingmarks">
            <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:28 }}>
              {Object.values(COLORS.product).map((c,i) => <ColorSwatch key={i} color={c} />)}
            </div>
            <div style={{ background:"#1E2823", borderRadius:12, padding:28, marginTop:8 }}>
              <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.2em", color:"#7A8B6F", marginBottom:12, fontWeight:600 }}>Palette Story</div>
              <p style={{ fontFamily:'"Source Serif 4",serif', fontSize:14, color:"#C9BFA8", lineHeight:1.7, margin:0, maxWidth:600 }}>
                The Wingmarks palette is built around the metaphor of trace and residue. <strong style={{color:"#A67C5B"}}>Impression Rust</strong> is the color of the mark itself — warm, earthen, the stain left by contact. <strong style={{color:"#C9BFA8"}}>Wing Dust</strong> is what remains after something delicate has passed through. <strong style={{color:"#7A8B6F"}}>Trace Olive</strong> is growth after contact — the new pattern forming over old grooves.
              </p>
            </div>
          </Section>

          <Section title="Typography" subtitle="Wingmarks">
            <TypeSample entry={TYPOGRAPHY.product.display} sampleText="Wingmarks" fontSize={48} />
            <TypeSample entry={TYPOGRAPHY.product.accent} sampleText="The encounters that rearranged us." fontSize={26} />
            <TypeSample entry={TYPOGRAPHY.product.body} sampleText="There is no permanent self. As humans, we're constantly shaped and reshaped by contact, with new patterns forming over even our most entrenched grooves when we brush up against what's other." fontSize={18} />
            <TypeSample entry={TYPOGRAPHY.product.label} sampleText="ELENA RUIZ · ESSAY 01 · GET EARLY ACCESS" fontSize={14} />
            <div style={{ padding:20, background:"#fff", borderRadius:8, border:"1px solid #E8E0D0", marginTop:8 }}>
              <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.2em", color:"#A67C5B", marginBottom:10, fontWeight:600 }}>Typography Note</div>
              <p style={{ fontSize:13, color:"#777", lineHeight:1.65, margin:0 }}>
                Wingmarks uses Cormorant Garamond at lighter weights than the parent brand. Where Luminous Estates uses it for prestige, Wingmarks uses it for intimacy — the same family, rendered more delicately. The italic weight is the typographic wingmark: a trace, a leaning-toward, the shape of being changed by contact.
              </p>
            </div>
          </Section>

          <Section title="Title Treatment" subtitle="Wingmarks">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:18 }}>
              {/* Dark / Hero */}
              <div style={{ background:"#1E2823", borderRadius:12, padding:40, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", minHeight:240, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", bottom:-30, right:-30, width:120, height:120, borderRadius:"50%", background:"radial-gradient(circle, rgba(166,124,91,0.08) 0%, transparent 70%)" }} />
                <div style={{ position:"relative" }}>
                  <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:42, fontWeight:300, color:"#F6F1E7", lineHeight:1, letterSpacing:"0.06em" }}>Wingmarks</div>
                  <div style={{ width:28, height:1, background:"#A67C5B", margin:"14px auto 10px" }} />
                  <div style={{ fontFamily:"DM Sans,sans-serif", fontSize:10, color:"#7A8B6F", letterSpacing:"0.25em", textTransform:"uppercase", textAlign:"center" }}>First Edition · 2026</div>
                </div>
              </div>
              {/* Light */}
              <div style={{ background:"#F6F1E7", borderRadius:12, padding:40, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", minHeight:240, border:"1px solid #E8E0D0" }}>
                <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:42, fontWeight:300, color:"#1E2823", lineHeight:1, letterSpacing:"0.06em" }}>Wingmarks</div>
                <div style={{ width:28, height:1, background:"#A67C5B", margin:"14px auto 10px" }} />
                <div style={{ fontFamily:"DM Sans,sans-serif", fontSize:10, color:"#999", letterSpacing:"0.25em", textTransform:"uppercase", textAlign:"center" }}>The encounters that rearranged us</div>
              </div>
              {/* Inline */}
              <div style={{ background:"#2C2C2A", borderRadius:12, padding:40, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", minHeight:240 }}>
                <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:28, fontWeight:300, color:"#F6F1E7", lineHeight:1, letterSpacing:"0.05em" }}>Wingmarks</div>
                <div style={{ fontFamily:"DM Sans,sans-serif", fontSize:9, color:"#666", letterSpacing:"0.3em", textTransform:"uppercase", marginTop:10 }}>By Luminous Estates</div>
              </div>
            </div>
            <p style={{ fontSize:13, color:"#888", marginTop:16, lineHeight:1.6, fontStyle:"italic" }}>
              The title treatment uses a single word in Cormorant Garamond Light — unhurried, unadorned. No bold weight, no stacking. The thin rust rule beneath is the wingmark itself: a trace of something landing. Consider a subtle moth-wing or feather-trace icon for social/favicon use.
            </p>
          </Section>

          <Section title="Author Card System" subtitle="Wingmarks">
            <p style={{ fontSize:13, color:"#888", marginBottom:20, lineHeight:1.6 }}>
              Each author gets a numbered card representing one encounter, one mark left. The palette rotates through brand colors — each card is a different trace.
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:12 }}>
              {[
                { num:"01", name:"Elena Ruiz", essay:"The Weight of Suitcases", tag:"Immigration", bg:"#1E2823", text:"#F6F1E7", accent:"#A67C5B" },
                { num:"02", name:"Marcus Chen", essay:"What the Mirror Forgot", tag:"Identity", bg:"#F6F1E7", text:"#1E2823", border:true, accent:"#7A8B6F" },
                { num:"03", name:"Amara Okafor", essay:"The Language of Leaving", tag:"Divorce", bg:"#3D4F3D", text:"#F6F1E7", accent:"#C9BFA8" },
                { num:"04", name:"David Mireles", essay:"Burning the Map", tag:"Reinvention", bg:"#A67C5B", text:"#F6F1E7", accent:"#F6F1E7" },
                { num:"05", name:"Priya Sharma", essay:"Between Two Mothers", tag:"Family", bg:"#8B9A7E", text:"#F6F1E7", accent:"#EDE6D6" },
              ].map((a,i) => (
                <div key={i} style={{
                  background:a.bg, color:a.text, borderRadius:10, padding:"22px 16px",
                  border: a.border?"1px solid #E8E0D0":"none",
                  display:"flex", flexDirection:"column", justifyContent:"space-between", minHeight:185,
                  cursor:"pointer", transition:"transform 0.25s ease, box-shadow 0.25s ease", position:"relative", overflow:"hidden",
                }}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.12)";}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
                  {/* Subtle trace circle */}
                  <div style={{ position:"absolute", top:-15, right:-15, width:60, height:60, borderRadius:"50%", border:`1px solid ${a.accent}`, opacity:0.15 }} />
                  <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:26, fontWeight:300, opacity:0.3 }}>{a.num}</div>
                  <div>
                    <div style={{ fontFamily:"DM Sans,sans-serif", fontSize:12, fontWeight:600, marginBottom:3 }}>{a.name}</div>
                    <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:13, fontStyle:"italic", opacity:0.8, marginBottom:8 }}>"{a.essay}"</div>
                    <div style={{
                      display:"inline-block", padding:"3px 10px", borderRadius:20,
                      fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase",
                      background:"rgba(255,255,255,0.12)", fontFamily:"DM Sans,sans-serif",
                      border: a.border?"1px solid rgba(0,0,0,0.08)":"none",
                    }}>{a.tag}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </>)}

        {/* ══════════ UI SYSTEM ══════════ */}
        {activeTab === "ui" && (<>
          <Section title="Buttons" subtitle="Interactive Elements">
            <div style={{ display:"flex", gap:14, flexWrap:"wrap", alignItems:"center", marginBottom:16 }}>
              <button style={{ fontFamily:"DM Sans,sans-serif", fontSize:12, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase",
                background:"#1E2823", color:"#F6F1E7", border:"none", padding:"13px 30px", borderRadius:6, cursor:"pointer" }}>Get Early Access</button>
              <button style={{ fontFamily:"DM Sans,sans-serif", fontSize:12, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase",
                background:"transparent", color:"#2C2C2A", border:"1.5px solid #2C2C2A", padding:"12px 30px", borderRadius:6, cursor:"pointer" }}>Learn More</button>
              <button style={{ fontFamily:"DM Sans,sans-serif", fontSize:12, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase",
                background:"#3D4F3D", color:"#F0EBE1", border:"none", padding:"13px 30px", borderRadius:6, cursor:"pointer" }}>Join the List</button>
              <button style={{ fontFamily:"DM Sans,sans-serif", fontSize:12, fontWeight:500, letterSpacing:"0.04em",
                background:"transparent", color:"#8B9A7E", border:"1px solid #C4B9A8", padding:"12px 26px", borderRadius:6, cursor:"pointer" }}>Read Excerpt →</button>
            </div>
            <p style={{ fontSize:12, color:"#999", margin:0, fontStyle:"italic" }}>
              Rounded corners at 6px — enough softness to feel approachable, enough structure to feel literary. No pill shapes, no sharp corners.
            </p>
          </Section>

          <Section title="Pull Quote" subtitle="The Wingmark Moment">
            <div style={{ background:"#1E2823", borderRadius:12, padding:"44px 52px", position:"relative", overflow:"hidden" }}>
              {/* Atmospheric trace */}
              <div style={{ position:"absolute", top:20, right:40, width:100, height:100, borderRadius:"50%",
                background:"radial-gradient(circle, rgba(166,124,91,0.06) 0%, transparent 70%)" }} />
              <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:64, color:"#A67C5B", lineHeight:0.5, position:"absolute", top:30, left:36, opacity:0.4 }}>"</div>
              <blockquote style={{
                fontFamily:'"Cormorant Garamond",serif', fontSize:22, fontWeight:300,
                color:"#F6F1E7", lineHeight:1.65, fontStyle:"italic",
                margin:0, padding:"0 0 0 24px", borderLeft:"2px solid #A67C5B",
              }}>
                I left everything I knew at thirty-two. Not because I was brave, but because staying had become more terrifying than the unknown.
              </blockquote>
              <div style={{ marginTop:20, paddingLeft:24 }}>
                <div style={{ fontFamily:"DM Sans,sans-serif", fontSize:12, color:"#A67C5B", fontWeight:600, letterSpacing:"0.04em" }}>Elena Ruiz</div>
                <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:13, color:"#6B7B68", fontStyle:"italic" }}>from "The Weight of Suitcases"</div>
              </div>
            </div>
          </Section>

          <Section title="Email Signup" subtitle="Conversion">
            <div style={{ background:"#F6F1E7", borderRadius:12, padding:44, border:"1px solid #E8E0D0", textAlign:"center", maxWidth:580 }}>
              <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:26, fontWeight:300, color:"#1E2823", marginBottom:6 }}>
                Be among the <em>first</em>
              </div>
              <p style={{ fontFamily:"DM Sans,sans-serif", fontSize:13, color:"#888", marginBottom:24 }}>
                Early access. Behind-the-scenes. Exclusive previews before anyone else.
              </p>
              <div style={{ display:"flex", gap:8, maxWidth:400, margin:"0 auto" }}>
                <input type="email" placeholder="your@email.com" style={{
                  flex:1, padding:"13px 16px", borderRadius:6, border:"1px solid #D5CFC5", background:"#fff",
                  fontFamily:"DM Sans,sans-serif", fontSize:13, color:"#2C2C2A", outline:"none",
                }} />
                <button style={{ fontFamily:"DM Sans,sans-serif", fontSize:12, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase",
                  background:"#1E2823", color:"#F6F1E7", border:"none", padding:"13px 22px", borderRadius:6, cursor:"pointer", whiteSpace:"nowrap" }}>Count Me In</button>
              </div>
            </div>
          </Section>

          <Section title="Navigation" subtitle="Header Pattern">
            <div style={{ background:"#1E2823", borderRadius:10, padding:"14px 28px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:20, color:"#F6F1E7", fontWeight:300, letterSpacing:"0.04em" }}>
                Wingmarks
              </div>
              <div style={{ display:"flex", gap:24, alignItems:"center" }}>
                {["The Voices","About","Submit"].map(item =>
                  <span key={item} style={{ fontFamily:"DM Sans,sans-serif", fontSize:12, color:"#C9BFA8", cursor:"pointer", letterSpacing:"0.02em" }}>{item}</span>
                )}
                <button style={{ fontFamily:"DM Sans,sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase",
                  background:"#A67C5B", color:"#F6F1E7", border:"none", padding:"9px 18px", borderRadius:5, cursor:"pointer" }}>Early Access</button>
              </div>
            </div>
          </Section>

          <Section title="Stats Row" subtitle="Social Proof">
            <div style={{ display:"flex", gap:1, background:"#E8E0D0", borderRadius:10, overflow:"hidden" }}>
              {[
                { num:"20", label:"Essays" },
                { num:"500K+", label:"Combined Following" },
                { num:"2", label:"Formats" },
                { num:"2026", label:"Release" },
              ].map((s,i) => (
                <div key={i} style={{ flex:1, background:"#F6F1E7", padding:"26px 18px", textAlign:"center" }}>
                  <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:34, fontWeight:300, color:"#1E2823" }}>{s.num}</div>
                  <div style={{ fontFamily:"DM Sans,sans-serif", fontSize:10, textTransform:"uppercase", letterSpacing:"0.15em", color:"#8B9A7E", marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Footer" subtitle="Brand Hierarchy in Practice">
            <div style={{ background:"#1E2823", borderRadius:12, padding:"32px 36px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
                <div>
                  <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:18, fontWeight:300, color:"#F6F1E7", letterSpacing:"0.04em", marginBottom:4 }}>Wingmarks</div>
                  <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:12, fontStyle:"italic", color:"#6B7B68" }}>The encounters that rearranged us</div>
                </div>
                <div style={{ display:"flex", gap:20 }}>
                  {["Home","About","Submit","Contact"].map(l =>
                    <span key={l} style={{ fontFamily:"DM Sans,sans-serif", fontSize:12, color:"#C9BFA8", cursor:"pointer" }}>{l}</span>
                  )}
                </div>
              </div>
              <div style={{ borderTop:"1px solid rgba(122,139,111,0.15)", paddingTop:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontSize:11, color:"#6B7B68" }}>© 2026 Luminous Estates LLC</div>
                <div style={{ display:"flex", gap:16 }}>
                  {["Privacy","Terms"].map(l =>
                    <span key={l} style={{ fontSize:11, color:"#6B7B68", cursor:"pointer" }}>{l}</span>
                  )}
                </div>
              </div>
            </div>
          </Section>
        </>)}

        {/* ══════════ GUIDELINES ══════════ */}
        {activeTab === "guidelines" && (<>
          <Section title="Photography Direction" subtitle="Visual Guidelines">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
              <div style={{ padding:24, background:"#fff", borderRadius:10, border:"1px solid #E8E0D0" }}>
                <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.2em", color:"#A67C5B", marginBottom:12, fontWeight:600 }}>Author Portraits</div>
                <p style={{ fontSize:13, lineHeight:1.7, color:"#666", margin:0 }}>
                  Warm, natural light. Shallow depth of field. Shot against organic backdrops — never studio white. Authors should look contemplative and present, not posed. Think: someone caught mid-thought, post-encounter. Earth-toned wardrobe. Muted color grading with warm, amber-leaning shadows.
                </p>
              </div>
              <div style={{ padding:24, background:"#fff", borderRadius:10, border:"1px solid #E8E0D0" }}>
                <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.2em", color:"#A67C5B", marginBottom:12, fontWeight:600 }}>Traces & Impressions</div>
                <p style={{ fontSize:13, lineHeight:1.7, color:"#666", margin:0 }}>
                  Light through windows casting shadows. Water marks on stone. Pressed flowers. Moth wings. Fingerprints on fogged glass. Paths worn through grass. These serve as section dividers, hero textures, and ambient imagery. Always desaturated, leaning into the sage/rust/dust palette. The subject is always what was <em>left behind</em>.
                </p>
              </div>
            </div>
            <div style={{ marginTop:16, padding:20, background:"#FAFAF5", borderRadius:8, border:"1px solid #E8E0D0" }}>
              <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.2em", color:"#7A8B6F", marginBottom:8, fontWeight:600 }}>Shift from V1 Mood Board</div>
              <p style={{ fontSize:13, color:"#777", lineHeight:1.6, margin:0 }}>
                The gothic architecture and antique keys from the mood board remain valid but should be secondary to organic traces. Less "entering an old estate" and more "finding what someone left on the windowsill." The misty forest imagery is perfect — it's the feeling of moving through something that changes you.
              </p>
            </div>
          </Section>

          <Section title="Texture & Material Language" subtitle="Visual Guidelines">
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:14 }}>
              {[
                { name:"Embossed Linen", desc:"Letterpress impression — a mark pressed into paper", bg:"#E8E0D0" },
                { name:"Aged Vellum", desc:"Warm parchment with subtle grain, time-touched", bg:"#EDE6D6" },
                { name:"Night Forest", desc:"Deep surfaces where encounters happen", bg:"#1E2823" },
                { name:"Wing Dust", desc:"The residue of contact, delicate overlay", bg:"#C9BFA8" },
              ].map((t,i) => (
                <div key={i} style={{ borderRadius:10, overflow:"hidden" }}>
                  <div style={{ height:72, background:t.bg }} />
                  <div style={{ padding:"10px 14px", background:"#fff", border:"1px solid #E8E0D0", borderTop:"none", borderRadius:"0 0 10px 10px" }}>
                    <div style={{ fontSize:12, fontWeight:600, color:"#2C2C2A" }}>{t.name}</div>
                    <div style={{ fontSize:11, color:"#999", lineHeight:1.4 }}>{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Voice & Tone" subtitle="Copy Guidelines">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
              <div style={{ padding:24, background:"#fff", borderRadius:10, border:"1px solid #E8E0D0" }}>
                <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.2em", color:"#3D4F3D", marginBottom:12, fontWeight:600 }}>Luminous Estates Voice</div>
                <p style={{ fontSize:13, lineHeight:1.7, color:"#666", margin:"0 0 12px" }}>Institutional warmth. A curator opening the doors to a private library. Quiet confidence, never shouting.</p>
                <div style={{ fontSize:12, color:"#2C2C2A", marginBottom:4 }}><strong>Do:</strong> "We publish the stories that illuminate."</div>
                <div style={{ fontSize:12, color:"#999" }}><strong>Don't:</strong> "Check out our amazing new book!"</div>
              </div>
              <div style={{ padding:24, background:"#fff", borderRadius:10, border:"1px solid #E8E0D0" }}>
                <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.2em", color:"#A67C5B", marginBottom:12, fontWeight:600 }}>Wingmarks Voice</div>
                <p style={{ fontSize:13, lineHeight:1.7, color:"#666", margin:"0 0 12px" }}>Contemplative warmth. Reflective, unhurried, psychologically precise. A book left open on a table for someone to discover — not pressed into their hands.</p>
                <div style={{ fontSize:12, color:"#2C2C2A", marginBottom:4 }}><strong>Do:</strong> "The encounters that rearranged us."</div>
                <div style={{ fontSize:12, color:"#999" }}><strong>Don't:</strong> "A groundbreaking anthology experience!"</div>
              </div>
            </div>
            <div style={{ marginTop:16, padding:20, background:"#1E2823", borderRadius:10 }}>
              <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.2em", color:"#A67C5B", marginBottom:10, fontWeight:600 }}>Key Voice Principle</div>
              <p style={{ fontFamily:'"Source Serif 4",serif', fontSize:14, color:"#C9BFA8", lineHeight:1.7, margin:0, maxWidth:580 }}>
                Wingmarks copy should sound like the essayists themselves — people who notice subtlety, who sit with complexity, who describe inner experience with precision. The brand voice mirrors the submission call: "We're especially interested in subtle, psychologically rich moments."
              </p>
            </div>
          </Section>

          <Section title="Brand Relationship" subtitle="Usage Rules">
            <div style={{ padding:24, background:"#fff", borderRadius:10, border:"1px solid #E8E0D0" }}>
              <p style={{ fontSize:13, lineHeight:1.7, color:"#666", margin:"0 0 16px" }}>
                Luminous Estates appears in footer, legal, and "About" contexts — the quiet institutional backing. Wingmarks leads the consumer experience. Think: Penguin Random House sits behind individual imprints. Present but not competing for attention.
              </p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
                {[
                  { context:"Website Header", show:"Wingmarks only" },
                  { context:"Website Footer", show:"© 2026 Luminous Estates LLC" },
                  { context:"Social Media", show:"Wingmarks primary, LE in bio" },
                  { context:"Book Cover", show:"LE small logo on spine" },
                  { context:"Press / Media", show:"Both, LE first" },
                  { context:"Email Marketing", show:"Wingmarks primary" },
                ].map((r,i) => (
                  <div key={i} style={{ padding:"10px 14px", background:"#FAFAF5", borderRadius:6 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:"#2C2C2A", marginBottom:2 }}>{r.context}</div>
                    <div style={{ fontSize:12, color:"#8B9A7E" }}>{r.show}</div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section title="Spacing System" subtitle="Layout">
            <div style={{ padding:24, background:"#fff", borderRadius:10, border:"1px solid #E8E0D0" }}>
              <p style={{ fontSize:13, lineHeight:1.7, color:"#666", margin:"0 0 16px" }}>
                Base unit: 8px. All spacing in multiples of 8. Generous whitespace is essential — the space between things is where the impression lives.
              </p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12 }}>
                {[
                  { label:"xs", val:"8px", size:8 }, { label:"sm", val:"16px", size:16 },
                  { label:"md", val:"24px", size:24 }, { label:"lg", val:"32px", size:32 },
                  { label:"xl", val:"48px", size:48 }, { label:"2xl", val:"64px", size:64 },
                  { label:"3xl", val:"96px", size:96 }, { label:"4xl", val:"128px", size:128 },
                ].map((s,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                    <div style={{ width:Math.min(s.size,128), height:6, background:"#A67C5B", borderRadius:2, opacity:0.6+i*0.05 }} />
                    <div>
                      <span style={{ fontFamily:"monospace", fontSize:12, color:"#2C2C2A" }}>{s.label}</span>
                      <span style={{ fontFamily:"monospace", fontSize:11, color:"#999", marginLeft:6 }}>{s.val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section title="Icon & Symbol Direction" subtitle="Visual Assets">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
              {[
                { symbol:"Moth Wing Trace", desc:"Primary mark. A faint, abstract wing shape — not a literal moth, but the dust pattern left by one. Used for favicon, social avatar, section breaks.", usage:"Favicon, Social, Dividers" },
                { symbol:"Embossed LE Monogram", desc:"Interlocking L and E in Cormorant weight. Letterpress / deboss treatment. Used for the parent brand in formal contexts.", usage:"Spine, Letterhead, Watermark" },
                { symbol:"Compass/Orbit Line", desc:"A thin elliptical arc suggesting 'pulled into a new orbit' from the brief. Used as decorative accent, never dominant.", usage:"Section ornaments, Borders" },
              ].map((s,i) => (
                <div key={i} style={{ padding:20, background:"#fff", borderRadius:10, border:"1px solid #E8E0D0" }}>
                  <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:17, fontWeight:500, color:"#2C2C2A", marginBottom:6 }}>{s.symbol}</div>
                  <p style={{ fontSize:12, lineHeight:1.6, color:"#777", margin:"0 0 10px" }}>{s.desc}</p>
                  <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.15em", color:"#A67C5B", fontWeight:600 }}>{s.usage}</div>
                </div>
              ))}
            </div>
          </Section>
        </>)}

      </div>
    </div>
  );
}
