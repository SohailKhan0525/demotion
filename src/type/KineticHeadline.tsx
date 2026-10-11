import React from "react";
import { AbsoluteFill } from "remotion";
import { measureText } from "@remotion/layout-utils";
import { useShot } from "../engine/context";
import { clamp, clamp01, outExpo, spring } from "../core/math";
import { archivo, FONT_FAMILY } from "../font";

/**
 * Letters fall from above with a real damped spring: stretch on the way down, squash on landing, a little
 * rotation that settles, then a shockwave ring when the last letter lands and an underline that snaps out.
 * `at` is in beats of the current <Shot> (negative = already in motion when the shot lands).
 */
export const KineticHeadline: React.FC<{
  text: string;
  /** beat (within the shot) when the FIRST letter starts to fall */
  at?: number;
  /** target width in px; the font size is fitted to it */
  width?: number;
  /** Archivo width axis 62..125 */
  wdth?: number;
  color: string;
  accent: string;
  accentIndex?: number;
  stagger?: number;
  underline?: boolean;
}> = ({ text, at = -0.15, width = 1500, wdth = 112, color, accent, accentIndex = -1, stagger = 2.6, underline = true }) => {
  const { frame, at: atBeat, clock } = useShot();
  const fps = clock.fps;
  const vs = archivo(wdth, 900);
  const natural = measureText({ text, fontFamily: "Archivo", fontSize: 200, fontWeight: "900", additionalStyles: { fontVariationSettings: vs } }).width;
  const size = (200 * width) / natural;
  const letters = text.split("");
  const start = atBeat(at);
  const lastLand = start + (letters.length - 1) * stagger + 0.22 * fps;

  const ring = outExpo(clamp01((frame - lastLand) / (0.55 * fps)));
  const ul = spring((frame - (lastLand + 2)) / fps, 6, 0.6);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      {ring > 0 && ring < 1 && (
        <div style={{ position: "absolute", width: 300 + ring * 1900, height: 300 + ring * 1900, borderRadius: "50%", border: `${Math.max(1, 14 * (1 - ring))}px solid ${accent}`, opacity: (1 - ring) * 0.8 }} />
      )}
      <div style={{ display: "flex", fontFamily: FONT_FAMILY, fontWeight: 900, fontVariationSettings: vs, fontSize: size, lineHeight: 1, color }}>
        {letters.map((ch, i) => {
          const t = (frame - (start + i * stagger)) / fps;
          const p = spring(t, 5.2, 0.42); // < 1 zeta: bounces
          const pAhead = spring(t + 1 / 60, 5.2, 0.42);
          const vel = (pAhead - p) * 60; // position units per second
          const fall = (1 - p) * -size * 1.15;
          const stretch = 1 + clamp(Math.abs(vel) * 0.05, 0, 0.35);
          const squash = p > 1 ? 1 - clamp((p - 1) * 2.2, 0, 0.18) : 1;
          const rot = (1 - p) * (i % 2 ? -16 : 16);
          return (
            <span key={i} style={{ display: "inline-block", color: i === accentIndex ? accent : color, transform: `translateY(${fall}px) rotate(${rot}deg) scale(${squash > 0.99 ? 1 / stretch ** 0.5 : 1 + (1 - squash)}, ${squash > 0.99 ? stretch : squash})`, transformOrigin: "50% 100%", opacity: t > 0 ? 1 : 0 }}>
              {ch === " " ? "\u00A0" : ch}
            </span>
          );
        })}
      </div>
      {underline && <div style={{ marginTop: size * 0.05, height: size * 0.07, width: width * 0.58 * clamp(ul, 0, 1.08), background: accent, borderRadius: 99 }} />}
    </AbsoluteFill>
  );
};
