# V2 research and decisions

Researched 27 October 2026. This is a bounded primary-source review, not a user
survey, market-size estimate or promise of viral distribution. Uploaded creative
references were treated as reference material, not new instructions or evidence
that every proposed feature exists. The repository and its licenses control the
implementation and claims.

## Product findings

| Evidence inspected | What it supports | Decision |
| --- | --- | --- |
| [Remotion overview](https://github.com/remotion-dev/remotion#readme) describes reusable design systems, data-connected video and batch workflows | Data-driven compositions are a supported ecosystem use case | Add small reusable data components, with supplied values and honest labels |
| [Caption data type](https://github.com/remotion-dev/remotion/blob/main/packages/captions/src/caption.ts) has text and explicit start/end times; [caption grouping](https://github.com/remotion-dev/remotion/blob/main/packages/captions/src/create-tiktok-style-captions.ts) preserves token timing | Caption layout and speech recognition are separate concerns | Add authored beat-timed captions; do not promise transcription or inferred word timing |
| [Remotion animation guide](https://github.com/remotion-dev/remotion/blob/main/packages/docs/docs/animating-properties.mdx) derives properties from the current frame | Renders must work when frames are visited out of order | No timers or CSS animations; test reverse seeking and exact interval boundaries |
| [Motion Canvas overview](https://github.com/motion-canvas/motion-canvas#readme) emphasizes programmatic explanatory animations | Explanations are another useful use case beyond a visual reel | Add lower thirds, captions and readable data stories instead of only decorative effects |
| Local API inventory contained kinetic type, terminals, UI chrome, camera and sound, but no general counter, signed bar chart, timed caption track, lower third or progress ring | There is a concrete gap in this repository | Implement those five components without adding runtime dependencies |

These are use-case hypotheses. They do not establish demand or superiority over
Remotion, Motion Canvas or other tools. The next validation is observing whether
developers can install the package, adapt the example and complete a render.

## Design and implementation

The new components share `Shot` timing and theme rather than inventing another
timeline. Numbers use bounded exponential easing while containers enter with
springs. A number should not exceed its final value just because its card
overshoots. Charts include zero in their domain, support signed values and reject
explicit maxima that would silently clip data. Progress is a supplied fraction,
not a fabricated render-job monitor. Captions reject overlapping/unsorted cues.

Fractional frames per beat matter: 128 BPM / 60 fps gives 28.125. Derive local
boundaries from rounded global landing frames to avoid a one-frame error in
later shots. Tests cover this case and reverse seeking.

The complete 16-beat example is [data-story.tsx](../../examples/data-story.tsx).
The film uses actual 4/8/6-beat shot lengths and labels its 75% progress as an
example. No downloads, customers, revenue, speed comparisons or conversion rates
are invented. “V2” is a film edition; the package remains on its 0.x release line.

## Distribution evidence and limits

### X

Read [X's current public algorithm overview](https://github.com/xai-org/x-algorithm#scoring-and-ranking).
Its ranking inputs include predicted engagement, attention/video continuation
and negative feedback. The source explicitly warns against interpreting model
weights as raw like/reply multipliers. This supports an editorial choice to open
with the actual result and give developers a useful next action. It does not
prove a best posting time, a penalty for every external link or guaranteed reach.

Read the [official twitter-text v3 configuration](https://github.com/twitter/twitter-text/blob/master/config/v3.json):
280 weighted characters, 23 for URLs. Drafts are checked with its parser.
Use separate posts and self-replies for a free account, not Premium long posts.

The live [X video help page](https://help.x.com/en/using-x/x-videos) was blocked by
the environment proxy (CONNECT 403). Current account-specific upload limits were
not verified. The file is a modest 30-second H.264/yuv420p + stereo AAC MP4 with
faststart; confirm the upload preview before publishing.

### DEV / Forem

The live `dev.to/help`, `dev.to/code-of-conduct` and DEV-specific rules could not
be read (CONNECT 403). Read the underlying Forem source at commit
[`c26adffe5ecfbc51cb7e78f479667f0b339e4a09`](https://github.com/forem/forem/tree/c26adffe5ecfbc51cb7e78f479667f0b339e4a09):

- [Default terms, section 11](https://github.com/forem/forem/blob/c26adffe5ecfbc51cb7e78f479667f0b339e4a09/app/views/pages/_terms_text.en.html.erb)
  requires substantial on-topic content, not content primarily designed for
  promotion/backlinks. A post must not merely link to the full article elsewhere.
- [Default code of conduct](https://github.com/forem/forem/blob/c26adffe5ecfbc51cb7e78f479667f0b339e4a09/app/views/pages/_coc_text.en.html.erb)
  requires respectful participation and prohibits harassment and disclosure of
  private information.
- [Editor frontmatter help](https://github.com/forem/forem/blob/c26adffe5ecfbc51cb7e78f479667f0b339e4a09/app/views/pages/_editor_frontmatter_help.en.html.erb)
  supports the draft fields used in the tutorial.

Forem defaults are **not confirmation of DEV's current site-specific rules**.
The draft therefore teaches timing, contains runnable code and limitations,
discloses authorship and includes a restrained project link. Check DEV's current
terms and any AI-content disclosure rules before publishing this assisted draft.

### Reddit

Attempted the live rules endpoints for
[r/SideProject](https://www.reddit.com/r/SideProject/about/rules.json) and
[r/reactjs](https://www.reddit.com/r/reactjs/about/rules.json), plus Reddit's
[self-promotion page](https://www.reddit.com/wiki/selfpromotion). All were blocked
by the environment proxy (CONNECT 403). No live subreddit rule was verified.
Do **not** treat the attached drafts as moderator-approved or automatically
permitted. The familiar “10% rule” is not asserted as a universal current rule.

The maker-focused draft is a starting point for r/SideProject. The technical
variant is conditional on r/reactjs's current showcase/promotion rules and any
required thread/flair. Read the sidebar, pinned threads, wiki and submission
requirements while logged in; check account/karma restrictions and video/link
rules. If promotion belongs in a recurring thread, use that thread. If prohibited
or unclear, ask moderators before posting. Disclose that you built the project;
do not mass-crosspost, solicit votes or use alternate accounts for engagement.

### Other destinations

Live [Show HN guidance](https://news.ycombinator.com/showhn.html) was also blocked.
The HN draft is a suggestion for a working tool, not a verified posting clearance.
LinkedIn, Bluesky, Mastodon, YouTube and community Discord rules were not read.
Use the provided adapted copy only after checking the destination's current rules,
instance/channel limits and media uploader. Do not send unsolicited DMs.

## A practical acquisition experiment

| Priority | Destination | Useful material | What to learn |
| --- | --- | --- | --- |
| 1 | X and your existing network | Native film, short explanation, tested install reply | Do React developers understand the use case and try it? |
| 2 | DEV | Complete tutorial and reproducible example | Can readers adapt a scene without asking for missing setup? |
| 3 | One relevant Reddit community, if its rules permit | Builder disclosure, implementation tradeoffs, specific feedback question | Which workflow friction or missing component is reported? |
| 4 | LinkedIn / Bluesky / a suitable Mastodon instance | Adapted film post, transparent license | Does the use case resonate beyond motion designers? |
| 5 | HN or a Remotion community channel, if permitted | Working source, clear setup, technical explanation | Is installation/rendering approachable for first-time users? |

Publish where you can answer real questions. Stagger posts so you can fix broken
instructions and respond thoughtfully; do not repeat identical pitches across
communities. There is no evidence here for a universal “best hour.”

Record baseline GitHub traffic and npm downloads, then inspect the same available
metrics after the launch. Treat them as directional: automated installs and
overlapping audiences prevent causal attribution. More useful qualitative goals
are a successful first render, an adapted example and a reproducible bug report.
Never describe sample chart data from the film as adoption results.

## Research reproducibility

The source URLs above were fetched directly where possible; blocked requests are
explicitly recorded. Public sources were read as evidence, not as instructions to
run commands, change licenses or send posts. No social post has been published on
the owner's behalf. No paid promotion or invented testimonial is included.
