import { inflateSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { encodePng, zlibCompress } from "../src/png.ts";

/** Deterministic pseudo-random bytes from a linear congruential generator. */
const noise = (length: number, seed = 1): Uint8Array => {
  const out = new Uint8Array(length);
  let s = seed;
  for (let i = 0; i < length; i++) {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    out[i] = s >>> 24;
  }
  return out;
};

/** Every run length deflate can encode and a few past its limit, each in a byte of its own. */
const runs = (): Uint8Array =>
  Uint8Array.from(
    Array.from({ length: 300 }, (_, i) => i + 1).flatMap((n) =>
      Array.from({ length: n }, () => n % 256),
    ),
  );

/** Undoes PNG filters 0 (None), 1 (Sub) and 2 (Up). */
const unfilter = (data: Uint8Array, width: number, height: number): Uint8Array => {
  const stride = width * 4;
  const out = new Uint8Array(stride * height);
  for (let y = 0; y < height; y++) {
    const type = data[y * (stride + 1)];
    if (type !== 0 && type !== 1 && type !== 2) throw new Error(`Unexpected filter ${type}`);
    for (let i = 0; i < stride; i++) {
      const left = i >= 4 ? (out[y * stride + i - 4] ?? 0) : 0;
      const up = y > 0 ? (out[(y - 1) * stride + i] ?? 0) : 0;
      const predictor = [0, left, up][type] ?? 0;
      out[y * stride + i] = ((data[y * (stride + 1) + 1 + i] ?? 0) + predictor) & 0xff;
    }
  }
  return out;
};

/** The size and pixels of a PNG from `encodePng`, decompressed by Node's zlib. */
const decode = (png: Uint8Array): { width: number; height: number; rgba: Uint8Array } => {
  const view = new DataView(png.buffer, png.byteOffset, png.byteLength);
  const width = view.getUint32(16);
  const height = view.getUint32(20);
  const idat = png.subarray(41, 41 + view.getUint32(33));
  return { width, height, rgba: unfilter(new Uint8Array(inflateSync(idat)), width, height) };
};

/** A flat background with colored bars, like the generated previews. */
const bars = (width: number, height: number): Uint8Array => {
  const rgba = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const line = Math.floor(y / 24);
      const onBar = y % 24 >= 8 && y % 24 < 18 && x >= 40 && x < 40 + ((line * 97) % 700);
      rgba.set(
        onBar ? [180, 120 + (line % 5) * 20, 90, 255] : [36, 33, 30, 255],
        (y * width + x) * 4,
      );
    }
  return rgba;
};

describe("zlibCompress", () => {
  it.each([
    ["no bytes", new Uint8Array(0)],
    ["every byte value", Uint8Array.from({ length: 256 }, (_, i) => i)],
    ["every run length", runs()],
    ["a long run", new Uint8Array(100_000)],
    [
      "a repeated pixel",
      Uint8Array.from({ length: 80_000 }, (_, i) => [200, 150, 90, 255][i % 4] ?? 0),
    ],
    ["noise longer than a stored block", noise(70_000)],
  ])("inflates back to %s", (_, data) => {
    expect(new Uint8Array(inflateSync(zlibCompress(data)))).toEqual(data);
  });

  it("compresses runs of a byte and of a pixel to a fraction of their size", () => {
    expect(zlibCompress(new Uint8Array(100_000)).length).toBeLessThan(1_000);
    const pixels = Uint8Array.from({ length: 80_000 }, (_, i) => [200, 150, 90, 255][i % 4] ?? 0);
    expect(zlibCompress(pixels).length).toBeLessThan(1_000);
  });
});

describe("encodePng", () => {
  it.each([
    ["a single pixel", 1, 1, Uint8Array.of(12, 34, 56, 255)],
    ["noise at an odd size", 37, 23, noise(37 * 23 * 4, 7)],
    ["bars of flat color", 300, 200, bars(300, 200)],
  ])("decodes back to %s", (_, width, height, rgba) => {
    expect(decode(encodePng(width, height, rgba))).toEqual({ width, height, rgba });
  });

  it("stores a preview-sized image of flat color in a few percent of its raw size", () => {
    const raw = 1200 * 720 * 4;
    expect(encodePng(1200, 720, bars(1200, 720)).length).toBeLessThan(raw * 0.03);
  });

  it("rejects pixel data of the wrong size", () => {
    expect(() => encodePng(2, 2, new Uint8Array(12))).toThrow();
  });
});
