import React from "react";
import { useShot } from "../engine/context";
import { clamp01, spring } from "../core/math";
import { FONT_FAMILY, LABEL_FAMILY } from "../font";
import { chartDomain, easedValue, finite, formatMetric } from "./dataMotion";

export type BarDatum = { label: string; value: number; color?: string };
export type BarChartProps = {
  data: readonly BarDatum[];
  at?: number;
  over?: number;
  stagger?: number;
  max?: number;
  width?: number;
  rowHeight?: number;
  decimals?: number;
  suffix?: string;
};

/** Horizontal bars share one zero baseline, including signed values. No randomized data. */
export const BarChart: React.FC<BarChartProps> = ({ data, at = 0, over = 1.5, stagger = 0.18, max, width = 1000, rowHeight = 94, decimals = 0, suffix = "" }) => {
  const shot = useShot();
  [at, over, stagger, width, rowHeight].forEach(v => finite(v, "BarChart input"));
  if (over < 0 || stagger < 0 || width <= 0 || rowHeight <= 0) throw new Error("BarChart timing must be non-negative and dimensions positive");
  const [low, high] = chartDomain(data.map(d => d.value), max);
  const zero = -low / (high - low) * 100;
  return <div role="img" aria-label={data.map(d => `${d.label}: ${formatMetric(d.value, decimals)}${suffix}`).join("; ")} style={{ width, fontFamily: FONT_FAMILY, color: shot.theme.chalk }}>
    {data.map((d, i) => {
      const beat = at + i * stagger;
      const start = shot.at(beat);
      const enter = spring((shot.frame - start) / shot.clock.fps, 4.5, 0.6);
      const v = easedValue(shot.frame, start, shot.at(beat + over), 0, d.value);
      const edge = (v - low) / (high - low) * 100;
      return <div key={i} style={{ height: rowHeight, display: "grid", gridTemplateColumns: "180px 1fr 115px", gap: 24, alignItems: "center", opacity: clamp01(enter), transform: `translateY(${24 * (1 - enter)}px)` }}>
        <span style={{ fontSize: 26, fontFamily: LABEL_FAMILY, overflowWrap: "anywhere" }}>{d.label}</span>
        <div style={{ position: "relative", height: 34, background: `${shot.theme.chalk}12`, borderRadius: 6 }}>
          <div style={{ position: "absolute", left: `${zero}%`, top: -8, bottom: -8, width: 2, background: `${shot.theme.chalk}55` }} />
          <div style={{ position: "absolute", left: `${Math.min(zero, edge)}%`, width: `${Math.abs(edge - zero)}%`, height: "100%", borderRadius: 6, background: d.color ?? shot.theme.accent }} />
        </div>
        <span style={{ fontSize: 27, fontVariantNumeric: "tabular-nums", textAlign: "right" }}>{formatMetric(v, decimals)}{suffix}</span>
      </div>;
    })}
  </div>;
};
