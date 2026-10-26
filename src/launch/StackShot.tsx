import React, { useMemo } from "react";
import { Stack3D, type StackPanel } from "../three/Stack3D";
import { drawWindow, drawCode, drawTerminal } from "../three/panels";
import { useShot } from "../engine/context";
import { clamp01, inOutExpo, lerp, outExpo } from "../core/math";
import { MYVIDEO, RENDER_CMD } from "./code";
import { MONO_FAMILY, FONT_FAMILY } from "../font";

type Vec = [number, number, number];
const positions: Vec[] = [[0, 0, 0], [4, -0.55, -2.6], [8, -1.1, -5.2]];
const mix = (a: Vec, b: Vec, t: number): Vec => a.map((v, i) => lerp(v, b[i], t)) as Vec;
export const StackShot: React.FC = () => {
  const { frame, at, clock, theme: T } = useShot();
  const panels = useMemo<StackPanel[]>(() => [
    { position: positions[0], draw: (ctx, w, h) => drawCode(ctx, w, h, 999, { title: "src/MyVideo.tsx", fontSize: 31,
      lines: MYVIDEO.map((toks) => ({ at: 0, toks: toks.map((t) => [t.text, T.chalk]) })) }) },
    { position: positions[1], animate: [0, at(10)], draw: (ctx, w, h, f) => {
      const r = drawWindow(ctx, w, h, { title: "MyVideo · 150 frames · 30 fps" });
      ctx.fillStyle = T.field; ctx.fillRect(r.x, r.y, r.w, r.h - 120);
      ctx.textAlign = "center"; ctx.fillStyle = T.chalk; ctx.font = `900 105px ${FONT_FAMILY}`;
      const progress = clamp01((f - at(3.8)) / (at(5.4) - at(3.8)));
      ctx.fillText(progress < 0.4 ? "Hello, demotion" : "Every frame is code.", w / 2, h / 2);
      ctx.textAlign = "left";
      const y = h - 130;
      ctx.fillStyle = T.field; ctx.fillRect(r.x, y, r.w * 0.4 - 6, 40);
      ctx.fillStyle = T.accent; ctx.fillRect(r.x + r.w * 0.4, y, r.w * 0.6, 40);
      ctx.fillStyle = T.chalk; ctx.fillRect(r.x + r.w * progress, y - 8, 4, 60);
      ctx.font = `500 26px ${MONO_FAMILY}`; ctx.fillText("60f + 90f = 150f   /   schematic preview", r.x, y + 80);
    } },
    { position: positions[2], animate: [at(6.4), at(9.5)], draw: (ctx, w, h, f) => {
      drawTerminal(ctx, w, h, f, { title: "4K render · workflow illustration", fontSize: 36, lines: [
        { at: at(6.4), text: RENDER_CMD, type: at(0.8), prompt: true },
        { at: at(7.4), text: "Rendering 150 frames…", color: T.accent },
        { at: at(8.5), text: "Rendered 150/150" },
        { at: at(8.7), text: "Encoded 150/150" },
        { at: at(9), text: "+ out/video-4k.mp4 (3840×2160)", color: T.accent },
      ] });
      ctx.fillStyle = T.field; ctx.fillRect(70, h - 120, w - 140, 20);
      ctx.fillStyle = T.accent; ctx.fillRect(70, h - 120, (w - 140) * outExpo(clamp01((f - at(7.4)) / (at(8.5) - at(7.4)))), 20);
    } },
  ], [T, clock]);
  const keys: { beat: number; position: Vec; look: Vec }[] = [
    { beat: 0, position: [8.2, 3.2, 16.5], look: [6.2, -0.9, -4.2] },
    { beat: 1.4, position: [0, 0, 6.6], look: positions[0] },
    { beat: 2.8, position: [0, 0, 6.6], look: positions[0] },
    { beat: 3.8, position: [4, -0.55, 4], look: positions[1] },
    { beat: 5.4, position: [4, -0.55, 4], look: positions[1] },
    { beat: 6.4, position: [8, -1.1, 1.4], look: positions[2] },
    { beat: 10, position: [8, -1.1, 1.4], look: positions[2] },
  ];
  const i = Math.max(0, keys.findIndex((k, j) => j < keys.length - 1 && frame >= at(k.beat) && frame < at(keys[j + 1].beat)));
  const a = keys[i], b = keys[i + 1];
  const p = clamp01((frame - at(a.beat)) / (at(b.beat) - at(a.beat)));
  const camera = mix(a.position, b.position, inOutExpo(p)), look = mix(a.look, b.look, inOutExpo(p));
  const distance = Math.hypot(...camera.map((v, j) => v - look[j]));
  const moving = a.position.some((v, j) => v !== b.position[j]);
  return <Stack3D panels={panels} cameraPosition={camera} lookAt={look} backgroundColor={T.ink}
    focusDistance={distance - (moving ? Math.sin(p * Math.PI) * 1.2 : 0)} focusRange={1.1} bokehScale={8 + 3 * p} bokehLights={35} />;
};
