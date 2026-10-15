import { type Hex, parseHex } from "@fovea/colorlab";

/** A filled region in pixel coordinates, with a bounding box that limits where it is sampled. */
export interface Shape {
  readonly x0: number;
  readonly y0: number;
  readonly x1: number;
  readonly y1: number;
  readonly inside: (x: number, y: number) => boolean;
}

export interface Layer {
  readonly shape: Shape;
  readonly color: Hex;
}

export const rect = (x: number, y: number, w: number, h: number, radius = 0): Shape => {
  const r = Math.min(radius, w / 2, h / 2);
  const cx = x + w / 2;
  const cy = y + h / 2;
  return {
    x0: x,
    y0: y,
    x1: x + w,
    y1: y + h,
    inside: (px, py) => {
      const qx = Math.abs(px - cx) - (w / 2 - r);
      const qy = Math.abs(py - cy) - (h / 2 - r);
      return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) <= r;
    },
  };
};

export const circle = (cx: number, cy: number, r: number): Shape => ({
  x0: cx - r,
  y0: cy - r,
  x1: cx + r,
  y1: cy + r,
  inside: (px, py) => (px - cx) ** 2 + (py - cy) ** 2 <= r * r,
});

export const ring = (cx: number, cy: number, r: number, width: number): Shape => {
  const outer = r + width / 2;
  const inner = r - width / 2;
  return {
    x0: cx - outer,
    y0: cy - outer,
    x1: cx + outer,
    y1: cy + outer,
    inside: (px, py) => {
      const d2 = (px - cx) ** 2 + (py - cy) ** 2;
      return d2 <= outer * outer && d2 >= inner * inner;
    },
  };
};

const coverage = (shape: Shape, px: number, py: number, samples: number): number => {
  const hits = Array.from({ length: samples * samples }, (_, i) =>
    shape.inside(
      px + ((i % samples) + 0.5) / samples,
      py + (Math.floor(i / samples) + 0.5) / samples,
    ),
  ).filter(Boolean).length;
  return hits / (samples * samples);
};

/**
 * Paints layers in order with supersampled anti-aliasing and returns 8-bit RGBA. Blending happens
 * in gamma-encoded sRGB, as browsers do. The buffer is local, so the function stays pure.
 */
export const render = (
  width: number,
  height: number,
  layers: readonly Layer[],
  samples = 4,
): Uint8Array => {
  const rgba = new Float64Array(width * height * 4);
  for (const { shape, color } of layers) {
    const { r, g, b } = parseHex(color);
    const xs = Math.max(0, Math.floor(shape.x0));
    const xe = Math.min(width, Math.ceil(shape.x1));
    const ys = Math.max(0, Math.floor(shape.y0));
    const ye = Math.min(height, Math.ceil(shape.y1));
    for (let y = ys; y < ye; y++) {
      for (let x = xs; x < xe; x++) {
        const cov = coverage(shape, x, y, samples);
        if (cov === 0) continue;
        const i = (y * width + x) * 4;
        const under = rgba[i + 3] ?? 0;
        const alpha = cov + under * (1 - cov);
        const mix = (top: number, bottom: number): number =>
          (top * cov + bottom * under * (1 - cov)) / alpha;
        rgba[i] = mix(r, rgba[i] ?? 0);
        rgba[i + 1] = mix(g, rgba[i + 1] ?? 0);
        rgba[i + 2] = mix(b, rgba[i + 2] ?? 0);
        rgba[i + 3] = alpha;
      }
    }
  }
  return Uint8Array.from(rgba, (v) => Math.round(Math.min(1, Math.max(0, v)) * 255));
};
