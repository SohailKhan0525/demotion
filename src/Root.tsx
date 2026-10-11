import React from "react";
import { Composition } from "remotion";
import { DemoReel, REEL_FRAMES } from "./reel/DemoReel";
import { ensureFontsLoaded } from "./font";
import { Lab, LAB_BEATS, labClock } from "./lab/Lab";

ensureFontsLoaded();

export const RemotionRoot: React.FC = () => (
  <>
  <Composition id="Lab" component={Lab} durationInFrames={labClock.duration(LAB_BEATS)} fps={60} width={1920} height={1080} />
  <Composition id="Demo" component={DemoReel} durationInFrames={REEL_FRAMES} fps={60} width={1920} height={1080} />
  </>
);
