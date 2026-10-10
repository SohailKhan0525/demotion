import React, { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";

const TILE = 256;

/** Film grain that is different every frame (deterministic) plus a soft vignette. Grain also dithers gradients, so they never band. */
export const Look: React.FC<{ grain?: number; vignette?: number; vignetteColor?: string }> = ({ grain = 0.14, vignette = 0.32, vignetteColor = "#07080b" }) => {
  const frame = useCurrentFrame();
  const tile = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = TILE;
    const ctx = c.getContext("2d")!;
    const img = ctx.createImageData(TILE, TILE);
    for (let i = 0; i < TILE * TILE; i++) {
      const v = Math.floor(random(`grain-${i}`) * 255);
      img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
      img.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return c.toDataURL("image/png");
  }, []);
  const ox = Math.floor(random(`gx-${frame}`) * TILE);
  const oy = Math.floor(random(`gy-${frame}`) * TILE);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {vignette > 0 && (
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 48%, transparent 52%, ${vignetteColor}${Math.round(vignette * 255).toString(16).padStart(2, "0")} 100%)` }} />
      )}
      {grain > 0 && (
        <AbsoluteFill style={{ backgroundImage: `url(${tile})`, backgroundSize: `${TILE}px ${TILE}px`, backgroundPosition: `${ox}px ${oy}px`, mixBlendMode: "overlay", opacity: grain }} />
      )}
    </AbsoluteFill>
  );
};
