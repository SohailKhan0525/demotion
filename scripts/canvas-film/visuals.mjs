// The editor's renderer is passed in from the standalone HTML. All shots that
// show a title card, including the saved PNG, draw that exact composition.
export const CHAPTERS = [
  { id: "intro", startBeat: 0, endBeat: 8 },
  { id: "title", startBeat: 8, endBeat: 16 },
  { id: "tempo", startBeat: 16, endBeat: 24 },
  { id: "playback", startBeat: 24, endBeat: 36 },
  { id: "save", startBeat: 36, endBeat: 42 },
  { id: "close", startBeat: 42, endBeat: 48 },
];

const W = 1920, H = 1080;
const ink = "#0D0E12", paper = "#F2F0EA", blue = "#2B3CFF", lime = "#D4FF3A";
const sans = '"Archivo", sans-serif', mono = '"JetBrains Mono", monospace';
const clamp = t => Math.max(0, Math.min(1, t));
const ease = t => 1 - Math.pow(1 - clamp(t), 4);
const smooth = t => { const p = clamp(t); return p * p * (3 - 2 * p); };
const interpolate = (a, b, t) => a + (b - a) * t;
const editorBeat = b => Math.max(0, Math.min(12, (b - 21) * 96 / 120));

function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function text(ctx, value, x, y, size, color, weight = 500, family = sans) {
  ctx.font = weight + " " + size + "px " + family;
  ctx.fillStyle = color;
  ctx.fillText(value, x, y);
}

function rule(ctx, x, y, w, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha *= alpha;
  rect(ctx, x, y, w, 2, color);
  ctx.restore();
}

function mark(ctx, x, y, s, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = color;
  for (let i = 0; i < 3; i++) {
    const left = i * 13;
    ctx.beginPath();
    ctx.moveTo(left, 0);
    ctx.lineTo(left + 8, 0);
    ctx.lineTo(left + 21, -27);
    ctx.lineTo(left + 13, -27);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function masthead(ctx, dark = false) {
  const color = dark ? paper : ink;
  mark(ctx, 86, 100, 1.16, dark ? lime : blue);
  text(ctx, "demotion", 153, 102, 49, color, 760);
}

// A small amount of camera movement keeps the opening alive after the title
// settles. The folded ring comes from the editor itself: the first edit then
// carries that silhouette across the cut into the working canvas.
function detail(ctx, drawTitleCard, { x, y, scale, spin, beat = 10 }) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(spin);
  ctx.scale(scale, scale);
  ctx.translate(-708, -258);
  ctx.beginPath();
  ctx.rect(493, 72, 452, 373);
  ctx.clip();
  card(ctx, drawTitleCard, "Daybreak", beat, 96);
  ctx.restore();
}

function card(ctx, drawTitleCard, title, beat, bpm) {
  drawTitleCard(ctx, { title, beat, bpm, width: 960, height: 540, displayFont: sans, monoFont: mono });
}

function opening(ctx, b, drawTitleCard) {
  rect(ctx, 0, 0, W, H, ink);
  const lift = 1 - ease((b + 0.7) / 2);
  const pulse = Math.exp(-4 * (b % 1));
  detail(ctx, drawTitleCard, {
    x: 1450 + 9 * Math.sin(b * 0.42), y: 434,
    scale: 1.89 + 0.022 * pulse + 0.065 * ease(b / 5),
    spin: -0.29 + 0.21 * ease(b / 7), beat: 8.1 + b * 0.45,
  });
  masthead(ctx, true);
  text(ctx, "Type in", 76, 451 + 48 * lift, 222, paper, 850);
  text(ctx, "motion.", 66, 669 + 92 * lift, 232, lime, 850);
  rule(ctx, 88, 818, 1738, paper, 0.33);
  text(ctx, "The Canvas title editor", 86, 917, 57, paper, 550);
  text(ctx, "Twelve beats from draft to final frame.", 88, 971, 34, paper, 420);
  for (let i = 0; i < 12; i++) {
    const active = i === Math.floor(b * 1.5) % 12;
    rect(ctx, 1300 + i * 44, active ? 917 : 931, 33, active ? 32 : 6, active ? lime : "#74757A");
  }
}

const editorX = 705, editorY = 149, editorScale = 1.14;
const fieldY = 591;
function box(ctx, x, y, w, h, fill, stroke, lineWidth = 1.5) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;
  ctx.strokeRect(x, y, w, h);
}

