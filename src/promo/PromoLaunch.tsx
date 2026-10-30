import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { MotionProject, Shot } from "../engine/MotionProject";
import { demotionTheme as T } from "../engine/theme";
import { clamp01, outExpo } from "../core/math";
import { FONT_FAMILY, MONO_FAMILY, SERIF_FAMILY } from "../font";
import { KineticHeadline } from "../type/KineticHeadline";
import { CountUp } from "../ui/CountUp";
import { BarChart } from "../ui/BarChart";
import { ProgressRing } from "../ui/ProgressRing";
import { CaptionTrack } from "../ui/CaptionTrack";
import { LowerThird } from "../ui/LowerThird";
import { CodeLines, Copy, FrameSculpture, Note, Paper, Reveal, Surface, TypeSpecimen, Wordmark, useBeatMotion } from "./art";
import { PROMO_BEATS, PROMO_CAPTIONS, PROMO_CODE, PROMO_COMMANDS, PROMO_RENDER, PROMO_SHOTS, promoClock, type PromoShotId } from "./timeline";

const CenterHeading: React.FC<{ first: string; second?: string; sub?: string }> = ({ first, second, sub }) => <div style={{ position: "absolute", top: 174, left: 120, right: 120, textAlign: "center" }}>
  <Reveal at={-0.55}><div style={{ fontSize: 83, fontWeight: 500, letterSpacing: -4.6, color: T.ink }}>{first} {second && <span style={{ color: T.field }}>{second}</span>}</div></Reveal>
  {sub && <Reveal at={-0.15}><div style={{ fontSize: 28, marginTop: 20, color: `${T.ink}B0` }}>{sub}</div></Reveal>}
</div>;

const Intro = () => <>
  <div style={{ position: "absolute", left: 140, right: 140, top: 175, textAlign: "center" }}>
    <div style={{ fontSize: 100, fontWeight: 500, letterSpacing: -6, color: T.ink }}>Ideas deserve <span style={{ color: T.field }}>motion.</span></div>
    <Reveal at={-0.3}><div style={{ marginTop: 25, fontSize: 30, color: `${T.ink}B0` }}>A React toolkit for videos that feel designed.</div></Reveal>
  </div>
  <div style={{ position: "absolute", left: 650, top: 445 }}><FrameSculpture size={420} assembled /></div>
  <Reveal at={0.7} style={{ position: "absolute", left: 330, top: 590 }}><Paper style={{ padding: "30px 42px", transform: "rotate(-8deg)" }}><TypeSpecimen text="Aa" /><div style={{ fontSize: 19, marginTop: 8, color: `${T.ink}99` }}>Type with character</div></Paper></Reveal>
  <Reveal at={1} style={{ position: "absolute", right: 245, top: 595 }}><Paper style={{ padding: "32px 35px", transform: "rotate(8deg)" }}><div style={{ display: "flex", gap: 12, alignItems: "end", height: 100 }}>{[55, 88, 70, 100].map((h, i) => <div key={i} style={{ width: 30, height: h, borderRadius: 8, background: i === 3 ? T.spark : T.field }} />)}</div><div style={{ marginTop: 20, fontSize: 19, color: `${T.ink}99` }}>Stories in every frame</div></Paper></Reveal>
  <Note>Written in React. Rendered with Remotion.</Note>
</>;

