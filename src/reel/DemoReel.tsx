import React from "react";
import { AbsoluteFill, Easing, Series, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import timeline from "../timeline.json";
import { BEAT, FPS, TOTAL_FRAMES, sceneFrames } from "../beats";
import { FONT_FAMILY, MONO_FAMILY, SERIF_FAMILY } from "../font";
import { REEL } from "../components/reel/palette";
import { KineticType, NumberRoll, SerifReveal, StackType } from "../components/reel/typography";
import { Halftone, RadialTicks, RectTunnel, Starburst, WireTerrain } from "../components/reel/geometry";
import { EasingGraph, MarqueeBands, ParticleSphere, ShapeMorph } from "../components/reel/motion";
import { RubiksCube } from "../three/RubiksCube";
import { ParticleText } from "../components/ParticleText";

export const NPM_PILL = "npm i demotion";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/* ------------------------------------------------------------------ scenes */
const Flow: React.FC = () => {
  const frame = useCurrentFrame();
  const p = Easing.out(Easing.cubic)(clamp01((frame - 26) / 22));
  return (
    <AbsoluteFill>
      <WireTerrain />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 60 }}>
        <div
          style={{
            fontFamily: SERIF_FAMILY,
            fontWeight: 400,
            fontSize: 380,
            color: REEL.pink,
            letterSpacing: -8,
            clipPath: `inset(${(1 - p) * 100}% 0 0 0)`,
            transform: `translateY(${(1 - p) * 60}px)`,
            textShadow: "0 0 60px rgba(255,46,147,0.45)",
          }}
        >
          flow
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Asterisk: React.FC<{ size: number; color: string; rot: number }> = ({ size, color, rot }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ transform: `rotate(${rot}deg)` }}>
    <g stroke={color} strokeWidth="13" strokeLinecap="round">
      {[0, 60, 120].map((d) => (
        <line key={d} x1="-38" y1="0" x2="38" y2="0" transform={`rotate(${d})`} />
      ))}
    </g>
  </svg>
);

