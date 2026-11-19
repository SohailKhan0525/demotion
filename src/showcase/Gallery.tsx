import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { AbsoluteFill, Sequence } from "remotion";
import { createBeatClock } from "../core/clock";
import { CardFan } from "../components/CardFan";
import { CloudGradient } from "../components/CloudGradient";
import { LoadingButton } from "../components/LoadingButton";
import { Safari } from "../components/Safari";
import { LayersIcon, PaletteIcon, SparkIcon } from "../components/icons";
import { RadialTicks } from "../components/reel/geometry";
import { MarqueeBands } from "../components/reel/motion";
import { KineticType } from "../components/reel/typography";
import { demotionTheme as T } from "../engine/theme";
import { FONT_FAMILY, MONO_FAMILY } from "../font";
import { RubiksCube } from "../three/RubiksCube";
import { scaleFadeBlur } from "../transitions/scaleFadeBlur";
import { speedRampCut } from "../transitions/speedRampCut";
import { HandCursor, MaskWipe } from "../v2/primitives";

const clock = createBeatClock({ bpm: 120, fps: 60 });
const swatches = [
  { label: "Carbon", gradient: `linear-gradient(135deg, ${T.ink}, ${T.field})`, icon: <LayersIcon /> },
  { label: "Cobalt", gradient: T.field, icon: <PaletteIcon /> },
  { label: "Ember", gradient: T.spark, icon: <SparkIcon /> },
];
const caption: React.CSSProperties = { fontFamily: MONO_FAMILY, fontSize: 30, letterSpacing: 1 };

// The cursor lands on the same beat that CardFan selects the middle swatch.
const InterfaceStudy = () => <AbsoluteFill>
  <CloudGradient colors={[T.field, T.chalk, T.accent]} speed={0.55} />
  <Safari url="Demotion / Palette study" dark tilt={false}>
    <AbsoluteFill style={{ background: T.ink, color: T.chalk, fontFamily: FONT_FAMILY }}>
      <div style={{ position: "absolute", top: 85, left: 85, ...caption }}>Component study</div>
      <div style={{ position: "absolute", left: 80, top: 228, width: 560, fontSize: 114, fontWeight: 850, lineHeight: .96 }}>
        Pick a<br />swatch.
      </div>
      <div style={{ position: "absolute", left: 590, top: 124, width: 730, height: 500, transform: "scale(1.65)" }}>
        <CardFan items={swatches} openAt={clock.frame(.4)} selectAt={clock.frame(4)} selectIndex={1} spread={116} />
      </div>
      <div style={{ position: "absolute", left: 85, bottom: 125, transform: "scale(2)", transformOrigin: "left center" }}>
        <LoadingButton messages={["Opening swatches", "Selecting Cobalt"]} holdFrames={clock.duration(2)} />
      </div>
      <HandCursor keys={[
        { frame: clock.frame(1), x: 1100, y: 655 },
        { frame: clock.frame(4), x: 963, y: 427, click: true },
        { frame: clock.frame(6), x: 1060, y: 600 },
      ]} scale={1.8} />
    </AbsoluteFill>
  </Safari>
</AbsoluteFill>;

const ReelStudy = () => <AbsoluteFill style={{ background: T.chalk }}>
  <Sequence durationInFrames={clock.frame(4)}>
    <Sequence width={1000} height={1080} style={{ left: 920 }}>
      <RadialTicks background={T.chalk} />
    </Sequence>
    <div style={{ position: "absolute", left: 20, top: 130, width: 1000, height: 790 }}>
      <KineticType text="MARK" fontSize={277} color={T.ink} accentIndex={1} accent={T.field} />
    </div>
    <MaskWipe start={clock.frame(.3)} dur={clock.duration(.6)} style={{ position: "absolute", left: 112, bottom: 92, ...caption }}>
      KineticType + RadialTicks
    </MaskWipe>
  </Sequence>
  <Sequence from={clock.frame(4)}>
    <MarqueeBands background={T.ink} angle={-9} bandHeight={198} bands={[
      { text: "MARK", background: T.chalk, color: T.ink, speed: 5, dir: 1 },
      { text: "MOVE", background: T.field, color: T.chalk, speed: 7, dir: -1 },
      { text: "REPEAT", background: T.accent, color: T.ink, speed: 5, dir: 1 },
    ]} />
  </Sequence>
</AbsoluteFill>;

const CubeStudy = () => <AbsoluteFill style={{ background: T.chalk }}>
  <RubiksCube background={T.chalk} moveFrames={clock.duration(1)} />
  <div style={{ position: "absolute", bottom: 72, left: 100, right: 100, display: "flex", justifyContent: "space-between", color: T.ink, ...caption }}>
    <span>RubiksCube</span><span>@demotion/cli/three</span>
  </div>
</AbsoluteFill>;

/** Each study starts eight beats apart. The half-beat overlap is included in the outgoing sequence. */
export const ComponentGallery = () => <TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={clock.duration(8.5)}><InterfaceStudy /></TransitionSeries.Sequence>
  <TransitionSeries.Transition timing={linearTiming({ durationInFrames: clock.duration(.5) })} presentation={scaleFadeBlur()} />
  <TransitionSeries.Sequence durationInFrames={clock.duration(8.5)}><ReelStudy /></TransitionSeries.Sequence>
  <TransitionSeries.Transition timing={linearTiming({ durationInFrames: clock.duration(.5) })} presentation={speedRampCut()} />
  <TransitionSeries.Sequence durationInFrames={clock.duration(8)}><CubeStudy /></TransitionSeries.Sequence>
</TransitionSeries>;
