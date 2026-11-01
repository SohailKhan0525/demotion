import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { MotionProject, Shot } from "../engine/MotionProject";
import { useShot } from "../engine/context";
import { demotionTheme as T } from "../engine/theme";
import { FONT_FAMILY, MONO_FAMILY, archivo } from "../font";
import { clamp01, inOutExpo, spring } from "../core/math";
import { DrawPath, FollowPath, WorkflowIllustration } from "../illustration";
import { Scene3D } from "../three/Scene3D";
import { ExtrudedSvg } from "../three/ExtrudedSvg";
import { UPDATE_CODE, UPDATE_INSTALL, UPDATE_SHOTS, UPDATE_VERSION, updateClock } from "./timeline";

// Original mark. The inner subpath cuts a real opening through the extruded mesh.
const MARK_OUTER = "M20 15H90C151 15 184 48 184 100S151 185 90 185H20Z";
const MARK_INNER = "M57 51V149H88C124 149 146 132 146 100S124 51 88 51Z";
const MARK = `${MARK_OUTER} ${MARK_INNER}`;
const PLAY = "M78 65L132 100L78 135Z";
const MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path fill-rule="evenodd" d="${MARK}"/></svg>`;
const PLAY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path d="${PLAY}"/></svg>`;
const ROUTE = "M90 340C90 110 310 110 310 340S530 570 530 340S750 110 750 340";

const useMotion = () => {
  const shot = useShot();
  return { ...shot, beat: shot.frame / shot.clock.framesPerBeat,
    enter: (at = 0) => spring((shot.frame - shot.at(at)) / shot.clock.fps, 2.6, 0.68),
    travel: (at: number, over: number) => inOutExpo(clamp01((shot.frame - shot.at(at)) / Math.max(1, shot.at(at + over) - shot.at(at)))),
  };
};
const In: React.FC<{ children: React.ReactNode; at?: number; style?: React.CSSProperties }> = ({ children, at = 0, style }) => {
  const { enter } = useMotion(); const p = enter(at);
  return <div style={{ ...style, opacity: clamp01(p), transform: `translateY(${(1 - p) * 48}px)` }}>{children}</div>;
};
const Header: React.FC<{ dark?: boolean; chapter: string }> = ({ dark, chapter }) => <div style={{ position: "absolute", left: 96, top: 62, right: 96, display: "flex", justifyContent: "space-between", alignItems: "center", color: dark ? T.chalk : T.ink }}>
  <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: -1 }}>demotion<span style={{ fontFamily: MONO_FAMILY, fontSize: 20, fontWeight: 400, marginLeft: 20, opacity: 0.6 }}>0.3</span></div>
  <div style={{ fontFamily: MONO_FAMILY, fontSize: 19, opacity: 0.65 }}>{chapter}</div>
</div>;
const Headline: React.FC<{ lines: string[]; dark?: boolean; top?: number; size?: number }> = ({ lines, dark, top = 260, size = 112 }) => <div style={{ position: "absolute", top, left: 96, maxWidth: 970, color: dark ? T.chalk : T.ink }}>
  {lines.map((text, i) => <In key={text} at={-0.8 + i * 0.16}><div style={{ fontSize: size, lineHeight: 1.01, letterSpacing: -size * 0.05, fontVariationSettings: archivo(90, 650) }}>{text}</div></In>)}
</div>;
const Foot: React.FC<{ dark?: boolean; children: React.ReactNode }> = ({ dark, children }) => <div style={{ position: "absolute", bottom: 66, left: 98, right: 98, display: "flex", justifyContent: "space-between", fontFamily: MONO_FAMILY, fontSize: 20, color: dark ? T.chalk : T.ink, opacity: 0.7 }}>{children}</div>;

const Sculpture: React.FC<{ exploded?: boolean; hero?: boolean }> = ({ exploded, hero }) => {
  const { travel, enter } = useMotion();
  const spread = exploded ? 1 - travel(1.2, 4.5) : 0;
  return <div style={{ position: "absolute", inset: hero ? "110px -120px 40px 730px" : "130px 0px 0px 0px" }}>
    <Scene3D width={hero ? 1310 : 1920} height={hero ? 930 : 950} camera={{ position: hero ? [5, 2.8, 10] : [6, 3, 11], target: [0, 0, 0], fov: 36 }} cameraMoves={[
      { beat: 0, position: hero ? [5, 2.8, 10] : [6, 3, 11] },
      { beat: 10, position: hero ? [3, 1.3, 10] : [-3.5, 1.6, 11] },
    ]} background={hero ? T.chalk : T.ink}>
      <group rotation={[0.1, -0.14, -0.15]}>
        {[0, 1, 2].map(i => <ExtrudedSvg key={i} svg={MARK_SVG} size={4.35} depth={0.3} bevel={0.035} curveSegments={24} bevelSegments={4} color={[T.field, T.chalk, T.accent][i]} sideColor={[T.field, T.chalk, T.accent][i]} roughness={0.3} metalness={0.16} position={[(i - 1) * spread * 1.6, (i - 1) * spread * 0.35, (i - 1) * (0.48 + spread * 0.95)]} />)}
        <ExtrudedSvg svg={PLAY_SVG} size={1.26} depth={0.3} bevel={0.045} color={T.spark} sideColor={T.spark} roughness={0.25} metalness={0.18} position={[0.14, 0, 1.1 + spread * 2.4 + (hero ? 0 : (1 - enter(0.4)) * 1.5)]} />
      </group>
    </Scene3D>
  </div>;
};

