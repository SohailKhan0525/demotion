import React from "react";
import { clamp01, outExpo, spring } from "../core/math";
import { useShot } from "../engine/context";
import { MONO_FAMILY } from "../font";

export type CodePanelToken = { text: string; color?: string };
export type CodePanelLine = string | readonly CodePanelToken[];
export type CodePanelProps = {
  file: string;
  lines: readonly CodePanelLine[];
  /** Local shot beats: start and total reveal duration. */
  at?: number;
  over?: number;
  colors?: { background?: string; text?: string; accent?: string };
  width?: number;
  height?: number;
  fontSize?: number;
};

/** Staggered code reveal; tokens preserve the exact source text, including indentation. */
export const CodePanel: React.FC<CodePanelProps> = ({ file, lines, at: startBeat = 0, over = 2.6, colors = {}, width = 1520, height = 780, fontSize = 28 }) => {
  const { frame, at, clock, theme } = useShot();
  const text = colors.text ?? theme.chalk, accent = colors.accent ?? theme.accent;
  const starts = lines.map((_, i) => at(startBeat + Math.max(0, over) * i / Math.max(1, lines.length - 1)));
  const active = starts.reduce((last, start, i) => frame >= start ? i : last, -1);
  const enter = spring((frame - at(startBeat)) / clock.fps, 4.5, 0.62);
  return <div style={{ width, height, boxSizing: "border-box", background: colors.background ?? theme.ink,
    color: text, fontFamily: MONO_FAMILY, borderRadius: 26, overflow: "hidden", border: `2px solid ${theme.chalk}33`,
    opacity: clamp01(enter), transform: `scale(${0.96 + 0.04 * enter})`, boxShadow: `0 28px 70px ${theme.ink}66` }}>
    <div style={{ height: 72, display: "flex", alignItems: "center", padding: "0 36px", borderBottom: `2px solid ${theme.chalk}26`, fontSize: 22 }}>{file}</div>
    <div style={{ padding: "22px 24px", fontSize, lineHeight: 1.5 }}>
      {lines.map((line, i) => {
        const seconds = (frame - starts[i]) / clock.fps;
        const p = outExpo(clamp01(seconds / clock.seconds(0.5)));
        const settle = spring(seconds, 4.5, 0.62);
        return <div key={i} style={{ display: "flex", whiteSpace: "pre", opacity: frame < starts[i] ? 0 : p,
          transform: `translateX(${24 * (1 - settle)}px)`, borderLeft: `3px solid ${i === active ? accent : "transparent"}`,
          background: i === active ? `${theme.chalk}0D` : "transparent" }}>
          <span style={{ width: 58, flexShrink: 0, textAlign: "right", paddingRight: 24, opacity: 0.35, userSelect: "none" }}>{i + 1}</span>
          <span>{typeof line === "string" ? line : line.map((token, j) => <span key={j} style={{ color: token.color ?? text }}>{token.text}</span>)}</span>
        </div>;
      })}
    </div>
  </div>;
};