const Workflow = () => {
  const { ease } = useBeatMotion();
  return <>
    <CenterHeading first="Your code." second="A real video." sub="Compose the scene. Preview it. Render on your computer." />
    <svg width="1920" height="1080" style={{ position: "absolute" }} aria-hidden>
      <path d="M580 628C720 628 680 628 815 628M1110 628C1210 628 1190 628 1320 628" fill="none" stroke={`${T.field}35`} strokeWidth="3" strokeDasharray="8 10" />
      {[0, 1].map(i => <circle key={i} cx={580 + i * 530 + ease(1 + i, 2) * 210} cy="628" r="7" fill={T.field} opacity={1 - ease(3 + i, 0.5)} />)}
    </svg>
    <Reveal at={0.1} style={{ position: "absolute", left: 185, top: 450 }}><Paper style={{ width: 420, height: 325, transform: "rotate(-5deg)", padding: 35, boxSizing: "border-box" }}><div style={{ fontSize: 22, color: `${T.ink}99` }}>scene.tsx</div><div style={{ fontSize: 32, marginTop: 32, fontFamily: MONO_FAMILY, color: T.field }}>&lt;Shot&gt;</div><div style={{ fontSize: 26, margin: "20px 0 20px 22px", fontFamily: MONO_FAMILY, color: T.ink }}>Your next idea</div><div style={{ fontSize: 32, fontFamily: MONO_FAMILY, color: T.field }}>&lt;/Shot&gt;</div></Paper></Reveal>
    <div style={{ position: "absolute", left: 785, top: 464 }}><FrameSculpture size={245} /></div>
    <Reveal at={0.65} style={{ position: "absolute", right: 175, top: 440 }}><Paper style={{ width: 415, height: 345, transform: "rotate(5deg)" }}><div style={{ background: T.field, height: 265, display: "grid", placeItems: "center", color: T.chalk, fontSize: 62, letterSpacing: -3, fontWeight: 700 }}>Make it move.</div><div style={{ padding: "22px 26px", fontSize: 22, color: T.ink }}>video.mp4</div></Paper></Reveal>
    <Note>Workflow illustration · your editor → Demotion + Remotion → local MP4</Note>
  </>;
};

const Code = () => <>
  <Copy eyebrow="A scene is a component" lines={["Write a scene.", "Watch it move."]} detail="Use React to compose your animation, one reusable part at a time." />
  <Reveal at={0.15} x={80} style={{ position: "absolute", left: 810, top: 230 }}><Paper dark style={{ width: 930, height: 510, transform: "rotate(1deg)" }}><div style={{ padding: "24px 30px", borderBottom: `1px solid ${T.chalk}20`, fontSize: 23, color: `${T.chalk}A0`, fontFamily: MONO_FAMILY }}>scene.tsx <span style={{ float: "right", color: T.accent }}>React</span></div><CodeLines lines={PROMO_CODE} /></Paper></Reveal>
  <Reveal at={2.1} style={{ position: "absolute", left: 1040, top: 677 }}><Paper style={{ width: 680, height: 200, background: T.field }}><KineticHeadline text="Make it move." width={555} color={T.chalk} accent={T.accent} at={2.25} stagger={2} underline={false} /></Paper></Reveal>
  <Note>Shot + KineticHeadline · available in npm 0.1.0</Note>
</>;

const Type = () => {
  const { enter, ease } = useBeatMotion();
  const p = enter(0.2);
  return <>
    <Copy eyebrow="Typography, with personality" lines={["Type with", "character."]} detail="Spring entrances. Variable-width letters. A rhythm you can feel." />
    <div style={{ position: "absolute", left: 820, top: 260, width: 935, height: 550, transform: `perspective(1600px) rotateY(${(1 - ease(0.4, 4)) * -9}deg) rotateZ(${(1 - p) * 4 - 2}deg)` }}>
      <Paper style={{ width: "100%", height: "100%", background: T.field }}><div style={{ position: "absolute", top: 48, left: 50, color: `${T.chalk}A0`, fontSize: 23 }}>KineticHeadline</div><KineticHeadline text="Move." width={735} color={T.chalk} accent={T.accent} at={0.35} underline stagger={4} /></Paper>
      <Reveal at={1.4} style={{ position: "absolute", left: -50, bottom: -60 }}><Paper style={{ width: 165, height: 155, display: "grid", placeItems: "center", transform: "rotate(-9deg)" }}><span style={{ fontFamily: SERIF_FAMILY, fontSize: 100, color: T.ink }}>a</span></Paper></Reveal>
      <Reveal at={1.6} style={{ position: "absolute", right: -25, top: -55 }}><Paper style={{ padding: "22px 28px", background: T.accent, transform: "rotate(8deg)" }}><TypeSpecimen text="Aa" color={T.ink} /></Paper></Reveal>
    </div>
    <Note>Fonts are bundled with the starter.</Note>
  </>;
};