const Hero = () => <>
  <Sculpture hero />
  <Header chapter="The illustration update" />
  <Headline lines={["Draw it.", "Give it", "depth."]} size={154} top={285} />
  <In at={0.5} style={{ position: "absolute", left: 102, top: 810, fontSize: 29, width: 600, lineHeight: 1.45 }}>Animated SVG. Sculpted 3D.<br />One React timeline.</In>
  <Foot><span>@demotion/cli · {UPDATE_VERSION}</span><span>Made with demotion + Remotion</span></Foot>
</>;

const Draw = () => {
  const { enter } = useMotion();
  return <>
    <Header chapter="01 / DrawPath" />
    <Headline lines={["Start with", "a line."]} top={290} />
    <In at={0.4} style={{ position: "absolute", top: 570, left: 100, width: 480, fontSize: 28, lineHeight: 1.5 }}>Turn SVG artwork into<br />a beat-timed reveal.</In>
    <svg style={{ position: "absolute", top: 155, left: 840, width: 840, height: 780 }} viewBox="0 0 800 740" aria-label="Original mark drawn as SVG paths">
      <g opacity=".13" stroke={T.field} strokeWidth="1">{Array.from({length: 9}, (_, i) => <React.Fragment key={i}><path d={`M${80 + i * 80} 30V710`} /><path d={`M40 ${50 + i * 80}H780`} /></React.Fragment>)}</g>
      <g transform="translate(70 55) scale(3.1)">
        <DrawPath d={MARK_OUTER} at={0.5} over={6} stroke={T.field} strokeWidth={1.5} />
        <DrawPath d={MARK_INNER} at={1} over={5.5} stroke={T.field} strokeWidth={1.5} />
        <DrawPath d={PLAY} at={2} over={3.5} stroke={T.spark} strokeWidth={1.5} />
        <path d={MARK} fill={T.field} fillRule="evenodd" opacity={clamp01(enter(6))} />
        <path d={PLAY} fill={T.spark} opacity={clamp01(enter(6.3))} />
      </g>
      {[[132,102],[640,102],[132,630],[640,630]].map(([x,y],i) => <g key={i} transform={`translate(${x} ${y}) scale(${enter(0.2+i*.15)})`}><circle r="8" fill={T.chalk} stroke={T.field} strokeWidth="2" /><path d="M-16 0H16M0 -16V16" stroke={T.field} opacity=".4" /></g>)}
    </svg>
    <Foot><span>Real SVG geometry</span><span>2D / @remotion/paths</span></Foot>
  </>;
};

const Follow = () => <>
  <Header dark chapter="02 / FollowPath" />
  <Headline dark lines={["A path.", "A point of view."]} top={220} size={112} />
  <svg viewBox="0 0 840 680" style={{ position: "absolute", width: 1180, height: 955, left: 750, top: 65 }} aria-label="Objects travel along a curved SVG route">
    <path d={ROUTE} fill="none" stroke={T.chalk} strokeWidth="1" opacity=".15" />
    <DrawPath d={ROUTE} at={0.1} over={8} stroke={T.accent} strokeWidth={5} />
    {[0,1,2].map(i => <FollowPath key={i} d={ROUTE} at={0.1 + i * 0.45} over={8} rotate>
      <rect x="-27" y="-19" width="54" height="38" rx="12" fill={[T.accent,T.field,T.spark][i]} stroke={T.ink} strokeWidth="3" />
      <path d="M-5 -7L6 0L-5 7" stroke={T.ink} strokeWidth="3" fill="none" />
    </FollowPath>)}
  </svg>
  <In at={0.4} style={{ position: "absolute", left: 102, top: 530, width: 550, fontSize: 28, color: T.chalk, lineHeight: 1.5 }}>Move along the curve.<br />Let the angle follow.</In>
  <Foot dark><span>Position + tangent rotation</span><span>Seek any frame. Same result.</span></Foot>
</>;

