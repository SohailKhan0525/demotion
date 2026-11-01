import test from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import ts from "typescript";
import { loadTs } from "./helpers.mjs";

const geometry = await loadTs("src/three/svgGeometry.ts");
const motion = await loadTs("src/three/illustrationMotion.ts");
const core = await loadTs("src/core/clock.ts");
// Bundle these constructors with the helper; tests exercise actual Three.js extrusion.
const { Shape, Path, Raycaster, Vector3, Mesh, MeshBasicMaterial } = await import("three");
const near = (a, b, epsilon = 1e-5) => assert.ok(Math.abs(a - b) < epsilon, `${a} should equal ${b}`);
const rectangle = (x, y, w, h) => {
  const shape = new Shape();
  shape.moveTo(x, y); shape.lineTo(x + w, y); shape.lineTo(x + w, y + h); shape.lineTo(x, y + h); shape.closePath();
  return shape;
};

test("SVG extrusion preserves holes, front-facing winding, world depth and shared centering", () => {
  const shape = rectangle(10, 20, 100, 100);
  const hole = new Path();
  hole.moveTo(35, 45); hole.lineTo(35, 95); hole.lineTo(85, 95); hole.lineTo(85, 45); hole.closePath();
  shape.holes.push(hole);
  const [{ geometry: solid }] = geometry.extrudeSvgShapeLayers([{ shapes: [shape], color: "#D4FF3A", opacity: 1 }], { size: 4, depth: 0.6, bevel: 0 });
  const material = new MeshBasicMaterial();
  try {
    const box = solid.boundingBox;
    near(box.min.x, -2); near(box.max.x, 2); near(box.min.y, -2); near(box.max.y, 2);
    near(box.min.z, -0.3); near(box.max.z, 0.3);
    assert.deepEqual([...new Set(solid.groups.map((g) => g.materialIndex))], [0, 1]);
    const mesh = new Mesh(solid, material);
    mesh.updateMatrixWorld();
    assert.equal(new Raycaster(new Vector3(0, 0, 5), new Vector3(0, 0, -1)).intersectObject(mesh).length, 0, "hole must go through the solid");
    assert.ok(new Raycaster(new Vector3(1.5, 0, 5), new Vector3(0, 0, -1)).intersectObject(mesh).length > 0, "front faces remain visible after SVG Y conversion");
  } finally { solid.dispose(); material.dispose(); }
});

test("multiple SVG paths share one coordinate system and bevel is measured in world units", () => {
  const layers = geometry.extrudeSvgShapeLayers([
    { shapes: [rectangle(0, 0, 20, 20)], color: "#2B3CFF", opacity: 1 },
    { shapes: [rectangle(80, 0, 20, 20)], color: "#D4FF3A", opacity: 0.5 },
  ], { size: 4, depth: 0.4, bevel: 0.05 });
  try {
    near(layers[0].geometry.boundingBox.min.x, -2.05);
    near(layers[1].geometry.boundingBox.max.x, 2.05);
    near(layers[0].geometry.boundingBox.min.z, -0.25);
    near(layers[0].geometry.boundingBox.max.z, 0.25);
    assert.equal(layers[1].opacity, 0.5);
  } finally { layers.forEach((layer) => layer.geometry.dispose()); }
});

test("SVG extrusion bounds source and tessellation cost and rejects degenerate geometry", () => {
  for (const options of [{ size: NaN }, { depth: 0 }, { bevel: -1 }, { curveSegments: 100 }, { bevelSegments: 1.5 }]) {
    assert.throws(() => geometry.validateSvgExtrusionOptions(options), /ExtrudedSvg/);
  }
  for (const svg of ["", "x".repeat(200001), '<!DOCTYPE svg><svg/>', '<svg><path fill="url(#gradient)"/></svg>']) {
    assert.throws(() => geometry.validateSvgSource(svg), /ExtrudedSvg/);
  }
  assert.throws(() => geometry.extrudeSvgShapeLayers([], {}), /non-zero/);
  assert.throws(() => geometry.extrudeSvgShapeLayers([{ shapes: [rectangle(0, 0, 0, 100)], color: "#2B3CFF", opacity: 1 }]), /non-zero/);
  const excessive = new Shape();
  excessive.moveTo(1, 0);
  for (let i = 1; i <= 10000; i++) excessive.lineTo(Math.cos(i / 10000 * Math.PI * 2), Math.sin(i / 10000 * Math.PI * 2));
  assert.throws(() => geometry.extrudeSvgShapeLayers([{ shapes: [excessive], color: "#2B3CFF", opacity: 1 }]), /budget/);
});