const Timing = () => {
  const { beat, enter } = useBeatMotion();
  const active = Math.min(7, Math.max(0, Math.floor(beat)));
  return <>
    <Copy eyebrow="One shared clock" lines={["Every move.", "On your beat."]} detail="Time scenes, transitions and sound in beats." />
    <Reveal at={0.1} x={60} style={{ position: "absolute", left: 850, top: 240 }}><Paper style={{ width: 880, height: 605, padding: 48, boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}><div><div style={{ fontSize: 22, color: `${T.ink}99`, marginBottom: 12 }}>This film’s clock</div><div style={{ fontSize: 94, fontWeight: 600, letterSpacing: -6, color: T.ink }}>120 <span style={{ fontSize: 30, letterSpacing: 0, color: T.field }}>BPM</span></div></div><svg width="140" height="140" viewBox="0 0 140 140" aria-hidden><circle cx="70" cy="70" r="60" fill="none" stroke={`${T.field}18`} strokeWidth="9" />{Array.from({ length: 8 }, (_, i) => <circle key={i} cx={70 + Math.sin(i * Math.PI / 4) * 60} cy={70 - Math.cos(i * Math.PI / 4) * 60} r={i === active ? 10 : 5} fill={i === active ? T.field : T.ink + "35"} />)}<path d="M70 70V34" stroke={T.field} strokeWidth="6" strokeLinecap="round" transform={`rotate(${active * 45} 70 70)`} /></svg></div>
      {["Picture", "Sound FX", "Music"].map((label, row) => <div key={label} style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 26, opacity: clamp01(enter(0.4 + row * 0.15)) }}><div style={{ width: 120, fontSize: 22, color: `${T.ink}A0` }}>{label}</div>{Array.from({ length: 8 }, (_, col) => <div key={col} style={{ width: 65, height: 52, borderRadius: 10, background: col <= active ? [T.field, T.spark, T.ink][row] : T.ink + "09", transform: `scale(${col === active ? 1 + 0.06 * Math.sin(Math.PI * (beat % 1)) : 1})` }} />)}</div>)}
    </Paper></Reveal>
    <Note>Scene and sound timing share createBeatClock({"{ bpm: 120, fps: 60 }"}).</Note>
  </>;
};

const Data = () => <>
  <Copy eyebrow="New on main · source preview" lines={["Give numbers", "a story."]} detail="Counters, charts and progress rings. Animated from the values you provide." />
  <Reveal at={0.15} x={55} style={{ position: "absolute", left: 825, top: 250 }}><Paper dark style={{ width: 915, height: 575, padding: 44, boxSizing: "border-box", transform: "rotate(-1deg)" }}>
    <div style={{ color: `${T.chalk}A0`, fontSize: 22, marginBottom: 28 }}>The timing behind this film</div>
    <CountUp value={120} suffix=" BPM" fontSize={92} at={0.5} over={2} label="One clock, every scene" />
    <div style={{ marginTop: 40 }}><BarChart width={815} rowHeight={73} max={6} at={1} over={2.5} stagger={0.25} suffix=" sec" data={[{ label: "Opening", value: 4, color: T.accent }, { label: "Code scene", value: 6, color: T.field }, { label: "Typography", value: 4, color: T.spark }]} /></div>
  </Paper></Reveal>
  <Reveal at={1.5} style={{ position: "absolute", right: 120, top: 710 }}><Paper dark style={{ padding: 20, borderRadius: 32 }}><ProgressRing value={0.75} size={170} strokeWidth={12} at={1.7} over={2} label="Sample progress" /></Paper></Reveal>
  <Note>Chart: actual scene lengths. Ring: sample value. New APIs are not in npm 0.1.0.</Note>
