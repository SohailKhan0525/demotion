import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random } from "remotion";

export type GlowBeamsProps = {
  color?: string;
  beamCount?: number;
  seed?: string;
};

export const GlowBeams: React.FC<GlowBeamsProps> = ({
  color = "#ff9d4d",
  beamCount = 5,
  seed = "glow-beams",
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#0a0805";
    ctx.fillRect(0, 0, width, height);

    const t = frame / fps;

    for (let i = 0; i < beamCount; i++) {
      const baseAngle = -35 + i * (70 / (beamCount - 1));
      const drift = Math.sin(t * 0.25 + i) * 4;
      const angle = ((baseAngle + drift) * Math.PI) / 180;
      const originX = width * (0.25 + 0.5 * random(`${seed}-x-${i}`));
      const length = height * 1.6;

      const grad = ctx.createLinearGradient(
        originX,
        height * 1.1,
        originX + Math.sin(angle) * length,
        height * 1.1 - Math.cos(angle) * length
      );
      grad.addColorStop(0, `${color}00`);
      grad.addColorStop(0.55, `${color}22`);
      grad.addColorStop(1, `${color}00`);

      ctx.save();
      ctx.translate(originX, height * 1.1);
      ctx.rotate(angle);
      ctx.fillStyle = grad;
      const beamWidth = width * 0.09;
      ctx.fillRect(-beamWidth / 2, -length, beamWidth, length);
      ctx.restore();
    }

    // subtle vignette
    const vg = ctx.createRadialGradient(
      width / 2,
      height * 0.4,
      0,
      width / 2,
      height * 0.4,
      width * 0.7
    );
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, width, height);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame, fps, width, height, beamCount, color, seed]);

  return (
    <AbsoluteFill>
      <canvas ref={canvasRef} width={width} height={height} style={{ width: "100%", height: "100%" }} />
    </AbsoluteFill>
  );
};
