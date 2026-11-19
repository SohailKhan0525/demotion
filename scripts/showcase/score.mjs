import { readFileSync, writeFileSync } from "node:fs";
import { renderSoundtrack, encodeWav } from "../../dist/audio.js";
import { beats, chapters, clock } from "./timeline.mjs";

export function writeScore(file) {
  const start = id => chapters.find(c => c.id === id).startBeat;
  const a = start("audio"), c = start("canvas"), end = start("close");
  const cueExample = JSON.parse(readFileSync(new URL("../../examples/cues.json", import.meta.url), "utf8"));
  const music = {
    pad: false, level: 0.8,
    chords: [
      { bass: 38, notes: [50, 57, 60, 64] }, { bass: 41, notes: [53, 57, 60, 67] },
      { bass: 36, notes: [52, 55, 62, 67] }, { bass: 43, notes: [50, 55, 59, 64] },
    ],
    arp: [[1, 8], [12, 29], [34, 55], [60, 75], [84, 109], [114, 125], [132, 148], [153, a - 1], [a + 2, c - 1], [c + 6, end], [end + 1, beats - 4]],
    bass: [[4, 28], [32, 52], [58, 77], [85, 108], [112, 123], [128, 150], [154, a - 1], [a + 4, c - 1], [c + 4, end], [end + 1, beats - 4]],
    kick: [[4, 29], [34, 53], [59, 77], [85, 109], [114, 124], [130, 147], [152, a - 1], [a + 5, c - 1], [c + 4, end - 1]],
    clap: [[18, 28], [42, 54], [62, 75], [87, 108], [115, 124], [138, 148], [153, a - 1], [a + 6, c - 1], [c + 12, end]],
    hat: [[20, 27], [46, 53], [70, 76], [93, 108], [118, 124], [140, 148], [159, a - 1], [a + 7, c - 1], [c + 14, end]],
  };
  const cues = [
    ...chapters.filter(chapter => chapter.id !== "audio").map(({startBeat}, i) => ({ at: startBeat, kind: i % 3 === 0 ? "hit" : "pop", gain: i === 0 ? .58 : .32 })),
    { at: .35, kind: "chime", gain: .48 }, { at: start("launch") + 1, kind: "typing", dur: 2, steps: 10, gain: .42 },
    { at: start("data") + 1, kind: "countRun", dur: 2, steps: 5, gain: .26 },
    { at: start("ui") + .5, kind: "typing", dur: 3, steps: 14, gain: .44 },
    { at: start("illustration") + 4, kind: "swoosh", dur: 2, gain: .34 },
    { at: start("depth"), kind: "shimmer", dur: 3, gain: .37 },
    // Play the example’s complete eight-beat hit/whoosh/hit/chime pattern over the chapter bed.
    ...cueExample.cues.map(cue => ({ ...cue, at: a + cue.at, gain: (cue.gain ?? 1) * .74 })),
    { at: c + 1.8, kind: "click", gain: .48 }, { at: c + 2.5, kind: "typing", dur: 2.16, steps: 8, gain: .46 },
    { at: c + 10.5, kind: "click", gain: .53 }, { at: c + 15.5, kind: "click", gain: .6 },
    { at: end, kind: "chime", gain: .63 }, { at: beats - 4, kind: "shimmer", dur: 2.4, gain: .42 },
  ];
  const track = renderSoundtrack({ bpm: clock.bpm, beats, seed: 431, music, cues, tail: 0, fadeOut: 1.8, targetLUFS: -15.5 });
  writeFileSync(file, encodeWav(track));
}
