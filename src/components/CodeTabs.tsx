import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { FONT_FAMILY } from "../font";

export type CodeToken = { text: string; color?: string };
export type CodeLine = CodeToken[];

export type CodeTabsProps = {
  tabs: { label: string; glyph: string; accent: string }[];
  activeIndex: number;
  lines: CodeLine[];
  fileName?: string;
};

const MONO = '"SF Mono", "JetBrains Mono", ui-monospace, Menlo, monospace';

export const CodeTabs: React.FC<CodeTabsProps> = ({ tabs, activeIndex, lines, fileName = "hero.tsx" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18, mass: 0.6 } });
  const panelOpacity = interpolate(enter, [0, 1], [0, 1]);

  return (
    <div
      style={{
        width: 640,
        borderRadius: 16,
        overflow: "hidden",
        background: "#0b0b10",
        border: "1px solid #24242c",
        boxShadow: "0 40px 80px -30px rgba(0,0,0,0.6)",
        opacity: panelOpacity,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "10px 14px",
          borderBottom: "1px solid #1e1e26",
        }}
      >
        {tabs.map((tab, i) => {
          const active = i === activeIndex;
          return (
            <div
              key={tab.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 10px",
                borderRadius: 7,
                background: active ? "#1a1a22" : "transparent",
                color: active ? "#f0f0f5" : "#63636e",
                fontFamily: FONT_FAMILY,
                fontSize: 11.5,
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  background: active ? tab.accent : "#2a2a32",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: 800,
                }}
              >
                {tab.glyph}
              </span>
              {tab.label}
            </div>
          );
        })}
        <div style={{ flex: 1 }} />
        <span style={{ color: "#4a4a54", fontFamily: FONT_FAMILY, fontSize: 11 }}>{fileName}</span>
      </div>

      <div style={{ padding: "16px 18px", minHeight: 190 }}>
        {lines.map((line, li) => {
          const lineDelay = li * 2;
          const lineEnter = spring({
            frame: frame - lineDelay,
            fps,
            config: { damping: 20, mass: 0.4 },
          });
          const lineOpacity = interpolate(lineEnter, [0, 1], [0, 1]);
          const lineX = interpolate(lineEnter, [0, 1], [-6, 0]);
          return (
            <div
              key={li}
              style={{
                fontFamily: MONO,
                fontSize: 13.5,
                lineHeight: 1.8,
                opacity: lineOpacity,
                transform: `translateX(${lineX}px)`,
                whiteSpace: "pre",
              }}
            >
              <span style={{ color: "#3a3a44", marginRight: 14, userSelect: "none" }}>
                {String(li + 1).padStart(2, "0")}
              </span>
              {line.map((tok, ti) => (
                <span key={ti} style={{ color: tok.color ?? "#d4d4dc" }}>
                  {tok.text}
                </span>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
