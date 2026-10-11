import React from "react";
import { AbsoluteFill, Sequence, getRemotionEnvironment, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import type { BeatClock } from "../core/clock";
import type { ShakeHit } from "../core/shake";
import { CameraRig } from "./CameraRig";
import { ShotContext } from "./context";
import { Look } from "./Look";
import { demotionTheme, type Theme } from "./theme";
import { Wipe, type WipeSpec } from "./Wipe";

export type ShotProps = {
  /** length in beats */
  beats: number;
  /** background color */
  bg: string;
  /** transition INTO this shot: a flat-colour shape that finishes exactly on this shot's first beat */
  wipe?: Omit<WipeSpec, "color"> & { color?: string };
  /** camera shake on landing (default 1; 0 to disable) */
  hit?: number;
  /** motion-blur samples for this shot (overrides the project value; 1 = off, use for heavy 3D shots) */
  blurSamples?: number;
  children: React.ReactNode;
};

/** Declarative marker: `MotionProject` reads its props and lays it out on the beat clock. */
export const Shot: React.FC<ShotProps> = ({ children }) => <>{children}</>;

export type MotionProjectProps = {
  clock: BeatClock;
  theme?: Theme;
  /** camera rig settings, or false to disable */
  camera?: false | { beat?: number; bar?: number; drift?: number; shakeAmp?: number };
  /** grain + vignette, or false to disable */
  look?: false | { grain?: number; vignette?: number };
  /** real shutter-style motion blur (sub-frame sampling). Default: on while rendering, off in the preview. */
  motionBlur?: boolean | { samples?: number; shutterAngle?: number };
  /** drawn above the camera so it never shakes (timecode, labels...) */
  hud?: React.ReactNode;
  children: React.ReactNode;
};

/** total beats of the <Shot> children, for sizing your <Composition> */
export const projectBeats = (children: React.ReactNode) =>
  React.Children.toArray(children).reduce<number>((a, c) => a + (React.isValidElement<ShotProps>(c) ? c.props.beats : 0), 0);

export const MotionProject: React.FC<MotionProjectProps> = ({ clock, theme = demotionTheme, camera = {}, look = {}, motionBlur, hud, children }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const { isRendering } = getRemotionEnvironment();
  const shots = React.Children.toArray(children).filter((c): c is React.ReactElement<ShotProps> => React.isValidElement(c));

  let beat = 0;
  const laid = shots.map((el) => {
    const startBeat = beat;
    beat += el.props.beats;
    return { el, startBeat, start: clock.frame(startBeat), end: clock.frame(beat) };
  });
  const hits: ShakeHit[] = laid.filter((s) => s.el.props.hit !== 0).map((s) => ({ frame: s.start, amp: s.el.props.hit ?? 1 }));

  const scene = (
    <AbsoluteFill>
      {laid.map(({ el, startBeat, start, end }, i) => (
        <Sequence key={i} from={start} durationInFrames={Math.max(1, end - start)} layout="none">
          <ShotContext.Provider value={{ clock, theme, startFrame: start, startBeat, durationFrames: end - start, pre: 0 }}>
            <AbsoluteFill style={{ background: el.props.bg, overflow: "hidden" }}>{el.props.children}</AbsoluteFill>
          </ShotContext.Provider>
        </Sequence>
      ))}
      {laid.map(({ el, start }, i) =>
        el.props.wipe ? <Wipe key={`w${i}`} spec={{ ...el.props.wipe, color: el.props.wipe.color ?? el.props.bg }} frame={frame} at={start} width={width} height={height} /> : null
      )}
    </AbsoluteFill>
  );

  const blurCfg = motionBlur === undefined ? (isRendering ? {} : false) : motionBlur === true ? {} : motionBlur;
  const active = laid.find((s) => frame >= s.start && frame < s.end) ?? laid[laid.length - 1];
  const samples = blurCfg === false ? 1 : active?.el.props.blurSamples ?? blurCfg.samples ?? 8;
  const blurred = samples <= 1 ? scene : <CameraMotionBlur samples={samples} shutterAngle={(blurCfg || {}).shutterAngle ?? 180}>{scene}</CameraMotionBlur>;
  const cam = camera === false ? blurred : <CameraRig clock={clock} hits={hits} {...camera}>{blurred}</CameraRig>;

  return (
    <AbsoluteFill style={{ background: theme.ink }}>
      {cam}
      {look !== false && <Look {...look} />}
      {hud}
    </AbsoluteFill>
  );
};
