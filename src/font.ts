import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

let loaded: Promise<unknown> | null = null;

/**
 * Loads Inter (UI/headlines) and JetBrains Mono (code/terminal) from woff2
 * files in your project's `public/fonts` folder (`demotion init` copies them
 * there). Local files mean renders are offline and deterministic -- no font
 * CDN is contacted while frames are being captured.
 */
export const ensureFontsLoaded = () => {
  if (!loaded) {
    loaded = Promise.all([
      loadFont({
        family: "Inter Variable",
        url: staticFile("fonts/InterVariable.woff2"),
        weight: "100 900",
        style: "normal",
      }),
      loadFont({
        family: "Playfair Display Variable",
        url: staticFile("fonts/PlayfairDisplayVariable.woff2"),
        weight: "400 900",
        style: "normal",
      }),
      loadFont({
        family: "JetBrains Mono Variable",
        url: staticFile("fonts/JetBrainsMonoVariable.woff2"),
        weight: "100 800",
        style: "normal",
      }),
    ]);
  }
  return loaded;
};

export const FONT_FAMILY = '"Inter Variable", "Inter", -apple-system, sans-serif';
export const MONO_FAMILY = '"JetBrains Mono Variable", ui-monospace, Menlo, monospace';

export const SERIF_FAMILY = '"Playfair Display Variable", Georgia, serif';
