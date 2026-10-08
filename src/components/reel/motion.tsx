import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { noise3D } from "@remotion/noise";
import { FONT_FAMILY, MONO_FAMILY } from "../../font";
import { REEL } from "./palette";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const textWidth = (text: string, font: string) => {
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.font = font;
  return ctx.measureText(text).width;
};

/* ------------------------------------------------------------ MarqueeBands */
export type Band = { text: string; background: string; color: string; speed: number; dir: 1 | -1 };

export const DEFAULT_BANDS: Band[] = [
  { text: "SPRING PHYSICS • EASE OUT • OVERSHOOT", background: REEL.yellow, color: REEL.ink, speed: 15, dir: 1 },
  { text: "MOTION BLUR • PARALLAX • MASK REVEAL", background: REEL.pink, color: REEL.white, speed: 21, dir: -1 },
  { text: "LENS BLUR • SPEED RAMPS • KINETIC TYPE", background: REEL.white, color: REEL.ink, speed: 13, dir: 1 },
  { text: "WRITTEN IN CODE • RENDERED TO MP4", background: REEL.blue, color: REEL.white, speed: 25, dir: -1 },
];

export const MarqueeBands: React.FC<{ bands?: Band[]; background?: string; angle?: number; bandHeight?: number }> = ({
  bands = DEFAULT_BANDS,
  background = REEL.purple,
  angle = -11,
  bandHeight = 188,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const font = `900 ${bandHeight * 0.52}px ${FONT_FAMILY}`;
  return (
    <AbsoluteFill style={{ background, overflow: "hidden" }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          {bands.map((b, i) => (
            <filter key={i} id={`mq-blur-${i}`} x="-5%" y="-5%" width="110%" height="110%">
              <feGaussianBlur stdDeviation={`${Math.min(16, b.speed * 0.62)} 0`} />
            </filter>
          ))}
        </defs>
      </svg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `rotate(${angle}deg) scale(1.35)` }}>
        {bands.map((b, i) => {
          const unit = `${b.text}  •  `;
          const unitW = textWidth(unit, font);
          const reps = Math.ceil((2600 * 1.1) / unitW) + 2;
          const off = (frame * b.speed) % unitW;
          const x = b.dir > 0 ? -off : off - unitW;
          const enter = spring({ frame: frame - i * 3, fps, config: { damping: 15, stiffness: 140 }, durationInFrames: 20 });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: 540 - (bands.length * bandHeight) / 2 + i * bandHeight,
                left: -300,
                width: 2520,
                height: bandHeight,
                background: b.background,
                color: b.color,
                overflow: "hidden",
                transform: `translateX(${(1 - enter) * (i % 2 ? 1400 : -1400)}px)`,
                boxShadow: "0 14px 40px rgba(0,0,0,0.25)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  whiteSpace: "pre",
                  fontFamily: FONT_FAMILY,
                  fontWeight: 900,
                  fontSize: bandHeight * 0.52,
                  transform: `translateX(${x}px)`,
                  filter: `url(#mq-blur-${i})`,
                }}
              >
                {new Array(reps).fill(unit).join("")}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ EasingGraph */
export const EasingGraph: React.FC<{
  bezier?: [number, number, number, number];
  background?: string;
}> = ({ bezier = [0.22, 1, 0.36, 1], background = REEL.white }) => {
  const frame = useCurrentFrame();
  const ease = Easing.bezier(...bezier);
  const label = `cubic-bezier(${bezier.join(", ")})`;
  const draw = Easing.out(Easing.cubic)(clamp01(frame / 22));
  const GX = 250, GY = 250, GW = 520, GH = 440;
  const pts: string[] = [];
  const N = 64;
  for (let i = 0; i <= N * draw; i++) {
    const u = i / N;
    pts.push(`${i ? "L" : "M"}${GX + u * GW},${GY + GH - ease(u) * GH}`);
  }
  const period = 42;
  const t = ((frame + 6) % period) / (period - 6);
  const tt = clamp01(t);
  const TX = 940, TW = 780;
  const rows = [
    { y: 380, name: "linear", pos: tt, color: "#9a98ad" },
    { y: 580, name: "demotion", pos: ease(tt), color: REEL.pink },
  ];
  const cardIn = spring({ frame, fps: 60, config: { damping: 16, stiffness: 150 }, durationInFrames: 22 });
  return (
    <AbsoluteFill style={{ background }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <g transform={`translate(0 ${(1 - cardIn) * 60})`} opacity={cardIn}>
          <rect x={190} y={150} width={620} height={640} rx={34} fill="#fff" stroke="#e5e4f0" strokeWidth="3" />
          <rect x={GX} y={GY} width={GW} height={GH} fill="#f6f5ff" rx="10" />
          {[0.25, 0.5, 0.75].map((g) => (
            <g key={g}>
              <line x1={GX + g * GW} y1={GY} x2={GX + g * GW} y2={GY + GH} stroke="#e1def5" />
              <line x1={GX} y1={GY + g * GH} x2={GX + GW} y2={GY + g * GH} stroke="#e1def5" />
            </g>
          ))}
          <path d={pts.join(" ")} fill="none" stroke={REEL.blue} strokeWidth="7" strokeLinecap="round" />
          <g opacity={draw}>
            <line x1={GX} y1={GY + GH} x2={GX + bezier[0] * GW} y2={GY + GH - bezier[1] * GH} stroke={REEL.pink} strokeWidth="3" />
            <line x1={GX + GW} y1={GY} x2={GX + bezier[2] * GW} y2={GY + GH - bezier[3] * GH} stroke={REEL.pink} strokeWidth="3" />
            <circle cx={GX + bezier[0] * GW} cy={GY + GH - bezier[1] * GH} r={11} fill={REEL.pink} />
            <circle cx={GX + bezier[2] * GW} cy={GY + GH - bezier[3] * GH} r={11} fill={REEL.pink} />
          </g>
          <text x={GX} y={GY - 36} fontFamily={MONO_FAMILY} fontWeight="700" fontSize="26" fill={REEL.ink}>{label}</text>
        </g>
        {rows.map((r, i) => (
          <g key={r.name} opacity={clamp01((frame - 6 - i * 4) / 8)}>
            <text x={TX} y={r.y - 56} fontFamily={MONO_FAMILY} fontWeight="700" fontSize="26" fill="#6c6a85">{r.name}</text>
            <line x1={TX} y1={r.y} x2={TX + TW} y2={r.y} stroke="#d9d7ee" strokeWidth="6" strokeLinecap="round" />
            <line x1={TX + TW} y1={r.y - 38} x2={TX + TW} y2={r.y + 38} stroke={REEL.ink} strokeWidth="5" />
            <circle cx={TX + r.pos * TW} cy={r.y} r={30} fill={r.color} stroke={REEL.ink} strokeWidth="4" />
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- ShapeMorph */
const N_PTS = 120;
const rayPoly = (verts: [number, number][], th: number) => {
  const d = [Math.cos(th), Math.sin(th)];
  let best = Infinity;
  for (let i = 0; i < verts.length; i++) {
    const A = verts[i], B = verts[(i + 1) % verts.length];
    const e = [B[0] - A[0], B[1] - A[1]];
    const den = d[0] * e[1] - d[1] * e[0];
    if (Math.abs(den) < 1e-9) continue;
    const t = (A[0] * e[1] - A[1] * e[0]) / den;
    const u = (A[0] * d[1] - A[1] * d[0]) / den;
    if (t > 0 && u >= 0 && u <= 1) best = Math.min(best, t);
  }
  return best;
};
const starVerts = (R: number): [number, number][] =>
  new Array(10).fill(0).map((_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 ? R * 0.46 : R * 1.12;
    return [Math.cos(a) * r, Math.sin(a) * r];
  });
const shapeR = (kind: number, th: number, R: number) => {
  if (kind === 0) return R;
  if (kind === 1) return (R * 1.02) / Math.pow(Math.abs(Math.cos(th - Math.PI / 4)) ** 4 + Math.abs(Math.sin(th - Math.PI / 4)) ** 4, 0.25);
  return rayPoly(starVerts(R), th);
};

export const ShapeMorph: React.FC<{ background?: string }> = ({ background = REEL.yellow }) => {
  const frame = useCurrentFrame();
  const R = 190;
  const hold = [0, 20, 40];
  const colors = [REEL.ink, REEL.pink, REEL.blue];
  // continuous shape index 0..2 with eased morphs between holds
  const m1 = Easing.inOut(Easing.cubic)(clamp01((frame - 12) / 10));
  const m2 = Easing.inOut(Easing.cubic)(clamp01((frame - 32) / 10));
  const idx = m1 + m2;
  const a = Math.floor(Math.min(1.999, idx));
  const f = idx - a;
  const pts: string[] = [];
  for (let i = 0; i < N_PTS; i++) {
    const th = (i / N_PTS) * Math.PI * 2;
    const r = lerp(shapeR(a, th, R), shapeR(a + 1, th, R), f);
    pts.push(`${i ? "L" : "M"}${Math.cos(th) * r},${Math.sin(th) * r}`);
  }
  const fromC = colors[a], toC = colors[a + 1];
  const blend = (c1: string, c2: string, t: number) => {
    const h = (c: string) => [1, 3, 5].map((k) => parseInt(c.slice(k, k + 2), 16));
    const A = h(c1), B = h(c2);
    return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], t))).join(",")})`;
  };
  const fill = blend(fromC, toC, f);
  const pop = spring({ frame, fps: 60, config: { damping: 9, stiffness: 200 }, durationInFrames: 20 });
  const rot = frame * 2.2 + (1 - pop) * -90;
  // confetti bursts on each morph
  const confetti: React.ReactNode[] = [];
  hold.forEach((s, bi) => {
    const age = frame - s;
    if (age < 0 || age > 34) return;
    for (let k = 0; k < 30; k++) {
      const ang = random(`cf-${bi}-${k}-a`) * Math.PI * 2;
      const sp = 9 + random(`cf-${bi}-${k}-s`) * 22;
      const dist = sp * 6.2 * (1 - Math.pow(1 - clamp01(age / 34), 2.2));
      const x = Math.cos(ang) * (R + 20 + dist);
      const y = Math.sin(ang) * (R + 20 + dist) + age * age * 0.12;
      const sz = 8 + random(`cf-${bi}-${k}-z`) * 14;
      const c = [REEL.ink, REEL.pink, REEL.blue, REEL.white][k % 4];
      confetti.push(
        k % 3 ? <rect key={`${bi}-${k}`} x={x} y={y} width={sz} height={sz} fill={c} opacity={1 - age / 34} transform={`rotate(${age * 12 + k * 40} ${x} ${y})`} />
              : <circle key={`${bi}-${k}`} cx={x} cy={y} r={sz / 2} fill={c} opacity={1 - age / 34} />
      );
    }
  });
  return (
    <AbsoluteFill style={{ background }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <g transform="translate(960 540)">
          <ellipse cx="0" cy={R + 90} rx={R * 0.9} ry="22" fill="rgba(0,0,0,0.16)" />
          {confetti}
          <g transform={`scale(${pop}) rotate(${rot})`}>
            <path d={pts.join(" ") + "Z"} fill={fill} stroke={REEL.ink} strokeWidth="9" strokeLinejoin="round" />
            <g stroke={REEL.white} strokeWidth="11" strokeLinecap="round" transform={`rotate(${-rot})`}>
              {[0, 60, 120].map((d) => (
                <line key={d} x1={-34} y1={0} x2={34} y2={0} transform={`rotate(${d})`} />
              ))}
            </g>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- ParticleSphere */
export const SPHERE_PARTICLES = 2400;

export const ParticleSphere: React.FC<{ duration?: number; background?: string }> = ({ duration = 240, background = REEL.deep }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const t = frame / 60;

  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
    const cx = width / 2, cy = height / 2 + 10;
    const form = Easing.out(Easing.cubic)(clamp01(frame / 40));
    const collapse = Easing.in(Easing.cubic)(clamp01((frame - (duration - 26)) / 26));
    const R = 330 * (1 - collapse * 0.97);
    const ry = t * 0.95, rx = 0.38;
    const cry = Math.cos(ry), sry = Math.sin(ry), crx = Math.cos(rx), srx = Math.sin(rx);
    const gold = Math.PI * (3 - Math.sqrt(5));
    const proj: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < SPHERE_PARTICLES; i++) {
      const yy = 1 - (i / (SPHERE_PARTICLES - 1)) * 2;
      const rr = Math.sqrt(1 - yy * yy);
      const th = gold * i;
      let x = Math.cos(th) * rr, y = yy, z = Math.sin(th) * rr;
      const n = noise3D("sphere", x * 1.6 + t * 0.3, y * 1.6, z * 1.6 + t * 0.4);
      const rad = R * (1 + n * 0.055);
      x *= rad; y *= rad; z *= rad;
      // scatter-in
      const d = clamp01((form * 1.4 - random(`s-${i}`) * 0.4));
      const sx = (random(`sx-${i}`) - 0.5) * width * 1.4, sy = (random(`sy-${i}`) - 0.5) * height * 1.4;
      const x1 = x * cry + z * sry, z1 = -x * sry + z * cry;
      const y2 = y * crx - z1 * srx, z2 = y * srx + z1 * crx;
      proj.push({ x: lerp(sx, x1, d), y: lerp(sy, y2, d), z: z2 });
    }
    proj.sort((a, b) => a.z - b.z);
    for (const p of proj) {
      const depth = clamp01((p.z + 360) / 720);
      const s = 1.2 + depth * 2.4;
      ctx.fillStyle = `rgba(${Math.round(150 + depth * 105)},${Math.round(175 + depth * 80)},255,${0.25 + depth * 0.75})`;
      ctx.fillRect(cx + p.x - s / 2, cy + p.y - s / 2, s, s);
    }
    // orbit ring
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.34);
    ctx.strokeStyle = "rgba(190,200,255,0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, R * 1.42, R * 0.42, 0, 0, Math.PI * 2);
    ctx.stroke();
    const oa = t * 1.7;
    ctx.fillStyle = REEL.pink;
    ctx.beginPath();
    ctx.arc(Math.cos(oa) * R * 1.42, Math.sin(oa) * R * 0.42, 9 * (1 - collapse), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // callouts
    const labels = [
      { at: 40, x: cx + R * 0.95, y: cy - R * 0.62, tx: cx + R * 1.5, ty: cy - R * 0.98, text: `${SPHERE_PARTICLES.toLocaleString("en-US")} particles` },
      { at: 62, x: cx - R * 0.85, y: cy + R * 0.5, tx: cx - R * 1.9, ty: cy + R * 0.86, text: "noise3D() displacement" },
    ];
    labels.forEach((l) => {
      const a = clamp01((frame - l.at) / 10) * (1 - collapse);
      if (a <= 0) return;
      ctx.globalAlpha = a;
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(l.x, l.y);
      ctx.lineTo(l.tx, l.ty);
      ctx.lineTo(l.tx + (l.tx > cx ? 40 : -40), l.ty);
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.font = `700 26px ${MONO_FAMILY}`;
      ctx.textAlign = l.tx > cx ? "left" : "right";
      ctx.fillText(l.text, l.tx + (l.tx > cx ? 52 : -52), l.ty + 9);
      ctx.beginPath();
      ctx.arc(l.x, l.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  });

  return (
    <AbsoluteFill style={{ background }}>
      <canvas ref={ref} width={width} height={height} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
    </AbsoluteFill>
  );
};
