import React from "react";
import { Composition } from "remotion";
import { LaunchDemo } from "./launch/LaunchDemo";
import { LAUNCH_BEATS, launchClock } from "./launch/timeline";
import { ensureFontsLoaded } from "./font";
import { Lab, LAB_BEATS, labClock } from "./lab/Lab";

import { UI, UI_BEATS, uiClock } from "./lab/UI";
import { LaunchV2 } from "./launch-v2/LaunchV2";
import { V2_BEATS, v2Clock } from "./launch-v2/timeline";
import { PromoLaunch } from "./promo/PromoLaunch";
import { PROMO_BEATS, promoClock } from "./promo/timeline";

ensureFontsLoaded();

export const RemotionRoot: React.FC = () => (
  <>
  <Composition id="PromoLaunch" component={PromoLaunch} durationInFrames={promoClock.duration(PROMO_BEATS)} fps={promoClock.fps} width={1920} height={1080} />
  <Composition id="LaunchV2" component={LaunchV2} durationInFrames={v2Clock.duration(V2_BEATS)} fps={v2Clock.fps} width={1920} height={1080} />
  <Composition id="UI" component={UI} durationInFrames={uiClock.duration(UI_BEATS)} fps={60} width={1920} height={1080} />
  <Composition id="Lab" component={Lab} durationInFrames={labClock.duration(LAB_BEATS)} fps={60} width={1920} height={1080} />
  <Composition id="Launch" component={LaunchDemo} durationInFrames={launchClock.duration(LAUNCH_BEATS)} fps={60} width={1920} height={1080} />
  </>
);
