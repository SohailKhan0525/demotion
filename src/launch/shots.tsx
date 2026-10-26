import React from "react";
import { AbsoluteFill } from "remotion";
import { useShot } from "../engine/context";
import { clamp01, decay, outExpo, spring } from "../core/math";
import { archivo, FONT_FAMILY, LABEL_FAMILY, MONO_FAMILY } from "../font";
import { KineticHeadline } from "../type/KineticHeadline";
import { WideStack } from "../type/WideStack";
import { Terminal } from "../ui/Terminal";
import { CodePanel } from "../ui/CodePanel";
import { ParticleText } from "../components/ParticleText";
import { StackShot } from "./StackShot";
import { INIT_CMD, MYVIDEO } from "./code";
import type { LaunchShotId } from "./timeline";

const Center: React.FC<{ children: React.ReactNode }> = ({ children }) => <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>{children}</AbsoluteFill>;
const Caption: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark }) => {
  const { theme: T } = useShot();
  return <div style={{ position: "absolute", left: 110, right: 110, bottom: 115, textAlign: "center", fontFamily: LABEL_FAMILY,
    fontWeight: 600, fontSize: 32, letterSpacing: 3, color: dark ? T.ink : T.chalk }}>{children}</div>;
};
const NoList: React.FC = () => {
  const { frame, at, clock, theme: T } = useShot();
  return <Center><div style={{ width: 1540 }}>
    {["NO TIMELINE.", "NO SCREEN RECORDINGS.", "JUST CODE."].map((text, i) => {
      const t = (frame - at(i * 0.85 + 0.1)) / clock.fps;
      const p = spring(t, 4.5, 0.5);
      const strike = outExpo(clamp01((frame - at((i + 1) * 0.85)) / clock.duration(0.4)));
      return <div key={text} style={{ position: "relative", width: "fit-content", fontFamily: FONT_FAMILY, fontVariationSettings: archivo(72),
        fontSize: i === 1 ? 92 : 142, fontWeight: 900, lineHeight: 1.35, color: T.ink, opacity: clamp01(p), transform: `translateX(${(1 - p) * -240}px)`,
        background: i === 2 ? T.accent : undefined, padding: "0 16px" }}>
        {text}{i < 2 && <span style={{ position: "absolute", left: 0, top: "52%", height: 12, width: `${strike * 100}%`, background: T.spark }} />}
      </div>;
    })}
  </div></Center>;
};
const NumberShot: React.FC = () => {
  const { frame, at, clock, theme: T } = useShot();
  return <><Center><div style={{ display: "flex", fontFamily: FONT_FAMILY, fontWeight: 900, fontVariationSettings: archivo(100), fontSize: 360, color: T.ink }}>
    {"3840".split("").map((digit, i) => {
      const p = spring((frame - at(0.1 + i * 0.1)) / clock.fps, 4, 0.6);
      return <div key={i} style={{ height: 410, width: 265, overflow: "hidden", lineHeight: "410px" }}>
        <div style={{ transform: `translateY(${-(10 + Number(digit)) * 410 * p}px)` }}>
          {Array.from({ length: 20 }, (_, j) => <div key={j} style={{ height: 410 }}>{j % 10}</div>)}
        </div>
      </div>;
    })}
  </div></Center><Caption dark>× 2160 · 4K OUTPUT · RENDERED LOCALLY</Caption></>;
};
const Bands: React.FC = () => {
  const { frame, at, clock, theme: T } = useShot();
  const phrases = ["BEAT-SYNCED MOTION • SPRING PHYSICS • EXPO EASING", "REAL MOTION BLUR • CAMERA RIG • BEAT-LANDED WIPES", "LENS BLUR • 3D PANELS • VARIABLE-WIDTH TYPE", "SOUND ENGINE • LUFS MASTERING • 4K RENDERS"];
  return <Center><div style={{ transform: "rotate(-8deg)", width: 2300 }}>{phrases.map((text, i) => {
    const t = (frame - at(i * 0.1)) / clock.fps, p = spring(t, 4.5, 0.5);
    const dir = i % 2 ? 1 : -1;
    const x = dir * ((1 - p) * 1300 + Math.max(0, t) * 65);
    return <div key={text} style={{ position: "relative", overflow: "hidden", height: 138, margin: "14px 0", background: [T.accent, T.chalk, T.spark, T.ink][i],
      color: i === 3 ? T.chalk : T.ink, fontFamily: FONT_FAMILY, fontWeight: 900, fontSize: 74, whiteSpace: "nowrap", lineHeight: "138px" }}>
      <div style={{ transform: `translateX(${x - 170}px)`, filter: `blur(${Math.max(0, 1 - p) * 5}px)` }}>{text} • {text}</div>
    </div>;
  })}</div></Center>;
};
const Sound: React.FC = () => {
  const { frame, startFrame, clock, theme: T } = useShot();
  const beat = decay(clock.sinceBeat(frame + startFrame), 0.13);
  return <><div style={{ position: "absolute", top: 160, width: "100%", textAlign: "center", color: T.chalk, fontFamily: FONT_FAMILY, fontSize: 118, fontWeight: 900 }}>SOUND, BUILT IN.</div>
    <Center><div style={{ display: "flex", gap: 10, alignItems: "center", height: 380, marginTop: 70 }}>
      {Array.from({ length: 56 }, (_, i) => <div key={i} style={{ width: 18, height: 28 + beat * (85 + 210 * Math.abs(Math.sin(i * 1.7))),
        background: i % 9 === 0 ? T.spark : T.accent, borderRadius: 4 }} />)}
    </div></Center><Caption>120 BPM · −14 LUFS TARGET · BEAT-DRIVEN CUES</Caption></>;
};
const License: React.FC = () => {
  const { frame, at, clock, theme: T } = useShot();
  return <><div style={{ position: "absolute", top: 125, width: "100%", textAlign: "center", fontFamily: FONT_FAMILY, fontSize: 115, fontWeight: 900, color: T.ink }}>FREE TO START.</div>
    <Center><div style={{ display: "flex", gap: 36, marginTop: 80 }}>{[
      ["PERSONAL & NON-COMMERCIAL", "FREE", "Personal projects, study, hobby"],
      ["TEAMS & COMPANIES", "COMMERCIAL", "Solo · Team · Company"],
    ].map(([label, hero, detail], i) => {
      const p = spring((frame - at(0.25 + i * 0.18)) / clock.fps, 4, 0.55);
      return <div key={hero} style={{ width: 720, height: 340, boxSizing: "border-box", padding: 44, background: i ? T.ink : T.accent, color: i ? T.chalk : T.ink,
        borderRadius: 26, transform: `translateY(${(1 - p) * 180}px)`, opacity: clamp01(p), fontFamily: LABEL_FAMILY }}>
        <div style={{ fontSize: 31 }}>{label}</div><div style={{ fontFamily: FONT_FAMILY, fontWeight: 900, fontSize: i ? 66 : 130, margin: "30px 0" }}>{hero}</div><div style={{ fontSize: 31 }}>{detail}</div>
      </div>;
    })}</div></Center><Caption dark>ko-fi.com/qofenoai · See full license terms in the repository</Caption></>;
};
const Final: React.FC = () => {
  const { frame, at, clock, theme: T } = useShot();
  const p = spring((frame - at(0.4)) / clock.fps, 4, 0.55);
  return <><KineticHeadline text="demotion" width={1420} wdth={100} color={T.chalk} accent={T.accent} underline={false} at={-0.2} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: FONT_FAMILY, fontSize: 110, color: T.accent }}>✳</div>
    <div style={{ position: "absolute", top: 720, left: 0, right: 0, textAlign: "center", color: T.chalk, fontFamily: LABEL_FAMILY, fontSize: 42,
      opacity: clamp01(p), transform: `translateY(${(1 - p) * 50}px)` }}>MOTION GRAPHICS, WRITTEN IN CODE.</div>
    <div style={{ position: "absolute", top: 805, left: 0, right: 0, textAlign: "center", fontFamily: MONO_FAMILY, fontSize: 28, color: T.ink }}>
      <span style={{ display: "inline-block", background: T.accent, padding: "15px 26px", borderRadius: 99 }}>PRE-RELEASE · BUILD FROM SOURCE</span>
    </div><Caption>github.com/SohailKhan0525/demotion · ko-fi.com/qofenoai</Caption></>;
};

