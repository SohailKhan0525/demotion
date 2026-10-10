import React, { useLayoutEffect, useMemo, useState, useEffect } from "react";
import { ThreeCanvas } from "@remotion/three";
import { continueRender, delayRender, random, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { Bloom, DepthOfField, EffectComposer } from "@react-three/postprocessing";

/** Draw a panel's face. Called once (static) or every frame (animated). */
export type PanelDraw = (ctx: CanvasRenderingContext2D, w: number, h: number, frame: number) => void;

export type StackPanel = {
  /** world position of the panel centre */
  position: [number, number, number];
  draw: PanelDraw;
  /** redraw the canvas every frame between these two frames (typing, progress, playheads...) */
  animate?: [number, number];
  /** world size; defaults to 4.8 x 3.0 (matches the 1600x1000 face) */
  size?: [number, number];
  /** small tilt in radians around Y/X for a hand-placed look */
  rotation?: [number, number, number];
};

export type Stack3DProps = {
  panels: StackPanel[];
  /** camera position in world space (compute per frame from useCurrentFrame) */
  cameraPosition: [number, number, number];
  /** point the camera looks at */
  lookAt: [number, number, number];
  /** world-space distance from the camera that is perfectly sharp */
  focusDistance: number;
  /** world-space depth range around focusDistance that stays sharp */
  focusRange?: number;
  /** lens blur strength (bigger = stronger bokeh) */
  bokehScale?: number;
  fov?: number;
  /** floating out-of-focus lights that turn into bokeh discs */
  bokehLights?: number;
  backgroundColor?: string;
  /** face texture resolution */
  faceSize?: [number, number];
};

const FACE_W = 1600;
const FACE_H = 1000;
const PALETTE = ["#ff4fa3", "#a855f7", "#6366f1", "#f59e0b", "#38bdf8", "#f472b6"];

const CameraRig: React.FC<{ position: [number, number, number]; lookAt: [number, number, number]; fov: number }> = ({
  position,
  lookAt,
  fov,
}) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    const c = camera as THREE.PerspectiveCamera;
    c.position.set(...position);
    c.fov = fov;
    c.near = 0.1;
    c.far = 60;
    c.lookAt(...lookAt);
    c.updateProjectionMatrix();
  });
  return null;
};

const Panel: React.FC<{ spec: StackPanel; faceSize: [number, number]; frame: number; fontsReady: boolean }> = ({
  spec,
  faceSize,
  frame,
  fontsReady,
}) => {
  const [fw, fh] = faceSize;
  const { canvas, texture } = useMemo(() => {
    const cv = document.createElement("canvas");
    cv.width = fw;
    cv.height = fh;
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return { canvas: cv, texture: tex };
  }, [fw, fh]);

  // static panels draw once fonts are ready; animated ones redraw each frame
  useMemo(() => {
    if (!fontsReady) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, fw, fh);
    spec.draw(ctx, fw, fh, frame);
    texture.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontsReady, spec.animate ? Math.min(spec.animate[1] + 1, Math.max(spec.animate[0] - 1, frame)) : 0, canvas, texture]);

  const [w, h] = spec.size ?? [4.8, 3.0];
  return (
    <group position={spec.position} rotation={spec.rotation ?? [0, 0, 0]}>
      {/* soft coloured halo behind the panel, gives the glass a glow that separates it from the void */}
      <mesh position={[0, 0, -0.06]}>
        <planeGeometry args={[w * 1.035, h * 1.05]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.07} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={texture} alphaTest={0.5} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const BokehLights: React.FC<{ count: number; frame: number }> = ({ count, frame }) => {
  const items = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        x: (random(`bl-x-${i}`) - 0.5) * 22,
        y: (random(`bl-y-${i}`) - 0.5) * 12,
        z: -16 + random(`bl-z-${i}`) * 26,
        r: 0.03 + random(`bl-r-${i}`) * 0.08,
        color: new THREE.Color(PALETTE[i % PALETTE.length]).multiplyScalar(2.2),
        sp: 0.15 + random(`bl-s-${i}`) * 0.35,
        ph: random(`bl-p-${i}`) * 6.28,
      })),
    [count]
  );
  const t = frame / 30;
  return (
    <>
      {items.map((it, i) => (
        <mesh key={i} position={[it.x + Math.sin(t * it.sp + it.ph) * 0.6, it.y + Math.cos(t * it.sp * 0.8 + it.ph) * 0.4, it.z]}>
          <circleGeometry args={[it.r, 24]} />
          <meshBasicMaterial color={it.color} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
};

/**
 * Real 3D: every panel is a textured plane in a three.js scene, and the lens
 * blur is a real depth-of-field pass (post-processing DepthOfFieldEffect --
 * circle of confusion computed per pixel from the depth buffer, bokeh-shaped
 * blur). Change `focusDistance` over time for a genuine rack focus.
 */
export const Stack3D: React.FC<Stack3DProps> = ({
  panels,
  cameraPosition,
  lookAt,
  focusDistance,
  focusRange = 1.4,
  bokehScale = 9,
  fov = 32,
  bokehLights = 70,
  backgroundColor = "#07060d",
  faceSize = [FACE_W, FACE_H],
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // wait for fonts so text baked into canvas textures uses the real typefaces
  const [handle] = useState(() => delayRender("stack3d-fonts"));
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    Promise.all([
      document.fonts.load('700 40px "Archivo"'),
      document.fonts.load('400 30px "JetBrains Mono Variable"'),
    ])
      .catch(() => undefined)
      .then(() => {
        setFontsReady(true);
        continueRender(handle);
      });
  }, [handle]);

  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ position: cameraPosition, fov, near: 0.1, far: 60 }}
      gl={{ antialias: false, alpha: false }}
    >
      <color attach="background" args={[backgroundColor]} />
      <CameraRig position={cameraPosition} lookAt={lookAt} fov={fov} />
      <BokehLights count={bokehLights} frame={frame} />
      {panels.map((p, i) => (
        <Panel key={i} spec={p} faceSize={faceSize} frame={frame} fontsReady={fontsReady} />
      ))}
      <EffectComposer multisampling={0}>
        <DepthOfField
          worldFocusDistance={focusDistance}
          worldFocusRange={focusRange}
          bokehScale={bokehScale}
          height={720}
        />
        <Bloom mipmapBlur luminanceThreshold={1.1} luminanceSmoothing={0.15} intensity={0.6} radius={0.7} />
      </EffectComposer>
    </ThreeCanvas>
  );
};
