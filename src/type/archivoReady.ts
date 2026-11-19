import { useLayoutEffect, useReducer } from "react";
import { cancelRender, continueRender, delayRender } from "remotion";

// A composition may import both Demotion source and its built package. Share
// pending font registration across those copies, and isolate it to this document.
const key = Symbol.for("@demotion/cli/pending-archivo");
type FontDocument = Document & { [key]?: Promise<void> };

export function trackArchivoRegistration(registration: Promise<void>) {
  if (typeof document === "undefined") return registration;
  const doc: FontDocument = document;
  doc[key] = registration;
  const clear = () => { if (doc[key] === registration) delete doc[key]; };
  registration.then(clear, clear);
  return registration;
}

export function useArchivoMeasurementFamily(fallbackStack: string) {
  const pending = typeof document === "undefined" ? undefined : (document as FontDocument)[key];
  const [, redraw] = useReducer(n => n + 1, 0);
  useLayoutEffect(() => {
    if (!pending) return;
    let mounted = true;
    const handle = delayRender("Fit text after Archivo has been registered");
    pending.then(() => { if (mounted) redraw(); }, cancelRender);
    // Cleanup after React commits the measured text, or if the shot unmounts.
    return () => { mounted = false; continueRender(handle); };
  }, [pending]);
  if (pending) return null;
  // A caller can render with system fonts first and opt into Archivo later.
  // Distinct family strings keep those measurements in different cache entries.
  const registered = typeof document !== "undefined" && document.fonts &&
    Array.from(document.fonts).some(face => face.status === "loaded" && face.family.replace(/["']/g, "") === "Archivo");
  return registered ? "Archivo" : fallbackStack;
}
