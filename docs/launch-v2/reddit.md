# Reddit drafts — rules check required

**Live rules could not be verified:** Reddit's rules endpoints are blocked by the
cloud proxy. These are drafts, not a statement that either community permits the
post. See [the exact research limits](research.md#reddit).

Before submitting, inspect the chosen community's current sidebar, wiki, pinned
threads and submission form. Check promotion, project showcases, video/link
formats, flair and account/karma requirements. Use a required recurring thread;
skip communities that prohibit promotion. If unclear, ask moderators. Choose one
relevant destination initially. Do not solicit upvotes or mass-crosspost.

## Maker-focused draft: candidate for r/SideProject

Title:

```text
I built a React toolkit for local motion-graphics videos. Here's the second demo and what still needs work.
```

Body:

```text
I'm the maker of demotion, a React toolkit and CLI built on Remotion. It lets me write a composition in code and render an MP4 locally.

I wanted reusable pieces for explainers and product stories, so I added five components: a numeric counter, signed bar chart, authored captions, lower thirds and a progress ring. They share one beat clock, with spring entrances and frame-based motion. The attached 30-second film was generated with the toolkit; it isn't a screen recording.

What exists today:
- The original starter/toolkit is published as @demotion/cli on npm.
- The five new components and a complete example are on GitHub main. They are not in npm 0.1.0 yet.
- Rendering is local. There is no hosted editor or rendering service.
- Captions use supplied text and beat timing; there is no transcription feature.

It is source-available: free for personal/non-commercial use; business, client or product work needs a commercial license. Remotion has its own terms.

Code, setup and example: https://github.com/SohailKhan0525/demotion

If you've tried making a product demo or tutorial in code, which step was most frustrating: scene layout, timing, captions or rendering? I'd like feedback on the workflow before adding more features.
```

Attach the native MP4 only if the community permits video. If links must go in a
comment or a specific thread, adapt the placement to the actual rule; do not
hide affiliation to evade it.

## Technical variant: only where React showcases are allowed

Title:

```text
Building deterministic React video components: rounded beat timing, signed charts and caption boundaries
```

Body:

```text
I'm building demotion on top of Remotion. The interesting problem in this iteration was keeping all components correct when the renderer visits frames out of order.

At 128 BPM and 60 fps, a beat is 28.125 frames. Rounding a shot's local beat independently can put a caption one frame away from its global cut. The components instead subtract the shot's rounded global start from the rounded global landing frame.

The counter uses bounded easing for its numeric value while its container uses a spring. That lets the card overshoot without reporting a number above the target. The chart uses a common zero baseline for positive and negative values, and rejects an explicit max that would clip a value. Caption intervals are half-open and reject overlap.

The new source includes CountUp, BarChart, CaptionTrack, LowerThird and ProgressRing, with reverse-seeking and boundary tests. The attached film demonstrates them. They are on main; the published npm 0.1.0 package still contains the original toolkit.

Repository: https://github.com/SohailKhan0525/demotion

I built the project. It's source-available, free for personal/non-commercial use, with a commercial license needed for business/client/product work. Remotion has its own terms.

For anyone who has built frame-driven React UIs: what edge cases would you prioritize next, particularly around timing and long labels?
```
