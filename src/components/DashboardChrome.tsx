import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { FONT_FAMILY } from "../font";
import { HomeIcon, LayersIcon, PaletteIcon, ToggleIcon } from "./icons";

const ICONS = [HomeIcon, LayersIcon, PaletteIcon, ToggleIcon];

export const Sidebar: React.FC<{ items: string[]; active?: number; dark?: boolean }> = ({
  items,
  active = 0,
  dark = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bg = dark ? "#0e0e12" : "#fbfbfd";
  const border = dark ? "#232329" : "#ececf0";
  const text = dark ? "#a6a6b0" : "#5c5c67";
  const activeText = dark ? "#ffffff" : "#14141c";
  const activeBg = dark ? "#1c1c22" : "#f0f0f5";

  return (
    <div
      style={{
        width: 228,
        height: "100%",
        background: bg,
        borderRight: `1px solid ${border}`,
        padding: "18px 12px",
        fontFamily: FONT_FAMILY,
        fontSize: 13.5,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 8px",
          marginBottom: 22,
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            background: "linear-gradient(135deg,#8b7cf6,#6f8cf9)",
            boxShadow: "0 2px 8px rgba(111,140,249,0.5)",
          }}
        />
        <span style={{ fontWeight: 800, fontSize: 14.5, color: activeText, letterSpacing: -0.3 }}>
          RewampUI
        </span>
      </div>

      {items.map((it, i) => {
        const Icon = ICONS[i % ICONS.length];
        const isActive = i === active;
        const delay = i * 2;
        const enter = spring({ frame: frame - delay, fps, config: { damping: 16, mass: 0.5 } });
        const x = interpolate(enter, [0, 1], [-10, 0]);
        const op = interpolate(enter, [0, 1], [0, 1]);
        return (
          <div
            key={it}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "8px 10px",
              borderRadius: 8,
              marginBottom: 2,
              color: isActive ? activeText : text,
              background: isActive ? activeBg : "transparent",
              fontWeight: isActive ? 700 : 500,
              transform: `translateX(${x}px)`,
              opacity: op,
            }}
          >
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  left: -12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 3,
                  height: 16,
                  borderRadius: 2,
                  background: "linear-gradient(180deg,#8b7cf6,#6f8cf9)",
                }}
              />
            )}
            <Icon size={15} color={isActive ? (dark ? "#c9bdfd" : "#7c6cf0") : text} strokeWidth={1.8} />
            {it}
          </div>
        );
      })}

      <div style={{ flex: 1 }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 8px",
          borderTop: `1px solid ${border}`,
          paddingTop: 14,
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#f6b28b,#f07a9c)",
          }}
        />
        <div style={{ fontSize: 12, color: text, fontWeight: 600 }}>Workspace</div>
      </div>
    </div>
  );
};

export const PillButton: React.FC<{
  label: string;
  variant?: "solid" | "outline";
  dark?: boolean;
}> = ({ label, variant = "solid", dark = false }) => {
  const solidBg = dark ? "#ffffff" : "#14141c";
  const solidText = dark ? "#14141c" : "#ffffff";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "10px 22px",
        borderRadius: 999,
        fontFamily: FONT_FAMILY,
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: -0.1,
        background: variant === "solid" ? solidBg : "rgba(255,255,255,0.06)",
        color: variant === "solid" ? solidText : dark ? "#e6e6ea" : "#14141c",
        border: variant === "outline" ? `1px solid ${dark ? "#ffffff33" : "#ffffff55"}` : "none",
        boxShadow:
          variant === "solid"
            ? "0 8px 20px -6px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)"
            : "none",
        backdropFilter: variant === "outline" ? "blur(6px)" : undefined,
      }}
    >
      {label}
    </div>
  );
};
