import { createBeatClock } from "../core/clock";

export const showcaseClock = createBeatClock({ bpm: 120, fps: 60 });

// Offsets use the 60 fps master timebase, including OffthreadVideo trims.
// For example, frame 240 in the Canvas MP4 means four seconds of source.
export type ShowcaseSource =
  | "opening" | "starter" | "Launch" | "LaunchV2" | "DataStory" | "PromoLaunch"
  | "PromoScene" | "Lab" | "UI" | "ComponentGallery" | "Specimens"
  | "IllustrationStory" | "UpdateFilm" | "IllustrationThree" | "Canvas" | "closing";

type Cut = { source: ShowcaseSource; startFrame: number; beats: number; credit: string };
type Chapter = { id: string; title: string; cuts: readonly Cut[] };

const edit = [
  { id: "intro", title: "The source reel", cuts: [
    { source: "opening", startFrame: 0, beats: 8, credit: "" },
  ] },
  { id: "starter", title: "A project in two scenes", cuts: [
    { source: "starter", startFrame: 0, beats: 10, credit: "Starter  /  src/MyVideo.tsx" },
  ] },
  { id: "launch", title: "From code to a 4K render", cuts: [
    { source: "Launch", startFrame: 600, beats: 12, credit: "Launch  /  Stack3D" },
  ] },
  { id: "data", title: "Data on a beat clock", cuts: [
    { source: "LaunchV2", startFrame: 225, beats: 6, credit: "LaunchV2  /  count and compare" },
    { source: "DataStory", startFrame: 225, beats: 6, credit: "examples/data-story.tsx  /  captions" },
  ] },
  { id: "specimens-a", title: "Interfaces and reveals", cuts: [
    { source: "Specimens", startFrame: 0, beats: 16, credit: "Component studies" },
  ] },
  { id: "promo", title: "Behind the promo", cuts: [
    { source: "PromoLaunch", startFrame: 240, beats: 6, credit: "PromoLaunch  /  the workflow" },
    { source: "PromoScene", startFrame: 0, beats: 6, credit: "examples/promo-scene.tsx" },
  ] },
  { id: "lab", title: "Type in motion", cuts: [
    { source: "Lab", startFrame: 0, beats: 8, credit: "Lab  /  kinetic type and wipes" },
  ] },
  { id: "ui", title: "A terminal you can direct", cuts: [
    { source: "UI", startFrame: 0, beats: 8, credit: "UI  /  Terminal and CodePanel" },
  ] },
  { id: "gallery", title: "From interface to object", cuts: [
    { source: "ComponentGallery", startFrame: 0, beats: 24, credit: "Safari  /  kinetic type  /  RubiksCube" },
  ] },
  { id: "specimens-b", title: "Light, material and type", cuts: [
    { source: "Specimens", startFrame: 480, beats: 16, credit: "Component studies" },
  ] },
  { id: "illustration", title: "Draw a path, then follow it", cuts: [
    { source: "IllustrationStory", startFrame: 90, beats: 12, credit: "examples/illustration.tsx" },
  ] },
  { id: "depth", title: "Give a flat mark depth", cuts: [
    { source: "UpdateFilm", startFrame: 0, beats: 6, credit: "UpdateFilm  /  Draw it. Give it depth." },
    { source: "IllustrationThree", startFrame: 0, beats: 6, credit: "examples/illustration-three.tsx" },
  ] },
  { id: "specimens-c", title: "Shapes and motion studies", cuts: [
    { source: "Specimens", startFrame: 960, beats: 16, credit: "Component studies" },
  ] },
  { id: "audio", title: "Score the edit", cuts: [
    { source: "Launch", startFrame: 1080, beats: 4, credit: "Launch  /  beat-driven cues" },
    { source: "PromoLaunch", startFrame: 2160, beats: 8, credit: "PromoLaunch  /  procedural sound" },
  ] },
  { id: "canvas", title: "Edit, play, save", cuts: [
    { source: "Canvas", startFrame: 240, beats: 8, credit: "Canvas editor  /  edit the title" },
    { source: "Canvas", startFrame: 495, beats: 6, credit: "Canvas editor  /  change tempo" },
    { source: "Canvas", startFrame: 1065, beats: 6, credit: "Canvas editor  /  save the frame" },
  ] },
  { id: "close", title: "Run demotion", cuts: [
    { source: "closing", startFrame: 0, beats: 10, credit: "" },
  ] },
] as const satisfies readonly Chapter[];

let nextBeat = 0;
export const SHOWCASE_CHAPTERS = edit.map(chapter => {
  const startBeat = nextBeat;
  nextBeat += chapter.cuts.reduce((sum, cut) => sum + cut.beats, 0);
  return { ...chapter, startBeat, endBeat: nextBeat };
});
export const SHOWCASE_BEATS = nextBeat;
export const SHOWCASE_COMMAND = "npx --yes @demotion/cli@latest showcase";
