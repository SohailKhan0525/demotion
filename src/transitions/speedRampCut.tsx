import React from "react";
import { AbsoluteFill } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { Easing } from "remotion";

export type SpeedRampCutProps = {
  direction?: "horizontal" | "vertical";
  blurAmount?: number;
};

// Accelerating ease-in: starts slow, rockets toward the cut -- the "speed
// ramp" editors use to punch into the next beat instead of a flat linear cut.
const rampIn = Easing.bezier(0.7, 0, 0.9, 0.2);
const rampOut = Easing.bezier(0.1, 0.8, 0.3, 1);

const SpeedRampPresentation: React.FC<
  TransitionPresentationComponentProps<SpeedRampCutProps>
> = ({ children, presentationProgress, presentationDirection, passedProps }) => {
  const { direction = "horizontal", blurAmount = 34 } = passedProps;

  if (presentationDirection === "exiting") {
    // outgoing scene rockets away and motion-blurs in its direction of travel
    const p = rampIn(presentationProgress);
    const travel = 140 * p;
    const blur = blurAmount * Math.min(1, p * 1.6);
    const translate =
      direction === "horizontal" ? `translateX(${-travel}px)` : `translateY(${-travel}px)`;
    const skew = direction === "horizontal" ? `skewX(${-p * 6}deg)` : `skewY(${-p * 6}deg)`;
    return (
      <AbsoluteFill
        style={{
          transform: `${translate} ${skew} scale(${1 + p * 0.08})`,
          filter: `blur(${blur}px)`,
          opacity: 1 - p * 0.7,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  // incoming scene decelerates in from the direction of travel, blur
  // resolving to sharp -- rackOut easing so it "catches" rather than floats
  const p = rampOut(presentationProgress);
  const travel = 140 * (1 - p);
  const blur = blurAmount * (1 - p) * 0.8;
  const translate =
    direction === "horizontal" ? `translateX(${travel}px)` : `translateY(${travel}px)`;
  return (
    <AbsoluteFill
      style={{
        transform: `${translate} scale(${1.05 - p * 0.05})`,
        filter: `blur(${blur}px)`,
        opacity: p,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const speedRampCut = (
  props: SpeedRampCutProps = {}
): TransitionPresentation<SpeedRampCutProps> => ({
  component: SpeedRampPresentation,
  props,
});
