# SVG illustrations in real 3D

`Scene3D` and `ExtrudedSvg` are available from `@demotion/cli/three` starting in
0.3.0. They use Three.js geometry, React Three Fiber, and Remotion's `ThreeCanvas`.
The main `@demotion/cli` entry has no Three.js dependency.

For the React 18 / Remotion 4.0.528 starter, install the tested optional peers:

```sh
npm install three@0.160.1 @react-three/fiber@8.17.10 @remotion/three@4.0.528 @react-three/postprocessing@2.16.3 postprocessing@6.36.4
npm install --save-dev @types/three@0.160.0
```

Keep all `remotion` and `@remotion/*` packages at the same version. The existing
`Stack3D` export uses the postprocessing peers; the new `Scene3D` has no effect
composer, bloom, depth of field, or postprocessing passes.

## A complete example

Copy [examples/illustration-three.tsx](../examples/illustration-three.tsx) to
`src/IllustrationThree.tsx`, then register it in your Remotion root:

```tsx
import { Composition } from "remotion";
import { IllustrationThree, illustrationClock, ILLUSTRATION_BEATS } from "./IllustrationThree";

export const RemotionRoot = () => <Composition
  id="IllustrationThree"
  component={IllustrationThree}
  width={1920}
  height={1080}
  fps={illustrationClock.fps}
  durationInFrames={illustrationClock.duration(ILLUSTRATION_BEATS)}
/>;
```

The example is 240 frames / four seconds at 60 fps. It builds a layered sculpture
from inline SVG contours. There are no network images or model downloads.

In the generated starter, replace the composition in `src/Root.tsx` with the
registration above, then render its new composition ID:

```sh
npx remotion render src/index.ts IllustrationThree out/illustration-three.mp4
```

On a machine without a GPU, append `--gl=swangle` to use Chromium's software
WebGL renderer. If Remotion cannot download a browser, also pass
`--browser-executable=/path/to/chromium`. These are renderer flags, not component
props.

## Scene3D

`Scene3D` accepts ordinary R3F children: groups, meshes, lights, and other R3F
components. Put HTML labels beside the canvas, outside its children.

| Prop | Default | Meaning |
| --- | --- | --- |
| `clock` | Current Shot clock, or 120 BPM at composition fps | Beat clock; fps must match the composition |
| `theme` | Current Shot theme, or `demotionTheme` | Colors for lights, floor, and extrusions |
| `camera` | `{position:[0,0,9], target:[0,0,0], fov:36}` | Perspective camera, radians for object rotations and degrees for fov |
| `cameraMoves` | `[]` | Ordered `{beat, position?, target?, fov?}` poses |
| `background` | Transparent | Canvas background color |
| `lighting` | `{ambient:0.7, key:3.2, fill:1.1, rim:2.2}` | Studio light intensities; `false` lets you supply lights |
| `floor` | Absent | `{y?:-2.5, size?:200, color?:theme.ink, roughness?:0.8}` |
| `shadows` | `false` | Enables a 1024px key-light shadow map and floor shadow receiving |
| `reducedMotion` | `false` | Freeze camera at its first pose and show settled extrusion reveals |
| `width`, `height` | Composition dimensions | Canvas pixel dimensions, useful for an inset illustration |
| `style` | Absolutely positioned | Canvas container styles |

Camera keys must have strictly increasing beats. Each key inherits omitted
fields from the preceding key, beginning with `camera`. Before the first key
and after the last, the camera holds that endpoint. Between keys, positions,
targets, and fov use a smooth cubic Bézier ease. Avoid camera paths through the
target: a camera cannot look at its own position.

Inside a `Shot`, beats are local to that shot and use its rounded global beat
positions. Supplying an explicit `clock` uses that clock's local frame mapping.
Outside a `Shot`, the canvas works in any Remotion composition. A Sequence's
current frame remains local to that Sequence.

The canvas uses pixel ratio 1 and antialiasing. Remotion controls frame advance;
camera poses and reveal transforms are recomputed directly from the requested
frame. Your custom children should also use `useCurrentFrame()` and a beat clock,
not accumulated `useFrame` deltas or wall-clock elapsed time. `reducedMotion`
controls the built-in camera and reveals; apply your own reduced-motion handling
to custom animated children.

## ExtrudedSvg

