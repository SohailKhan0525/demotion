import React from "react";
import { Composition } from "remotion";
import { LaunchDemo } from "./launch/LaunchDemo";
import { LAUNCH_BEATS, launchClock } from "./launch/timeline";
import { ensureFontsLoaded } from "./font";
import { Lab, LAB_BEATS, labClock } from "./lab/Lab";

import { UI, UI_BEATS, uiClock } from "./lab/UI";

ensureFontsLoaded();

export const RemotionRoot: React.FC = () => (
  <>
  <Composition id="UI" component={UI} durationInFrames={uiClock.duration(UI_BEATS)} fps={60} width={1920} height={1080} />
  <Composition id="Lab" component={Lab} durationInFrames={labClock.duration(LAB_BEATS)} fps={60} width={1920} height={1080} />
  <Composition id="Launch" component={LaunchDemo} durationInFrames={launchClock.duration(LAUNCH_BEATS)} fps={60} width={1920} height={1080} />
  </>
);
