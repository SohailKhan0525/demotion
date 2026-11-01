# Animated 2D illustrations

`DrawPath`, `FollowPath`, `usePathMotion`, and `WorkflowIllustration` are exported
from `@demotion/cli`. Use them inside a `Shot` within `MotionProject`. Timing is
in shot-local beats, including fractional beats, and follows the project's
rounded beat landing frames. Seeking backwards and rendering frames out of order
produce the same result. There are no animation timers or browser path measurements.

```tsx
import { DrawPath, FollowPath, demotionTheme } from "@demotion/cli";

const route = "M80 180C240 20 400 340 560 180";

export const Route = () => (
  <svg width={640} height={360} viewBox="0 0 640 360">
    <DrawPath d={route} at={0.5} over={2} strokeWidth={5} />
    <FollowPath d={route} at={0.5} over={3}>
      <path d="M-12-9L15 0L-12 9Z" fill={demotionTheme.accent} />
    </FollowPath>
  </svg>
);
```

The complete [illustration example](../examples/illustration.tsx) includes a
registered 1920×1080, 60 fps composition at 128 BPM. Its 16 beats produce 450
frames. In a project with the package installed, copy it into `src/` and run
`npx remotion render src/illustration.tsx IllustrationStory out/illustration.mp4`.
The example calls `ensureFontsLoaded()`; `demotion init` supplies the font files.

## Drawing and following paths

| API | Options and behavior |
| --- | --- |
| `DrawPath` | Required `d`; `at=0`, `over=2`, `strokeWidth=4`, `reverse=false`, `reducedMotion=false`. Defaults to the theme accent. Accepts normal SVG path presentation props except fill, path length, and dash controls. Always draws a stroke with no fill. |
| `FollowPath` | Required `d`; `at=0`, `over=2`, `from=0`, `to=1`, `rotate=true`, `rotationOffset=0`, `reducedMotion=false`. Renders an SVG group with normal group presentation props, plus its children. |
| `usePathMotion` | Takes the movement options from `FollowPath`; returns `{x, y, angle, progress, pathProgress, transform}` for custom SVG or HTML artwork. `angle` is degrees; `transform` uses SVG transform syntax. |

Center follower artwork at `(0, 0)`. Its positive x axis points in the direction
of travel when `rotate` is enabled. Set `from=1` and `to=0` for reverse travel,
or use fractions to traverse only part of the path. `rotationOffset` adjusts an
asset's intrinsic orientation, and still applies with `rotate={false}`. With
equal `from` and `to`, the follower holds that point with `rotationOffset`.

Drawing uses exponential ease-out; movement uses cubic ease-in-out. Both remain
bounded and hold their final state. Before `at`, the drawing is invisible and the
follower holds its starting point. `over={0}` changes to the final state exactly
on `at`. Set `reducedMotion` to show the completed state at every frame, including
before `at`; it is explicit and does not read the operating system preference.
Set this option separately on each animated component.

Paths must contain one continuous subpath with positive length. Render a separate
component per subpath for compound artwork. Relative coordinates, lines, quadratic
and cubic curves, arcs, and closed contours are supported. The MIT-licensed
`@remotion/paths@4.0.528` handles path parsing, canonicalization, measurement, and
sampling. Arcs are converted to cubic curves; their length and position are
numerical approximations. Zero-radius arcs become lines; collapsed segments are
removed. A wholly collapsed path is rejected. Orientation uses nearby samples so
stationary endpoints and reverse movement stay finite; corners can turn sharply.

Malformed commands, non-finite geometry, and values outside supported bounds
throw descriptive errors. Limits are 32,768 input characters, 1,024 parsed
instructions, absolute coordinates/control points within ±1,000,000, and length
no greater than 100,000,000. `from` and `to` must be within `[0, 1]`; `over` must
be non-negative. Nested SVG groups can scale or reposition larger artwork.

## A complete layered illustration

```tsx
import { WorkflowIllustration } from "@demotion/cli";

export const WorkflowArt = () => (
  <WorkflowIllustration
    at={0.25}
    width={960}
    height={600}
    labels={["Source", "Compose", "Ready"]}
    title="Source material becomes a finished video"
  />
);
```

The original artwork combines a source document, three stacked composition layers,
and a video card. Staggered spring entrances, drawn connectors, traveling tokens,
and a completion mark settle within five beats. It uses the current shot theme,
the bundled Archivo and JetBrains Mono families, and a unique accessible title ID
per instance. It includes no external image assets. `reducedMotion` freezes the
complete illustration and hides the transient tokens. Width and height default
to `960` and `600` and must be positive and at most `16384`; a fixed `960 600`
viewBox preserves the artwork. Labels accept three strings of up to 24 characters.
`style` and `className` apply to the SVG. Camera movement, motion blur, and grain
come from the surrounding `MotionProject`.

Upstream references: [paths package](https://github.com/remotion-dev/remotion/tree/v4.0.528/packages/paths),
[drawing](https://www.remotion.dev/docs/paths/evolve-path),
[sampling](https://www.remotion.dev/docs/paths/get-point-at-length).
