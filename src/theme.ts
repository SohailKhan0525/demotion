import { FONT_FAMILY } from "./font";

export type DemotionTheme = {
  colors: {
    bg: string;
    bgDark: string;
    text: string;
    textDark: string;
    accentFrom: string;
    accentVia: string;
    accentTo: string;
    glow: string;
  };
  font: {
    family: string;
    weightBold: number;
    weightRegular: number;
  };
  radius: number;
};

export const defaultTheme: DemotionTheme = {
  colors: {
    bg: "#f6f5fa",
    bgDark: "#08080c",
    text: "#100f1a",
    textDark: "#f5f5f7",
    accentFrom: "#8b7cf6",
    accentVia: "#b79bfa",
    accentTo: "#6f8cf9",
    glow: "#8a6cf7",
  },
  font: {
    family: FONT_FAMILY,
    weightBold: 800,
    weightRegular: 500,
  },
  radius: 20,
};