export const LaunchShot: React.FC<{ id: LaunchShotId }> = ({ id }) => {
  const { theme: T, at, clock } = useShot();
  switch (id) {
    case "motion": return <KineticHeadline text="MOTION" at={-0.7} color={T.chalk} accent={T.accent} accentIndex={3} />;
    case "code": return <WideStack text="CODE" color={T.ink} accent={T.spark} />;
    case "meet": return <><KineticHeadline text="demotion" color={T.chalk} accent={T.accent} width={1420} wdth={100} /><Caption>MOTION GRAPHICS, WRITTEN IN CODE</Caption></>;
    case "nolist": return <NoList />;
    case "terminal": return <><Center><Terminal title="Source checkout · pre-release" fontSize={30} width={1640} height={640} lines={[
      { at: 0.2, text: INIT_CMD, prompt: true, type: 1.25 },
      { at: 1.55, text: "✔ Created my-video/", color: T.accent },
      { at: 1.75, text: "✔ Copied fonts to public/fonts" },
      { at: 2, text: "Next: cd my-video && npm install && npm start" },
      { at: 2.3, text: "Demotion is free for personal & non-commercial use. Business use needs a commercial license." },
      { at: 2.6, text: "Get one or support the project: https://ko-fi.com/qofenoai" },
    ]} /></Center><Caption>LOCAL CLI · ACTUAL SCAFFOLD OUTPUT</Caption></>;
    case "codepanel": return <Center><CodePanel file="src/MyVideo.tsx · actual starter" lines={MYVIDEO} at={0.1} over={2.6} fontSize={32} height={830} /></Center>;
    case "number": return <NumberShot />;
    case "stack": return <><StackShot /><Caption>CODE → PREVIEW → RENDER · WORKFLOW ILLUSTRATION</Caption></>;
    case "bands": return <Bands />;
    case "sound": return <Sound />;
    case "license": return <License />;
    case "ptext": return <ParticleText text="demotion" fontSize={260} color={T.chalk} formAt={at(0.1)} formDuration={clock.duration(1.15)} />;
    case "final": return <Final />;
  }
};
