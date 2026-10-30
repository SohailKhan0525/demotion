import React from "react";
import { MotionProject, Shot, KineticHeadline, createBeatClock, demotionTheme as theme } from "@demotion/cli";

export const promoExampleClock = createBeatClock({ bpm: 120, fps: 60 });
export const PROMO_EXAMPLE_FRAMES = promoExampleClock.duration(8);

// Register with width=1920, height=1080, fps=60, durationInFrames=240.
// The starter's Root already calls ensureFontsLoaded().
export const PromoScene = () => (
  <MotionProject clock={promoExampleClock}>
    <Shot beats={8} bg={theme.field}>
      <KineticHeadline
        text="Make it move."
        color={theme.chalk}
        accent={theme.accent}
      />
    </Shot>
  </MotionProject>
);