function controlBox(ctx, x, y, w, h, fill, stroke, lineWidth = 1.5) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 5);
  ctx.fillStyle = fill; ctx.fill();
  ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke();
}

function currentTitle(b) {
  if (b < 10.5) return "On cue";
  return "Daybreak".slice(0, Math.min(8, 1 + Math.floor((b - 10.5) * 3.7)));
}

// Draw the same select at body size or as a complete, enlarged control.
function tempoSelect(ctx, b, hovered, openBelow) {
  const bpm = b < 19 ? 120 : 96;
  text(ctx, "Tempo", 0, -12, 21, paper, 700);
  controlBox(ctx, 0, 0, 170, 55, ink, hovered ? lime : "#77767D", hovered ? 3 : 1.5);
  text(ctx, bpm + " BPM", 13, 36, 23, paper, 550);
  ctx.fillStyle = paper;
  ctx.beginPath(); ctx.moveTo(142, 24); ctx.lineTo(155, 24);
  ctx.lineTo(149, 31); ctx.closePath(); ctx.fill();
  if (b > 17.3 && b < 19) {
    const y = openBelow ? 55 : -165;
    controlBox(ctx, 0, y, 170, 164, ink, "#77767D");
    [90, 96, 120, 150].forEach((value, i) => {
      const active = i === (b < 18.2 ? 2 : 1);
      if (active) rect(ctx, 1, y + i * 41 + 1, 168, 40, lime);
      text(ctx, value + " BPM", 14, y + i * 41 + 29, 22, active ? ink : paper, 550);
    });
  }
}

function controls(ctx, b) {
  const title = currentTitle(b), bpm = b < 19 ? 120 : 96;
  const pos = editorBeat(b);
  const focusTitle = b >= 9.65 && b < 14.3;
  const focusTempo = b >= 16.5 && b < 20.5;
  text(ctx, "Title", 0, fieldY - 12, 21, paper, 700);
  controlBox(ctx, 0, fieldY, 470, 55, ink, focusTitle ? lime : "#77767D", focusTitle ? 3 : 1.5);
  if (b >= 9.8 && b < 10.5) rect(ctx, 14, fieldY + 11, 89, 33, blue);
  text(ctx, title, 14, fieldY + 37, 27, paper);
  if (focusTitle && b >= 10.5) {
    rect(ctx, 17 + ctx.measureText(title).width, fieldY + 10, 2, 34, lime);
  }
  ctx.save(); ctx.translate(488, fieldY);
  tempoSelect(ctx, b, focusTempo, false);
  ctx.restore();
  controlBox(ctx, 675, fieldY, 114, 55, lime, lime);
  text(ctx, b < 21 ? "Play" : b < 36 ? "Pause" : "Replay", 690, fieldY + 36, 24, ink, 650);
  const saveHit = b >= 37 && b < 37.55;
  controlBox(ctx, 806, fieldY, 154, 55, saveHit ? lime : ink, saveHit ? lime : "#77767D");
  text(ctx, "Save frame", 819, fieldY + 36, 23, saveHit ? ink : paper, 600);
  rule(ctx, 0, fieldY + 68, 960, paper, 0.25);
  text(ctx, "Playhead", 0, fieldY + 92, 20, paper, 700);
  const elapsed = (pos * 60 / bpm).toFixed(1), total = (12 * 60 / bpm).toFixed(1);
  ctx.save(); ctx.textAlign = "right";
  text(ctx, elapsed + " / " + total + " s", 960, fieldY + 92, 18, paper, 500, mono);
  ctx.restore();
  rect(ctx, 0, fieldY + 110, 960, 3, "#A3A2A1");
  rect(ctx, 0, fieldY + 109, 960 * pos / 12, 5, lime);
  ctx.beginPath(); ctx.arc(7 + 946 * pos / 12, fieldY + 111, 8, 0, Math.PI * 2);
  ctx.fillStyle = lime; ctx.fill();


}

