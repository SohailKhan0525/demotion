import React from "react";
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, getRemotionEnvironment,
  getStaticFiles, staticFile, useCurrentFrame,
} from "remotion";
import { DataStory } from "../../examples/data-story";
import { IllustrationThree } from "../../examples/illustration-three";
import { PromoScene } from "../../examples/promo-scene";
import { clamp01, spring } from "../core/math";
import { MotionProject, Shot } from "../engine/MotionProject";
import { demotionTheme as T } from "../engine/theme";
import { FONT_FAMILY, MONO_FAMILY, archivo } from "../font";
import { Lab } from "../lab/Lab";
import { UI } from "../lab/UI";
import { LaunchDemo } from "../launch/LaunchDemo";
import { LaunchV2 } from "../launch-v2/LaunchV2";
import { PromoLaunch } from "../promo/PromoLaunch";
import { UpdateFilm } from "../update-film/UpdateFilm";
import { ComponentGallery } from "./Gallery";
import { Specimens } from "./Specimens";
import { SHOWCASE_CHAPTERS, SHOWCASE_COMMAND, showcaseClock, type ShowcaseSource } from "./timeline";

const width = 1920, height = 1080;
const promoPoster = new URL("../../docs/assets/promo-poster.webp", import.meta.url).href;
const depthPoster = new URL("../../docs/assets/update-poster.webp", import.meta.url).href;
const contactPrints = [
  { label: "Starter", src: new URL("../../docs/assets/starter-preview.png", import.meta.url).href },
  { label: "Data story", src: new URL("../../docs/assets/data-story-preview.png", import.meta.url).href },
  { label: "Canvas demo", src: new URL("../../docs/assets/canvas-launch-poster.webp", import.meta.url).href },
];
const imageSources = {
  starter: "showcase/starter.mp4",
  IllustrationStory: "showcase/illustration.mp4",
  Canvas: "showcase/canvas-launch.mp4",
};
const score = "showcase/score.wav";
const face: React.CSSProperties = { fontFamily: FONT_FAMILY, fontVariationSettings: archivo(92, 830) };
const mono: React.CSSProperties = { fontFamily: MONO_FAMILY, fontWeight: 520 };

function Wordmark({ dark = false }: { dark?: boolean }) {
  return <div style={{ position: "absolute", top: 68, left: 90, display: "flex", alignItems: "center", gap: 17, ...face, color: dark ? T.chalk : T.ink, fontSize: 48, letterSpacing: -2 }}>
    <div style={{ display: "flex", gap: 6, transform: "skewX(-22deg)" }}>
      {[0, 1, 2].map(i => <div key={i} style={{ width: 10, height: 32, background: dark ? T.accent : T.field }} />)}
    </div>
    demotion
  </div>;
}

function useEntrance(at: number, frequency = 2.7) {
  const frame = useCurrentFrame();
  return spring((frame - showcaseClock.frame(at)) / showcaseClock.fps, frequency, .72);
}

function Opening() {
  const title = useEntrance(-.85), subtitle = useEntrance(.25);
  const firstPrint = useEntrance(-.5), secondPrint = useEntrance(.32);
  const frame = useCurrentFrame();
  const drift = Math.sin(showcaseClock.beats(frame) * Math.PI / 8) * 5;
  return <AbsoluteFill style={{ backgroundColor: T.ink, color: T.chalk, overflow: "hidden" }}>
    <Wordmark dark />
    <div style={{ position: "absolute", left: 88, top: 251, ...face, fontSize: 167, lineHeight: .94, letterSpacing: -9, transform: `translateY(${(1-title)*45}px)` }}>
      <div>Motion,</div><div style={{ color: T.accent }}>from code.</div>
    </div>
    <div style={{ position: "absolute", left: 95, top: 690, width: 780, fontFamily: FONT_FAMILY, fontSize: 47, lineHeight: 1.2, opacity: clamp01(subtitle), transform: `translateY(${(1-subtitle)*24}px)` }}>
      A tour of the React toolkit,<br />its components and its films.
    </div>
    <div style={{ position: "absolute", top: 163, left: 1088, width: 616, height: 347, border: `7px solid ${T.chalk}`, borderBottomWidth: 20, background: T.chalk,
      transform: `rotate(7deg) translateY(${(1-firstPrint)*85+drift}px)` }}>
      <Img src={promoPoster} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
    <div style={{ position: "absolute", top: 454, left: 1073, width: 683, height: 384, border: `7px solid ${T.chalk}`, borderBottomWidth: 20, background: T.chalk,
      transform: `rotate(-5deg) translateY(${(1-secondPrint)*105-drift}px)`, boxShadow: `0 7px 0 ${T.ink}` }}>
      <Img src={depthPoster} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
    <div style={{ position: "absolute", top: 940, left: 90, right: 90, borderTop: `2px solid ${T.chalk}55`, paddingTop: 25, display: "flex", justifyContent: "space-between", ...mono, fontSize: 25 }}>
      <span>Demotion / The source reel</span><span>React · Remotion · Canvas 2D</span>
    </div>
  </AbsoluteFill>;
}

