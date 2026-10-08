import React from "react";
import { AbsoluteFill } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { Easing } from "remotion";

export type ScaleFadeBlurProps = {
  scaleAmount?: number;
  blurAmount?: number;
};

const ease = Easing.bezier(0.22, 1, 0.36, 1); // premium "expo-out" feel

const ScaleFadeBlurPresentation: React.FC<
  TransitionPresentationComponentProps<ScaleFadeBlurProps>
> = ({ children, presentationProgress, presentationDirection, passedProps }) => {
  const { scaleAmount = 0.06, blurAmount = 14 } = passedProps;
  const p = ease(presentationProgress);

  if (presentationDirection === "entering") {
    const scale = 1 + scaleAmount * (1 - p);
    const opacity = p;
    const blur = blurAmount * (1 - p);
    return (
      <AbsoluteFill
        style={{
          opacity,
          transform: `scale(${scale})`,
          filter: `blur(${blur}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  // exiting
  const scale = 1 - scaleAmount * 0.6 * p;
  const opacity = 1 - p;
  const blur = blurAmount * p;
  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const scaleFadeBlur = (
  props: ScaleFadeBlurProps = {}
): TransitionPresentation<ScaleFadeBlurProps> => {
  return {
    component: ScaleFadeBlurPresentation,
    props,
  };
};
