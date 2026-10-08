# demotion

**Motion graphics, written in code.** A React toolkit and CLI for making polished videos on your own computer — beat-synced motion, camera, type, transitions and sound — rendered locally with [Remotion](https://www.remotion.dev). No screen recordings. No screenshots. Every frame is code.

> **Status: pre-release (0.x).** Not on npm yet — the first release is cut automatically from the `main` branch.

## Quick start

```bash
npx demotion init my-video
cd my-video
npm install
npm start            # live preview in your browser
npm run render       # out/video.mp4      (1920x1080)
npm run render:4k    # out/video-4k.mp4   (3840x2160)
```

Edit `src/MyVideo.tsx` — that's the whole video. Everything renders on your computer; nothing is uploaded.

## License — free for personal use, paid for business

Demotion uses the [PolyForm Noncommercial License 1.0.0](./LICENSE). It is **source-available**, not OSI "open source".

| You are… | License |
|---|---|
| An individual: personal projects, hobby, research, study | **Free** |
| A school, charity, public-research or government body | **Free** |
| A freelancer, a team, or a company — any paid, client or product-promoting work | **[Commercial license](./COMMERCIAL-LICENSE.md)** — Solo / Team / Company |

Get a commercial license or support the project on Ko-fi: **https://ko-fi.com/qofenoai**

Demotion is built on Remotion, which has its **own** license (it may require a company license for larger teams): https://www.remotion.dev/docs/terms

## Support the project

Demotion is built and maintained by one person. If it saves you time, please support it: **https://ko-fi.com/qofenoai** ☕

## Contributing

Bug reports and ideas are very welcome in [Issues](https://github.com/sohailkhan0525/demotion/issues). I'm not accepting code pull requests yet, because contributions to a dual-licensed project need a contributor agreement that isn't set up.

## Development

```bash
npm install
npm run dev      # preview the showcase video
npm run lint && npm run build && npm test
```

Releases are automated with [semantic-release](https://semantic-release.gitbook.io): commits follow [Conventional Commits](https://www.conventionalcommits.org) (`feat:` → minor, `fix:` → patch, `feat!:` → major).
