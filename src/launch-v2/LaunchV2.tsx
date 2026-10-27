import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { MotionProject, Shot } from "../engine/MotionProject";
import { useShot } from "../engine/context";
import { demotionTheme as T } from "../engine/theme";
import { clamp01, decay, outExpo, spring } from "../core/math";
import { archivo, FONT_FAMILY, LABEL_FAMILY, MONO_FAMILY } from "../font";
import { CountUp } from "../ui/CountUp";
import { BarChart } from "../ui/BarChart";
import { CaptionTrack } from "../ui/CaptionTrack";
import { LowerThird } from "../ui/LowerThird";
import { ProgressRing } from "../ui/ProgressRing";
import { CodePanel } from "../ui/CodePanel";
import { KineticHeadline } from "../type/KineticHeadline";
import { V2_API_NAMES, V2_BEATS, V2_CODE, V2_INSTALL, V2_SHOTS, v2Clock, type V2ShotId } from "./timeline";

const Label: React.FC<{ children: React.ReactNode; dark?: boolean; bottom?: boolean }> = ({ children, dark, bottom }) => <div style={{ position: "absolute", left: 112, right: 112, [bottom ? "bottom" : "top"]: 92, color: dark ? T.ink : T.chalk, fontFamily: LABEL_FAMILY, fontSize: 26, fontWeight: 600, letterSpacing: 2 }}>{children}</div>;

const Rise: React.FC<{ children: React.ReactNode; at?: number; style?: React.CSSProperties }> = ({ children, at = 0, style }) => {
  const shot = useShot();
  const p = spring((shot.frame - shot.at(at)) / shot.clock.fps, 4, 0.57);
  return <div style={{ opacity: clamp01(p), transform: `translateY(${(1 - p) * 80}px)`, ...style }}>{children}</div>;
};

const Hook = () => {
  const { frame, clock } = useShot();
  // A composed first frame: the main headline is already present at frame 0.
  const p = spring((frame + clock.duration(0.8)) / clock.fps, 3.5, 0.6);
  return <>
    <Label>DEMOTION / SECOND TAKE</Label>
    <div style={{ position: "absolute", left: 110, top: 245, fontFamily: FONT_FAMILY, fontVariationSettings: archivo(96), fontWeight: 900, fontSize: 210, lineHeight: 0.97, letterSpacing: -11, transform: `translateY(${(1 - p) * 180}px)` }}>
      <div style={{ color: T.chalk }}>Your data.</div><div style={{ color: T.accent }}>In motion.</div>
    </div>
    <div style={{ position: "absolute", right: 160, top: 280, width: 260, height: 420, display: "flex", alignItems: "end", gap: 20, transform: "rotate(-9deg)" }}>
      {[0.45, 0.72, 1].map((v, i) => {
        const s = spring((frame + clock.duration(0.6 - i * 0.1)) / clock.fps, 3.5, 0.5);
        return <div key={i} style={{ width: 64, height: v * 370 * Math.max(0, s), borderRadius: 10, background: i === 2 ? T.spark : T.field }} />;
      })}
    </div>
    <Label bottom>REACT COMPONENTS → LOCAL VIDEO · GENERATED WITH DEMOTION</Label>
  </>;
};

const Data = () => <>
  <Label>01 / DATA STORIES · DEMONSTRATION VALUES</Label>
  <Rise at={0.1} style={{ position: "absolute", left: 112, top: 185, fontFamily: FONT_FAMILY, fontSize: 94, fontWeight: 800, letterSpacing: -4, color: T.chalk }}>Make numbers move.</Rise>
  <div style={{ position: "absolute", left: 112, top: 365 }}>
    <CountUp value={128} suffix=" BPM" label="The clock driving this film" at={0.45} over={2} fontSize={154} />
    <div style={{ marginTop: 48 }}><BarChart width={1030} rowHeight={96} at={1} over={2} stagger={0.3} suffix=" beats" max={8} data={[{ label: "Opening", value: 4 }, { label: "Data story", value: 8, color: T.field }, { label: "Code", value: 6, color: T.spark }]} /></div>
  </div>
  <div style={{ position: "absolute", right: 145, top: 412 }}><ProgressRing value={0.75} size={340} at={1} over={2} label="Example progress" /></div>
  <Label bottom>COUNTUP + BARCHART + PROGRESSRING · REAL TIMELINE VALUES, SAMPLE PROGRESS</Label>