</>;

const Captions = () => {
  const { beat } = useBeatMotion();
  return <>
    <Copy eyebrow="New on main · source preview" lines={["Keep the", "story clear."]} detail="Write your captions and title cards. Choose when each one appears." />
    <Reveal at={0.15} x={60} style={{ position: "absolute", left: 810, top: 240 }}><Paper style={{ width: 950, height: 610, background: T.field }}>
      <div style={{ position: "absolute", top: 45, left: 45, fontSize: 22, color: `${T.chalk}A0` }}>Rendered with CaptionTrack + LowerThird</div>
      <div style={{ position: "absolute", left: 360, top: 110, transform: `rotate(${Math.sin(beat * Math.PI / 4) * 3}deg)` }}><FrameSculpture size={245} assembled /></div>
      <LowerThird title="A story worth telling." subtitle="Made with demotion" at={0.6} beats={6.8} left={40} bottom={165} width={690} />
      <CaptionTrack cues={PROMO_CAPTIONS} fontSize={32} bottom={50} />
    </Paper></Reveal>
    <Note>Authored captions; no automatic transcription. New APIs are not in npm 0.1.0.</Note>
  </>;
};

const Toolkit = () => {
  const { enter, beat } = useBeatMotion();
  const items = ["KineticHeadline", "CodePanel", "CameraRig", "CountUp", "ProgressRing", "CaptionTrack"];
  return <>
    <CenterHeading first="Small parts." second="Your whole story." sub="Compose the toolkit in React. Make the result your own." />
    <div style={{ position: "absolute", left: 230, top: 420, display: "grid", gridTemplateColumns: "repeat(3, 450px)", gap: 32 }}>
      {items.map((name, i) => {
        const p = enter(0.15 + i * 0.12);
        return <Paper key={name} style={{ width: 450, height: 210, boxSizing: "border-box", padding: "26px 30px", opacity: clamp01(p), transform: `translateY(${(1 - p) * 60}px)` }}><div style={{ height: 106, display: "flex", alignItems: "center" }}>
          {i === 0 && <TypeSpecimen text="Aa" />}
          {i === 1 && <span style={{ fontFamily: MONO_FAMILY, fontSize: 62, color: T.field }}>&lt;/&gt;</span>}
          {i === 2 && <svg width="110" height="90" viewBox="0 0 110 90" aria-hidden><rect x="12" y="12" width="85" height="66" rx="12" fill="none" stroke={T.field} strokeWidth="5" /><circle cx={55 + Math.sin(beat * Math.PI / 4) * 12} cy="45" r="17" fill="none" stroke={T.field} strokeWidth="5" /></svg>}
          {i === 3 && <CountUp value={120} at={0.6} fontSize={76} color={T.field} />}
          {i === 4 && <div style={{ padding: 6, background: T.ink, borderRadius: 20 }}><ProgressRing value={0.75} at={0.7} size={92} strokeWidth={8} color={T.accent} /></div>}
          {i === 5 && <div style={{ padding: "13px 19px", borderRadius: 12, background: T.ink, color: T.chalk, fontSize: 28 }}>Every word.</div>}
        </div><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 22, color: T.ink, marginTop: 15 }}>{name}<span style={{ fontSize: 17, color: `${T.ink}80` }}>{i > 2 ? "on main" : "npm 0.1.0"}</span></div></Paper>;
      })}
    </div>
    <Note>Includes core tools and source-preview additions. More in the component guide.</Note>
  </>;
};

