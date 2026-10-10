import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_FAMILY, SERIF_FAMILY } from "../../font";
import { REEL } from "./palette";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/* ------------------------------------------------------------ KineticType */
export const KineticType: React.FC<{
  text: string;
  fontSize?: number;
  color?: string;
  accent?: string;
  accentIndex?: number;
  startAt?: number;
  /** frames between letters */
  stagger?: number;
  underline?: boolean;
}> = ({ text, fontSize = 250, color = REEL.white, accent = REEL.pink, accentIndex = -1, startAt = 0, stagger = 2.4, underline = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const letters = text.split("");
  const lineStart = startAt + letters.length * stagger + 4;
  const line = spring({ frame: frame - lineStart, fps, config: { damping: 18, stiffness: 160 }, durationInFrames: 16 });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ display: "flex", fontFamily: FONT_FAMILY, fontWeight: 900, fontSize, letterSpacing: -fontSize * 0.03, lineHeight: 1 }}>
        {letters.map((ch, i) => {
          const s = spring({ frame: frame - startAt - i * stagger, fps, config: { damping: 8, stiffness: 240, mass: 0.55 } });
          const drop = (1 - s) * -fontSize * 1.1;
          const rot = (1 - s) * (i % 2 ? -22 : 22);
          const sy = 1 + Math.max(0, 1 - s) * 0.45;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                color: i === accentIndex ? accent : color,
                transform: `translateY(${drop}px) rotate(${rot}deg) scaleY(${sy})`,
                opacity: clamp01(s * 5),
                transformOrigin: "50% 100%",
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
      {underline && (
        <div style={{ marginTop: fontSize * 0.04, height: fontSize * 0.06, width: `${line * 62}%`, background: accent, borderRadius: 99 }} />
      )}
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------- StackType */
export const StackType: React.FC<{
  text: string;
  rows?: number;
  fontSize?: number;
  background?: string;
  ink?: string;
}> = ({ text, rows = 3, fontSize = 330, background = REEL.pink, ink = REEL.ink }) => {
  const frame = useCurrentFrame();
  const mid = Math.floor(rows / 2);
  return (
    <AbsoluteFill style={{ background, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.84 }}>
        {new Array(rows).fill(0).map((_, i) => {
          const t = Easing.out(Easing.exp)(clamp01((frame - i * 2.5) / 14));
          const dir = i % 2 ? 1 : -1;
          const x = dir * (1 - t) * 1700 + dir * frame * 2.2;
          const filled = i === mid;
          return (
            <div
              key={i}
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: 900,
                fontSize,
                letterSpacing: -fontSize * 0.035,
                whiteSpace: "nowrap",
                textAlign: "center",
                transform: `translateX(${x}px)`,
                color: filled ? ink : "transparent",
                WebkitTextStroke: filled ? "0px" : `4px ${ink}`,
              }}
            >
              {text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ SerifReveal */
export const SerifReveal: React.FC<{
  text: string;
  fontSize?: number;
  background?: string;
  ink?: string;
  stroke?: string;
}> = ({ text, fontSize = 430, background = REEL.white, ink = REEL.ink, stroke = REEL.purple }) => {
  const frame = useCurrentFrame();
  const draw = Easing.out(Easing.cubic)(clamp01(frame / 15));
  const fill = clamp01((frame - 12) / 8);
  const L = 9000;
  const common = {
    x: 960,
    y: 700,
    textAnchor: "middle" as const,
    fontFamily: SERIF_FAMILY,
    fontWeight: 400,
    fontSize,
  };
  return (
    <AbsoluteFill style={{ background }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <text {...common} x={972} y={712} fill="none" stroke={stroke} strokeWidth="3" strokeDasharray={L} strokeDashoffset={L * (1 - draw)} opacity={0.55}>
          {text}
        </text>
        <text {...common} fill={ink} fillOpacity={fill} stroke={ink} strokeWidth="4" strokeDasharray={L} strokeDashoffset={L * (1 - draw)}>
          {text}
        </text>
      </svg>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- NumberRoll */
export const NumberRoll: React.FC<{
  value: string;
  caption?: string;
  background?: string;
  color?: string;
  fontSize?: number;
}> = ({ value, caption, background = REEL.blue, color = REEL.yellow, fontSize = 330 }) => {
  const frame = useCurrentFrame();
  const lh = fontSize * 1.0;
  const chars = value.split("");
  return (
    <AbsoluteFill style={{ background, alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ display: "flex", fontFamily: FONT_FAMILY, fontWeight: 900, fontSize, letterSpacing: -fontSize * 0.03, color }}>
        {chars.map((ch, j) => {
          const isDigit = /\d/.test(ch);
          if (!isDigit) return <span key={j} style={{ lineHeight: `${lh}px` }}>{ch}</span>;
          const d = Number(ch);
          const p = Easing.out(Easing.cubic)(clamp01((frame - j * 2) / 20));
          const pPrev = Easing.out(Easing.cubic)(clamp01((frame - 1 - j * 2) / 20));
          const idx = p * (20 + d);
          const vel = Math.abs(p - pPrev) * (20 + d) * lh;
          return (
            <div key={j} style={{ height: lh, overflow: "hidden", width: fontSize * 0.62, position: "relative" }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translateY(${-idx * lh}px)`, filter: `blur(${Math.min(14, vel * 0.04)}px)` }}>
                {new Array(31).fill(0).map((_, k) => (
                  <div key={k} style={{ height: lh, lineHeight: `${lh}px`, textAlign: "center" }}>{k % 10}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {caption && (
        <div style={{ marginTop: 6, fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 46, letterSpacing: 6, color: REEL.white, opacity: clamp01((frame - 16) / 8) }}>
          {caption}
        </div>
      )}
    </AbsoluteFill>
  );
};
