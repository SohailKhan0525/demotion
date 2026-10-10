import React from "react";
import { AbsoluteFill } from "remotion";
import { inQuart, outExpo, prog } from "../core/math";

export type WipeKind = "slide" | "slats" | "iris" | "diagonal";
export type WipeSpec = { kind: WipeKind; /** color the screen is covered with (use the NEXT shot's background) */ color: string; /** optional leading color layer */ accent?: string; lead?: number; tail?: number };

/**
 * A flat-colour transition shape. It COVERS the screen, finishing exactly on frame `at` (the beat the next
 * shot lands on), then UNCOVERS to reveal the new shot. The cut itself happens while the screen is fully covered.
 * `t` is frames relative to the start of the cover phase.
 */
export const Wipe: React.FC<{ spec: WipeSpec; frame: number; at: number; width: number; height: number }> = ({ spec, frame, at, width, height }) => {
  const lead = spec.lead ?? 14;
  const tail = spec.tail ?? 16;
  const start = at - lead;
  if (frame < start || frame > at + tail) return null;
  const cover = (f: number) => inQuart(prog(f, start, lead));
  const uncover = (f: number) => outExpo(prog(f, at, tail));
  const layer = (color: string, delay: number, key: string) => {
    const f = frame - delay;
    const c = frame <= at ? cover(f) : 1;
    const u = frame > at ? uncover(f) : 0;
    if (spec.kind === "slide") {
      const x = frame <= at ? (-1 + c) * width : u * width;
      return <div key={key} style={{ position: "absolute", left: x, top: 0, width, height, background: color }} />;
    }
    if (spec.kind === "diagonal") {
      const sk = 18;
      const x = frame <= at ? (-1 + c) * (width + 400) : u * (width + 400);
      return <div key={key} style={{ position: "absolute", left: x - 200, top: 0, width: width + 400, height, background: color, transform: `skewX(-${sk}deg)` }} />;
    }
    if (spec.kind === "slats") {
      const N = 8;
      const w = width / N + 1;
      return (
        <React.Fragment key={key}>
          {new Array(N).fill(0).map((_, i) => {
            const d = i * 1.4;
            const cc = frame <= at ? inQuart(prog(f - d, start, lead - 6)) : 1;
            const uu = frame > at ? outExpo(prog(f - d, at, tail - 4)) : 0;
            // cover grows downward from the top, uncover shrinks upward to the top
            const h = frame <= at ? cc * height : (1 - uu) * height;
            return <div key={i} style={{ position: "absolute", left: i * (width / N), top: 0, width: w, height: h, background: color }} />;
          })}
        </React.Fragment>
      );
    }
    // iris
    const R = Math.hypot(width, height) * 0.62;
    const r = frame <= at ? c * R : u * R;
    const cx = width * 0.5, cy = height * 0.5;
    if (frame <= at) return <div key={key} style={{ position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: "50%", background: color }} />;
    return (
      <svg key={key} width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <mask id={`iris-${key}`}>
            <rect width={width} height={height} fill="white" />
            <circle cx={cx} cy={cy} r={r} fill="black" />
          </mask>
        </defs>
        <rect width={width} height={height} fill={color} mask={`url(#iris-${key})`} />
      </svg>
    );
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {spec.accent && layer(spec.accent, 0, "accent")}
      {layer(spec.color, spec.accent ? 3 : 0, "main")}
    </AbsoluteFill>
  );
};
