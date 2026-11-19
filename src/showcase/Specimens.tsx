import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { CodeTabs } from "../components/CodeTabs";
import { CursorActor } from "../components/CursorActor";
import { PillButton, Sidebar } from "../components/DashboardChrome";
import { FloatingCard, ScoreBadge } from "../components/FloatingCard";
import { GlowBeams } from "../components/GlowBeams";
import { GlowToggle } from "../components/GlowToggle";
import { LiquidBlob } from "../components/LiquidBlob";
import { MaskReveal } from "../components/MaskReveal";
import { ParallaxBackdrop } from "../components/ParallaxBackdrop";
import { ParticleText } from "../components/ParticleText";
import { HighlightCircle, LineDraw } from "../components/ShapeAccent";
import { TypingText } from "../components/TypingText";
import { CheckIcon, ChevronRightIcon, LockIcon } from "../components/icons";
import { Halftone, RectTunnel, Starburst, WireTerrain } from "../components/reel/geometry";
import { EasingGraph, ParticleSphere, ShapeMorph } from "../components/reel/motion";
import { NumberRoll, SerifReveal, StackType } from "../components/reel/typography";
import { createBeatClock } from "../core/clock";
import { demotionTheme as T } from "../engine/theme";
import { FONT_FAMILY, MONO_FAMILY } from "../font";
import { Blobs } from "../v2/Blobs";
import { Caret, Glass, GradientText, Sparkle } from "../v2/primitives";

const clock = createBeatClock({ fps: 60, bpm: 120 });
const spreadFrames = clock.duration(8);
const center: React.CSSProperties = { alignItems: "center", justifyContent: "center" };

// A full-size stage preserves the coordinate system of the original 1920px reel components.
function Sample({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ width: 880 }}>
    <div style={{ position: "relative", width: 880, height: 495, overflow: "hidden", background: T.ink }}>
      <div style={{ position: "relative", width: 1920, height: 1080, transformOrigin: "top left", transform: "scale(0.4583333333)" }}>
        {children}
      </div>
    </div>
    <div style={{ marginTop: 24, fontSize: 33, color: T.chalk, fontFamily: MONO_FAMILY }}>{label}</div>
  </div>;
}

function Spread({ title, children }: { title: string; children: React.ReactNode }) {
  return <AbsoluteFill style={{ background: T.ink, color: T.chalk, padding: "68px 66px", boxSizing: "border-box", fontFamily: FONT_FAMILY, overflow: "hidden" }}>
    <div style={{ fontSize: 36, color: T.accent, fontFamily: MONO_FAMILY }}>Demotion / Component library</div>
    <div style={{ fontSize: 123, fontWeight: 850, lineHeight: 1.08, letterSpacing: -6, margin: "24px 0 58px" }}>{title}</div>
    <div style={{ display: "flex", gap: 28 }}>{children}</div>
  </AbsoluteFill>;
}

function Alternating({ labels, children }: { labels: [string, string]; children: [React.ReactNode, React.ReactNode] }) {
  const half = clock.duration(4);
  return <Sample label={labels[useCurrentFrame() < half ? 0 : 1]}>
    <Sequence durationInFrames={half}>{children[0]}</Sequence>
    <Sequence from={half}>{children[1]}</Sequence>
  </Sample>;
}

function InterfaceDetails() {
  return <Spread title="Interface details">
    <Sample label="Sidebar + GlowToggle">
      <AbsoluteFill style={{ background: T.ink }}>
        <div style={{ display: "flex", position: "absolute", width: 800, height: 450, transform: "scale(2.4)", transformOrigin: "top left" }}>
          <Sidebar dark brand="Demotion" items={["Overview", "Layers", "Palette", "Glow"]} active={3} />
          <div style={{ flex: 1 }}><GlowToggle color={T.accent} label="GLOW" sublabel="Light study" /></div>
        </div>
      </AbsoluteFill>
    </Sample>
    <Sample label="CodeTabs + CursorActor">
      <AbsoluteFill style={{ background: T.field, ...center }}>
        <div style={{ transform: "scale(2.45)" }}>
          <CodeTabs fileName="scene.tsx" tabs={[{ label: "scene.tsx", glyph: "TS", accent: T.field }]} activeIndex={0}
            lines={[
              [{ text: 'import { GlowToggle }', color: T.chalk }],
              [{ text: '  from "@demotion/cli";', color: T.accent }],
              [],
              [{ text: 'export const Light = () => (' }],
              [{ text: '  <GlowToggle label="GLOW" />', color: T.accent }],
              [{ text: ');' }],
            ]} />
        </div>
        <CursorActor keyframes={[{ frame: 0, x: 350, y: 225 }, { frame: clock.frame(3), x: 795, y: 656, click: true }]} />
      </AbsoluteFill>
    </Sample>
  </Spread>;
}

