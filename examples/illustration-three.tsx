import React from "react";
import { MotionProject, Shot, createBeatClock, demotionTheme } from "@demotion/cli";
import { ExtrudedSvg, Scene3D } from "@demotion/cli/three";

export const illustrationClock = createBeatClock({ bpm: 120, fps: 60 });
export const ILLUSTRATION_BEATS = 8;

// Original filled artwork. The evenodd contour makes a real opening through the solid.
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <path fill-rule="evenodd" d="M20 15H90C151 15 184 48 184 100S151 185 90 185H20Z M57 51V149H88C124 149 146 132 146 100S124 51 88 51Z"/>
</svg>`;
const PLAY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path d="M78 65L132 100L78 135Z"/></svg>`;

/** Register at 1920 × 1080, 60 fps, durationInFrames={illustrationClock.duration(ILLUSTRATION_BEATS)}. */
export const IllustrationThree = () => (
  <MotionProject clock={illustrationClock} camera={{ beat: 0.001, drift: 0.001 }}>
    <Shot beats={ILLUSTRATION_BEATS} bg={demotionTheme.ink} blurSamples={1}>
      <Scene3D camera={{ position: [5, 2, 10], fov: 36 }} cameraMoves={[
        { beat: 0, position: [5, 2, 10] },
        { beat: 8, position: [-2, 1, 9] },
      ]}>
        <group rotation={[0.1, -0.14, -0.15]}>
          {[demotionTheme.field, demotionTheme.chalk, demotionTheme.accent].map((color, i) => (
            <ExtrudedSvg key={color} svg={MARK} size={4.35} depth={0.3} bevel={0.035}
              color={color} position={[0, 0, (i - 1) * 0.48]}
              reveal={{ atBeat: i * 0.15, durationBeats: 1.5, fromZ: -1 }} />
          ))}
          <ExtrudedSvg svg={PLAY} size={1.26} depth={0.3} bevel={0.045}
            color={demotionTheme.spark} position={[0.14, 0, 1.1]}
            reveal={{ atBeat: 0.5, durationBeats: 1.5 }} />
        </group>
      </Scene3D>
    </Shot>
  </MotionProject>
);
