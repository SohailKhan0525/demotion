import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
} from "remotion";
import { CloudGradient } from "./CloudGradient";
import { LineDraw } from "./ShapeAccent";
import { defaultTheme } from "../theme";

export type TitleCardProps = {
  text: string | { text: string; color?: string }[];
  subtext?: string;
  align?: "center" | "left";
  dark?: boolean;
  underline?: boolean;
};

const OFFSET = 6;
const BLUR = 6;
const DURATION_FRAMES = 12;
const STAGGER_FRAMES = 2.4;

const Word: React.FC<{ word: string; index: number; color: string; fps: number }> = ({
  word,
  index,
  color,
  fps,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - index * STAGGER_FRAMES - 1.2;
  const t = Math.min(1, Math.max(0, localFrame / DURATION_FRAMES));
  const eased = Easing.out(Easing.ease)(t);

  // scale overshoot: a slightly separate, springier curve so words punch in
  // past 1.0 and settle back, rather than a flat linear scale-up
  const scaleSpring = spring({
    frame: frame - index * STAGGER_FRAMES,
    fps,
    config: { damping: 10, mass: 0.4, stiffness: 160 },
  });
  const scale = interpolate(scaleSpring, [0, 1], [0.7, 1]);

  const opacity = eased;
  const translateY = interpolate(eased, [0, 1], [OFFSET, 0]);
  const blur = interpolate(eased, [0, 1], [BLUR, 0]);
  // tracking: letters start wide-spaced and pull tight as the word resolves
  const tracking = interpolate(eased, [0, 1], [10, 0]);

  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        filter: `blur(${blur}px)`,
        letterSpacing: `${tracking}px`,
        color,
        marginRight: "0.28em",
      }}
    >
      {word}
    </span>
  );
};

export const TitleCard: React.FC<TitleCardProps> = ({
  text,
  subtext,
  align = "center",
  dark = false,
  underline = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineColor = dark ? "#f6f5fb" : "#14121f";
  const segments = typeof text === "string" ? [{ text, color: lineColor }] : text;
  const words: { word: string; color: string }[] = [];
  segments.forEach((seg) => {
    seg.text.split(" ").filter(Boolean).forEach((w) => words.push({ word: w, color: seg.color ?? lineColor }));
  });

  const totalWordFrames = words.length * STAGGER_FRAMES + DURATION_FRAMES;
  const subOpacity = interpolate(frame, [totalWordFrames, totalWordFrames + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const underlineWidth = Math.min(560, words.length * 90);

  return (
    <AbsoluteFill>
      <CloudGradient
        intensity={dark ? 0.28 : 1}
        colors={
          dark
            ? ["#0d0b16", "#231b3d", "#3c2f66", "#1a1428"]
            : ["#eef0ff", "#d9c9ff", "#8f7af5", "#6f8cf9", "#fbfaff"]
        }
      />
      {dark && <AbsoluteFill style={{ backgroundColor: "rgba(6,6,10,0.78)" }} />}
      <AbsoluteFill
        style={{
          alignItems: align === "center" ? "center" : "flex-start",
          justifyContent: "center",
          padding: "0 130px",
        }}
      >
        <div style={{ textAlign: align, maxWidth: 1200 }}>
          <div
            style={{
              fontFamily: defaultTheme.font.family,
              fontWeight: 800,
              fontSize: 84,
              letterSpacing: -2.5,
              lineHeight: 1.08,
            }}
          >
            {words.map((w, i) => (
              <Word key={`${w.word}-${i}`} word={w.word} index={i} color={w.color} fps={fps} />
            ))}
          </div>
          {underline && (
            <div style={{ marginTop: 10 }}>
              <LineDraw width={underlineWidth} startAt={totalWordFrames - 4} color={dark ? "#c9b8fb" : "#a21caf"} />
            </div>
          )}
          {subtext && (
            <div
              style={{
                marginTop: 20,
                opacity: subOpacity,
                fontFamily: defaultTheme.font.family,
                fontWeight: 500,
                fontSize: 28,
                letterSpacing: -0.3,
                color: dark ? "rgba(246,245,251,0.62)" : "rgba(20,18,31,0.56)",
              }}
            >
              {subtext}
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const highlight = (text: string, color = "#a21caf") => ({ text, color });