const Sound = () => {
  const { beat, enter } = useBeatMotion();
  return <>
    <Copy eyebrow="Sound, made from code" lines={["The rhythm", "comes with it."]} detail="Build a score from music layers and timed sound cues." />
    <Reveal at={0.15} style={{ position: "absolute", left: 825, top: 275 }}><Paper style={{ width: 920, height: 500, padding: 45, boxSizing: "border-box" }}>
      <div style={{ fontSize: 23, color: `${T.ink}A0` }}>This film’s procedural soundtrack</div>
      <div style={{ height: 235, display: "flex", alignItems: "center", gap: 10, marginTop: 15 }}>{Array.from({ length: 40 }, (_, i) => {
        const envelope = 0.15 + Math.pow(Math.sin(i * 0.28), 2) * (0.4 + 0.6 * Math.pow(Math.cos(beat * Math.PI / 2 - i * 0.17), 2));
        return <div key={i} style={{ width: 11, height: 190 * envelope * clamp01(enter(0.2 + i * 0.012)), borderRadius: 6, background: i > 27 ? T.spark : T.field }} />;
      })}</div>
      <div style={{ display: "flex", gap: 28, borderTop: `1px solid ${T.ink}14`, paddingTop: 28, fontSize: 25, color: T.ink }}>{["Music", "Whooshes", "Clicks", "Chimes"].map((s, i) => <Reveal key={s} at={0.7 + i * 0.2}>{s}</Reveal>)}</div>
    </Paper></Reveal>
    <Note>Original synthesized audio · beat-driven illustration, not a measured waveform</Note>
  </>;
};

const Render = () => {
  const { ease } = useBeatMotion();
  const p = ease(2.5, 2);
  return <>
    <Copy eyebrow="On your own computer" lines={["Your project.", "Your render."]} detail="Preview in Remotion Studio. Export an MP4 locally." />
    <Reveal at={0.1} style={{ position: "absolute", left: 840, top: 255 }}><Paper style={{ width: 855, height: 550, padding: 20, background: T.ink }}>
      <div style={{ height: 410, borderRadius: 15, background: T.field, position: "relative", overflow: "hidden" }}><KineticHeadline text="Made by you." width={685} color={T.chalk} accent={T.accent} at={0.5} stagger={2.3} /></div>
      <div style={{ fontFamily: MONO_FAMILY, padding: "30px 22px", color: T.chalk, fontSize: 30 }}><span style={{ color: T.accent }}>$ </span>{PROMO_RENDER}</div>
    </Paper><div style={{ width: 980, height: 22, background: `${T.ink}E0`, borderRadius: "0 0 35px 35px", marginLeft: -42, boxShadow: `0 18px 30px ${T.ink}16` }} /></Reveal>
    <Reveal at={3} style={{ position: "absolute", left: 1360, top: 690 }}><Paper style={{ padding: "25px 32px", transform: `translateY(${(1 - p) * -30}px) rotate(5deg)` }}><div style={{ color: T.field, fontSize: 38, marginBottom: 8 }}>video.mp4</div><div style={{ color: `${T.ink}99`, fontSize: 21 }}>Local output</div></Paper></Reveal>
    <Note>Workflow illustration · no hosted rendering service to configure</Note>
  </>;
};

const Install = () => <>
  <Copy eyebrow="Start with the published CLI" lines={["Your next film", "starts here."]} detail="Create a project. Install its dependencies. Open the preview." top={285} />
  <Reveal at={0.15} x={50} style={{ position: "absolute", left: 795, top: 280 }}><Paper dark style={{ width: 1000, height: 455 }}><div style={{ padding: "25px 34px", fontSize: 23, color: `${T.chalk}A0`, borderBottom: `1px solid ${T.chalk}20` }}>Terminal</div><div style={{ padding: "30px 32px", color: T.chalk, fontFamily: MONO_FAMILY, fontSize: 27, lineHeight: 2.4 }}>{PROMO_COMMANDS.map((line, i) => <Reveal key={line} at={0.4 + i * 0.7} y={18}><span style={{ color: T.accent }}>$ </span>{line}</Reveal>)}</div></Paper></Reveal>
  <Reveal at={3.2} style={{ position: "absolute", left: 825, top: 785, color: `${T.ink}B0`, fontSize: 26 }}>Node.js 22.14+ · npm · Chromium for rendering</Reveal>
  <Note>npm 0.1.0: original toolkit. New data and caption components: source on GitHub.</Note>
