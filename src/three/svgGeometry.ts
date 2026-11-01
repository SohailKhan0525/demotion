import { Box2, ExtrudeGeometry, Vector2, type Shape } from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { finiteNumber } from "./illustrationMotion";

export type SvgExtrusionOptions = {
  /** Longest SVG axis before bevel, in world units. */
  size?: number;
  /** Depth in world units, independent of SVG viewBox coordinates. */
  depth?: number;
  /** Bevel size and thickness in world units; 0 disables it. */
  bevel?: number;
  bevelSegments?: number;
  curveSegments?: number;
  /** Smooth adjacent faces while retaining sharp corners. Set false for faceted artwork. */
  smooth?: boolean;
};

export type SvgShapeLayer = { shapes: Shape[]; color: string; opacity: number };
export type ExtrudedSvgLayer = { geometry: ExtrudeGeometry; color: string; opacity: number };

const MAX_SOURCE_LENGTH = 200000;
const MAX_ELEMENTS = 256;
const MAX_CURVES = 2048;
const MAX_SHAPES = 128;
const MAX_VERTICES = 300000;

export const validateSvgExtrusionOptions = (options: SvgExtrusionOptions = {}) => {
  const size = finiteNumber(options.size ?? 4, "ExtrudedSvg size", 0.001, 10000);
  const depth = finiteNumber(options.depth ?? 0.35, "ExtrudedSvg depth", 0.001, 10000);
  const bevel = finiteNumber(options.bevel ?? 0.035, "ExtrudedSvg bevel", 0, Math.min(size, depth) / 2);
  const bevelSegments = finiteNumber(options.bevelSegments ?? 3, "ExtrudedSvg bevelSegments", 1, 8);
  const curveSegments = finiteNumber(options.curveSegments ?? 12, "ExtrudedSvg curveSegments", 1, 32);
  if (!Number.isInteger(bevelSegments) || !Number.isInteger(curveSegments)) throw new Error("ExtrudedSvg segment counts must be integers.");
  return { size, depth, bevel, bevelSegments, curveSegments };
};