const Depth: React.FC<{ assembly?: boolean }> = ({ assembly }) => <>
  <Sculpture exploded={assembly} />
  <Header dark chapter={assembly ? "04 / Compose in space" : "03 / ExtrudedSvg + Scene3D"} />
  <div style={{ position: "absolute", left: 96, top: 166, color: T.chalk }}><In at={-0.2}><div style={{ fontSize: 100, letterSpacing: -5, fontWeight: 600 }}>{assembly ? "Built in layers." : "Your SVG. In 3D."}</div></In></div>
  <Foot dark><span>{assembly ? "Meshes. Materials. Camera." : "Actual extruded geometry"}</span><span>Three.js + React Three Fiber</span></Foot>
</>;

const Workflow = () => <>
  <Header chapter="05 / WorkflowIllustration" />
  <Headline lines={["Make the", "idea visible."]} top={260} size={110} />
  <In at={0.5} style={{position:"absolute",left:100,top:550,fontSize:28,lineHeight:1.5,width:530}}>Paths, objects and timing.<br />Reusable as React components.</In>
  <div style={{position:"absolute",left:720,top:220,width:1130,height:700}}><WorkflowIllustration at={0} width={1130} height={700} /></div>
  <Foot><span>Authored illustrations</span><span>One beat clock</span></Foot>
</>;

const Code = () => <>
  <Header dark chapter="06 / Compose with React" />
  <Headline dark lines={["Small API.", "Room to play."]} top={255} size={112} />
  <div style={{position:"absolute",left:780,top:275,width:1050,borderTop:`2px solid ${T.accent}`,paddingTop:32}}>
    {UPDATE_CODE.map((line,i)=><In key={i} at={i*.12} style={{fontFamily:MONO_FAMILY,fontSize:28,lineHeight:1.9,whiteSpace:"pre",color:i===1||i===2?T.accent:T.chalk}}>{line}</In>)}
    <In at={1} style={{fontSize:21,color:T.chalk,opacity:.6,marginTop:32,fontFamily:MONO_FAMILY}}>Inside a Shot · route is your SVG path</In>
  </div>
  <Foot dark><span>Included in @demotion/cli {UPDATE_VERSION}</span><span>3D via optional /three entry</span></Foot>
</>;

const Close = () => <>
  <Header chapter="Create your next film" />
  <div style={{position:"absolute",left:96,top:220,right:96}}>
    <In at={-0.2}><div style={{fontSize:164,fontVariationSettings:archivo(88,650),letterSpacing:-9,lineHeight:1.03}}>Make it yours.</div></In>
    <In at={.2} style={{fontSize:32,marginTop:32}}>The illustration update · @demotion/cli {UPDATE_VERSION}</In>
    <In at={.5} style={{marginTop:78,padding:"30px 36px",background:T.ink,color:T.accent,fontFamily:MONO_FAMILY,fontSize:35,borderRadius:12}}>{UPDATE_INSTALL}</In>
    <In at={.7} style={{fontFamily:MONO_FAMILY,fontSize:25,marginTop:22}}>cd my-video  →  npm install  →  npm start</In>
    <In at={.9} style={{marginTop:70,fontSize:30,color:T.field}}>github.com/SohailKhan0525/demotion</In>
  </div>
  <Foot><span>Free for personal / non-commercial use. Commercial license for business.</span><span>Remotion has separate terms.</span></Foot>
</>;

export const UpdateFilm: React.FC<{muted?:boolean}> = ({muted=false}) => <AbsoluteFill style={{fontFamily:FONT_FAMILY}}>
  {!muted && <Audio src={staticFile("update-soundtrack.wav")} />}
  <MotionProject clock={updateClock} camera={{beat:.001,bar:.002,drift:.001,shakeAmp:.12}} look={{grain:.025,vignette:.04}} motionBlur={{samples:4,shutterAngle:160}}>
    {UPDATE_SHOTS.map((shot,i) => <Shot key={shot.id} beats={shot.beats} bg={["follow","depth","assembly","code"].includes(shot.id)?T.ink:T.chalk} hit={0} blurSamples={["hero","depth","assembly"].includes(shot.id)?2:4} wipe={i?{kind:"slide",lead:8,tail:10,color:["follow","depth","assembly","code"].includes(shot.id)?T.ink:T.chalk}:undefined}>
      {shot.id==="hero"?<Hero/>:shot.id==="draw"?<Draw/>:shot.id==="follow"?<Follow/>:shot.id==="depth"?<Depth/>:shot.id==="assembly"?<Depth assembly/>:shot.id==="workflow"?<Workflow/>:shot.id==="code"?<Code/>:<Close/>}
    </Shot>)}
  </MotionProject>
</AbsoluteFill>;
