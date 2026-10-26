import React from "react";
import { clamp01, spring } from "../core/math";
import { useShot } from "../engine/context";
import { MONO_FAMILY } from "../font";

export type TerminalLine = {
  /** Local shot beat at which the line starts. */
  at: number;
  text: string;
  /** Typing duration in beats; omitted or zero reveals the whole line. */
  type?: number;
  color?: string;
  prompt?: boolean;
};

export type TerminalProps = {
  lines: readonly TerminalLine[];
  title?: string;
  width?: number;
  height?: number;
  fontSize?: number;
};

/** Frame-deterministic terminal. Mount inside a MotionProject Shot. */
export const Terminal: React.FC<TerminalProps> = ({ lines, title = "Terminal", width = 1520, height = 640, fontSize = 32 }) => {
  const { frame, at, clock, theme } = useShot();
  const enter = spring(frame / clock.fps, 4.5, 0.62);
  const visible = lines.map((line, index) => ({ line, index, start: at(line.at) }))
    .filter(({ start }) => frame >= start);
  const active = visible.reduce<(typeof visible)[number] | undefined>((latest, item) =>
    !latest || item.start >= latest.start ? item : latest, undefined);
  return (
    <div style={{ width, height, boxSizing: "border-box", border: `2px solid ${theme.chalk}33`, borderRadius: 26,
      background: theme.ink, color: theme.chalk, fontFamily: MONO_FAMILY, fontSize, overflow: "hidden",
      transform: `translateY(${36 * (1 - enter)}px) scale(${0.94 + 0.06 * enter})`, opacity: clamp01(enter),
      boxShadow: `0 28px 70px ${theme.ink}66` }}>
      <div style={{ height: 72, padding: "0 32px", display: "flex", alignItems: "center", gap: 12, borderBottom: `2px solid ${theme.chalk}26` }}>
        {[theme.spark, theme.accent, theme.field].map((color) => <span key={color} style={{ width: 12, height: 12, borderRadius: "50%", background: color }} />)}
        <span style={{ marginLeft: 18, fontSize: 22, opacity: 0.65 }}>{title}</span>
      </div>
      <div style={{ padding: "28px 36px", lineHeight: 1.65, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
        {visible.map(({ line, index, start }) => {
          const duration = at(line.at + (line.type ?? 0)) - start;
          const chars = Array.from(line.text);
          const count = duration > 0 ? Math.floor(chars.length * clamp01((frame - start) / duration)) : chars.length;
          const caret = active?.index === index && Math.floor((frame - start) / Math.max(1, clock.framesPerBeat / 2)) % 2 === 0;
          return <div key={index} style={{ minHeight: "1.65em", color: line.color ?? theme.chalk }}>
            {line.prompt && <span style={{ color: theme.accent }}>{"$ "}</span>}{chars.slice(0, count).join("")}
            {caret && <span style={{ display: "inline-block", width: "0.6em", height: "1.05em", verticalAlign: "-0.15em", background: theme.accent }} />}
          </div>;
        })}
      </div>
    </div>
  );
};