function Closing() {
  const settle = useEntrance(-.4);
  const commands = [
    ["Create a video project", "npx --yes @demotion/cli@latest init my-video"],
    ["Write the Canvas demo", "npx --yes @demotion/cli@latest demo"],
    ["Get this film and its source", SHOWCASE_COMMAND],
  ];
  return <AbsoluteFill style={{ backgroundColor: T.chalk, color: T.ink }}>
    <Wordmark />
    <div style={{ position: "absolute", left: 86, top: 287, ...face, fontSize: 135, lineHeight: .94, letterSpacing: -8, transform: `translateY(${(1-settle)*38}px)` }}>
      <div>Your next</div><div style={{ color: T.field }}>frame.</div>
    </div>
    <div style={{ position: "absolute", left: 95, top: 591, fontFamily: FONT_FAMILY, fontSize: 38, lineHeight: 1.2 }}>
      Run the CLI with<br />Node.js 22.14+ and npm.
    </div>
    <div style={{ position: "absolute", top: 729, left: 95, display: "flex", gap: 12 }}>
      {contactPrints.map(({ label, src }) => <div key={label} style={{ width: 202 }}>
        <Img src={src} style={{ display: "block", width: 202, height: 114, border: `1px solid ${T.ink}55`, boxSizing: "border-box" }} />
        <div style={{ ...mono, marginTop: 9, fontSize: 19 }}>{label}</div>
      </div>)}
    </div>
    <div style={{ position: "absolute", left: 777, top: 248, width: 1052, boxSizing: "border-box", background: T.ink, padding: "31px 39px", color: T.chalk }}>
      {commands.map(([label, command], i) => <Command key={command} label={label} command={command} index={i} />)}
    </div>
    <div style={{ position: "absolute", top: 925, left: 92, right: 92, borderTop: `2px solid ${T.ink}55`, display: "flex", justifyContent: "space-between", paddingTop: 31, ...mono, fontSize: 29 }}>
      <span>github.com/SohailKhan0525/demotion</span><span>MIT License</span>
    </div>
  </AbsoluteFill>;
}

function Command({ label, command, index }: { label: string; command: string; index: number }) {
  const p = useEntrance(index * .34 - .2);
  return <div style={{ padding: "28px 0 32px", borderBottom: index < 2 ? `1px solid ${T.chalk}55` : undefined,
    opacity: clamp01(p), transform: `translateY(${(1-p)*16}px)` }}>
    <div style={{ fontFamily: FONT_FAMILY, color: T.chalk, fontSize: 29, marginBottom: 14 }}>{label}</div>
    <div style={{ ...mono, color: T.accent, whiteSpace: "nowrap", fontSize: 31 }}>{command}</div>
  </div>;
}