function RevealAndAnnotate() {
  return <Spread title="Reveal and annotate">
    <Sample label="MaskReveal + LineDraw">
      <ParallaxBackdrop />
      <MaskReveal kind="iris" durationInFrames={clock.frame(2)}>
        <AbsoluteFill style={center}>
          <Glass style={{ position: "relative", width: 1240, padding: "90px 84px", boxSizing: "border-box", color: T.ink }}>
            <div style={{ fontSize: 80 }}><GradientText>On the beat.</GradientText><Caret height={65} color={T.field} /></div>
            <TypingText text="Mark the downbeat" color={T.ink} fontSize={83} charsPerSecond={12} />
            <LineDraw width={590} color={T.field} strokeWidth={10} startAt={clock.frame(1)} />
            <div style={{ position: "absolute", right: 110, top: 115, width: 116, height: 116 }}>
              <Sparkle size={116} color={T.field} />
              <HighlightCircle size={210} color={T.spark} startAt={clock.frame(2)} />
            </div>
          </Glass>
        </AbsoluteFill>
      </MaskReveal>
    </Sample>
    <Sample label="FloatingCard + ScoreBadge">
      <Blobs preset="lightPink" />
      <div style={{ transformOrigin: "top left", transform: "scale(3)", width: 640, height: 360, position: "relative", fontFamily: FONT_FAMILY }}>
        <FloatingCard x={92} y={83} width={410} rotate={-3}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", color: T.ink, fontSize: 25, marginBottom: 18 }}>
            <LockIcon size={22} /> Timing study <ChevronRightIcon size={17} />
          </div>
          <ScoreBadge label="Demo progress" score={8} maxScore={12} color={T.field} />
          <div style={{ marginTop: 20, display: "flex", gap: 10, alignItems: "center" }}><CheckIcon size={20} /><PillButton label="Preview" /></div>
        </FloatingCard>
      </div>
    </Sample>
  </Spread>;
}

function LightAndMaterial() {
  return <Spread title="Light and material">
    <Sample label="LiquidBlob"><LiquidBlob colors={[T.accent, T.field, T.spark]} background={T.chalk} /></Sample>
    <Alternating labels={["GlowBeams", "ParticleText"]}>
      <GlowBeams color={T.accent} beamCount={12} />
      <ParticleText text="GLOW" fontSize={345} color={T.accent} background={T.ink} formAt={2} formDuration={clock.frame(2)} />
    </Alternating>
  </Spread>;
}

function DisplayType() {
  return <Spread title="Display type">
    <Sample label="SerifReveal"><SerifReveal text="Form" background={T.chalk} ink={T.ink} stroke={T.field} /></Sample>
    <Alternating labels={["StackType", "NumberRoll"]}>
      <StackType text="TYPE" fontSize={295} background={T.field} ink={T.chalk} />
      <NumberRoll value="120" caption="beats per minute" background={T.field} color={T.chalk} />
    </Alternating>
  </Spread>;
}

function GeometryLoops() {
  return <Spread title="Geometry loops">
    <Alternating labels={["Halftone", "WireTerrain"]}>
      <Halftone duration={clock.frame(4)} /><WireTerrain />
    </Alternating>
    <Alternating labels={["RectTunnel", "Starburst"]}>
      <RectTunnel /><Starburst duration={clock.frame(4)} />
    </Alternating>
  </Spread>;
}

function MotionStudies() {
  return <Spread title="Motion studies">
    <Sample label="EasingGraph"><EasingGraph background={T.chalk} /></Sample>
    <Alternating labels={["ShapeMorph", "ParticleSphere"]}>
      <ShapeMorph background={T.accent} /><ParticleSphere background={T.ink} duration={clock.frame(4)} />
    </Alternating>
  </Spread>;
}

const spreads = [InterfaceDetails, RevealAndAnnotate, LightAndMaterial, DisplayType, GeometryLoops, MotionStudies];

export function Specimens() {
  return <AbsoluteFill>{spreads.map((Page, i) =>
    <Sequence key={Page.name} from={i * spreadFrames} durationInFrames={spreadFrames}><Page /></Sequence>
  )}</AbsoluteFill>;
}