</>;

const Captions = () => {
  const { frame, at, clock } = useShot();
  return <>
    <Label dark>02 / TUTORIALS + EXPLAINERS</Label>
    <div style={{ position: "absolute", left: 110, top: 245, width: 1510, fontFamily: FONT_FAMILY, fontSize: 165, fontWeight: 900, fontVariationSettings: archivo(84), letterSpacing: -6, lineHeight: 1.04, color: T.ink }}>
      {["Keep the story.", "Lose the guesswork."].map((line, i) => {
        const p = spring((frame - at(0.1 + i * 0.25)) / clock.fps, 4, 0.55);
        return <div key={line} style={{ transform: `translateX(${(1 - p) * -180}px)`, opacity: clamp01(p) }}>{line}</div>;
      })}
    </div>
    <CaptionTrack bottom={172} fontSize={54} cues={[
      { at: 0.5, beats: 2, text: "Write the caption. Choose the beat." },
      { at: 2.5, beats: 2.5, text: "Seek backward. The same frame returns." },
      { at: 5, beats: 3, text: "CaptionTrack · authored timing, no transcription" },
    ]} />
    <div style={{ position: "absolute", left: 112, bottom: 115, fontFamily: LABEL_FAMILY, fontSize: 27, color: T.ink }}>Useful even with sound off.</div>
  </>;
};

const Code = () => <>
  <Label>03 / SMALL APIS, COMPOSABLE SCENES</Label>
  <div style={{ position: "absolute", left: 130, top: 210 }}><CodePanel file="Data story · new APIs on main" at={0.2} over={3.4} width={1660} height={640} fontSize={34} lines={V2_CODE} /></div>
  <Label bottom>NEW COMPONENTS: SOURCE PREVIEW · NPM 0.1.0 INCLUDES THE ORIGINAL TOOLKIT</Label>
</>;

const Identity = () => <>
  <Label>04 / PRODUCT DEMOS + PRESENTATIONS</Label>
  <Rise at={0.1} style={{ position: "absolute", top: 225, left: 112, color: T.chalk, fontFamily: FONT_FAMILY, fontSize: 154, lineHeight: 1.02, letterSpacing: -7, fontWeight: 900 }}>Give every story<br /><span style={{ color: T.accent }}>a clear introduction.</span></Rise>
  <LowerThird title="Your next product story" subtitle="LowerThird · title, context, timed exit" at={0.5} beats={5.4} bottom={160} width={1040} />
</>;

const System = () => {
  const { frame, at, clock } = useShot();
  return <>
    <Label dark>05 / FIVE NEW BUILDING BLOCKS</Label>
    <Rise style={{ position: "absolute", left: 112, top: 195, fontFamily: FONT_FAMILY, fontSize: 112, color: T.ink, fontWeight: 900, letterSpacing: -5 }}>Built to work together.</Rise>
    <div style={{ position: "absolute", left: 112, top: 375, display: "flex", gap: 24, flexWrap: "wrap", width: 1660 }}>
      {V2_API_NAMES.map((name, i) => {
        const p = spring((frame - at(0.25 + i * 0.35)) / clock.fps, 4, 0.52);
        return <div key={name} style={{ padding: "32px 42px", borderRadius: 22, background: i === 2 ? T.field : T.ink, color: i === 4 ? T.accent : T.chalk, fontFamily: FONT_FAMILY, fontSize: 61, fontWeight: 750, transform: `translateY(${(1 - p) * 130}px) rotate(${(1 - p) * (i % 2 ? 6 : -6)}deg)`, opacity: clamp01(p) }}>{name}</div>;
      })}
    </div>
    <Rise at={2.7} style={{ position: "absolute", left: 112, bottom: 180, fontFamily: LABEL_FAMILY, fontSize: 40, color: T.ink }}>One beat clock. Springs. Camera motion. Real shutter blur.</Rise>
    <Label dark bottom>ALSO IN THE TOOLKIT: KINETIC TYPE · TERMINALS · CODE PANELS · OPTIONAL 3D</Label>
  </>;
};

