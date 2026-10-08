import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

export type BlobSpec = {
  color: string;
  x: number; // 0..1 of width
  y: number; // 0..1 of height
  size: number; // px (diameter)
  drift?: number; // px amplitude
  phase?: number;
  stretch?: number; // x-scale for comet-like ellipses
  rotate?: number;
  opacity?: number;
};

export const PRESETS: Record<string, { base: string; blobs: BlobSpec[]; blur: number }> = {
  darkPlain: {
    base: "#08070f",
    blur: 90,
    blobs: [{ color: "#5b21b6", x: 0.3, y: 1.05, size: 700, drift: 40, opacity: 0.45 }],
  },
  darkPeach: {
    base: "#08070f",
    blur: 80,
    blobs: [
      { color: "#fb923c", x: 0.35, y: 0.78, size: 520, drift: 30, stretch: 2.2, opacity: 0.55 },
      { color: "#a21caf", x: 0.6, y: 0.9, size: 520, drift: 40, stretch: 1.8, opacity: 0.45 },
    ],
  },
  darkPink: {
    base: "#07060c",
    blur: 70,
    blobs: [
      { color: "#ec4899", x: 0.3, y: 0.62, size: 560, drift: 60, stretch: 2.6, rotate: -24, opacity: 0.85, phase: 1 },
      { color: "#7c3aed", x: 0.52, y: 0.7, size: 520, drift: 50, stretch: 2, rotate: -20, opacity: 0.6, phase: 2 },
    ],
  },
  lightPink: {
    base: "#f7f6fa",
    blur: 70,
    blobs: [
      { color: "#f9a8d4", x: 0.85, y: 0.12, size: 900, drift: 50, stretch: 1.6, rotate: -30, opacity: 0.75 },
      { color: "#c4b5fd", x: 0.7, y: 0.05, size: 620, drift: 40, opacity: 0.5, phase: 2 },
    ],
  },
  lightBlue: {
    base: "#ffffff",
    blur: 80,
    blobs: [
      { color: "#818cf8", x: 0.45, y: 0.55, size: 760, drift: 60, opacity: 0.75 },
      { color: "#c026d3", x: 0.6, y: 0.62, size: 640, drift: 70, opacity: 0.6, phase: 1.5 },
      { color: "#60a5fa", x: 0.32, y: 0.7, size: 560, drift: 50, opacity: 0.6, phase: 3 },
    ],
  },
  warm: {
    base: "#fbf7fb",
    blur: 80,
    blobs: [
      { color: "#fb923c", x: 0.12, y: 0.98, size: 760, drift: 50, opacity: 0.8 },
      { color: "#d946ef", x: 0.42, y: 1.0, size: 820, drift: 60, opacity: 0.75, phase: 1.5 },
      { color: "#6366f1", x: 0.85, y: 0.95, size: 700, drift: 60, opacity: 0.7, phase: 3 },
      { color: "#f9a8d4", x: 0.6, y: 0.2, size: 620, drift: 50, opacity: 0.5, phase: 2 },
    ],
  },
  vivid: {
    base: "#fdf2ff",
    blur: 90,
    blobs: [
      { color: "#f472b6", x: 0.25, y: 0.4, size: 820, drift: 90, opacity: 0.85 },
      { color: "#fdba74", x: 0.75, y: 0.25, size: 720, drift: 80, opacity: 0.7, phase: 2 },
      { color: "#a855f7", x: 0.55, y: 0.75, size: 860, drift: 90, opacity: 0.85, phase: 4 },
      { color: "#60a5fa", x: 0.15, y: 0.85, size: 660, drift: 80, opacity: 0.7, phase: 5.5 },
    ],
  },
};

export const Blobs: React.FC<{
  preset: keyof typeof PRESETS;
  speed?: number;
  intensity?: number;
  grain?: boolean;
}> = ({ preset, speed = 1, intensity = 1, grain = true }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = (frame / fps) * speed;
  const p = PRESETS[preset];

  return (
    <AbsoluteFill style={{ background: p.base, overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: `blur(${p.blur}px)` }}>
        {p.blobs.map((b, i) => {
          const ph = b.phase ?? i;
          const dx = Math.sin(t * 0.55 + ph) * (b.drift ?? 40);
          const dy = Math.cos(t * 0.42 + ph * 1.3) * (b.drift ?? 40) * 0.7;
          const sx = b.stretch ?? 1;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: b.x * width + dx - b.size / 2,
                top: b.y * height + dy - b.size / 2,
                width: b.size,
                height: b.size,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${b.color} 0%, ${b.color}00 68%)`,
                opacity: (b.opacity ?? 0.7) * intensity,
                transform: `rotate(${b.rotate ?? 0}deg) scaleX(${sx})`,
              }}
            />
          );
        })}
      </AbsoluteFill>
      {grain && (
        <AbsoluteFill
          style={{
            opacity: 0.06,
            mixBlendMode: "overlay",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
