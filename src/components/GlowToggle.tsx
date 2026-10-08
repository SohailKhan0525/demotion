import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { FONT_FAMILY } from "../font";

export type GlowToggleProps = {
  label?: string;
  sublabel?: string;
  color?: string;
};

export const GlowToggle: React.FC<GlowToggleProps> = ({
  label = "NIGHT MODE",
  sublabel = "Click to toggle Hex / HSL mode",
  color = "#8a6cf7",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 14, mass: 0.7, stiffness: 120 } });
  const pulse = 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 1.2);
  const spin = (frame / fps) * 30;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        background:
          "radial-gradient(circle at 50% 45%, #14101f 0%, #08070c 70%)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 140,
          height: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${interpolate(enter, [0, 1], [0.5, 1])})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `1px solid ${color}33`,
            transform: `rotate(${spin}deg)`,
          }}
        />
        <div
          style={{
            width: 92,
            height: 92,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 28%, #ffffff, ${color} 50%, #1c1530 100%)`,
            boxShadow: `0 0 ${44 + pulse * 34}px ${12 + pulse * 12}px ${color}4d, inset -6px -6px 16px rgba(0,0,0,0.35)`,
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: 4,
            color: "#f3f1fb",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 500,
            fontSize: 13,
            color: "rgba(255,255,255,0.4)",
          }}
        >
          {sublabel}
        </div>
      </div>
    </div>
  );
};