function Footage({ source, startFrame }: { source: ShowcaseSource; startFrame: number }) {
  if (source === "starter" || source === "Canvas" || source === "IllustrationStory") {
    return <OffthreadVideo src={staticFile(imageSources[source])} muted trimBefore={startFrame}
      style={{ width, height, display: "block", objectFit: "contain" }} />;
  }
  // The original composition receives its own frame number. Seeking backwards
  // in Studio and parallel rendering land on the same source frame.
  const scenes = {
    Launch: <LaunchDemo muted />, LaunchV2: <LaunchV2 muted />, PromoLaunch: <PromoLaunch muted />,
    DataStory: <DataStory />, PromoScene: <PromoScene />, Lab: <Lab />, UI: <UI />,
    ComponentGallery: <ComponentGallery />, UpdateFilm: <UpdateFilm muted />,
    IllustrationThree: <IllustrationThree />, Specimens: <Specimens />,
    opening: <Opening />, closing: <Closing />,
  };
  return <Sequence from={-startFrame} layout="none">{scenes[source]}</Sequence>;
}

type Chapter = typeof SHOWCASE_CHAPTERS[number];
function ChapterView({ chapter }: { chapter: Chapter }) {
  const frame = useCurrentFrame();
  let next = 0;
  const clips = chapter.cuts.map(cut => {
    const from = next;
    const length = showcaseClock.duration(cut.beats);
    next += length;
    return { ...cut, from, length };
  });
  const current = clips.find(clip => frame < clip.from + clip.length) ?? clips[clips.length - 1];
  if (current.source === "opening" || current.source === "closing") {
    return <MotionProject clock={showcaseClock} camera={{ beat: .001, bar: .0015, drift: .0002, shakeAmp: .12 }} look={{ grain: .025, vignette: .035 }} motionBlur={{ samples: 2 }}>
      <Shot beats={current.beats} bg={current.source === "opening" ? T.ink : T.chalk} hit={0}>
        {current.source === "opening" ? <Opening /> : <Closing />}
      </Shot>
    </MotionProject>;
  }
  const chapterIndex = SHOWCASE_CHAPTERS.findIndex(c => c.id === chapter.id);
  const inset = .865;
  return <AbsoluteFill style={{ background: T.ink, color: T.chalk }}>
    <div style={{ position: "absolute", top: 20, left: (width - width * inset) / 2, width, height, overflow: "hidden",
      boxSizing: "border-box", transformOrigin: "0 0", transform: `scale(${inset})` }}>
      {clips.map(clip => <Sequence key={clip.from} from={clip.from} durationInFrames={clip.length}>
        <Footage source={clip.source} startFrame={clip.startFrame} />
      </Sequence>)}
    </div>
    <div style={{ position: "absolute", left: 91, right: 91, bottom: 32, display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 32 }}>
      <div style={{ ...face, fontSize: 49, lineHeight: 1.04, letterSpacing: -1.9 }}>{chapter.title}</div>
      <div style={{ ...mono, fontSize: 23, color: T.accent }}>{current.credit}</div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 981, right: 90, height: 3, display: "flex", gap: 4 }}>
      {SHOWCASE_CHAPTERS.map((c, i) => <div key={c.id} style={{ flex: c.endBeat - c.startBeat, background: i === chapterIndex ? T.accent : T.chalk + "45" }} />)}
    </div>
  </AbsoluteFill>;
}

function PreparationNote() {
  return <AbsoluteFill style={{ background: T.ink, color: T.chalk, display: "flex", justifyContent: "center", paddingLeft: 128, fontFamily: FONT_FAMILY }}>
    <div style={{ ...face, fontSize: 90, marginBottom: 28 }}>Prepare the source reel</div>
    <div style={{ ...mono, fontSize: 52, color: T.accent }}>npm run studio:showcase</div>
  </AbsoluteFill>;
}

export function Showcase({ muted = false }: { muted?: boolean }) {
  if (getRemotionEnvironment().isStudio) {
    const files = new Set(getStaticFiles().map(file => file.name));
    if ([...Object.values(imageSources), score].some(file => !files.has(file))) return <PreparationNote />;
  }
  return <AbsoluteFill style={{ background: T.ink }}>
    {!muted && <Audio src={staticFile(score)} />}
    {SHOWCASE_CHAPTERS.map(chapter => <Sequence key={chapter.id} name={chapter.title} from={showcaseClock.frame(chapter.startBeat)} durationInFrames={showcaseClock.duration(chapter.endBeat - chapter.startBeat)}>
      <ChapterView chapter={chapter} />
    </Sequence>)}
  </AbsoluteFill>;
}
