import React from "react";
import { usePathMotion, type PathMotionOptions } from "./pathMotion";

export type FollowPathProps = PathMotionOptions & Omit<React.SVGProps<SVGGElement>, "from" | "to" | "transform" | "rotate">;

/** Render inside the same SVG coordinate system as d. Center children at (0, 0). */
export const FollowPath: React.FC<FollowPathProps> = ({ d, at, over, from, to, rotate, rotationOffset, reducedMotion, children, ...props }) => {
  const motion = usePathMotion({ d, at, over, from, to, rotate, rotationOffset, reducedMotion });
  return <g {...props} transform={motion.transform}>{children}</g>;
};
