import type { Soundtrack } from "./mix";

/** 16-bit PCM stereo WAV (what Remotion's <Audio> and ffmpeg expect). */
export const encodeWav = (s: Pick<Soundtrack, "left" | "right" | "sampleRate">): Uint8Array => {
  const n = s.left.length;
  const buf = new Uint8Array(44 + n * 4);
  const v = new DataView(buf.buffer);
  const str = (o: number, t: string) => { for (let i = 0; i < t.length; i++) v.setUint8(o + i, t.charCodeAt(i)); };
  str(0, "RIFF"); v.setUint32(4, 36 + n * 4, true); str(8, "WAVE"); str(12, "fmt ");
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true);
  v.setUint32(24, s.sampleRate, true); v.setUint32(28, s.sampleRate * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true);
  str(36, "data"); v.setUint32(40, n * 4, true);
  for (let i = 0; i < n; i++) {
    v.setInt16(44 + i * 4, Math.max(-1, Math.min(1, s.left[i])) * 32767, true);
    v.setInt16(46 + i * 4, Math.max(-1, Math.min(1, s.right[i])) * 32767, true);
  }
  return buf;
};