test("SVG presentation keeps ancestor display and composited opacity when a child overrides opacity", () => {
  const node = (attributes = {}, parentElement = null, styles = {}) => ({
    parentElement, getAttribute: (key) => attributes[key] ?? null,
    style: { getPropertyValue: (key) => styles[key] ?? "" },
  });
  assert.deepEqual(geometry.svgAncestorPresentation(node({ opacity: "1" }, node({ opacity: "0" }))), { hidden: true, opacity: 0 });
  assert.deepEqual(geometry.svgAncestorPresentation(node({}, node({ display: "none" }))), { hidden: true, opacity: 0 });
  assert.deepEqual(geometry.svgAncestorPresentation(node({ opacity: ".8" }, node({ opacity: ".5" }))), { hidden: false, opacity: .4 });
  assert.deepEqual(geometry.svgAncestorPresentation(node({ opacity: ".8" }, null, { opacity: "25%" })), { hidden: false, opacity: .25 });
  assert.throws(() => geometry.svgAncestorPresentation(node({ opacity: "inherit" })), /finite/);
  assert.throws(() => geometry.validateSvgSource('<svg><path fill="currentColor"/></svg>'), /paint/);
});

test("camera keyframes use rounded beat positions and reproduce reverse seeks", () => {
  const clock = core.createBeatClock({ bpm: 128, fps: 60 });
  const at = (beat) => clock.frame(2 + beat) - clock.frame(2);
  const camera = { position: [0, 0, 9], fov: 36 };
  const moves = [{ beat: 0.5, position: [4, 2, 9] }, { beat: 3.5, position: [-4, 1, 8], fov: 44 }];
  assert.deepEqual(motion.sampleScene3DCamera(at(0.5), at, camera, moves).position, [4, 2, 9]);
  assert.deepEqual(motion.sampleScene3DCamera(at(3.5), at, camera, moves).position, [-4, 1, 8]);
  const first = motion.sampleScene3DCamera(42, at, camera, moves);
  motion.sampleScene3DCamera(87, at, camera, moves);
  assert.deepEqual(motion.sampleScene3DCamera(42, at, camera, moves), first);
  assert.deepEqual(motion.sampleScene3DCamera(87, at, camera, moves, true).position, [4, 2, 9]);
  assert.throws(() => motion.sampleScene3DCamera(0, at, camera, [{ beat: 2 }, { beat: 1 }]), /increasing/);
  assert.throws(() => motion.sampleScene3DCamera(0, at, { position: [0, 0, 0] }), /must differ/);
  assert.throws(() => motion.sampleScene3DCamera(0, at, { fov: Infinity }), /finite/);
});

test("SVG reveals stagger on beats, overshoot, settle and honor reduced motion", () => {
  const at = (beat) => Math.round(beat * 30);
  const reveal = { atBeat: 1, durationBeats: 2, staggerBeats: 0.5, fromZ: -2 };
  assert.equal(motion.sampleExtrudedSvgReveal(29, at, 0, reveal, false).visible, false);
  assert.equal(motion.sampleExtrudedSvgReveal(40, at, 1, reveal, false).visible, false);
  assert.ok(motion.sampleExtrudedSvgReveal(55, at, 0, reveal, false).scale > 1);
  assert.deepEqual(motion.sampleExtrudedSvgReveal(90, at, 0, reveal, false), { scale: 1, z: 0, visible: true });
  assert.deepEqual(motion.sampleExtrudedSvgReveal(-100, at, 0, reveal, true), { scale: 1, z: 0, visible: true });
  assert.throws(() => motion.sampleExtrudedSvgReveal(0, at, 0, { durationBeats: 0 }, false), /durationBeats/);
});

