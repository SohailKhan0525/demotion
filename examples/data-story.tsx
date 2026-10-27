import React from "react";
import {
  BarChart, CaptionTrack, CountUp, LowerThird, MotionProject,
  ProgressRing, Shot, createBeatClock, demotionTheme,
} from "@demotion/cli";

export const storyClock = createBeatClock({ bpm: 128, fps: 60 });
export const STORY_BEATS = 16;

export const DataStory = () => (
  <MotionProject clock={storyClock}>
    <Shot beats={8} bg={demotionTheme.ink}>
      <div style={{ position: "absolute", left: 120, top: 150 }}>
        <CountUp value={128} suffix=" BPM" label="Example tempo" over={2} />
        <div style={{ marginTop: 80 }}>
          <BarChart width={1050} at={0.5} max={8} suffix=" beats" data={[
            { label: "Opening", value: 4 },
            { label: "Story", value: 8 },
            { label: "Close", value: 6 },
          ]} />
        </div>
      </div>
      <div style={{ position: "absolute", right: 150, top: 310 }}>
        <ProgressRing value={0.75} at={0.5} label="Example progress" />
      </div>
    </Shot>
    <Shot beats={8} bg={demotionTheme.field} wipe={{ kind: "slats" }}>
      <LowerThird title="A story you can edit" subtitle="Example author · example project" at={0.25} beats={5} bottom={420} width={1050} />
      <CaptionTrack cues={[
        { at: 0.5, beats: 3, text: "Write the message. Choose the beat." },
        { at: 3.5, beats: 4, text: "Every frame is a function of time." },
      ]} />
    </Shot>
  </MotionProject>
);
