import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_FAMILY } from "../font";

export type TypingTextProps = {
  text: string;
  fontSize?: number;
  color?: string;
  charsPerSecond?: number;
  startAt?: number;
};

export const TypingText: React.FC<TypingTextProps> = ({
  text,
  fontSize = 64,
  color = "#f5f5fb",
  charsPerSecond = 18,
  startAt = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const elapsed = Math.max(0, (frame - startAt) / fps);
  const charsShown = Math.min(text.length, Math.floor(elapsed * charsPerSecond));
  const shown = text.slice(0, charsShown);
  const cursorOn = Math.floor(frame / (fps * 0.5)) % 2 === 0;

  return (
    <div
      style={{
        fontFamily: FONT_FAMILY,
        fontWeight: 700,
        fontSize,
        color,
        letterSpacing: -1,
        display: "flex",
        alignItems: "center",
      }}
    >
      {shown}
      <span
        style={{
          display: "inline-block",
          width: 3,
          height: fontSize * 0.9,
          marginLeft: 4,
          background: color,
          opacity: cursorOn ? 1 : 0,
        }}
      />
    </div>
  );
};