const Sound = () => {
  const { frame, startFrame, clock } = useShot();
  const pulse = decay(clock.sinceBeat(frame + startFrame), 0.14);
  const reveal = outExpo(clamp01(frame / clock.duration(0.8)));
  return <>
    <Label>06 / PICTURE + SOUND, ONE CLOCK</Label>
    <Rise style={{ position: "absolute", left: 110, top: 220, color: T.chalk, fontFamily: FONT_FAMILY, fontSize: 142, fontWeight: 900, letterSpacing: -6 }}>Hear the keyframes.</Rise>
    <div style={{ position: "absolute", left: 120, right: 120, top: 435, height: 280, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      {Array.from({ length: 64 }, (_, i) => <div key={i} style={{ width: 15, height: reveal * (20 + (65 + 175 * Math.abs(Math.sin(i * 1.23))) * pulse), borderRadius: 5, background: i % 8 === 0 ? T.spark : T.accent }} />)}
    </div>
    <Label bottom>128 BPM · PROCEDURAL SOUNDTRACK · −14 LUFS TARGET</Label>
  </>;
};

const License = () => <>
  <Label dark>07 / CLEAR TERMS</Label>
  <Rise style={{ position: "absolute", left: 112, top: 225, fontFamily: FONT_FAMILY, fontSize: 136, fontWeight: 900, letterSpacing: -6, color: T.ink }}>Create locally.</Rise>
  <Rise at={0.3} style={{ position: "absolute", left: 112, top: 440, fontFamily: FONT_FAMILY, fontSize: 65, fontWeight: 700, color: T.ink }}>Free for personal & non-commercial use.</Rise>
  <Rise at={0.6} style={{ position: "absolute", left: 112, top: 565, width: 1630, fontFamily: LABEL_FAMILY, fontSize: 47, color: T.ink }}>Business, client or product work needs a commercial license.</Rise>
  <Label dark bottom>SEE REPOSITORY LICENSE TERMS · REMOTION HAS ITS OWN TERMS</Label>
</>;

const Final = () => <>
  <Label>DEMOTION / SECOND TAKE · V2 LAUNCH FILM</Label>
  <div style={{ position: "absolute", inset: 0, transform: "translateY(-140px)" }}><KineticHeadline text="demotion" at={-0.3} width={1460} wdth={100} color={T.chalk} accent={T.accent} underline={false} /></div>
  <Rise at={0.5} style={{ position: "absolute", left: 112, top: 590, fontFamily: MONO_FAMILY, fontSize: 40, color: T.ink, background: T.accent, padding: "24px 32px", borderRadius: 14 }}>{V2_INSTALL}</Rise>
  <Rise at={0.8} style={{ position: "absolute", left: 112, top: 725, fontFamily: LABEL_FAMILY, fontSize: 38, color: T.chalk }}>Original toolkit on npm. New components on main.</Rise>
  <Label bottom>GITHUB.COM/SOHAILKHAN0525/DEMOTION · BUILD SOMETHING WORTH WATCHING.</Label>
</>;

export const V2Scene: React.FC<{ id: V2ShotId }> = ({ id }) => {
  switch (id) {
    case "hook": return <Hook />;
    case "brand": return <><KineticHeadline text="demotion" at={-0.3} width={1460} color={T.chalk} accent={T.accent} underline={false} /><Label bottom>THE SECOND TAKE · A TOOLKIT FOR YOUR NEXT STORY</Label></>;
    case "data": return <Data />;
    case "captions": return <Captions />;
    case "code": return <Code />;
    case "identity": return <Identity />;
    case "system": return <System />;
    case "sound": return <Sound />;
    case "license": return <License />;
    case "final": return <Final />;
  }
};

export const LaunchV2: React.FC<{ muted?: boolean }> = ({ muted = false }) => <AbsoluteFill>
  {!muted && <Audio src={staticFile("launch-v2-soundtrack.wav")} volume={frame => clamp01((v2Clock.duration(V2_BEATS) - frame) / (v2Clock.fps * 1.5))} />}
  <MotionProject clock={v2Clock} camera={{ drift: 0.0004, shakeAmp: 5, beat: 0.003, bar: 0.006 }} look={{ grain: 0.045, vignette: 0.12 }}>
    {V2_SHOTS.map(shot => <Shot key={shot.id} beats={shot.beats} blurSamples={6} bg={T[shot.bg]} wipe={shot.wipe ? { kind: shot.wipe, accent: T.accent } : undefined}><V2Scene id={shot.id} /></Shot>)}
  </MotionProject>
</AbsoluteFill>;
