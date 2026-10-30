import React from "react";
import { AbsoluteFill } from "remotion";
import { useShot } from "../engine/context";
import { demotionTheme as T } from "../engine/theme";
import { clamp01, outExpo, spring } from "../core/math";
import { FONT_FAMILY, MONO_FAMILY, archivo } from "../font";

export const useBeatMotion = () => {
  const shot = useShot();
  return {
    ...shot,
    beat: shot.frame / shot.clock.framesPerBeat,
    enter: (at = 0, hz = 2.5) => spring((shot.frame - shot.at(at)) / shot.clock.fps, hz, 0.74),
    ease: (at: number, over: number) => outExpo(clamp01((shot.frame - shot.at(at)) / Math.max(1, shot.at(at + over) - shot.at(at)))),
  };
};

export const Reveal: React.FC<{ children: React.ReactNode; at?: number; x?: number; y?: number; style?: React.CSSProperties }> = ({ children, at = 0, x = 0, y = 42, style }) => {
  const { enter } = useBeatMotion();
  const p = enter(at);
  return <div style={{ ...style, opacity: clamp01(p), transform: `translate(${x * (1 - p)}px, ${y * (1 - p)}px)` }}>{children}</div>;
};

export const Wordmark: React.FC<{ size?: number }> = ({ size = 34 }) => <div style={{ display: "flex", gap: size * 0.32, alignItems: "center", color: T.ink }}>
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden><rect x="4" y="4" width="92" height="92" rx="28" fill={T.field} /><path d="M30 27H46C65 27 76 36 76 50S65 73 46 73H30Z" fill="none" stroke={T.chalk} strokeWidth="10" /><path d="M43 39L60 50L43 61Z" fill={T.accent} /></svg>
  <span style={{ fontFamily: FONT_FAMILY, fontSize: size, fontWeight: 700, letterSpacing: -size * 0.05 }}>demotion</span>
</div>;

export const Surface = () => <AbsoluteFill style={{ background: T.chalk }}>
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 90% 26%, ${T.field}0C, transparent 60%), radial-gradient(ellipse at 8% 95%, ${T.accent}16, transparent 55%)` }} />
  <div style={{ position: "absolute", bottom: -520, left: 300, width: 1450, height: 750, border: `1px solid ${T.ink}07`, borderRadius: "50%" }} />
</AbsoluteFill>;

export const Copy: React.FC<{ eyebrow: string; lines: [string, string]; detail?: string; top?: number }> = ({ eyebrow, lines, detail, top = 320 }) => <div style={{ position: "absolute", left: 126, top, width: 620 }}>
  <Reveal at={-0.5}><div style={{ color: T.field, fontSize: 25, fontWeight: 600, marginBottom: 27 }}>{eyebrow}</div></Reveal>
  {lines.map((line, i) => <Reveal key={line} at={-0.35 + i * 0.17}><div style={{ fontSize: 84, lineHeight: 1.09, letterSpacing: -4.2, fontWeight: 500, color: i ? T.field : T.ink, whiteSpace: "nowrap" }}>{line}</div></Reveal>)}
  {detail && <Reveal at={0.35}><div style={{ marginTop: 30, width: 500, fontSize: 27, lineHeight: 1.5, color: `${T.ink}AE` }}>{detail}</div></Reveal>}
</div>;

export const Note: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ position: "absolute", bottom: 64, left: 126, fontSize: 22, color: `${T.ink}A6` }}>{children}</div>;

export const Paper: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; dark?: boolean }> = ({ children, style, dark }) => <div style={{ position: "relative", borderRadius: 28, background: dark ? T.ink : T.chalk, border: `1.5px solid ${dark ? T.chalk + "30" : T.ink + "13"}`, boxShadow: `0 28px 60px ${T.ink}12, 0 4px 10px ${T.ink}08, inset 0 1px 0 ${T.chalk}BB`, overflow: "hidden", ...style }}>{children}</div>;

/** Original layered film-frame sculpture; SVG/CSS geometry, not a product UI. */
export const FrameSculpture: React.FC<{ size?: number; assembled?: boolean }> = ({ size = 440, assembled = false }) => {
  const { enter, beat } = useBeatMotion();
  return <div style={{ position: "relative", width: size * 1.4, height: size * 1.15, perspective: 1600 }}>
    <div style={{ position: "absolute", width: size * 1.2, height: size * 0.16, left: size * 0.08, top: size * 0.98, background: T.ink, opacity: 0.09, borderRadius: "50%", filter: "blur(22px)" }} />
    {[0, 1, 2].map(i => {
      const p = enter(assembled ? -1 + i * 0.1 : 0.25 + i * 0.2, 2.2);
      const sway = Math.sin(beat * Math.PI / 8 + i * 0.7) * 5;
      return <div key={i} style={{ position: "absolute", width: size, height: size * 0.78, top: size * 0.09 + i * 24 + sway, left: i * 70, borderRadius: size * 0.13, background: [T.accent, T.chalk, T.field][i], border: `2px solid ${T.ink}14`, boxShadow: `9px 13px 0 ${[T.accent, T.chalk, T.field][i]}, 11px 16px 2px ${T.ink}22, 16px 24px 35px ${T.ink}18, inset 3px 3px 2px ${T.chalk}60`, opacity: clamp01(p), transform: `translateY(${(1 - p) * 130}px) rotateY(-24deg) rotateX(12deg) rotateZ(${-11 + i * 7 + (1 - p) * -20}deg)` }}>
        {i === 2 ? <svg width="100%" height="100%" viewBox="0 0 440 344" aria-hidden><path d="M132 86H203C271 86 312 119 312 172S271 258 203 258H132Z" fill="none" stroke={T.chalk} strokeWidth="29" /><path d="M185 135L244 172L185 209Z" fill={T.accent} /><path d="M50 42H110M330 302H389" stroke={T.chalk} strokeWidth="5" opacity=".35" strokeLinecap="round" /></svg> : <div style={{ position: "absolute", left: 24, top: 22, fontFamily: MONO_FAMILY, fontSize: 15, color: `${T.ink}88` }}>{i ? "FRAME / 002" : "FRAME / 001"}</div>}
      </div>;
    })}
  </div>;
};

export const CodeLines: React.FC<{ lines: readonly string[]; at?: number; fontSize?: number }> = ({ lines, at = 0.4, fontSize = 27 }) => {
  const { enter } = useBeatMotion();
  return <div style={{ fontFamily: MONO_FAMILY, fontSize, lineHeight: 1.7, padding: "26px 30px", color: T.chalk }}>
    {lines.map((line, i) => {
      const p = enter(at + i * 0.18);
      return <div key={i} style={{ display: "flex", whiteSpace: "pre", opacity: clamp01(p), transform: `translateX(${18 * (1 - p)}px)` }}><span style={{ display: "inline-block", width: 48, color: `${T.chalk}50`, fontSize: fontSize - 4, flexShrink: 0 }}>{i + 1}</span><span style={{ color: /text=|color=|accent=/.test(line) ? T.accent : T.chalk }}>{line}</span></div>;
    })}
  </div>;
};

export const TypeSpecimen: React.FC<{ text?: string; color?: string; large?: boolean }> = ({ text = "Aa", color = T.field, large = false }) => <div style={{ fontSize: large ? 210 : 100, fontWeight: 800, letterSpacing: -8, fontVariationSettings: archivo(85, 800), color, lineHeight: 1 }}>{text}</div>;
