import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random, Easing, delayRender, continueRender, cancelRender } from "remotion";

import { ensureFontsLoaded, FONT_FAMILY } from "../font";
import { demotionTheme } from "../engine/theme";

export type ParticleTextProps = {
  text: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  background?: string;
  /** frame at which particles start converging into the text shape */
  formAt?: number;
  /** how many frames the formation takes */
  formDuration?: number;
  /** frame at which the formed text disperses back into particles (omit to hold) */
  dispersAt?: number;
  particleSize?: number;
  seed?: string;
};

type Particle = {
  targetX: number;
  targetY: number;
  startX: number;
  startY: number;
  delay: number; // 0..1 stagger within the formation window
  size: number;
};

const SAMPLE_STEP = 4; // px between sampled points on the text mask
const MAX_PARTICLES = 2600;

/**
 * Renders `text` to an offscreen canvas once, reads back which pixels are
 * "ink", and turns each sampled ink pixel into a particle that starts at a
 * random scattered position and eases into place -- the same core technique
 * (rasterize text -> sample mask -> simulate particles) that real
 * canvas/WebGL text-reveal effects (e.g. Canvas UI's Particle Reveal) use.
 * This is a genuine simulation driven by useCurrentFrame, not a canned clip.
 */
export const ParticleText: React.FC<ParticleTextProps> = ({
  text,
  fontSize = 120,
  fontWeight = 800,
  color = demotionTheme.chalk,
  background = "transparent",
  formAt = 0,
  formDuration = 40,
  dispersAt,
  particleSize = 2.2,
  seed = "particle-text",
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [handle] = useState(() => delayRender("particle-text-fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    ensureFontsLoaded().then(() => { setReady(true); continueRender(handle); }).catch(cancelRender);
  }, [handle]);

  // Sample the text mask once per (text, font, size) combination.
  const particles = useMemo<Particle[]>(() => {
    if (!ready) return [];
    const off = document.createElement("canvas");
    off.width = width;
    off.height = height;
    const octx = off.getContext("2d");
    if (!octx) return [];
    octx.clearRect(0, 0, width, height);
    octx.fillStyle = demotionTheme.chalk;
    octx.font = `${fontWeight} ${fontSize}px ${FONT_FAMILY}`;
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.fillText(text, width / 2, height / 2);

    const img = octx.getImageData(0, 0, width, height);
    const points: { x: number; y: number }[] = [];
    for (let y = 0; y < height; y += SAMPLE_STEP) {
      for (let x = 0; x < width; x += SAMPLE_STEP) {
        const alpha = img.data[(y * width + x) * 4 + 3];
        if (alpha > 128) points.push({ x, y });
      }
    }

    // If there are more sampled points than our budget, take an evenly
    // spaced subset rather than the first N (keeps the glyph shapes intact).
    let sampled = points;
    if (points.length > MAX_PARTICLES) {
      const stride = points.length / MAX_PARTICLES;
      sampled = new Array(MAX_PARTICLES)
        .fill(0)
        .map((_, i) => points[Math.floor(i * stride)]);
    }

    return sampled.map((p, i) => {
      const angle = random(`${seed}-a-${i}`) * Math.PI * 2;
      const dist = 200 + random(`${seed}-d-${i}`) * Math.max(width, height) * 0.5;
      return {
        targetX: p.x,
        targetY: p.y,
        startX: width / 2 + Math.cos(angle) * dist,
        startY: height / 2 + Math.sin(angle) * dist,
        delay: random(`${seed}-delay-${i}`),
        size: particleSize * (0.6 + random(`${seed}-s-${i}`) * 0.8),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, text, fontSize, fontWeight, width, height, seed, particleSize]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const formT = (frame - formAt) / formDuration;
    const dispersing = dispersAt !== undefined && frame >= dispersAt;
    const disperseT = dispersing ? (frame - dispersAt!) / formDuration : 0;

    for (const p of particles) {
      // stagger: each particle's own easing window is offset by its delay,
      // so the shape resolves gradually rather than all points snapping at once
      const localT = Math.min(1, Math.max(0, (formT - p.delay * 0.5) / (1 - p.delay * 0.5)));
      const eased = Easing.out(Easing.cubic)(localT);

      let x: number;
      let y: number;
      let alpha: number;

      if (dispersing) {
        const dEased = Easing.in(Easing.cubic)(Math.min(1, Math.max(0, disperseT)));
        x = p.targetX + (p.startX - p.targetX) * dEased;
        y = p.targetY + (p.startY - p.targetY) * dEased;
        alpha = 1 - dEased;
      } else {
        x = p.startX + (p.targetX - p.startX) * eased;
        y = p.startY + (p.targetY - p.startY) * eased;
        alpha = 0.25 + 0.75 * eased;
      }

      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame, particles, fps, formAt, formDuration, dispersAt, color, width, height]);

  return (
    <AbsoluteFill style={{ background }}>
      <canvas ref={canvasRef} width={width} height={height} style={{ width: "100%", height: "100%" }} />
    </AbsoluteFill>
  );
};
