import React, { useId } from "react";
import { clamp01, spring } from "../core/math";
import { useShot } from "../engine/context";
import { FONT_FAMILY, MONO_FAMILY } from "../font";
import { DrawPath } from "./DrawPath";
import { FollowPath } from "./FollowPath";
import { finite, timingProgress } from "./pathMotion";

export type WorkflowIllustrationProps = {
  /** Entrance begins at this shot-local beat; the illustration settles after 5 beats. */
  at?: number;
  width?: number;
  height?: number;
  /** Display the completed illustration at every frame. */
  reducedMotion?: boolean;
  /** Accessible description of the whole illustration. */
  title?: string;
  /** Short captions under the three stations; default: Source, Compose, Ready. */
  labels?: readonly [string, string, string];
  style?: React.CSSProperties;
  className?: string;
};

const INPUT_PATH = "M255 280 C306 280 302 238 352 238";
const OUTPUT_PATH = "M608 300 C667 300 657 338 710 338";

/** An original layered source → composition → finished-video SVG illustration. */
export const WorkflowIllustration: React.FC<WorkflowIllustrationProps> = ({ at = 0, width = 960, height = 600, reducedMotion = false, title = "Source material becomes a finished composition", labels = ["Source", "Compose", "Ready"], style, className }) => {
  const shot = useShot();
  const titleId = `workflow-${useId().replace(/:/g, "")}`;
  finite(at, "at"); finite(width, "width"); finite(height, "height");
  if (width <= 0 || height <= 0 || width > 16_384 || height > 16_384) throw new Error("WorkflowIllustration dimensions must be in (0, 16384]");
  if (labels.length !== 3 || labels.some(label => typeof label !== "string" || Array.from(label).length > 24)) {
    throw new Error("WorkflowIllustration requires three labels of at most 24 characters");
  }
  const { ink, chalk, field, accent, spark } = shot.theme;
  const entrance = (delay: number) => {
    const p = timingProgress(shot, at + delay, 1.25, reducedMotion);
    return p >= 1 ? 1 : spring(p * 0.65, 3.8, 0.6);
  };
  const station = (x: number, y: number, delay: number, tilt: number) => {
    const p = entrance(delay);
    return { opacity: clamp01(p), transform: `translate(${x} ${y + (1 - p) * 36}) rotate(${tilt + (1 - p) * -7}) scale(${0.86 + p * 0.14})` };
  };
  const packetOpacity = (delay: number) => {
    if (reducedMotion) return 0;
    const p = timingProgress(shot, at + delay, 1.5, false);
    return Math.min(1, p * 10, (1 - p) * 10);
  };
  const done = entrance(3.35);
  return <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 960 600" role="img" aria-labelledby={titleId} className={className} style={{ overflow: "visible", ...style }}>
    <title id={titleId}>{title}</title>
    <g fill="none" stroke={ink} strokeWidth={1.5} opacity={0.12 * clamp01(entrance(0.1))}>
      <ellipse cx={482} cy={425} rx={366} ry={62} />
      <path d="M106 426H850" />
    </g>
    <g strokeLinecap="round" strokeLinejoin="round">
      <DrawPath d={INPUT_PATH} at={at + 0.65} over={1.5} stroke={ink} strokeWidth={3} reducedMotion={reducedMotion} />
      <DrawPath d={OUTPUT_PATH} at={at + 1.45} over={1.5} stroke={ink} strokeWidth={3} reducedMotion={reducedMotion} />
      <FollowPath d={INPUT_PATH} at={at + 1.1} over={1.5} opacity={packetOpacity(1.1)} reducedMotion={reducedMotion}>
        <rect x={-8} y={-8} width={16} height={16} rx={4} fill={spark} stroke={chalk} strokeWidth={3} />
      </FollowPath>
      <FollowPath d={OUTPUT_PATH} at={at + 2.1} over={1.5} opacity={packetOpacity(2.1)} reducedMotion={reducedMotion}>
        <rect x={-8} y={-8} width={16} height={16} rx={4} fill={accent} stroke={ink} strokeWidth={2} />
      </FollowPath>
    </g>
    <g {...station(160, 278, 0, -7)}>
      <rect x={-77} y={-101} width={176} height={226} rx={15} fill={ink} opacity={0.13} />
      <rect x={-87} y={-113} width={176} height={226} rx={15} fill={chalk} stroke={ink} strokeWidth={3} />
      <path d="M-53-70H24M-53-51H5" fill="none" stroke={ink} strokeWidth={7} strokeLinecap="round" />
      <rect x={-53} y={-22} width={107} height={72} rx={7} fill={field} />
      <circle cx={25} cy={-2} r={10} fill={accent} />
      <path d="M-53 40L-20 6L10 34L29 17L54 42V50H-53Z" fill={chalk} />
      <path d="M-53 76H49M-53 91H13" fill="none" stroke={ink} strokeOpacity={0.3} strokeWidth={5} strokeLinecap="round" />
      <g transform={`translate(72 -88) rotate(${10 + (1 - entrance(0.3)) * 18})`}>
        <rect x={-17} y={-35} width={34} height={70} rx={8} fill={spark} stroke={ink} strokeWidth={2.5} />
        <path d="M-6-18H6M-6-6H6M-6 6H3" stroke={chalk} strokeWidth={3} strokeLinecap="round" />
      </g>
    </g>
    <g {...station(480, 271, 0.3, 0)}>
      <rect x={-118} y={-120} width={262} height={262} rx={24} fill={ink} opacity={0.13} />
      <rect x={-130} y={-132} width={262} height={262} rx={24} fill={ink} />
      <path d="M-130-78H132" stroke={chalk} strokeOpacity={0.2} strokeWidth={2} />
      <circle cx={-103} cy={-105} r={5} fill={spark} />
      <circle cx={-85} cy={-105} r={5} fill={accent} />
      <circle cx={-67} cy={-105} r={5} fill={chalk} opacity={0.6} />
      <text x={103} y={-100} fill={chalk} textAnchor="end" fontFamily={MONO_FAMILY} fontSize={12}>scene.tsx</text>
      {[0, 1, 2].map(i => {
        const p = entrance(0.65 + i * 0.18);
        return <g key={i} opacity={clamp01(p)} transform={`translate(${(1 - p) * 18} ${20 - i * 24 + (1 - p) * 30})`}>
          <path d="M-83 15L0-32L83 15L0 63Z" fill={[field, chalk, accent][i]} stroke={ink} strokeWidth={3} />
          <path d="M-83 15V28L0 76L83 28V15L0 63Z" fill={[field, chalk, accent][i]} stroke={ink} strokeWidth={3} />
          <path d="M0 63V76" stroke={ink} strokeWidth={2} opacity={0.5} />
        </g>;
      })}
      <path d="M-100 95H-63M-49 95H10" stroke={chalk} strokeOpacity={0.4} strokeWidth={4} strokeLinecap="round" />
      <circle cx={99} cy={95} r={5} fill={accent} />
    </g>
    <g {...station(785, 315, 0.65, 7)}>
      <rect x={-75} y={-83} width={185} height={177} rx={18} fill={ink} opacity={0.13} />
      <rect x={-87} y={-95} width={185} height={177} rx={18} fill={chalk} stroke={ink} strokeWidth={3} />
      <rect x={-71} y={-79} width={153} height={104} rx={9} fill={field} />
      <path d="M-71 11C-30-38 16 48 82-38V25H-71Z" fill={accent} />
      <circle cx={4} cy={-27} r={29} fill={ink} />
      <path d="M-3-39L16-27L-3-15Z" fill={chalk} />
      <path d="M-61 49H26" stroke={ink} strokeWidth={5} strokeLinecap="round" />
      <path d="M-61 63H-4" stroke={ink} strokeOpacity={0.3} strokeWidth={4} strokeLinecap="round" />
      <g transform={`translate(81 -76) scale(${0.6 + done * 0.4})`} opacity={clamp01(done)}>
        <circle r={26} fill={accent} stroke={ink} strokeWidth={3} />
        <DrawPath d="M-11 0L-3 8L12-9" at={at + 3.45} over={0.75} stroke={ink} strokeWidth={4} reducedMotion={reducedMotion} />
      </g>
    </g>
    <g fill={ink} fontFamily={FONT_FAMILY} fontSize={22} fontWeight={650} textAnchor="middle">
      {[160, 480, 785].map((x, i) => <text key={x} x={x} y={479} opacity={clamp01(entrance(0.85 + i * 0.15))}>{labels[i]}</text>)}
    </g>
    <g fill="none" stroke={ink} strokeWidth={3} strokeLinecap="round" opacity={clamp01(entrance(1))}>
      <path d="M707 128L713 145M736 126L730 144M753 146L741 154" />
      <path d="M274 159L280 166M287 140L289 151" stroke={spark} />
    </g>
  </svg>;
};
