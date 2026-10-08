import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { FONT_FAMILY } from "../font";
import { CheckIcon } from "./icons";

export type LoadingButtonProps = {
  messages: string[];
  holdFrames?: number;
  dark?: boolean;
  endWithCheck?: boolean;
};

const SEGMENTS = 8;

const Spinner: React.FC<{ dark: boolean }> = ({ dark }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rotation = (frame / fps) * 360 * 0.9;
  return (
    <div style={{ position: "relative", width: 15, height: 15 }}>
      {new Array(SEGMENTS).fill(0).map((_, i) => {
        const angle = (360 / SEGMENTS) * i;
        const phase = (((angle - rotation) % 360) + 360) % 360;
        const opacity = interpolate(phase, [0, 180, 360], [1, 0.12, 1]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 2.2,
              height: 5.5,
              borderRadius: 2,
              background: dark ? "#8a6cf7" : "#7c6cf0",
              left: "50%",
              top: "0%",
              opacity,
              transform: `translateX(-50%) rotate(${angle}deg)`,
              transformOrigin: "50% 7.5px",
            }}
          />
        );
      })}
    </div>
  );
};

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  messages,
  holdFrames = 32,
  dark = true,
  endWithCheck = true,
}) => {
  const frame = useCurrentFrame();
  const totalMessageFrames = messages.length * holdFrames;
  const inCheckPhase = endWithCheck && frame >= totalMessageFrames;

  const idx = Math.min(messages.length - 1, Math.floor(frame / holdFrames));
  const localFrame = frame - idx * holdFrames;
  const textOpacity = interpolate(
    localFrame,
    [0, 8, holdFrames - 8, holdFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const textY = interpolate(localFrame, [0, 8], [4, 0], { extrapolateRight: "clamp" });

  const checkFrame = frame - totalMessageFrames;
  const checkScale = interpolate(checkFrame, [0, 10], [0.4, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const checkOpacity = interpolate(checkFrame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const spinnerFadeOut = interpolate(checkFrame, [-6, 0], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "14px 26px",
        borderRadius: 999,
        background: dark ? "#111114" : "#ffffff",
        border: `1px solid ${dark ? "#2a2a32" : "#e4e4e8"}`,
        boxShadow: "0 14px 34px -12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        minWidth: 190,
      }}
    >
      <div style={{ position: "relative", width: 15, height: 15, flexShrink: 0 }}>
        <div style={{ position: "absolute", inset: 0, opacity: inCheckPhase ? spinnerFadeOut : 1 }}>
          <Spinner dark={dark} />
        </div>
        {inCheckPhase && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: checkOpacity,
              transform: `scale(${checkScale})`,
              color: "#4ade80",
            }}
          >
            <CheckIcon size={15} strokeWidth={2.6} />
          </div>
        )}
      </div>
      <span
        style={{
          opacity: inCheckPhase ? checkOpacity : textOpacity,
          transform: `translateY(${inCheckPhase ? 0 : textY}px)`,
          fontFamily: FONT_FAMILY,
          fontSize: 15,
          fontWeight: 600,
          color: dark ? "#e6e6ea" : "#1a1a1f",
          whiteSpace: "nowrap",
        }}
      >
        {inCheckPhase ? "Done" : messages[idx]}
      </span>
    </div>
  );
};
