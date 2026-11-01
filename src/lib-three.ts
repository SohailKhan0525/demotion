// Demotion 3D — optional entry (needs three, @react-three/fiber, @react-three/postprocessing, @remotion/three).
// Preserve Fiber's JSX augmentation for consumers of the emitted declarations.
// A bare `import type {}` is removed by TypeScript's declaration emitter.
export type { ThreeElements } from "@react-three/fiber";
export * from "./three/Stack3D";
export * from "./three/panels";
export * from "./three/RubiksCube";
export * from "./three/Scene3D";
export * from "./three/ExtrudedSvg";
