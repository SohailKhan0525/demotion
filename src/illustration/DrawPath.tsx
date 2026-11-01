import React from "react";
import { evolvePath } from "@remotion/paths";
import { outExpo } from "../core/math";
import { useShot } from "../engine/context";
import { finite, timingProgress, usePreparedPath, type IllustrationTiming } from "./pathMotion";

export type DrawPathProps = IllustrationTiming & Omit<React.SVGProps<SVGPathElement>, "d" | "fill" | "strokeWidth" | "strokeDasharray" | "strokeDashoffset" | "pathLength"> & {
  d: string;
  strokeWidth?: number;
  /** Reveal from the end of the path towards its beginning. */
  reverse?: boolean;
};

/** Render inside an SVG. Draws one continuous stroke on the shot's beat clock. */
export const DrawPath: React.FC<DrawPathProps> = ({ d, at = 0, over = 2, reverse = false, reducedMotion = false, stroke, strokeWidth = 4, strokeLinecap = "round", opacity = 1, ...props }) => {
  const shot = useShot();
  const path = usePreparedPath(d);
  finite(strokeWidth, "strokeWidth");
  if (strokeWidth <= 0 || strokeWidth > 1_000_000) throw new Error("strokeWidth must be in (0, 1000000]");
  const progress = outExpo(timingProgress(shot, at, over, reducedMotion));
  const dash = evolvePath(progress, path.d);
  return <path {...props} d={path.d} fill="none" stroke={stroke ?? shot.theme.accent} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap}
    strokeDasharray={dash.strokeDasharray} strokeDashoffset={dash.strokeDashoffset * (reverse ? -1 : 1)} opacity={progress === 0 ? 0 : opacity} />;
};
