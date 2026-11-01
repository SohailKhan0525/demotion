import React, { useEffect, useMemo } from "react";
import { useIllustration3D } from "./illustrationContext";
import { finiteNumber, sampleExtrudedSvgReveal, validateVector3, type ExtrudedSvgReveal, type Vector3Tuple } from "./illustrationMotion";
import { extrudeSvgShapeLayers, parseSvgShapeLayers, type SvgExtrusionOptions } from "./svgGeometry";

export type { SvgExtrusionOptions } from "./svgGeometry";
export type { ExtrudedSvgReveal } from "./illustrationMotion";

export type ExtrudedSvgProps = SvgExtrusionOptions & {
  /** Inline, self-contained filled SVG. Expand strokes and text to paths first. */
  svg: string;
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  scale?: number;
  color?: string;
  sideColor?: string;
  /** Override front-face colors in filled-path document order. */
  pathColors?: readonly string[];
  /** Opt in to the original SVG fill colors instead of the theme palette. */
  useSvgColors?: boolean;
  roughness?: number;
  metalness?: number;
  clearcoat?: number;
  opacity?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
  /** Staggered, overshooting entrance driven by the parent Scene3D beat clock. */
  reveal?: ExtrudedSvgReveal;
};

/** Filled SVG contours become beveled, lit Three.js solids with true depth and holes. */
export const ExtrudedSvg: React.FC<ExtrudedSvgProps> = ({
  svg, size = 4, depth = 0.35, bevel = 0.035, bevelSegments = 3, curveSegments = 12, smooth = true,
  position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, color, sideColor, pathColors,
  useSvgColors = false, roughness = 0.3, metalness = 0.12, clearcoat = 0.35, opacity = 1,
  castShadow = true, receiveShadow = true, reveal,
}) => {
  const { frame, at, theme, reducedMotion } = useIllustration3D();
  validateVector3(position, "ExtrudedSvg position");
  validateVector3(rotation, "ExtrudedSvg rotation");
  finiteNumber(scale, "ExtrudedSvg scale", 0, 10000);
  for (const [name, value] of Object.entries({ roughness, metalness, clearcoat, opacity })) finiteNumber(value, `ExtrudedSvg ${name}`, 0, 1);
  const layers = useMemo(() => extrudeSvgShapeLayers(parseSvgShapeLayers(svg), { size, depth, bevel, bevelSegments, curveSegments, smooth }), [svg, size, depth, bevel, bevelSegments, curveSegments, smooth]);
  useEffect(() => () => layers.forEach(({ geometry }) => geometry.dispose()), [layers]);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {layers.map((layer, index) => {
        const revealPose = sampleExtrudedSvgReveal(frame, at, index, reveal, reducedMotion);
        const front = pathColors?.[index] ?? color ?? (useSvgColors ? layer.color : theme.accent);
        const alpha = opacity * layer.opacity;
        return <mesh key={index} geometry={layer.geometry} position={[0, 0, revealPose.z]} scale={revealPose.scale} visible={revealPose.visible} castShadow={castShadow} receiveShadow={receiveShadow}>
          <meshPhysicalMaterial attach="material-0" color={front} roughness={roughness} metalness={metalness} clearcoat={clearcoat} transparent={alpha < 1} opacity={alpha} />
          <meshPhysicalMaterial attach="material-1" color={sideColor ?? front} roughness={roughness} metalness={metalness} clearcoat={clearcoat} transparent={alpha < 1} opacity={alpha} />
        </mesh>;
      })}
    </group>
  );
};
