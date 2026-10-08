import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export type LineDrawProps = {
  width: number;
  color?: string;
  strokeWidth?: number;
  startAt?: number;
};

export const LineDraw: React.FC<LineDrawProps> = ({ width, color = "#a21caf", strokeWidth = 4, startAt = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - startAt, fps, config: { damping: 200 }, durationInFrames: 20 });
  const dash = interpolate(progress, [0, 1], [width, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <svg width={width} height={strokeWidth + 4} style={{ overflow: "visible" }}>
      <line
        x1={0}
        y1={strokeWidth / 2 + 2}
        x2={width}
        y2={strokeWidth / 2 + 2}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={width}
        strokeDashoffset={dash}
      />
    </svg>
  );
};

export type HighlightCircleProps = {
  size?: number;
  color?: string;
  startAt?: number;
};

export const HighlightCircle: React.FC<HighlightCircleProps> = ({
  size = 160,
  color = "#a21caf",
  startAt = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - startAt, fps, config: { damping: 200 }, durationInFrames: 22 });
  const circumference = Math.PI * size * 1.15;
  const dash = interpolate(progress, [0, 1], [circumference, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg
      width={size * 1.3}
      height={size * 0.7}
      viewBox={`0 0 ${size * 1.3} ${size * 0.7}`}
      style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", overflow: "visible" }}
    >
      <ellipse
        cx={(size * 1.3) / 2}
        cy={(size * 0.7) / 2}
        rx={(size * 1.3) / 2 - 4}
        ry={(size * 0.7) / 2 - 4}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dash}
        transform={`rotate(-4 ${(size * 1.3) / 2} ${(size * 0.7) / 2})`}
      />
    </svg>
  );
};