const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 10, stiffness: 160 }, durationInFrames: 26 });
  const tag = clamp01((frame - 10) / 14);
  const pill = spring({ frame: frame - 18, fps, config: { damping: 13, stiffness: 150 }, durationInFrames: 22 });
  const glow = 0.6 + 0.4 * Math.sin(frame * 0.14);
  return (
    <AbsoluteFill style={{ background: REEL.navy, alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, rgba(255,46,147,${0.22 * glow}), transparent 55%)` }} />
      <div style={{ transform: `scale(${s})` }}>
        <Asterisk size={92} color={REEL.pink} rot={frame * 3} />
      </div>
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 900,
          fontSize: 250,
          letterSpacing: -9,
          color: REEL.white,
          lineHeight: 1,
          transform: `scale(${0.82 + 0.18 * s})`,
          opacity: clamp01(s * 3),
          textShadow: `0 0 ${30 + 30 * glow}px rgba(255,214,10,0.55), 0 0 90px rgba(255,46,147,0.5)`,
        }}
      >
        demotion
      </div>
      <div style={{ marginTop: 20, fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 40, color: "#d9d6ff", opacity: tag, transform: `translateY(${(1 - tag) * 14}px)` }}>
        Motion graphics, written in code.
      </div>
      <div style={{ marginTop: 34, display: "flex", gap: 16, alignItems: "center", opacity: pill, transform: `translateY(${(1 - pill) * 24}px)` }}>
        <div style={{ fontFamily: MONO_FAMILY, fontWeight: 700, fontSize: 27, color: REEL.white, background: REEL.pink, borderRadius: 99, padding: "14px 30px" }}>{NPM_PILL}</div>
        <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 21, color: "#b9b6ec", letterSpacing: 2 }}>OPEN SOURCE · MIT</div>
      </div>
    </AbsoluteFill>
  );
};

const frames = (id: string) => sceneFrames(id);

const SCENES: Record<string, React.FC> = {
  motion: () => (
    <AbsoluteFill style={{ background: REEL.navy }}>
      <KineticType text="MOTION" accentIndex={3} />
    </AbsoluteFill>
  ),
  code: () => <StackType text="CODE" />,
  serif: () => <SerifReveal text="Render" />,
  number: () => <NumberRoll value="3840" caption="× 2160  ·  4K" />,
  halftone: () => <Halftone duration={frames("halftone")} />,
  ticks: () => <RadialTicks />,
  terrain: () => <Flow />,
  tunnel: () => <RectTunnel />,
  cube: () => <RubiksCube />,
  marquee: () => <MarqueeBands />,
  easing: () => <EasingGraph />,
  morph: () => <ShapeMorph />,
  sphere: () => <ParticleSphere duration={frames("sphere")} />,
  burst: () => <Starburst duration={frames("burst")} />,
  ptext: () => (
    <AbsoluteFill style={{ background: REEL.deep }}>
      <ParticleText text="demotion" fontSize={250} fontWeight={900} formAt={0} formDuration={22} particleSize={2.6} color="#ffffff" />
    </AbsoluteFill>
  ),
  final: () => <Final />,
};

/* ---------------------------------------------- smash cut + HUD (overlay) */
const Wrap: React.FC<{ n: number; flash: boolean; children: React.ReactNode }> = ({ n, flash, children }) => {
  const frame = useCurrentFrame();
  const inP = Easing.out(Easing.cubic)(clamp01(frame / 9));
  const outP = clamp01((frame - (n - 4)) / 4);
  const f = flash ? interpolate(frame, [0, 5], [0.85, 0], { extrapolateRight: "clamp" }) : interpolate(frame, [0, 3], [0.35, 0], { extrapolateRight: "clamp" });
  const blur = (1 - inP) * 12 + outP * 7;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${1 + (1 - inP) * 0.06 + outP * 0.03})`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
        {children}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: f, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

type S = { id: string; beats: number; chapter: string; hud: string; in: string };
const LIST = timeline.scenes as S[];

const pad = (v: number, n = 2) => String(v).padStart(n, "0");

const Hud: React.FC = () => {
  const frame = useCurrentFrame();
  let acc = 0;
  let idx = 0;
  let startOf = 0;
  for (let i = 0; i < LIST.length; i++) {
    const len = Math.round(LIST[i].beats * BEAT);
    if (frame < acc + len) { idx = i; startOf = acc; break; }
    acc += len;
    idx = i;
    startOf = acc - len;
  }
  const cur = LIST[idx];
  const ink = cur.hud === "light" ? "rgba(255,255,255,0.92)" : "rgba(11,11,20,0.88)";
  const dim = cur.hud === "light" ? "rgba(255,255,255,0.35)" : "rgba(11,11,20,0.28)";
  const sec = Math.floor(frame / FPS);
  const tc = `00:${pad(Math.floor(sec / 60))}:${pad(sec % 60)}:${pad(frame % FPS)}`;
  const isComponent = cur.chapter !== "demotion";
  const chapter = isComponent ? `<${cur.chapter} />` : "demotion";
  // progress ticks at every scene boundary
  const marks: number[] = [];
  let a = 0;
  LIST.forEach((s) => { marks.push(a / TOTAL_FRAMES); a += Math.round(s.beats * BEAT); });
  const pop = interpolate(frame - startOf, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", fontFamily: MONO_FAMILY, color: ink }}>
      <div style={{ position: "absolute", left: 52, top: 40, fontSize: 15, fontWeight: 700, letterSpacing: 3 }}>
        DEMOTION · MOTION REEL 2026
      </div>
      <div style={{ position: "absolute", right: 52, top: 40, fontSize: 15, fontWeight: 700, letterSpacing: 2 }}>{tc}</div>
      <div style={{ position: "absolute", left: 52, bottom: 62, fontSize: 17, fontWeight: 700, opacity: pop, transform: `translateY(${(1 - pop) * 6}px)` }}>
        {chapter}
      </div>
      <div style={{ position: "absolute", right: 52, bottom: 62, fontSize: 15, fontWeight: 700, opacity: 0.8 }}>
        {pad(idx + 1)} / {pad(LIST.length)}
      </div>
      <div style={{ position: "absolute", left: 52, right: 52, bottom: 40, height: 3, background: dim, borderRadius: 2 }}>
        <div style={{ width: `${(frame / TOTAL_FRAMES) * 100}%`, height: "100%", background: ink, borderRadius: 2 }} />
        {marks.map((m, i) => (
          <div key={i} style={{ position: "absolute", left: `${m * 100}%`, top: -4, width: 2, height: 11, background: dim }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const DemoReel: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Series>
      {LIST.map((sc) => {
        const n = sceneFrames(sc.id);
        const C = SCENES[sc.id];
        return (
          <Series.Sequence key={sc.id} durationInFrames={n}>
            <Wrap n={n} flash={sc.in === "flashHit"}>
              <C />
            </Wrap>
          </Series.Sequence>
        );
      })}
    </Series>
    <Hud />
  </AbsoluteFill>
);

export const REEL_FRAMES = TOTAL_FRAMES;
