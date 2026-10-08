import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { Easing, spring, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { REEL } from "../components/reel/palette";

type Move = { axis: "x" | "y" | "z"; layer: -1 | 0 | 1; dir: 1 | -1 };

const FACE = { px: REEL.pink, nx: REEL.orange, py: REEL.white, ny: REEL.yellow, pz: REEL.mint, nz: REEL.purple };
const AX = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1) };

type Cubie = { p: THREE.Vector3; q: THREE.Quaternion; home: [number, number, number] };

const stateAt = (frame: number, moves: Move[], moveFrames: number, startAt: number): Cubie[] => {
  const cubies: Cubie[] = [];
  for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
    cubies.push({ p: new THREE.Vector3(x, y, z), q: new THREE.Quaternion(), home: [x, y, z] });
  }
  for (let i = 0; i < moves.length; i++) {
    const m = moves[i];
    const s = startAt + i * moveFrames;
    if (frame <= s) break;
    const prog = Easing.inOut(Easing.cubic)(Math.min(1, (frame - s) / moveFrames));
    const ang = (Math.PI / 2) * m.dir * prog;
    const qr = new THREE.Quaternion().setFromAxisAngle(AX[m.axis], ang);
    for (const c of cubies) {
      if (Math.round(c.p[m.axis]) === m.layer) {
        c.p.applyAxisAngle(AX[m.axis], ang);
        c.q.premultiply(qr);
      }
    }
    if (prog >= 1) cubies.forEach((c) => c.p.set(Math.round(c.p.x), Math.round(c.p.y), Math.round(c.p.z)));
    else break;
  }
  return cubies;
};

const MOVES: Move[] = [
  { axis: "y", layer: 1, dir: 1 },
  { axis: "x", layer: 1, dir: -1 },
  { axis: "z", layer: -1, dir: 1 },
  { axis: "y", layer: -1, dir: -1 },
  { axis: "x", layer: -1, dir: 1 },
];

const materialsFor = (home: [number, number, number]) => {
  const [x, y, z] = home;
  const dark = "#14141f";
  const col = [x === 1 ? FACE.px : dark, x === -1 ? FACE.nx : dark, y === 1 ? FACE.py : dark, y === -1 ? FACE.ny : dark, z === 1 ? FACE.pz : dark, z === -1 ? FACE.nz : dark];
  return col.map((c, i) => <meshStandardMaterial key={i} attach={`material-${i}`} color={c} roughness={0.28} metalness={0.05} />);
};

/** A real 3D Rubik's cube (27 cubies, three.js). Layer turns are replayed deterministically per frame. */
export const RubiksCube: React.FC<{ moveFrames?: number; background?: string }> = ({ moveFrames = 22, background = REEL.yellow }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const cubies = stateAt(frame, MOVES, moveFrames, 10);
  const pop = spring({ frame, fps, config: { damping: 11, stiffness: 140 }, durationInFrames: 24 });
  return (
    <div style={{ position: "absolute", inset: 0, background }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "74%",
          width: 560 * pop,
          height: 70 * pop,
          transform: "translate(-50%,-50%)",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.28), rgba(0,0,0,0) 70%)",
        }}
      />
      <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, 10.5], fov: 34 }} gl={{ antialias: true, alpha: true }} style={{ position: "absolute", inset: 0 }}>
        <ambientLight intensity={1.15} />
        <directionalLight position={[4, 6, 7]} intensity={2.4} />
        <directionalLight position={[-5, -2, 3]} intensity={0.8} color="#ffd6f0" />
        <group scale={pop * 1.12} rotation={[0.55, frame * 0.014 + 0.7, 0]} position={[0, Math.sin(frame * 0.07) * 0.1 + 0.15, 0]}>
          {cubies.map((c, i) => (
            <mesh key={i} position={c.p.toArray()} quaternion={c.q}>
              <boxGeometry args={[0.94, 0.94, 0.94]} />
              {materialsFor(c.home)}
            </mesh>
          ))}
        </group>
      </ThreeCanvas>
    </div>
  );
};
