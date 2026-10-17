import React from "react";
import { Composition } from "remotion";
import { ensureFontsLoaded } from "demotion";
import { MyVideo } from "./MyVideo";

// Loads Inter + JetBrains Mono from public/fonts (offline, deterministic renders).
ensureFontsLoaded();

export const RemotionRoot: React.FC = () => (
  <Composition
    id="MyVideo"
    component={MyVideo}
    durationInFrames={150}
    fps={30}
    width={1920}
    height={1080}
  />
);
