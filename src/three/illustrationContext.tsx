import { createContext, useContext } from "react";
import { demotionTheme, type Theme } from "../engine/theme";

export type Illustration3DContextValue = {
  frame: number;
  at: (beat: number) => number;
  theme: Theme;
  reducedMotion: boolean;
};

export const Illustration3DContext = createContext<Illustration3DContextValue | null>(null);

export const useIllustration3D = () => {
  const context = useContext(Illustration3DContext);
  // Static extrusion can also be used directly in a consumer's R3F Canvas.
  return context ?? { frame: 0, at: (beat: number) => beat * 30, theme: demotionTheme, reducedMotion: true };
};