test("the published 3D example typechecks against built declarations and core stays Three-free", async () => {
  const program = ts.createProgram(["examples/illustration-three.tsx"], {
    target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX, strict: true, skipLibCheck: true, esModuleInterop: true, noEmit: true,
    baseUrl: process.cwd(), paths: { "@demotion/cli": ["dist/types/lib.d.ts"], "@demotion/cli/three": ["dist/types/lib-three.d.ts"] },
  });
  assert.ok(!program.getSourceFiles().some((file) => file.fileName.startsWith(`${process.cwd()}/src/`)), "consumer typecheck must not load source JSX augmentations");
  const diagnostics = ts.getPreEmitDiagnostics(program);
  assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCurrentDirectory: () => process.cwd(), getCanonicalFileName: (name) => name, getNewLine: () => "\n",
  }));
  const built = await build({ entryPoints: ["src/lib.ts"], bundle: true, write: false, metafile: true, external: ["react", "react-dom", "react/jsx-runtime", "remotion", "@remotion/*"] });
  assert.ok(!Object.keys(built.metafile.inputs).some((name) => /(?:^|\/)three(?:\/|$)|@react-three|postprocessing/.test(name)), "core must not pull in optional Three.js dependencies");
});

test("built /three inherits the main entry's Shot clock, theme and local beat rounding", async () => {
  // Mock only the WebGL surface and Remotion's frame hooks. Both public bundles
  // and the React provider/hook machinery are real, including context identity.
  const result = await build({
    stdin: { resolveDir: process.cwd(), loader: "tsx", contents: `
      import React from 'react';
      import {renderToStaticMarkup} from 'react-dom/server';
      import {ShotContext, createBeatClock} from './dist/index.js';
      import {Scene3D} from './dist/three.js';
      const clock = createBeatClock({bpm:128, fps:60});
      const shot = {clock, theme:{ink:'#0D0E12', chalk:'#D4FF3A', field:'#2B3CFF', accent:'#FF4B1F', spark:'#F2F0EA'},
        startFrame:clock.frame(2), startBeat:2, pre:4, durationFrames:120};
      export const html = renderToStaticMarkup(<ShotContext.Provider value={shot}>
        <Scene3D cameraMoves={[{beat:0,position:[0,0,10]},{beat:2,position:[10,0,10]}]}>{null}</Scene3D>
      </ShotContext.Provider>);
    ` },
    bundle: true, platform: "browser", format: "esm", write: false,
    alias: { "react-dom/server": "react-dom/server.browser" },
    plugins: [{ name: "webgl-surface", setup(builder) {
      builder.onResolve({ filter: /^@remotion\/three$/ }, () => ({ path: "canvas", namespace: "three-test" }));
      builder.onResolve({ filter: /^remotion$/ }, () => ({ path: "frame", namespace: "three-test" }));
      builder.onResolve({ filter: /^@react-three\/fiber$/ }, () => ({ path: "fiber", namespace: "three-test" }));
      builder.onResolve({ filter: /^@react-three\/postprocessing$/ }, () => ({ path: "effects", namespace: "three-test" }));
      builder.onLoad({ filter: /.*/, namespace: "three-test" }, ({ path }) => {
        const contents = path === "canvas" ? `
          import React from 'react';
          export const ThreeCanvas = props => {
            const children = React.Children.toArray(props.children.props.children);
            const lights = children.find(child => child.type === React.Fragment);
            const ambient = React.Children.toArray(lights.props.children)[0].props.color;
            return React.createElement('output', {'data-camera':JSON.stringify(props.camera.position), 'data-ambient':ambient});
          };` : path === "frame" ? `
          export * from ${JSON.stringify(`${process.cwd()}/node_modules/remotion/dist/esm/index.mjs`)};
          export const useCurrentFrame = () => 34;
          export const useVideoConfig = () => ({fps:60,width:1920,height:1080});
        ` : path === "fiber" ? "export const useThree = () => ({});" : "export const Bloom = () => null; export const DepthOfField = () => null; export const EffectComposer = () => null;";
        return { contents, resolveDir: process.cwd(), loader: "js" };
      });
    } }],
  });
  const { html } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString("base64")}`);
  const clock = core.createBeatClock({ bpm: 128, fps: 60 });
  const expected = motion.sampleScene3DCamera(30, (beat) => clock.frame(2 + beat) - clock.frame(2), {}, [
    { beat: 0, position: [0, 0, 10] }, { beat: 2, position: [10, 0, 10] },
  ]);
  assert.ok(html.includes(`data-camera="${JSON.stringify(expected.position)}"`), html);
  assert.ok(html.includes('data-ambient="#D4FF3A"'), html);
});
