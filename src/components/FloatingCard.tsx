import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { FONT_FAMILY } from "../font";

export type FloatingCardProps = {
  x: number;
  y: number;
  width?: number;
  rotate?: number;
  delay?: number;
  children: React.ReactNode;
};

export const FloatingCard: React.FC<FloatingCardProps> = ({
  x,
  y,
  width = 280,
  rotate = 0,
  delay = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 16, mass: 0.6, stiffness: 110 } });
  const translateY = interpolate(enter, [0, 1], [24, 0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const idle = Math.sin((frame / fps) * 0.8 + x) * 3;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        opacity,
        transform: `translateY(${translateY + idle}px) rotate(${rotate}deg)`,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.6)",
        boxShadow: "0 30px 60px -20px rgba(60,30,100,0.35), 0 4px 16px rgba(60,30,100,0.12)",
        padding: 18,
      }}
    >
      {children}
    </div>
  );
};

export type ScoreBadgeProps = {
  label: string;
  score: number;
  maxScore?: number;
  color?: string;
  delay?: number;
};

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  label,
  score,
  maxScore = 100,
  color = "#c026d3",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 20, mass: 0.5 } });
  const shownScore = Math.round(interpolate(enter, [0, 1], [0, score]));
  const barWidth = interpolate(enter, [0, 1], [0, (score / maxScore) * 100]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: FONT_FAMILY }}>
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${color}, #7c3aed)`,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: "#6b6b76", fontWeight: 600, marginBottom: 4 }}>{label}</div>
        <div style={{ height: 5, borderRadius: 3, background: "#ece9f5", overflow: "hidden" }}>
          <div
            style={{
              width: `${barWidth}%`,
              height: "100%",
              borderRadius: 3,
              background: `linear-gradient(90deg, ${color}, #7c3aed)`,
            }}
          />
        </div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#1a1a1f", whiteSpace: "nowrap" }}>
        {shownScore}/{maxScore}
      </div>
    </div>
  );
};
