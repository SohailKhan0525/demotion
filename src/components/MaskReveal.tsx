import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export type MaskRevealProps = {
  children: React.ReactNode;
  /** "iris" grows a circle from the center; "wipe" sweeps a soft-edged line left-to-right */
  kind?: "iris" | "wipe";
  startAt?: number;
  durationInFrames?: number;
};

export const MaskReveal: React.FC<MaskRevealProps> = ({
  children,
  kind = "wipe",
  startAt = 0,
  durationInFrames = 26,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const progress = spring({
    frame: frame - startAt,
    fps,
    durationInFrames,
    config: { damping: 200 },
  });
  const p = interpolate(progress, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const maskImage =
    kind === "iris"
      ? `radial-gradient(circle at 50% 50%, black ${p * 75}%, transparent ${p * 75 + 18}%)`
      : `linear-gradient(90deg, black ${p * 130 - 30}%, transparent ${p * 130}%)`;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        WebkitMaskImage: maskImage,
        maskImage,
        WebkitMaskSize: `${width}px ${height}px`,
        maskSize: `${width}px ${height}px`,
      }}
    >
      {children}
    </div>
  );
};
