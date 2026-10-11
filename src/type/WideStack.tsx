import React from "react";
import { AbsoluteFill } from "remotion";
import { measureText } from "@remotion/layout-utils";
import { useVideoConfig } from "remotion";
import { useShot } from "../engine/context";
import { clamp01, outExpo, spring } from "../core/math";
import { archivo, FONT_FAMILY, LABEL_FAMILY } from "../font";

/**
 * One word, stacked at different widths of Archivo's variable width axis, every row fitted to the same
 * column. Rows slam in from alternating sides with overshoot, then keep drifting in opposite directions.
 */
export const WideStack: React.FC<{
  text: string;
  widths?: number[];
  width?: number;
  color: string;
  accent: string;
  at?: number;
}> = ({ text, widths = [62, 100, 125], width = 1380, color, accent, at = -0.1 }) => {
  const { frame, at: atBeat, clock } = useShot();
  const fps = clock.fps;
  const { height } = useVideoConfig();
  const raw = widths.map((w) => {
    const vs = archivo(w, 900);
    const nat = measureText({ text, fontFamily: "Archivo", fontSize: 200, fontWeight: "900", additionalStyles: { fontVariationSettings: vs } }).width;
    return { w, vs, size: (200 * width) / nat };
  });
  // all rows share one column width; if the stack would be taller than the frame, shrink the column to fit
  const stackH = raw.reduce((a, r) => a + r.size * 0.86, 0);
  const k = Math.min(1, (height * 0.74) / stackH);
  const rows = raw.map((r) => ({ ...r, size: r.size * k }));
  const start = atBeat(at);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
        {rows.map((r, i) => {
          const t = (frame - (start + i * 3)) / fps;
          const p = spring(t, 4.4, 0.5);
          const dir = i % 2 ? 1 : -1;
          const slam = (1 - p) * dir * 1900;
          const drift = dir * clamp01(t) * (frame - start) * 0.9;
          const outlined = i === 0;
          return (
            <div key={i} style={{ position: "relative", transform: `translateX(${slam + drift}px)` }}>
              <div style={{ fontFamily: FONT_FAMILY, fontWeight: 900, fontVariationSettings: r.vs, fontSize: r.size, lineHeight: 0.86, whiteSpace: "nowrap", color: outlined ? "transparent" : i === 1 ? color : accent, WebkitTextStroke: outlined ? `4px ${color}` : "0" }}>
                {text}
              </div>
              <div style={{ position: "absolute", right: -10, top: "50%", transform: "translate(100%, -50%)", fontFamily: LABEL_FAMILY, fontWeight: 600, fontSize: 24, letterSpacing: 2, color, opacity: outExpo(clamp01((t - 0.15) / 0.3)) * 0.7 }}>
                {`WDTH ${r.w}`}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
