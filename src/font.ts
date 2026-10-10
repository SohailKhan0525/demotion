import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

let loaded: Promise<unknown> | null = null;

/**
 * Loads Demotion's typefaces from woff2 files in your project's `public/fonts`
 * folder (`demotion init` copies them there). Local files mean renders are
 * offline and deterministic.
 *
 *  - Archivo (variable: weight 100-900 AND width 62-125) - headlines, UI
 *  - Abril Fatface - one-word display serif moments
 *  - Barlow Semi Condensed - HUD labels, captions
 *  - JetBrains Mono - code and terminals
 */
export const ensureFontsLoaded = () => {
  if (!loaded) {
    loaded = Promise.all([
      loadFont({ family: "Archivo", url: staticFile("fonts/ArchivoVariable.woff2"), weight: "100 900", style: "normal" }),
      loadFont({ family: "Abril Fatface", url: staticFile("fonts/AbrilFatface.woff2"), weight: "400", style: "normal" }),
      ...[500, 600, 700].map((w) =>
        loadFont({ family: "Barlow Semi Condensed", url: staticFile(`fonts/BarlowSemiCondensed-${w}.woff2`), weight: String(w), style: "normal" })
      ),
      loadFont({ family: "JetBrains Mono Variable", url: staticFile("fonts/JetBrainsMonoVariable.woff2"), weight: "100 800", style: "normal" }),
    ]);
  }
  return loaded;
};

export const FONT_FAMILY = '"Archivo", system-ui, sans-serif';
export const SERIF_FAMILY = '"Abril Fatface", Georgia, serif';
export const LABEL_FAMILY = '"Barlow Semi Condensed", "Archivo", sans-serif';
export const MONO_FAMILY = '"JetBrains Mono Variable", ui-monospace, Menlo, monospace';

/** CSS `font-variation-settings` for Archivo: wdth 62 (condensed) .. 125 (extended), wght 100..900. */
export const archivo = (wdth: number, wght = 900) => `'wdth' ${wdth}, 'wght' ${wght}`;