export const validateSvgSource = (svg: string) => {
  if (typeof svg !== "string" || !svg.trim()) throw new Error("ExtrudedSvg svg must be a non-empty inline SVG string.");
  if (svg.length > MAX_SOURCE_LENGTH) throw new Error(`ExtrudedSvg SVG exceeds ${MAX_SOURCE_LENGTH} characters; simplify the artwork.`);
  if (/<!DOCTYPE|<!ENTITY/i.test(svg)) throw new Error("ExtrudedSvg does not support XML entities or DOCTYPE declarations.");
  if (/url\s*\(/i.test(svg)) throw new Error("ExtrudedSvg does not support URL paints, filters, or external assets.");
  if (/var\s*\(|\bcurrentColor\b|\bcontext-(?:fill|stroke)\b/i.test(svg)) throw new Error("ExtrudedSvg requires explicit SVG paint colors; CSS variables and context paints are unsupported.");
};

/** SVGLoader ignores display and treats group opacity as inherited, not multiplied. */
export const svgAncestorPresentation = (node: Element): { hidden: boolean; opacity: number } => {
  let opacity = 1;
  for (let current: Element | null = node; current; current = current.parentElement) {
    const inline = (current as SVGElement).style;
    const display = inline?.getPropertyValue("display") || current.getAttribute("display");
    if (display?.trim().toLowerCase() === "none") return { hidden: true, opacity: 0 };
    const value = inline?.getPropertyValue("opacity") || current.getAttribute("opacity");
    if (value !== null && value !== undefined && value.trim() !== "") {
      const normalized = value.trim();
      const number = Number(normalized.endsWith("%") ? normalized.slice(0, -1) : normalized);
      if (!Number.isFinite(number)) throw new Error("ExtrudedSvg opacity must be an explicit finite number or percentage.");
      opacity *= Math.max(0, Math.min(1, normalized.endsWith("%") ? number / 100 : number));
    }
  }
  return { hidden: opacity === 0, opacity };
};

/** Browser-only parser. No fetches, image loading, or injected SVG DOM. */
export const parseSvgShapeLayers = (svg: string): SvgShapeLayer[] => {
  validateSvgSource(svg);
  if (typeof DOMParser === "undefined") throw new Error("ExtrudedSvg parses SVG in a browser; render it through Remotion or a browser R3F Canvas.");
  const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
  if (doc.querySelector("parsererror") || doc.documentElement.localName !== "svg") throw new Error("ExtrudedSvg requires well-formed SVG markup with an <svg> root.");
  if (doc.documentElement.namespaceURI !== "http://www.w3.org/2000/svg" || doc.documentElement.nodeName !== "svg") throw new Error('ExtrudedSvg requires an <svg xmlns="http://www.w3.org/2000/svg"> root.');
  const elements = Array.from(doc.querySelectorAll("*"));
  if (elements.length > MAX_ELEMENTS) throw new Error(`ExtrudedSvg supports at most ${MAX_ELEMENTS} SVG elements.`);
  const allowed = new Set(["svg", "g", "path", "rect", "circle", "ellipse", "polygon", "polyline", "line", "title", "desc"]);
  const allowedStyles = new Set(["fill", "fill-opacity", "fill-rule", "opacity", "stroke", "stroke-opacity", "stroke-width", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "visibility", "display"]);
  for (const element of elements) {
    if (element.namespaceURI !== "http://www.w3.org/2000/svg" || element.prefix) throw new Error("ExtrudedSvg elements must use the SVG namespace without namespace prefixes.");
    if (!allowed.has(element.localName)) throw new Error(`ExtrudedSvg does not support <${element.localName}>; convert the artwork to filled paths.`);
    for (const attribute of Array.from(element.attributes)) {
      if (/^on/i.test(attribute.name) || attribute.localName === "href") throw new Error("ExtrudedSvg does not support event handlers or linked assets.");
    }
    const inline = (element as SVGElement).style;
    if (inline) for (let i = 0; i < inline.length; i++) {
      const property = inline.item(i);
      if (!allowedStyles.has(property)) throw new Error(`ExtrudedSvg does not support inline CSS ${property}; use SVG geometry and transform attributes.`);
    }
  }
  const parsed = new SVGLoader().parse(svg);
  let curves = 0;
  let shapeCount = 0;
  const layers: SvgShapeLayer[] = [];
  for (const path of parsed.paths) {
    curves += path.subPaths.reduce((sum, subpath) => sum + subpath.curves.length, 0);
    if (curves > MAX_CURVES) throw new Error(`ExtrudedSvg supports at most ${MAX_CURVES} curves; simplify the artwork.`);
    const style = path.userData?.style;
    const presentation = svgAncestorPresentation(path.userData!.node);
    if (presentation.hidden || style?.fill === "none" || style?.visibility === "hidden" || style?.visibility === "collapse") continue;
    const opacity = presentation.opacity * Number(style?.fillOpacity ?? 1);
    if (!Number.isFinite(opacity) || opacity < 0 || opacity > 1) throw new Error("ExtrudedSvg fill opacity must be between 0 and 1.");
    if (opacity === 0) continue;
    const shapes = SVGLoader.createShapes(path);
    shapeCount += shapes.length;
    if (shapeCount > MAX_SHAPES) throw new Error(`ExtrudedSvg supports at most ${MAX_SHAPES} filled shapes.`);
    if (shapes.length) layers.push({ shapes, color: `#${path.color.getHexString()}`, opacity });
  }
  if (!layers.length) throw new Error("ExtrudedSvg needs at least one visible filled shape. Convert strokes and text to paths first.");
  return layers;
};

/** Shared construction path for browser SVGs and geometry-level tests. Caller owns disposal. */
export const extrudeSvgShapeLayers = (layers: SvgShapeLayer[], options: SvgExtrusionOptions = {}): ExtrudedSvgLayer[] => {
  const { size, depth, bevel, bevelSegments, curveSegments } = validateSvgExtrusionOptions(options);
  const bounds = new Box2();
  let points = 0;
  for (const layer of layers) for (const shape of layer.shapes) {
    const extracted = shape.extractPoints(curveSegments);
    const vertices = [...extracted.shape, ...extracted.holes.flat()];
    points += vertices.length;
    // Bound tessellation work before allocating the geometry's typed buffers.
    if (points * (bevel === 0 ? 12 : 12 + bevelSegments * 12) > MAX_VERTICES) throw new Error("ExtrudedSvg geometry budget exceeded; simplify paths or reduce segment counts.");
    for (const point of vertices) {
      finiteNumber(point.x, "ExtrudedSvg path coordinate", -10000000, 10000000);
      finiteNumber(point.y, "ExtrudedSvg path coordinate", -10000000, 10000000);
      bounds.expandByPoint(point);
    }
  }
  const span = bounds.getSize(new Vector2());
  const longest = Math.max(span.x, span.y);
  if (!Number.isFinite(longest) || span.x <= 0 || span.y <= 0) throw new Error("ExtrudedSvg filled geometry must have finite, non-zero width and height.");
  const scale = size / longest;
  const center = bounds.getCenter(new Vector2());
  const output: ExtrudedSvgLayer[] = [];
  let vertexCount = 0;
  try {
    for (const layer of layers) {
      const geometry = new ExtrudeGeometry(layer.shapes, {
        depth: depth / scale, steps: 1, curveSegments,
        bevelEnabled: bevel > 0, bevelSize: bevel / scale, bevelThickness: bevel / scale,
        bevelSegments,
      });
      output.push({ geometry, color: layer.color, opacity: layer.opacity });
      vertexCount += geometry.getAttribute("position").count;
      if (vertexCount > MAX_VERTICES) throw new Error("ExtrudedSvg geometry budget exceeded; simplify the artwork.");
      geometry.translate(-center.x, -center.y, -depth / scale / 2);
      // A rotation flips SVG's downwards Y without reflecting the mesh winding.
      geometry.rotateX(Math.PI);
      if (options.smooth !== false) {
        // The official utility hashes positions at 0.01-unit precision. Normalize
        // first so tiny and very large source coordinate systems shade identically.
        geometry.scale(100 / longest, 100 / longest, 100 / longest);
        toCreasedNormals(geometry, Math.PI / 6);
        geometry.scale(size / 100, size / 100, size / 100);
      } else geometry.scale(scale, scale, scale);
      const positions = geometry.getAttribute("position");
      for (let i = 0; i < positions.array.length; i++) {
        if (!Number.isFinite(positions.array[i])) throw new Error("ExtrudedSvg produced invalid geometry; simplify intersecting or degenerate paths.");
      }
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
    }
    return output;
  } catch (error) {
    output.forEach(({ geometry }) => geometry.dispose());
    throw error;
  }
};
