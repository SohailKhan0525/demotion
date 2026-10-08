import { FONT_FAMILY, MONO_FAMILY } from "../font";

export const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

export type WindowOpts = { title: string; theme?: "dark" | "light" };

/** Rounded window with a title bar. Returns the content rectangle. */
export const drawWindow = (ctx: CanvasRenderingContext2D, w: number, h: number, o: WindowOpts) => {
  const dark = (o.theme ?? "dark") === "dark";
  const pad = 6;
  roundRect(ctx, pad, pad, w - pad * 2, h - pad * 2, 44);
  ctx.fillStyle = dark ? "#100d19" : "#fbfafe";
  ctx.fill();
  ctx.lineWidth = 3;
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, dark ? "rgba(255,255,255,0.34)" : "rgba(255,255,255,0.9)");
  g.addColorStop(1, dark ? "rgba(168,85,247,0.55)" : "rgba(168,85,247,0.35)");
  ctx.strokeStyle = g;
  ctx.stroke();

  const barH = 92;
  ctx.save();
  roundRect(ctx, pad, pad, w - pad * 2, h - pad * 2, 44);
  ctx.clip();
  ctx.fillStyle = dark ? "#171325" : "#f1eef8";
  ctx.fillRect(pad, pad, w - pad * 2, barH);
  ctx.fillStyle = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  ctx.fillRect(pad, pad + barH, w - pad * 2, 2);
  ctx.restore();

  ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
    ctx.beginPath();
    ctx.arc(70 + i * 44, pad + barH / 2, 14, 0, Math.PI * 2);
    ctx.fillStyle = c;
    ctx.fill();
  });
  ctx.font = `600 32px ${FONT_FAMILY}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = dark ? "rgba(255,255,255,0.62)" : "rgba(20,16,32,0.6)";
  ctx.fillText(o.title, w / 2, pad + barH / 2 + 1);
  ctx.textAlign = "left";
  return { x: pad + 56, y: pad + barH + 44, w: w - pad * 2 - 112, h: h - pad * 2 - barH - 70 };
};

export type TermLine = {
  /** frame at which this line starts appearing */
  at: number;
  text: string;
  /** frames to type it (omit for instant output lines) */
  type?: number;
  color?: string;
  /** shows the "$" prompt before the text */
  prompt?: boolean;
};

const caretOn = (frame: number) => Math.floor(frame / 8) % 2 === 0;

/** Animated terminal: commands type out, output lines pop in. */
export const drawTerminal = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number,
  o: { title: string; lines: TermLine[]; fontSize?: number }
) => {
  const r = drawWindow(ctx, w, h, { title: o.title, theme: "dark" });
  const fs = o.fontSize ?? 38;
  const lh = fs * 1.62;
  ctx.font = `500 ${fs}px ${MONO_FAMILY}`;
  ctx.textBaseline = "top";
  let y = r.y;
  let lastTyping: { x: number; y: number } | null = null;
  for (const ln of o.lines) {
    if (frame < ln.at) break;
    let x = r.x;
    if (ln.prompt) {
      ctx.fillStyle = "#f472b6";
      ctx.fillText("$", x, y);
      x += fs * 1.25;
    }
    let shown = ln.text;
    let typing = false;
    if (ln.type) {
      const p = Math.min(1, (frame - ln.at) / ln.type);
      shown = ln.text.slice(0, Math.floor(p * ln.text.length + 1e-4));
      typing = p < 1;
    }
    ctx.fillStyle = ln.color ?? "#ece8f8";
    ctx.fillText(shown, x, y);
    if (typing || (ln.prompt && ln === o.lines[o.lines.length - 1])) {
      lastTyping = { x: x + ctx.measureText(shown).width, y };
    }
    y += lh;
  }
  if (lastTyping && caretOn(frame)) {
    ctx.fillStyle = "#f0abfc";
    ctx.fillRect(lastTyping.x + 4, lastTyping.y + 3, fs * 0.55, fs * 1.1);
  }
  return r;
};

export type CodeTok = [string, string?];
export type CodeLineSpec = { at: number; toks: CodeTok[] };

export const TOK = {
  kw: "#c792ea",
  fn: "#82aaff",
  str: "#c3e88d",
  tag: "#ff7eb6",
  attr: "#ffcb6b",
  num: "#f78c6c",
  pun: "#9b95b5",
  txt: "#e9e5f7",
  cmt: "#6b6488",
};

/** Syntax-coloured editor; lines slide/fade in at their `at` frame. */
export const drawCode = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number,
  o: { title: string; lines: CodeLineSpec[]; fontSize?: number; highlightLine?: number }
) => {
  const r = drawWindow(ctx, w, h, { title: o.title, theme: "dark" });
  const fs = o.fontSize ?? 36;
  const lh = fs * 1.6;
  ctx.font = `500 ${fs}px ${MONO_FAMILY}`;
  ctx.textBaseline = "top";
  o.lines.forEach((ln, i) => {
    const p = Math.min(1, Math.max(0, (frame - ln.at) / 9));
    if (p <= 0) return;
    const y = r.y + i * lh + (1 - p) * 10;
    if (o.highlightLine === i) {
      ctx.fillStyle = "rgba(168,85,247,0.16)";
      ctx.fillRect(r.x - 22, y - 4, r.w + 44, lh);
    }
    ctx.globalAlpha = p;
    ctx.fillStyle = TOK.cmt;
    ctx.fillText(String(i + 1).padStart(2, " "), r.x - 6, y);
    let x = r.x + fs * 2.2;
    for (const [text, color] of ln.toks) {
      ctx.fillStyle = color ?? TOK.txt;
      ctx.fillText(text, x, y);
      x += ctx.measureText(text).width;
    }
    ctx.globalAlpha = 1;
  });
  return r;
};
