import React from "react";
import { useShot } from "../engine/context";
import { clamp01, spring } from "../core/math";
import { FONT_FAMILY } from "../font";
import { finite } from "./dataMotion";

export type CaptionCue = { text: string; at: number; beats: number };
export type CaptionTrackProps = {
  cues: readonly CaptionCue[];
  fontSize?: number;
  bottom?: number;
  maxWidth?: number;
  color?: string;
  background?: string;
};

/** Authored captions, not speech recognition. Intervals are [at, at + beats). */
export const CaptionTrack: React.FC<CaptionTrackProps> = ({ cues, fontSize = 52, bottom = 96, maxWidth = 1400, color, background }) => {
  const shot = useShot();
  let previousEnd = -Infinity;
  for (const cue of cues) {
    finite(cue.at, "Caption at"); finite(cue.beats, "Caption beats");
    if (cue.beats <= 0 || cue.at < previousEnd - 1e-9) throw new Error("Caption cues must be ordered, non-overlapping and have positive duration");
    previousEnd = cue.at + cue.beats;
  }
  const cue = cues.find(c => shot.frame >= shot.at(c.at) && shot.frame < shot.at(c.at + c.beats));
  if (!cue) return null;
  const enter = spring((shot.frame - shot.at(cue.at)) / shot.clock.fps, 5, 0.65);
  return <div style={{ position: "absolute", left: 72, right: 72, bottom, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
    <div style={{ maxWidth, padding: "20px 34px", borderRadius: 16, background: background ?? shot.theme.ink, color: color ?? shot.theme.chalk, fontFamily: FONT_FAMILY, fontSize, fontWeight: 700, lineHeight: 1.25, textAlign: "center", whiteSpace: "pre-wrap", overflowWrap: "anywhere", opacity: clamp01(enter), transform: `translateY(${20 * (1 - enter)}px)` }}>{cue.text}</div>
  </div>;
};
