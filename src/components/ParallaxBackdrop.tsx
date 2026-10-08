import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random } from "remotion";
import { CloudGradient } from "./CloudGradient";

export type ParallaxBackdropProps = {
  dark?: boolean;
  seed?: string;
};

/**
 * Three depth layers moving at different speeds (classic parallax), with
 * the far layer blurred more than the near layer -- a cheap but real
 * depth-of-field cue: things further from the "camera" are softer.
 */
export const ParallaxBackdrop: React.FC<ParallaxBackdropProps> = ({ dark = false, seed = "parallax" }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = frame / fps;

  const farShapes = new Array(3).fill(0).map((_, i) => ({
    x: width * (0.15 + 0.35 * i) + Math.sin(t * 0.06 + i) * 40,
    y: height * (0.2 + 0.25 * random(`${seed}-fy-${i}`)),
    size: 220 + random(`${seed}-fs-${i}`) * 140,
  }));
  const nearShapes = new Array(2).fill(0).map((_, i) => ({
    x: width * (0.3 + 0.45 * i) + Math.sin(t * 0.18 + i * 2) * 90,
    y: height * (0.55 + 0.2 * random(`${seed}-ny-${i}`)),
    size: 90 + random(`${seed}-ns-${i}`) * 60,
  }));

  return (
    <AbsoluteFill style={{ background: dark ? "#08070c" : "#eef0ff", overflow: "hidden" }}>
      <CloudGradient
        intensity={dark ? 0.3 : 0.85}
        speed={0.4}
        colors={dark ? ["#0d0b16", "#231b3d", "#3c2f66", "#1a1428"] : undefined}
      />
      {/* far layer: slow drift, heavily blurred (out of focus / distant) */}
      <AbsoluteFill style={{ filter: "blur(30px)", opacity: dark ? 0.5 : 0.35 }}>
        {farShapes.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x - s.size / 2,
              top: s.y - s.size / 2,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: dark
                ? "radial-gradient(circle, #6f8cf9, transparent 70%)"
                : "radial-gradient(circle, #a78bfa, transparent 70%)",
            }}
          />
        ))}
      </AbsoluteFill>
      {/* near layer: faster drift, lighter blur (closer to camera) */}
      <AbsoluteFill style={{ filter: "blur(8px)", opacity: dark ? 0.4 : 0.28 }}>
        {nearShapes.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x - s.size / 2,
              top: s.y - s.size / 2,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: dark
                ? "radial-gradient(circle, #c9b8fb, transparent 70%)"
                : "radial-gradient(circle, #6f8cf9, transparent 70%)",
            }}
          />
        ))}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.28) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
