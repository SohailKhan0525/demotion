# X launch: free-plan copy and posting sequence

Use this only after the npm publication and registry-backed install/render
checks succeed. Attach the existing 26-second MP4 directly to the main post.
The demo was recorded before publication; the second reply makes that explicit.

## Main post — 247 weighted characters

```text
This video is React code.

No screen recording. Every frame is generated locally with demotion, my new toolkit built on Remotion.

Beat-synced type, 3D, motion blur + generated sound.

npx @demotion/cli init my-video

What would you build with it?
```

## First self-reply — 185 weighted characters

```text
Try it:

npx @demotion/cli init my-video
cd my-video
npm install
npm start

Edit src/MyVideo.tsx, then npm run render.

Code + docs: https://github.com/SohailKhan0525/demotion
npm: https://www.npmjs.com/package/@demotion/cli
```

## Second self-reply — 222 weighted characters

```text
Demo recorded before the first release. demotion 0.1.0 is now on npm.

Free for personal/non-commercial use. Business, client or product work needs a commercial license. Remotion has its own terms.

https://ko-fi.com/qofenoai
```

Each post was checked with the official twitter-text parser against the standard
280-character limit, including URL weighting. These are three separate posts,
not one long Premium-only post. Do not wrap commands in Markdown backticks when
copying the plain-text drafts to X.

## Research and practical choices

Reviewed 26 October 2026:

1. [X's current public feed algorithm](https://github.com/xai-org/x-algorithm#scoring-and-ranking)
   describes viewer-specific predictions for replies, sharing, video quality
   views, dwell and video continuation, together with negative feedback. The
   repository includes September 2026 updates. Its weights apply to predicted
   values, not raw engagement counts; no fixed like/reply multiplier is claimed.
2. [The scoring implementation](https://github.com/xai-org/x-algorithm/blob/main/xai-value-model/scoring.rs)
   includes attention and video-continuation inputs. The recommendation here is
   therefore to show the actual result immediately, explain it in the opening
   sentence and give interested developers something concrete to try.
3. [The official text configuration](https://github.com/twitter/twitter-text/blob/master/config/v3.json)
   defines the standard 280-character weighted limit and 23-character URL weight.

The native video, plain-language React hook, working command and one real question
are editorial choices informed by those sources, not a guarantee of viral reach.
Links are in a reply to keep the main post focused and within the limit; this is
not presented as a proven way to bypass link ranking. The public ranking code
cannot establish a universal best posting time or your account's likely reach.
X Help pages could not be read from this environment (HTTP 403), so no claim is
made that their current free-account media specifications were independently
verified here. The supplied file is 26 seconds / 26 MB, H.264 + AAC in MP4.

## Publish it

- Upload your downloaded launch MP4 directly to X; do not use the GitHub video URL
  as a substitute for the native upload. Keep its composed opening frame.
- Paste the main post and play the uploaded preview before publishing.
- Add the two self-replies with the install instructions, links and license context.
- Choose a time when you can stay available for useful conversation. Reply to
  genuine questions and fix installation reports; do not repeat the post, demand
  engagement or mass-tag unrelated accounts.
- Check the replies and basic analytics available on your account. Use actual
  feedback to improve the next demo rather than relying on a claimed algorithm hack.

The commercial terms above summarize existing repository wording; this launch
copy does not change those terms. No post or reply has been sent on your behalf.
