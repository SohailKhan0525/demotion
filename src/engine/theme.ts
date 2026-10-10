/** Palette discipline: five colors, no pure black or white. Everything in a project draws from this. */
export type Theme = {
  ink: string; // near-black, slightly cool
  chalk: string; // warm off-white
  field: string; // the big saturated background color
  accent: string; // the hot highlight (use sparingly)
  spark: string; // second accent, for tiny details
};

export const demotionTheme: Theme = {
  ink: "#0D0E12",
  chalk: "#F2F0EA",
  field: "#2B3CFF",
  accent: "#D4FF3A",
  spark: "#FF4B1F",
};
