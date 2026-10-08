import React from "react";
import { interpolate, Easing, useCurrentFrame } from "remotion";
import { FONT_FAMILY } from "../font";

export const GRAD = "linear-gradient(90deg,#ec4899 0%,#a855f7 55%,#6366f1 100%)";
export const GRAD_PINK = "linear-gradient(90deg,#f43f8e 0%,#c026d3 100%)";

export const GradientText: React.FC<{
  children: React.ReactNode;
  gradient?: string;
  style?: React.CSSProperties;
}> = ({ children, gradient = GRAD, style }) => (
  <span
    style={{
      background: gradient,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      WebkitTextFillColor: "transparent",
      ...style,
    }}
  >
    {children}
  </span>
);

/** Reveals children with a soft-edged left-to-right mask (a real mask reveal, not an opacity fade). */
export const MaskWipe: React.FC<{
  start: number;
  dur: number;
  edge?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  ease?: (t: number) => number;
}> = ({ start, dur, edge = 18, children, style, ease = Easing.out(Easing.cubic) }) => {
  const frame = useCurrentFrame();
  const t = ease(Math.min(1, Math.max(0, (frame - start) / dur)));
  const pos = t * (100 + edge) - edge;
  const mask = `linear-gradient(90deg, #000 ${pos}%, transparent ${pos + edge}%)`;
  return (
    <div style={{ WebkitMaskImage: mask, maskImage: mask, ...style }}>{children}</div>
  );
};

export type CursorKey = { frame: number; x: number; y: number; click?: boolean };

const posAt = (frame: number, k: CursorKey[]) => {
  const fr = k.map((a) => a.frame);
  const ease = Easing.inOut(Easing.cubic);
  return {
    x: interpolate(frame, fr, k.map((a) => a.x), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }),
    y: interpolate(frame, fr, k.map((a) => a.y), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }),
  };
};

/** Pointing-hand cursor (purple outline, white fill) with a squash-press and expanding click ring. */
export const HandCursor: React.FC<{ keys: CursorKey[]; scale?: number }> = ({ keys, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { x, y } = posAt(frame, keys);
  const click = keys.find((k) => k.click && frame >= k.frame && frame < k.frame + 20);
  const ct = click ? (frame - click.frame) / 20 : null;
  const press = click ? Math.max(0, 1 - (frame - click.frame) / 5) : 0;
  const visible = frame >= keys[0].frame - 2;
  if (!visible) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 60, pointerEvents: "none" }}>
      {ct !== null &&
        [0, 0.2].map((d, i) => {
          const p = Math.min(1, Math.max(0, (ct - d) / (1 - d)));
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: -30 * scale,
                top: -30 * scale,
                width: 60 * scale,
                height: 60 * scale,
                borderRadius: "50%",
                border: "2.5px solid rgba(168,85,247,0.85)",
                transform: `scale(${0.3 + p * 1.5})`,
                opacity: (1 - p) * 0.8,
              }}
            />
          );
        })}
      <svg
        width={44 * scale}
        height={44 * scale}
        viewBox="0 0 24 24"
        fill="white"
        stroke="#7c3aed"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transform: `translate(-9px,-4px) scale(${1 - press * 0.14})`,
          transformOrigin: "9px 3px",
          filter: "drop-shadow(0 4px 8px rgba(88,28,135,0.35))",
        }}
      >
        <path d="M18 11V10a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
        <path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1" />
        <path d="M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10" />
        <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
      </svg>
    </div>
  );
};

export const Sparkle: React.FC<{ size: number; rotate?: number; color?: string }> = ({
  size,
  rotate = 0,
  color = "white",
}) => (
  <svg width={size} height={size} viewBox="-12 -12 24 24" style={{ transform: `rotate(${rotate}deg)` }}>
    <g fill="none" stroke={color} strokeWidth="1.7">
      <circle cx="0" cy="-5.2" r="5.2" />
      <circle cx="0" cy="5.2" r="5.2" />
      <circle cx="-5.2" cy="0" r="5.2" />
      <circle cx="5.2" cy="0" r="5.2" />
    </g>
  </svg>
);

export const Glass: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.78)",
      backdropFilter: "blur(22px)",
      border: "1px solid rgba(255,255,255,0.75)",
      borderRadius: 20,
      boxShadow: "0 30px 70px -24px rgba(90,30,140,0.45), 0 4px 18px rgba(90,30,140,0.12)",
      fontFamily: FONT_FAMILY,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Caret: React.FC<{ color?: string; height: number }> = ({ color = "#a855f7", height }) => {
  const frame = useCurrentFrame();
  const on = Math.floor(frame / 8) % 2 === 0;
  return (
    <span
      style={{
        display: "inline-block",
        width: 4,
        height,
        background: color,
        marginLeft: 6,
        verticalAlign: "middle",
        opacity: on ? 1 : 0.15,
      }}
    />
  );
};