</>;

const Close = () => <>
  <div style={{ position: "absolute", left: 140, right: 140, top: 200, textAlign: "center" }}>
    <Reveal at={-0.4}><div style={{ fontSize: 94, fontWeight: 500, letterSpacing: -5.5, color: T.ink }}>Make something <span style={{ color: T.field }}>move.</span></div></Reveal>
    <Reveal at={0.1}><div style={{ fontSize: 31, marginTop: 28, color: `${T.ink}A0` }}>Your idea. Your code. Your next video.</div></Reveal>
  </div>
  <div style={{ position: "absolute", left: 795, top: 420 }}><FrameSculpture size={245} assembled /></div>
  <Reveal at={0.5} style={{ position: "absolute", left: 0, right: 0, top: 752, display: "flex", justifyContent: "center" }}><Wordmark size={64} /></Reveal>
  <Reveal at={0.8} style={{ position: "absolute", left: 0, right: 0, top: 858, textAlign: "center", color: T.field, fontSize: 29 }}>github.com/SohailKhan0525/demotion</Reveal>
  <div style={{ position: "absolute", bottom: 62, left: 100, right: 100, textAlign: "center", color: `${T.ink}A6`, fontSize: 23 }}>Free for personal use · Commercial license for business · Remotion terms apply</div>
</>;

const scenes: Record<PromoShotId, React.FC> = { intro: Intro, workflow: Workflow, code: Code, type: Type, timing: Timing, data: Data, captions: Captions, toolkit: Toolkit, sound: Sound, render: Render, install: Install, close: Close };

const Scene: React.FC<{ id: PromoShotId; index: number }> = ({ id, index }) => {
  const { frame, durationFrames, clock } = useBeatMotion();
  const exit = outExpo(clamp01((frame - durationFrames + clock.duration(0.3)) / clock.duration(0.3)));
  const Content = scenes[id];
  return <AbsoluteFill style={{ fontFamily: FONT_FAMILY }}>
    <Surface />
    <div style={{ position: "absolute", left: 126, top: 70 }}><Wordmark /></div>
    <div style={{ position: "absolute", right: 126, top: 76, fontSize: 22, color: `${T.ink}80` }}>Motion graphics, written in code.</div>
    <AbsoluteFill style={{ opacity: id === "close" ? 1 : 1 - exit * 0.8, transform: `translateY(${-exit * 12}px)` }}><Content /></AbsoluteFill>
    {id !== "close" && <div style={{ position: "absolute", right: 126, bottom: 64, color: `${T.ink}70`, fontFamily: MONO_FAMILY, fontSize: 19 }}>{String(index + 1).padStart(2, "0")} / 12</div>}
  </AbsoluteFill>;
};

export const PromoLaunch: React.FC<{ muted?: boolean }> = ({ muted = false }) => <AbsoluteFill>
  {!muted && <Audio src={staticFile("promo-soundtrack.wav")} volume={frame => clamp01((promoClock.duration(PROMO_BEATS) - frame) / (promoClock.fps * 2))} />}
  <MotionProject clock={promoClock} camera={{ beat: 0.0006, bar: 0.0008, drift: 0.00005, shakeAmp: 0 }} look={{ grain: 0.018, vignette: 0.025 }}>
    {PROMO_SHOTS.map((shot, index) => <Shot key={shot.id} beats={shot.beats} bg={T.chalk} hit={0} blurSamples={4}><Scene id={shot.id} index={index} /></Shot>)}
  </MotionProject>
</AbsoluteFill>;
