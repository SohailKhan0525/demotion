import React from "react";
import { useShot } from "../engine/context";
import { clamp01, spring } from "../core/math";
import { FONT_FAMILY } from "../font";
import { easedValue, finite } from "./dataMotion";

export type ProgressRingProps = { value: number; at?: number; over?: number; size?: number; strokeWidth?: number; label?: string; color?: string };

/** A 0..1 progress value, bounded even during the spring entrance. */
export const ProgressRing: React.FC<ProgressRingProps> = ({ value, at = 0, over = 2, size = 300, strokeWidth = 18, label, color }) => {
  const shot = useShot();
  [value, at, over, size, strokeWidth].forEach(v => finite(v, "ProgressRing input"));
  if (over < 0 || size <= 0 || strokeWidth <= 0 || strokeWidth >= size) throw new Error("ProgressRing requires non-negative timing and 0 < strokeWidth < size");
  const start = shot.at(at);
  const enter = spring((shot.frame - start) / shot.clock.fps, 4, 0.6);
  const progress = easedValue(shot.frame, start, shot.at(at + over), 0, clamp01(value));
  const r = (size - strokeWidth) / 2, circumference = 2 * Math.PI * r;
  return <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-label={label} style={{ position: "relative", width: size, height: size, color: shot.theme.chalk, opacity: clamp01(enter), transform: `scale(${0.85 + enter * 0.15})`, fontFamily: FONT_FAMILY }}>
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`${shot.theme.chalk}22`} strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color ?? shot.theme.accent} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)} />
    </svg>
    <div style={{ position: "absolute", inset: strokeWidth * 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div style={{ fontSize: size * 0.21, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{Math.round(progress * 100)}%</div>
      {label && <div style={{ fontSize: size * 0.065, marginTop: 8 }}>{label}</div>}
    </div>
  </div>;
};
