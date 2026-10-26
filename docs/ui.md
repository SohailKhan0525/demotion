# Beat-driven UI panels

`Terminal` and `CodePanel` are exported from `demotion`. Place them inside a
`Shot` in a `MotionProject`; their times are local shot beats, using the project's
clock and theme. Load the bundled fonts with `ensureFontsLoaded()` as in the
existing Remotion entry point.

```tsx
<Shot beats={4} bg={theme.field}>
  <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
    <Terminal lines={[
      { at: 0.2, text: 'npm run build', type: 1, prompt: true },
    ]} />
  </AbsoluteFill>
</Shot>
```

Terminal lines accept `at`, `text`, optional typing duration `type`, `color`, and
`prompt`. Zero or omitted `type` reveals a whole line. Text reveals by Unicode
code point; combined grapheme clusters are not specially segmented. The caret
follows the most recently started line. Keep lines in display order. Configure
`title`, `width`, `height`, and `fontSize` to fit your content.

`CodePanel` accepts a `file` label and `lines` (strings or arrays of
`{text, color?}` tokens). Whitespace is preserved and React escapes source text.
`at` defaults to beat 0; `over` defaults to 2.6 beats and spaces line starts evenly
from first to last. Each line settles with a spring and reveals with expo easing;
the latest started line has an accent border. Optional `colors` contains
`background`, `text`, and `accent`; optional dimensions and `fontSize` control
layout. Long lines are clipped rather than reflowed, so fit them to the panel.

Run `npm run dev` and select **UI** for the two-shot component study. This is a
utility preview, not the finished launch film. Tests cover frame seeking, timing,
Unicode typing, source preservation, escaping, and highlight selection.
