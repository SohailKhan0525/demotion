import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { FONT_FAMILY } from "../font";
import { useMotionBlur } from "../utils/useMotionBlur";

export type CardFanItem = {
  gradient: string;
  label: string;
  icon?: React.ReactNode;
};

export type CardFanProps = {
  items: CardFanItem[];
  openAt?: number;
  selectAt?: number; // frame at which one card "gets picked" (scale + ring)
  selectIndex?: number;
  spread?: number;
  rotateStep?: number;
};

export const CardFan: React.FC<CardFanProps> = ({
  items,
  openAt = 0,
  selectAt,
  selectIndex = 0,
  spread = 76,
  rotateStep = 9,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - openAt,
    fps,
    config: { damping: 13, mass: 0.6, stiffness: 100 },
  });

  const selectProgress =
    selectAt !== undefined
      ? spring({ frame: frame - selectAt, fps, config: { damping: 14, mass: 0.5 } })
      : 0;

  const mid = (items.length - 1) / 2;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {items.map((item, i) => {
        const offsetIndex = i - mid;
        const idleSway = Math.sin((frame / fps) * 1.1 + i) * 1.3 * progress;
        const isSelected = i === selectIndex && selectAt !== undefined;

        const baseX = interpolate(progress, [0, 1], [0, offsetIndex * spread]);
        const baseY = interpolate(progress, [0, 1], [0, Math.abs(offsetIndex) * 12]);
        const baseRotate =
          interpolate(progress, [0, 1], [0, offsetIndex * rotateStep]) + idleSway;

        const selX = isSelected ? interpolate(selectProgress, [0, 1], [baseX, 0]) : baseX;
        const selY = isSelected ? interpolate(selectProgress, [0, 1], [baseY, -14]) : baseY;
        const selRotate = isSelected
          ? interpolate(selectProgress, [0, 1], [baseRotate, 0])
          : baseRotate;
        const selScale = isSelected ? interpolate(selectProgress, [0, 1], [1, 1.14]) : 1;
        const dim = selectAt !== undefined && !isSelected ? interpolate(selectProgress, [0, 1], [1, 0.5]) : 1;
        const z = isSelected ? 100 : items.length - Math.abs(offsetIndex);

        const cardBlur = useMotionBlur(
          (f) => {
            const p = spring({ frame: f - openAt, fps, config: { damping: 13, mass: 0.6, stiffness: 100 } });
            return interpolate(p, [0, 1], [0, offsetIndex * spread]);
          },
          frame,
          { sensitivity: 0.35, max: 8 }
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 152,
              height: 152,
              borderRadius: 26,
              background: item.gradient,
              boxShadow: isSelected
                ? "0 30px 60px -16px rgba(20,10,50,0.5), 0 0 0 3px rgba(138,108,247,0.55), 0 2px 8px rgba(20,10,50,0.2)"
                : "0 24px 48px -14px rgba(20,10,50,0.4), 0 2px 8px rgba(20,10,50,0.15), inset 0 1px 0 rgba(255,255,255,0.25)",
              border: "1px solid rgba(255,255,255,0.18)",
              transform: `translate(${selX}px, ${selY}px) rotate(${selRotate}deg) scale(${selScale})`,
              filter: `blur(${cardBlur}px)`,
              zIndex: z,
              opacity: dim,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: 16,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                background: "rgba(255,255,255,0.22)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              {item.icon}
            </div>
            <span
              style={{
                color: "white",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: -0.2,
                fontFamily: FONT_FAMILY,
                textShadow: "0 2px 6px rgba(0,0,0,0.25)",
              }}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