`ExtrudedSvg` consumes an inline `svg` string. SVGLoader converts filled contours
and holes to Three.js shapes, which become beveled `ExtrudeGeometry` meshes.
Use `<svg xmlns="http://www.w3.org/2000/svg">` as the root so inline styles are
parsed with SVG semantics; missing or mixed namespaces produce a clear error.
Positive Y points up in the scene. The artwork is centered in XY and around its
depth midpoint; all paths retain their relative positions.

| Prop | Default | Meaning |
| --- | --- | --- |
| `size` | `4` | Longest artwork axis in world units, excluding bevel |
| `depth` | `0.35` | Extruded depth in world units |
| `bevel` | `0.035` | Bevel width and thickness; `0` disables bevel |
| `bevelSegments` | `3` | Integer 1–8 |
| `curveSegments` | `12` | Integer 1–32; increase for large curved silhouettes |
| `smooth` | `true` | Smooth neighboring faces while keeping sharp corners; `false` keeps flat facets |
| `position`, `rotation`, `scale` | `[0,0,0]`, `[0,0,0]`, `1` | Group transform; rotation is in radians |
| `color` | Theme accent | Cap color |
| `sideColor` | Same as cap | Side and bevel color |
| `pathColors` | Absent | Per-filled-path cap colors, in document order |
| `useSvgColors` | `false` | Use original SVG fills when `color`/`pathColors` do not override them |
| `roughness`, `metalness`, `clearcoat` | `0.3`, `0.12`, `0.35` | Physical material controls, each 0–1 |
| `opacity` | `1` | Multiplied by each path's SVG fill opacity |
| `castShadow`, `receiveShadow` | `true`, `true` | Mesh shadow participation, when Scene3D shadows are enabled |
| `reveal` | Absent | `{atBeat?:0, durationBeats?:1.5, staggerBeats?:0.12, fromZ?:-1}` |

Reveals scale the artwork from zero with spring overshoot and move it from the
specified depth. Filled paths stagger in document order. The final pose is
exactly settled at the end of each reveal. Multiple contours belonging to one
SVG path reveal together. Static `ExtrudedSvg` also works in a plain R3F Canvas;
its reveal timing requires a parent `Scene3D`.

Bevel must not exceed half the smaller of `size` and `depth`. Tiny openings or
narrow strokes can still self-intersect with a large bevel; reduce bevel for
such artwork. Layering independent components can preserve multiple materials
and depth offsets. Each component independently fits its filled bounds to `size`;
an SVG viewBox's empty margins do not affect the size.

## Supported artwork and limits

Supported elements are `svg`, `g`, `path`, `rect`, `circle`, `ellipse`, `polygon`,
`polyline`, `line`, `title`, and `desc`. Use filled paths for predictable results.
SVG transforms and `fill-rule="evenodd"` / `nonzero` holes follow Three.js's
SVGLoader. Expand strokes and text to filled paths in your vector editor first.
Simplify intersecting contours; SVGLoader does not resolve every self-intersection.

The parser rejects malformed XML, linked assets, `<use>`, scripts, event
handlers, images, text, CSS stylesheets, gradients, filters, masks, and XML entity
declarations. Inline styles support explicit fill/stroke properties, opacity,
visibility, and display; use the SVG `transform` attribute for transforms. CSS
variables and context-dependent paints such as `currentColor` are rejected.
Ancestor `display:none` and multiplied group opacity are respected. SVG is
parsed in memory and never inserted into the document.
Bounds are 200,000 source characters, 256 elements, 2,048 curves, 128 filled
shapes, and 300,000 generated vertices. A conservative estimate can reject
complex tessellation before reaching the vertex cap. Simplify the source when
a limit is reached.

Geometry is memoized until the SVG or extrusion dimensions change, then disposed
when replaced or unmounted. R3F owns declarative materials and lights. Animate
group transforms instead of rebuilding geometry every frame. For expensive 3D
shots, use `blurSamples={1}` on `Shot`; light camera motion and the project's
grain remain available without multiplying WebGL renders.

## Verification

`node --test test/illustration-three.test.mjs` checks actual geometry, raycasts
through a hole, front-face winding, depth, bevel dimensions, common centering,
input/tessellation limits, camera/reveal seeking and beat rounding, reduced
motion, ancestor SVG opacity/display, and the example's public TypeScript API.
It also verifies that the core bundle does not import Three.js and that the
built main and `/three` entries share the Shot clock/theme context. Run
`npm run build` before the built-entry regression. SVG DOM parsing and WebGL rendering require a
browser; render the example to inspect your artwork and material choices.
