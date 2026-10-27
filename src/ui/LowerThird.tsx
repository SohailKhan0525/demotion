import React from "react";
import { useShot } from "../engine/context";
import { clamp01, outExpo, spring } from "../core/math";
import { FONT_FAMILY, LABEL_FAMILY } from "../font";
import { finite } from "./dataMotion";

export type LowerThirdProps = {
  title: string;
  subtitle?: string;
  at?: number;
  beats?: number;
  left?: number;
  bottom?: number;
  width?: number;
};

/** A timed name/title card with staggered title and subtitle, then a beat-timed exit. */
export const LowerThird: React.FC<LowerThirdProps> = ({ title, subtitle, at = 0, beats = 6, left = 100, bottom = 120, width = 760 }) => {
  const shot = useShot();
  finite(at, "LowerThird at"); finite(beats, "LowerThird beats");
  if (beats <= 0) throw new Error("LowerThird beats must be positive");
  const start = shot.at(at), end = shot.at(at + beats);
  if (shot.frame < start || shot.frame >= end) return null;
  const enter = spring((shot.frame - start) / shot.clock.fps, 4.5, 0.6);
  const exitFrames = Math.max(1, Math.min(end - start, shot.clock.duration(0.35)));
  const exit = outExpo(clamp01((shot.frame - (end - exitFrames)) / exitFrames));
  const detail = spring((shot.frame - shot.at(at + 0.18)) / shot.clock.fps, 4.5, 0.6);
  return <div style={{ position: "absolute", left, bottom, width, boxSizing: "border-box", padding: "28px 34px", borderLeft: `9px solid ${shot.theme.accent}`, borderRadius: "0 18px 18px 0", background: shot.theme.ink, color: shot.theme.chalk, opacity: clamp01(enter) * (1 - exit), transform: `translateX(${(1 - enter) * -70 + exit * -50}px)` }}>
    <div style={{ fontFamily: FONT_FAMILY, fontSize: 48, fontWeight: 800, overflowWrap: "anywhere" }}>{title}</div>
    {subtitle && <div style={{ fontFamily: LABEL_FAMILY, fontSize: 28, marginTop: 10, opacity: clamp01(detail), transform: `translateY(${12 * (1 - detail)}px)` }}>{subtitle}</div>}
  </div>;
};
