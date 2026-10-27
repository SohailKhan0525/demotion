import React from "react";
import { useShot } from "../engine/context";
import { clamp01, spring } from "../core/math";
import { FONT_FAMILY } from "../font";
import { easedValue, finite, formatMetric } from "./dataMotion";

export type CountUpProps = {
  value: number;
  from?: number;
  at?: number;
  over?: number;
  decimals?: number;
  locale?: string;
  prefix?: string;
  suffix?: string;
  label?: string;
  fontSize?: number;
  color?: string;
  style?: React.CSSProperties;
};

/** A bounded numeric count with a spring entrance. All timing is in local shot beats. */
export const CountUp: React.FC<CountUpProps> = ({ value, from = 0, at = 0, over = 2, decimals = 0, locale = "en-US", prefix = "", suffix = "", label, fontSize = 144, color, style }) => {
  const shot = useShot();
  [value, from, at, over].forEach(v => finite(v, "CountUp input"));
  if (over < 0) throw new Error("CountUp over must be non-negative");
  const start = shot.at(at);
  const enter = spring((shot.frame - start) / shot.clock.fps, 4, 0.6);
  const current = easedValue(shot.frame, start, shot.at(at + over), from, value);
  return <div style={{ fontFamily: FONT_FAMILY, color: color ?? shot.theme.chalk, opacity: clamp01(enter), transform: `translateY(${28 * (1 - enter)}px)`, ...style }}>
    <div style={{ fontSize, fontWeight: 800, lineHeight: 1.05, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.05em" }}>{prefix}{formatMetric(current, decimals, locale)}{suffix}</div>
    {label && <div style={{ fontSize: fontSize * 0.2, marginTop: 18, letterSpacing: 0 }}>{label}</div>}
  </div>;
};
