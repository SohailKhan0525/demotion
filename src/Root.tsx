import React from "react";
import { Composition } from "remotion";
import { DemoReel, REEL_FRAMES } from "./reel/DemoReel";
import { ensureFontsLoaded } from "./font";

ensureFontsLoaded();

export const RemotionRoot: React.FC = () => (
  <Composition id="Demo" component={DemoReel} durationInFrames={REEL_FRAMES} fps={60} width={1920} height={1080} />
);
