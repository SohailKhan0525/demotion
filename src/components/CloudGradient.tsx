import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { noise3D } from "@remotion/noise";

export type CloudGradientProps = {
  speed?: number;
  colors?: string[];
  intensity?: number;
  seed?: string;
  grain?: boolean;
};

const GRID_W = 48;
const GRID_H = 27;

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const sampleGradient = (
  stops: [number, number, number][],
  t: number
): [number, number, number] => {
  const clamped = Math.min(1, Math.max(0, t));
  const scaled = clamped * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(scaled));
  const localT = scaled - i;
  const a = stops[i];
  const b = stops[i + 1];
  return [lerp(a[0], b[0], localT), lerp(a[1], b[1], localT), lerp(a[2], b[2], localT)];
};

/**
 * A soft, flowing "liquid marble" background built from simplex noise
 * (via @remotion/noise, which wraps simplex-noise) sampled on a coarse grid
 * and rendered to a small canvas, then upscaled with the browser's own
 * bilinear smoothing -- producing an organic mesh-gradient look closer to a
 * real fragment shader than CSS radial-gradient blobs, at a fraction of the
 * per-pixel cost of a full WebGL pass.
 */
export const CloudGradient: React.FC<CloudGradientProps> = ({
  speed = 1,
  colors = ["#eef0ff", "#c9b8fb", "#8f7af5", "#6f8cf9", "#fbfaff"],
  intensity = 1,
  seed = "demotion-cloud",
  grain = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stops = colors.map(hexToRgb);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const t = (frame / fps) * speed;
    const img = ctx.createImageData(GRID_W, GRID_H);

    for (let y = 0; y < GRID_H; y++) {
      for (let x = 0; x < GRID_W; x++) {
        const nx = x / GRID_W;
        const ny = y / GRID_H;
        const n1 = noise3D(seed, nx * 2.2, ny * 2.2, t * 0.35);
        const n2 = noise3D(`${seed}-b`, nx * 4 + 5, ny * 4 + 5, t * 0.5);
        const v = (n1 * 0.7 + n2 * 0.3 + 1) / 2; // 0..1
        const [r, g, b] = sampleGradient(stops, v);
        const idx = (y * GRID_W + x) * 4;
        img.data[idx] = r;
        img.data[idx + 1] = g;
        img.data[idx + 2] = b;
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame, fps, speed, seed, JSON.stringify(colors)]);

  return (
    <AbsoluteFill style={{ backgroundColor: colors[0], overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        width={GRID_W}
        height={GRID_H}
        style={{
          width: "112%",
          height: "112%",
          left: "-6%",
          top: "-6%",
          position: "absolute",
          filter: "blur(6px)",
          opacity: intensity,
        }}
      />
      {grain && (
        <AbsoluteFill
          style={{
            opacity: 0.05,
            mixBlendMode: "overlay",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      )}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 25%, rgba(255,255,255,0.35), rgba(255,255,255,0) 55%)",
        }}
      />
    </AbsoluteFill>
  );
};