function pointer(ctx, x, y, press = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1 - 0.13 * press, 1 - 0.13 * press);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(4, 31); ctx.lineTo(12, 23);
  ctx.lineTo(19, 38); ctx.lineTo(26, 34); ctx.lineTo(18, 21); ctx.lineTo(31, 19);
  ctx.closePath(); ctx.lineJoin = "round"; ctx.lineWidth = 3; ctx.strokeStyle = paper;
  ctx.stroke(); ctx.fillStyle = ink; ctx.fill();
  ctx.restore();
}

const cursorPath = [
  [8, 935, 680], [9.6, 115, 617], [14.1, 115, 617],
  [16.9, 635, 617], [17.6, 616, 528], [18.85, 567, 487],
  [19.65, 585, 614], [20.95, 743, 615], [22.2, 743, 615], [23.8, 893, 671],
  [35, 942, 660], [36.95, 891, 616], [38, 891, 616],
];
function cursor(ctx, b) {
  const index = cursorPath.findIndex(k => k[0] > b);
  const [left, right] = index > 0 ? [cursorPath[index - 1], cursorPath[index]] : [cursorPath.at(-1), cursorPath.at(-1)];
  const t = right === left ? 1 : smooth((b - left[0]) / (right[0] - left[0]));
  const hit = Math.max(...[9.8, 17.3, 19, 21, 37].map(k => Math.max(0, 1 - Math.abs(b - k) * 4)));
  pointer(ctx, interpolate(left[1], right[1], t), interpolate(left[2], right[2], t), hit);
}

function editor(ctx, b, drawTitleCard) {
  rect(ctx, 0, 0, W, H, paper);
  masthead(ctx);
  const timing = b >= 16 && b < 36, saving = b >= 36;
  const words = saving ? ["Keep", "a frame."] : timing ? ["Set the", "tempo."] : ["Edit the", "title."];
  const caption = saving ? ["Save the current frame", "as a PNG."] : timing ?
    ["Change the beat clock.", "Then press Play."] : ["Type a new title.", "See it on the canvas."];
  const label = saving ? "PNG export" : timing ? "Playback" : "Live title";
  const enter = ease((b - (saving ? 36 : timing ? 16 : 8)) / 0.9);
  rect(ctx, 88, 245, 44, 5, blue);
  text(ctx, label, 149, 260, 32, blue, 650);
  text(ctx, words[0], 80, 434 + (1 - enter) * 20, 126, ink, 850);
  text(ctx, words[1], 77, 553 + (1 - enter) * 36, 126, ink, 850);
  text(ctx, caption[0], 88, 669, 35, ink, 460);
  text(ctx, caption[1], 88, 719, 35, ink, 460);

  // Match the last editor frame to the first full-screen playback frame. The
  // crop holds the same title and rosette, and follows the actual playhead.
  const expanding = smooth((b - 22.2) / 1.8);
  const returning = smooth((b - 34.6) / 1.4);
  const full = expanding * (1 - returning);
  const scale = interpolate(editorScale, 2, full);
  const baseX = interpolate(editorX, 0, full), baseY = interpolate(editorY, 0, full);
  // Expand the entire live preview into the playback shot. For the close-up
  // of the tempo selector, recompose the canvas and the field as two complete
  // elements instead of cropping an enlarged interface through its text.
  if (b >= 16 && b < 20.9) {
    const macro = smooth((b - 16) / .8) * (1 - smooth((b - 20.05) / .85));
    const previewScale = interpolate(editorScale, .69, macro);
    const previewX = interpolate(editorX, 949, macro), previewY = interpolate(editorY, 124, macro);
    ctx.save(); ctx.translate(previewX, previewY); ctx.scale(previewScale, previewScale);
    box(ctx, -1, -1, 962, 542, paper, ink);
    card(ctx, drawTitleCard, "Daybreak", 0, b < 19 ? 120 : 96);
    ctx.restore();
    const focusScale = interpolate(editorScale, 1.86, macro);
    ctx.save();
    ctx.translate(interpolate(editorX + 488 * editorScale, 1119, macro),
      interpolate(editorY + fieldY * editorScale, 590, macro));
    ctx.scale(focusScale, focusScale);
    controlBox(ctx, -18, -48, 206, b > 17.3 && b < 19 ? 282 : 120, ink, ink);
    tempoSelect(ctx, b, true, true);
    const aim = smooth((b - 17.35) / .85);
    const back = smooth((b - 18.85) / .5);
    const cursorY = interpolate(29, interpolate(153, 111, aim), (b > 17.35 ? 1 : 0) * (1 - back));
    pointer(ctx, 127, cursorY, Math.max(0, 1 - Math.abs(b - 19) * 5));
    ctx.restore();
    return;
  }
  ctx.save();
  ctx.translate(baseX, baseY); ctx.scale(scale, scale);
  if (full < 0.999) box(ctx, -1, -1, 962, 542, paper, ink);
  card(ctx, drawTitleCard, currentTitle(b), editorBeat(b), b < 19 ? 120 : 96);
  if (full < 0.999) {
    rect(ctx, -1, 540, 962, 183, ink);
    ctx.save();
    ctx.translate(18, 20);
    ctx.scale(0.9625, 0.9625);
    controls(ctx, b);
    cursor(ctx, b);
    ctx.restore();
  }
  ctx.restore();
}

