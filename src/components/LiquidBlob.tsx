import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random } from "remotion";

export type LiquidBlobProps = {
  colors?: [string, string, string?];
  background?: string;
  blobCount?: number;
  seed?: string;
};

/**
 * Metaball / lava-lamp effect: several blurred circles combined with an SVG
 * "goo" filter (feGaussianBlur + feColorMatrix contrast boost) so overlapping
 * circles merge into one organic liquid shape. 100% generated, no video.
 */
export const LiquidBlob: React.FC<LiquidBlobProps> = ({
  colors = ["#e0aaff", "#a855f7", "#5b21b6"],
  background = "#150c21",
  blobCount = 5,
  seed = "demotion-blob",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  const blobs = useMemo(
    () =>
      new Array(blobCount).fill(0).map((_, i) => ({
        rx: random(`${seed}-rx-${i}`),
        ry: random(`${seed}-ry-${i}`),
        rr: random(`${seed}-rr-${i}`),
        speed: 0.3 + random(`${seed}-s-${i}`) * 0.5,
        phase: random(`${seed}-p-${i}`) * Math.PI * 2,
      })),
    [blobCount, seed]
  );

  return (
    <AbsoluteFill style={{ background }}>
      <svg width={width} height={height} style={{ position: "absolute" }}>
        <defs>
          <filter id="demotion-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
              result="goo"
            />
          </filter>
          <linearGradient id="demotion-blob-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="55%" stopColor={colors[1]} />
            <stop offset="100%" stopColor={colors[2] ?? colors[1]} />
          </linearGradient>
        </defs>
        <g filter="url(#demotion-goo)">
          {blobs.map((b, i) => {
            const cx =
              width * (0.3 + b.rx * 0.4) +
              Math.sin(t * b.speed + b.phase) * width * 0.12;
            const cy =
              height * (0.3 + b.ry * 0.4) +
              Math.cos(t * b.speed * 1.2 + b.phase) * height * 0.12;
            const r = 60 + b.rr * 90;
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill="url(#demotion-blob-gradient)"
              />
            );
          })}
        </g>
      </svg>
      <AbsoluteFill
        style={{
          opacity: 0.06,
          mixBlendMode: "overlay",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
