import React, { useContext, useLayoutEffect, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { ACESFilmicToneMapping, PerspectiveCamera } from "three";
import { createBeatClock, type BeatClock } from "../core/clock";
import { ShotContext } from "../engine/context";
import { demotionTheme, type Theme } from "../engine/theme";
import { Illustration3DContext } from "./illustrationContext";
import { finiteNumber, sampleScene3DCamera, type ResolvedScene3DCamera, type Scene3DCamera, type Scene3DCameraMove } from "./illustrationMotion";

export type { Scene3DCamera, Scene3DCameraMove, Vector3Tuple } from "./illustrationMotion";

export type Scene3DProps = {
  children: React.ReactNode;
  /** Inherits the current Shot clock, otherwise defaults to 120 BPM. */
  clock?: BeatClock;
  theme?: Theme;
  camera?: Scene3DCamera;
  /** Absolute camera poses on local beats; omitted fields inherit the preceding pose. */
  cameraMoves?: readonly Scene3DCameraMove[];
  /** Transparent by default, so HTML typography can sit behind the canvas. */
  background?: string;
  /** Studio lighting intensities, or false for custom R3F lights. */
  lighting?: false | { ambient?: number; key?: number; fill?: number; rim?: number };
  /** Optional horizontal surface in world units. */
  floor?: { y?: number; size?: number; color?: string; roughness?: number };
  /** Shadow maps are optional because they add rendering work. */
  shadows?: boolean;
  /** Freezes the camera at its first pose and settles ExtrudedSvg reveals. */
  reducedMotion?: boolean;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
};

const Camera: React.FC<{ pose: ResolvedScene3DCamera }> = ({ pose }) => {
  const { camera, invalidate } = useThree();
  useLayoutEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return;
    camera.position.set(...pose.position);
    camera.lookAt(...pose.target);
    camera.fov = pose.fov;
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate, pose]);
  return null;
};

/** A real Three.js scene synchronized to Remotion's frame, including reverse seeking. */
export const Scene3D: React.FC<Scene3DProps> = ({
  children, clock: explicitClock, theme: explicitTheme, camera, cameraMoves, background,
  lighting = {}, floor, shadows = false, reducedMotion = false, width: explicitWidth,
  height: explicitHeight, style,
}) => {
  const localFrame = useCurrentFrame();
  const config = useVideoConfig();
  const shot = useContext(ShotContext);
  const fallbackClock = useMemo(() => createBeatClock({ fps: config.fps }), [config.fps]);
  const clock = explicitClock ?? shot?.clock ?? fallbackClock;
  if (clock.fps !== config.fps) throw new Error("Scene3D clock.fps must match the composition fps.");
  const theme = explicitTheme ?? shot?.theme ?? demotionTheme;
  const frame = localFrame - (shot?.pre ?? 0);
  const at = (beat: number) => shot && !explicitClock ? clock.frame(shot.startBeat + beat) - shot.startFrame : clock.frame(beat);
  const pose = sampleScene3DCamera(frame, at, camera, cameraMoves, reducedMotion);
  const width = finiteNumber(explicitWidth ?? config.width, "Scene3D width", 1, 16384);
  const height = finiteNumber(explicitHeight ?? config.height, "Scene3D height", 1, 16384);
  const intensity = (n: number, name: string) => finiteNumber(n, `Scene3D lighting.${name}`, 0, 100);
  if (floor) {
    finiteNumber(floor.y ?? -2.5, "Scene3D floor.y", -100000, 100000);
    finiteNumber(floor.size ?? 200, "Scene3D floor.size", 0.001, 100000);
    finiteNumber(floor.roughness ?? 0.8, "Scene3D floor.roughness", 0, 1);
  }
  return (
    <ThreeCanvas
      width={width} height={height} dpr={1} frameloop="demand" shadows={shadows}
      camera={{ position: pose.position, fov: pose.fov, near: 0.05, far: 1000 }}
      gl={{ antialias: true, alpha: true, toneMapping: ACESFilmicToneMapping }}
      style={{ position: "absolute", inset: 0, ...style }}
    >
      <Illustration3DContext.Provider value={{ frame, at, theme, reducedMotion }}>
        {background && <color attach="background" args={[background]} />}
        <Camera pose={pose} />
        {lighting !== false && <>
          <ambientLight color={theme.chalk} intensity={intensity(lighting.ambient ?? 0.7, "ambient")} />
          <directionalLight color={theme.chalk} position={[5, 7, 8]} intensity={intensity(lighting.key ?? 3.2, "key")} castShadow={shadows} shadow-mapSize={[1024, 1024]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-normalBias={0.03} />
          <directionalLight color={theme.field} position={[-6, 2, 4]} intensity={intensity(lighting.fill ?? 1.1, "fill")} />
          <directionalLight color={theme.chalk} position={[2, 4, -5]} intensity={intensity(lighting.rim ?? 2.2, "rim")} />
        </>}
        {floor && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, floor.y ?? -2.5, 0]} receiveShadow={shadows}>
          <planeGeometry args={[floor.size ?? 200, floor.size ?? 200]} />
          <meshStandardMaterial color={floor.color ?? theme.ink} roughness={floor.roughness ?? 0.8} />
        </mesh>}
        {children}
      </Illustration3DContext.Provider>
    </ThreeCanvas>
  );
};
