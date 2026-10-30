import fs from "node:fs";
import { execFileSync } from "node:child_process";

export const validatePromoMetadata = (metadata, { seconds, frames, fps }) => {
  const v = metadata.streams.find(s => s.codec_type === "video");
  const a = metadata.streams.find(s => s.codec_type === "audio");
  if (!v || v.codec_name !== "h264" || v.width !== 1920 || v.height !== 1080 || Number(v.nb_frames) !== frames || v.avg_frame_rate !== `${fps}/1` || v.pix_fmt !== "yuv420p" || v.color_range !== "tv" || v.color_space !== "bt709") throw new Error("Unexpected promo picture format");
  if (!a || a.codec_name !== "aac" || a.channels !== 2 || Number(a.sample_rate) !== 48000) throw new Error("Unexpected promo audio format");
  for (const stream of [v, a]) {
    if (!Number.isFinite(Number(stream.start_time)) || Math.abs(Number(stream.start_time)) > 1 / fps) throw new Error("Promo stream starts late");
    if (!Number.isFinite(Number(stream.duration)) || Math.abs(Number(stream.duration) - seconds) > 1 / fps) throw new Error("Promo stream duration mismatch");
  }
  if (!Number.isFinite(Number(metadata.format.duration)) || Math.abs(Number(metadata.format.duration) - seconds) > 1 / fps) throw new Error("Promo container duration mismatch");
};

// Scan only top-level box headers: no full-file allocation, supports extended sizes.
export const hasFaststart = file => {
  const fd = fs.openSync(file, "r"), size = fs.fstatSync(fd).size;
  const header = Buffer.alloc(16);
  let pos = 0, moov = -1, mdat = -1;
  try {
    while (pos + 8 <= size) {
      if (fs.readSync(fd, header, 0, 8, pos) !== 8) return false;
      let length = header.readUInt32BE(0);
      const type = header.toString("ascii", 4, 8);
      if (length === 1) {
        if (fs.readSync(fd, header, 8, 8, pos + 8) !== 8) return false;
        length = Number(header.readBigUInt64BE(8));
        if (!Number.isSafeInteger(length) || length < 16) return false;
      } else if (length === 0) length = size - pos;
      if (length < 8 || pos + length > size) return false;
      if (type === "moov") moov = pos;
      if (type === "mdat") mdat = pos;
      pos += length;
    }
    return pos === size && moov >= 0 && mdat >= 0 && moov < mdat;
  } finally { fs.closeSync(fd); }
};

export const checkPromoMedia = (file, expected) => {
  const metadata = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", file], { encoding: "utf8" }));
  validatePromoMetadata(metadata, expected);
  if (!hasFaststart(file)) throw new Error("Promo is missing faststart metadata");
  return metadata;
};
