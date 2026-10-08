import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

export type CursorPoint = { frame: number; x: number; y: number; click?: boolean };
export type CursorActorProps = { keyframes: CursorPoint[] };

const positionAt = (frame: number, keyframes: CursorPoint[]) => {
  const frames = keyframes.map((k) => k.frame);
  const xs = keyframes.map((k) => k.x);
  const ys = keyframes.map((k) => k.y);
  const x = interpolate(frame, frames, xs, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const y = interpolate(frame, frames, ys, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  return { x, y };
};

export const CursorActor: React.FC<CursorActorProps> = ({ keyframes }) => {
  const frame = useCurrentFrame();
  if (keyframes.length === 0) return null;

  const { x, y } = positionAt(frame, keyframes);
  const prev = positionAt(frame - 3, keyframes);
  const dx = x - prev.x;
  const dy = y - prev.y;
  const moving = Math.hypot(dx, dy) > 0.4;
  const heading = moving ? (Math.atan2(dy, dx) * 180) / Math.PI : -60;
  // gentle tilt toward travel direction, capped so it never looks broken
  const tilt = moving ? interpolate(Math.min(Math.hypot(dx, dy), 14), [0, 14], [0, 10]) : 0;
  const tiltSign = Math.cos((heading * Math.PI) / 180) >= 0 ? 1 : -1;

  const RIPPLE_LIFE = 26;
  const activeClick = keyframes.find(
    (k) => k.click && frame >= k.frame && frame < k.frame + RIPPLE_LIFE
  );
  const cp = activeClick ? (frame - activeClick.frame) / RIPPLE_LIFE : null;
  const pressT = activeClick ? Math.max(0, 1 - (frame - activeClick.frame) / 6) : 0;
  const pressScale = 1 - pressT * 0.16;

  // faded trail: a few ghost samples slightly behind in time
  const trail = [6, 12, 18].map((lag) => positionAt(frame - lag, keyframes));

  return (
    <>
      {trail.map((t, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: t.x + 5,
            top: t.y + 3,
            width: 8 - i * 1.6,
            height: 8 - i * 1.6,
            borderRadius: "50%",
            background: "rgba(138,108,247,0.9)",
            opacity: 0.22 - i * 0.06,
            filter: "blur(1px)",
            pointerEvents: "none",
          }}
        />
      ))}

      <div style={{ position: "absolute", left: x, top: y, zIndex: 50, pointerEvents: "none" }}>
        {cp !== null && (
          <>
            <Ripple progress={cp} delay={0} />
            <Ripple progress={cp} delay={0.18} />
          </>
        )}
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            transform: `scale(${pressScale}) rotate(${tiltSign * tilt}deg)`,
            transformOrigin: "4px 2px",
            filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.35))",
          }}
        >
          <path
            d="M4 2L4 20L9 15.5L12.5 22L15.5 20.5L12 14L18 14L4 2Z"
            fill="white"
            stroke="#14121f"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
};

const Ripple: React.FC<{ progress: number; delay: number }> = ({ progress, delay }) => {
  const p = Math.min(1, Math.max(0, (progress - delay) / (1 - delay)));
  if (p <= 0) return null;
  const size = interpolate(p, [0, 1], [10, 52]);
  const opacity = interpolate(p, [0, 1], [0.55, 0]);
  return (
    <div
      style={{
        position: "absolute",
        left: -size / 2 + 6,
        top: -size / 2 + 4,
        width: size,
        height: size,
        borderRadius: "50%",
        border: "2px solid rgba(138,108,247,0.9)",
        opacity,
      }}
    />
  );
};
