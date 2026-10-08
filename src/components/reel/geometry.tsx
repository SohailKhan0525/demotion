import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { noise2D, noise3D } from "@remotion/noise";
import { REEL } from "./palette";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const hex = (h: string): [number, number, number] => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a: string, b: string, t: number) => {
  const A = hex(a), B = hex(b);
  return `rgb(${Math.round(lerp(A[0], B[0], t))},${Math.round(lerp(A[1], B[1], t))},${Math.round(lerp(A[2], B[2], t))})`;
};

const useCanvas = (draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, deps: unknown[]) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { width, height } = useVideoConfig();
  useLayoutEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    draw(ctx, width, height);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return <canvas ref={ref} width={width} height={height} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
};

/* --------------------------------------------------------------- Halftone */
/** A halftone dot grid: dot size follows an animated ring that grows, then breaks into an arc. */
export const Halftone: React.FC<{ duration?: number; background?: string }> = ({ duration = 60, background = REEL.navy }) => {
  const frame = useCurrentFrame();
  const p = clamp01(frame / duration);
  return (
    <AbsoluteFill style={{ background }}>
      {useCanvas(
        (ctx, w, h) => {
          ctx.fillStyle = background;
          ctx.fillRect(0, 0, w, h);
          const S = 26;
          const cx = w / 2, cy = h / 2;
          const r0 = lerp(70, 470, Easing.out(Easing.cubic)(p));
          const th = lerp(70, 150, p);
          const spin = frame * 0.045;
          for (let y = S / 2; y < h; y += S) {
            for (let x = S / 2; x < w; x += S) {
              const dx = x - cx, dy = y - cy;
              const d = Math.hypot(dx, dy);
              const ang = Math.atan2(dy, dx) + spin;
              // after 55% of the scene the ring opens into a sweeping arc
              const open = clamp01((p - 0.55) / 0.3);
              const gap = 0.5 + 0.5 * Math.cos(ang - 1.0);
              const arcMask = lerp(1, Math.pow(gap, 1.6), open);
              const v = Math.exp(-Math.pow((d - r0) / th, 2)) * arcMask;
              const rad = 1.6 + v * S * 0.66;
              const col = p < 0.55 ? mix(REEL.pink, REEL.white, clamp01(v * 1.3)) : mix(REEL.yellow, REEL.white, clamp01(v * 1.1 - 0.15));
              ctx.fillStyle = col;
              ctx.beginPath();
              ctx.arc(x, y, rad, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        },
        [frame, duration, background]
      )}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- RadialTicks */
export const RadialTicks: React.FC<{ background?: string }> = ({ background = REEL.white }) => {
  const frame = useCurrentFrame();
  const t = frame / 60;
  return (
    <AbsoluteFill style={{ background }}>
      {useCanvas(
        (ctx, w, h) => {
          ctx.fillStyle = background;
          ctx.fillRect(0, 0, w, h);
          const cx = w / 2, cy = h / 2;
          const grow = Easing.out(Easing.cubic)(clamp01(frame / 22));
          // outer thin ring + dotted rings
          ctx.lineWidth = 2;
          ctx.strokeStyle = REEL.blue;
          ctx.beginPath();
          ctx.arc(cx, cy, 330 * grow, 0, Math.PI * 2);
          ctx.stroke();
          const dots = 110;
          for (let i = 0; i < dots; i++) {
            const a = (i / dots) * Math.PI * 2 + t * 0.4;
            const n = noise3D("dots", Math.cos(a) * 1.3, Math.sin(a) * 1.3, t * 0.9);
            const r = (355 + n * 26) * grow;
            ctx.fillStyle = i % 3 === 0 ? REEL.pink : REEL.blue;
            ctx.beginPath();
            ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 3.6, 0, Math.PI * 2);
            ctx.fill();
          }
          // black noisy tick bands
          const bands = [{ r: 150, n: 150, len: 62 }, { r: 214, n: 190, len: 54 }];
          bands.forEach((b, bi) => {
            for (let i = 0; i < b.n; i++) {
              const a = (i / b.n) * Math.PI * 2 + t * (bi ? -0.35 : 0.55);
              const n = noise3D(`t${bi}`, Math.cos(a) * 1.6, Math.sin(a) * 1.6, t * 1.2);
              const L = (b.len * (0.35 + 0.65 * (n * 0.5 + 0.5))) * grow;
              ctx.strokeStyle = REEL.ink;
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.moveTo(cx + Math.cos(a) * b.r * grow, cy + Math.sin(a) * b.r * grow);
              ctx.lineTo(cx + Math.cos(a) * (b.r * grow + L), cy + Math.sin(a) * (b.r * grow + L));
              ctx.stroke();
            }
          });
          // target
          const pulse = 1 + 0.06 * Math.sin(frame * 0.3);
          [[78, REEL.pink], [48, REEL.yellow], [30, REEL.ink], [12, REEL.white]].forEach(([r, c]) => {
            ctx.fillStyle = c as string;
            ctx.beginPath();
            ctx.arc(cx, cy, (r as number) * grow * pulse, 0, Math.PI * 2);
            ctx.fill();
          });
        },
        [frame, background]
      )}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- WireTerrain */
export const WireTerrain: React.FC<{ background?: string; lines?: number }> = ({ background = REEL.deep, lines = 38 }) => {
  const frame = useCurrentFrame();
  const t = frame / 60;
  return (
    <AbsoluteFill style={{ background }}>
      {useCanvas(
        (ctx, w, h) => {
          const g = ctx.createLinearGradient(0, 0, 0, h);
          g.addColorStop(0, "#14106e");
          g.addColorStop(1, background);
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
          const horizon = h * 0.34;
          const PTS = 150;
          for (let li = 0; li < lines; li++) {
            const z = li / (lines - 1); // 0 far .. 1 near
            const persp = Math.pow(z, 1.7);
            const baseY = horizon + persp * h * 0.78;
            const spread = lerp(0.18, 1.45, persp) * w;
            const amp = lerp(8, 250, persp);
            const pts: [number, number][] = [];
            for (let i = 0; i < PTS; i++) {
              const u = i / (PTS - 1) * 2 - 1;
              const n = noise2D("terrain", u * 2.6 + t * 0.35, li * 0.23 - t * 1.5);
              const edge = 1 - Math.pow(Math.abs(u), 3) * 0.55;
              pts.push([w / 2 + u * spread * 0.5, baseY - (n * 0.5 + 0.5) * amp * edge]);
            }
            // painter's fill so near ridges occlude far ones
            ctx.beginPath();
            ctx.moveTo(pts[0][0], h);
            pts.forEach(([x, y]) => ctx.lineTo(x, y));
            ctx.lineTo(pts[PTS - 1][0], h);
            ctx.closePath();
            ctx.fillStyle = background;
            ctx.fill();
            ctx.beginPath();
            pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
            ctx.strokeStyle = li % 9 === 4 ? REEL.pink : `rgba(255,255,255,${0.35 + 0.6 * persp})`;
            ctx.lineWidth = 1 + persp * 2.2;
            ctx.stroke();
          }
        },
        [frame, background, lines]
      )}
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------- RectTunnel */
export const RectTunnel: React.FC<{ background?: string }> = ({ background = REEL.pink }) => {
  const frame = useCurrentFrame();
  const phase = (frame * 0.011) % 1;
  const N = 15;
  const colors = [REEL.white, REEL.blue, REEL.yellow, REEL.ink, REEL.pink, REEL.white];
  const rects = new Array(N).fill(0).map((_, k) => {
    const e = k + 1 - phase;
    const s = Math.pow(1.42, e) * 0.085;
    return { k, s, color: colors[(k + (Math.floor(frame * 0.011) % colors.length)) % colors.length] };
  }).reverse();
  const spin = Math.sin(frame * 0.02) * 6;
  const zoomIn = interpolate(Easing.out(Easing.cubic)(clamp01(frame / 26)), [0, 1], [0.6, 1]);
  return (
    <AbsoluteFill style={{ background, overflow: "hidden" }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <g transform={`translate(960 540) rotate(${spin}) scale(${zoomIn})`}>
          {rects.map(({ k, s, color }) => {
            const w = 1600 * s, hh = 1000 * s;
            return <rect key={k} x={-w / 2} y={-hh / 2} width={w} height={hh} rx={Math.min(90, 100 * s)} fill={color} stroke={REEL.ink} strokeWidth={Math.max(2, 5 * s)} />;
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* --------------------------------------------------------------- Starburst */
export const Starburst: React.FC<{ duration?: number }> = ({ duration = 30 }) => {
  const frame = useCurrentFrame();
  const p = clamp01(frame / duration);
  return (
    <AbsoluteFill style={{ background: "#05041c" }}>
      {useCanvas(
        (ctx, w, h) => {
          ctx.fillStyle = "#05041c";
          ctx.fillRect(0, 0, w, h);
          const cx = w / 2, cy = h / 2;
          const env = Math.sin(Math.min(1, p * 1.15) * Math.PI) ** 0.8; // build → peak → fall
          const R = 150 + env * 520;
          const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
          glow.addColorStop(0, `rgba(255,255,255,${0.95 * env})`);
          glow.addColorStop(0.18, `rgba(190,200,255,${0.6 * env})`);
          glow.addColorStop(1, "rgba(60,50,200,0)");
          ctx.fillStyle = glow;
          ctx.fillRect(0, 0, w, h);
          ctx.globalCompositeOperation = "lighter";
          for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI + frame * 0.004;
            const long = (i % 2 ? 380 : 880) * env;
            const thick = i % 2 ? 7 : 12;
            const grad = ctx.createLinearGradient(cx - Math.cos(a) * long, cy - Math.sin(a) * long, cx + Math.cos(a) * long, cy + Math.sin(a) * long);
            grad.addColorStop(0, "rgba(255,255,255,0)");
            grad.addColorStop(0.5, `rgba(255,255,255,${0.95 * env})`);
            grad.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = grad;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(a);
            ctx.beginPath();
            ctx.moveTo(-long, 0);
            ctx.lineTo(0, -thick * env);
            ctx.lineTo(long, 0);
            ctx.lineTo(0, thick * env);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          }
          ctx.globalCompositeOperation = "source-over";
          // grain
          for (let i = 0; i < 900; i++) {
            const gx = random(`g${frame}-${i}-x`) * w, gy = random(`g${frame}-${i}-y`) * h;
            ctx.fillStyle = `rgba(255,255,255,${random(`g${frame}-${i}-a`) * 0.14})`;
            ctx.fillRect(gx, gy, 2, 2);
          }
        },
        [frame, duration]
      )}
    </AbsoluteFill>
  );
};