function saved(ctx, b, drawTitleCard) {
  const t = ease((b - 37.5) / 1.05);
  rect(ctx, 0, 0, W, H, blue);
  masthead(ctx, true);
  ctx.save(); ctx.translate(90, 300 + (1 - t) * 55);
  text(ctx, "Frame", 0, 130, 142, paper, 840);
  text(ctx, "saved.", -2, 263, 142, lime, 840);
  text(ctx, "demotion-launch-frame.png", 0, 380, 35, paper, 520, mono);
  text(ctx, "960 × 540", 0, 438, 35, paper, 450);
  ctx.restore();

  // A print with an actual captured final card. Its dimensions and filename
  // match the download produced by the editor.
  ctx.save();
  ctx.translate(1330, 545 + (1 - t) * 86); ctx.rotate((-4.8 - (1 - t) * 3) * Math.PI / 180);
  const width = 900, height = width * 9 / 16;
  rect(ctx, -width / 2 + 20, -height / 2 + 26, width + 28, height + 76, ink);
  rect(ctx, -width / 2 - 14, -height / 2 - 14, width + 28, height + 76, paper);
  ctx.save(); ctx.translate(-width / 2, -height / 2); ctx.scale(width / 960, width / 960);
  card(ctx, drawTitleCard, "Daybreak", 12, 96);
  ctx.restore();
  text(ctx, "demotion-launch-frame.png", -width / 2 + 4, height / 2 + 38, 23, ink, 550, mono);
  ctx.restore();
}

function close(ctx, b, drawTitleCard) {
  rect(ctx, 0, 0, W, H, ink);
  masthead(ctx, true);
  const t = ease((b - 42) / 0.85);
  detail(ctx, drawTitleCard, { x: 1520, y: 431 + (1 - t) * 20, scale: 1.50, spin: 0.1 + (b - 42) * 0.023 });
  text(ctx, "Make it", 78, 439 + (1 - t) * 28, 181, paper, 850);
  text(ctx, "yours.", 72, 621 + (1 - t) * 28, 194, lime, 850);
  rule(ctx, 88, 735, 1740, paper, 0.36);
  text(ctx, "$", 88, 841, 54, lime, 580, mono);
  text(ctx, "npx @demotion/cli@latest demo", 145, 841, 54, paper, 580, mono);
  text(ctx, "GitHub  /  SohailKhan0525/demotion", 88, 955, 31, paper, 460, mono);
  ctx.save(); ctx.textAlign = "right";
  text(ctx, "MIT License", 1824, 955, 32, lime, 600);
  ctx.restore();
}

export function drawFilmFrame(ctx, frame, { drawTitleCard }) {
  const beat = Math.max(0, Math.min(719, frame)) / 15;
  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  if (beat < 8) opening(ctx, beat, drawTitleCard);
  else if (beat < 37.5) editor(ctx, beat, drawTitleCard);
  else if (beat < 42) saved(ctx, beat, drawTitleCard);
  else close(ctx, beat, drawTitleCard);
  ctx.restore();
}
