import { clamp01, outExpo } from "../core/math";

export const finite = (value: number, label: string) => {
  if (!Number.isFinite(value)) throw new Error(`${label} must be finite`);
  return value;
};

/** Values stay within the supplied endpoints even when their container overshoots. */
export const easedValue = (frame: number, start: number, end: number, from: number, to: number) => {
  const p = end <= start ? Number(frame >= start) : outExpo(clamp01((frame - start) / (end - start)));
  return from + (to - from) * p;
};

export const formatMetric = (value: number, decimals = 0, locale = "en-US") => {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 10) throw new Error("decimals must be an integer from 0 to 10");
  // Avoid displaying negative zero while an animation crosses zero.
  const rounded = Number(value.toFixed(decimals));
  return new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(Object.is(rounded, -0) ? 0 : rounded);
};

export const chartDomain = (values: readonly number[], max?: number): [number, number] => {
  values.forEach(value => finite(value, "BarChart value"));
  if (max !== undefined && (finite(max, "BarChart max") <= 0 || values.some(v => Math.abs(v) > max))) {
    throw new Error("BarChart max must be positive and cover every absolute value");
  }
  const low = Math.min(0, ...values);
  const high = Math.max(0, ...values);
  if (max !== undefined) return [low < 0 ? -max : 0, high > 0 || low === 0 ? max : 0];
  return low === high ? [0, 1] : [low, high];
};
