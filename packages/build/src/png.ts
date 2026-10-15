/**
 * A minimal PNG encoder for 8-bit RGBA images. It filters rows and compresses them with its own
 * deflate encoder, so the bytes depend only on the pixels, never on the zlib build.
 */

const crcOf = (n: number): number =>
  Array.from({ length: 8 }).reduce<number>((c) => (c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1), n);

const CRC_TABLE: readonly number[] = Array.from({ length: 256 }, (_, n) => crcOf(n) >>> 0);

export const crc32 = (bytes: Uint8Array): number =>
  (bytes.reduce((c, b) => (CRC_TABLE[(c ^ b) & 0xff] ?? 0) ^ (c >>> 8), 0xffffffff) ^
    0xffffffff) >>>
  0;

export const adler32 = (bytes: Uint8Array): number => {
  const MOD = 65521;
  const [a, b] = bytes.reduce<readonly [number, number]>(
    ([s1, s2], byte) => {
      const next = (s1 + byte) % MOD;
      return [next, (s2 + next) % MOD];
    },
    [1, 0],
  );
  return ((b << 16) | a) >>> 0;
};

const concat = (parts: readonly Uint8Array[]): Uint8Array => {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  parts.reduce((offset, p) => {
    out.set(p, offset);
    return offset + p.length;
  }, 0);
  return out;
};

const u32 = (n: number): Uint8Array =>
  Uint8Array.of((n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff);

interface BitWriter {
  /** Writes `value` from its least significant bit, as deflate packs data. */
  readonly bits: (value: number, count: number) => void;
  /** Writes a Huffman code from its most significant bit, as deflate packs codes. */
  readonly code: (value: number, length: number) => void;
  readonly bytes: () => Uint8Array;
}

const bitWriter = (): BitWriter => {
  const out: number[] = [];
  let pending = 0;
  let filled = 0;
  const bits = (value: number, count: number): void => {
    pending |= value << filled;
    filled += count;
    for (; filled >= 8; filled -= 8) {
      out.push(pending & 0xff);
      pending >>>= 8;
    }
  };
  const code = (value: number, length: number): void => {
    let reversed = 0;
    for (let i = 0; i < length; i++) reversed = (reversed << 1) | ((value >>> i) & 1);
    bits(reversed, length);
  };
  const bytes = (): Uint8Array => Uint8Array.from(filled > 0 ? [...out, pending & 0xff] : out);
  return { bits, code, bytes };
};

/** Deflate's length symbols 257–285: the shortest length each covers, and its extra bits. */
const LENGTH_BASE: readonly number[] = [
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131,
  163, 195, 227, 258,
];
const LENGTH_EXTRA: readonly number[] = [
  0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0,
];
const MIN_MATCH = 3;
const MAX_MATCH = 258;
const BYTES_PER_PIXEL = 4;

/** A literal byte, the end of the block (256) or a length symbol, in deflate's fixed code. */
const symbol = (w: BitWriter, s: number): void => {
  if (s < 144) w.code(0x30 + s, 8);
  else if (s < 256) w.code(0x190 + s - 144, 9);
  else if (s < 280) w.code(s - 256, 7);
  else w.code(0xc0 + s - 280, 8);
};

/** Distances 1 to 4 have the distance codes 0 to 3, with no extra bits. */
const match = (w: BitWriter, length: number, distance: number): void => {
  const i = LENGTH_BASE.findLastIndex((base) => base <= length);
  symbol(w, 257 + i);
  w.bits(length - (LENGTH_BASE[i] ?? 0), LENGTH_EXTRA[i] ?? 0);
  w.code(distance - 1, 5);
};

/** How many bytes from `at` repeat the bytes `distance` before them, up to deflate's limit. */
const runLength = (data: Uint8Array, at: number, distance: number): number => {
  if (at < distance) return 0;
  let n = 0;
  while (n < MAX_MATCH && at + n < data.length && data[at + n] === data[at + n - distance]) n++;
  return n;
};

/**
 * A zlib stream holding one deflate block with fixed Huffman codes. Matches reach back one byte
 * or one pixel, which is enough for filtered rows of flat color.
 */
export const zlibCompress = (data: Uint8Array): Uint8Array => {
  const w = bitWriter();
  w.bits(1, 1); // BFINAL: the only block
  w.bits(1, 2); // BTYPE: fixed Huffman codes
  for (let at = 0; at < data.length; ) {
    const byByte = runLength(data, at, 1);
    const byPixel = runLength(data, at, BYTES_PER_PIXEL);
    const [length, distance] = byPixel > byByte ? [byPixel, BYTES_PER_PIXEL] : [byByte, 1];
    if (length >= MIN_MATCH) {
      match(w, length, distance);
      at += length;
    } else {
      symbol(w, data[at] ?? 0);
      at += 1;
    }
  }
  symbol(w, 256);
  return concat([Uint8Array.of(0x78, 0x01), w.bytes(), u32(adler32(data))]);
};

type Filter = (row: Uint8Array, above: Uint8Array, i: number) => number;

/** PNG's filter types 0 (None), 1 (Sub) and 2 (Up). */
const FILTERS: readonly Filter[] = [
  (row, _above, i) => row[i] ?? 0,
  (row, _above, i) =>
    ((row[i] ?? 0) - (i >= BYTES_PER_PIXEL ? (row[i - BYTES_PER_PIXEL] ?? 0) : 0)) & 0xff,
  (row, above, i) => ((row[i] ?? 0) - (above[i] ?? 0)) & 0xff,
];

/** Bytes read as signed differences; the PNG specification's heuristic picks the smallest sum. */
const filterCost = (line: Uint8Array): number =>
  line.reduce((sum, b, i) => (i === 0 ? sum : sum + (b < 128 ? b : 256 - b)), 0);

/** Each row filtered by whichever filter scores lowest, prefixed with its filter type. */
const scanlines = (width: number, height: number, rgba: Uint8Array): Uint8Array => {
  const stride = width * BYTES_PER_PIXEL;
  const blank = new Uint8Array(stride);
  return concat(
    Array.from({ length: height }, (_, y) => {
      const row = rgba.subarray(y * stride, (y + 1) * stride);
      const above = y === 0 ? blank : rgba.subarray((y - 1) * stride, y * stride);
      const lines = FILTERS.map((filter, type) => {
        const line = new Uint8Array(stride + 1);
        line[0] = type;
        for (let i = 0; i < stride; i++) line[i + 1] = filter(row, above, i);
        return { line, cost: filterCost(line) };
      });
      return lines.reduce((best, next) => (next.cost < best.cost ? next : best)).line;
    }),
  );
};

const chunk = (type: string, data: Uint8Array): Uint8Array => {
  const typed = concat([new TextEncoder().encode(type), data]);
  return concat([u32(data.length), typed, u32(crc32(typed))]);
};

const SIGNATURE = Uint8Array.of(137, 80, 78, 71, 13, 10, 26, 10);

/** Encodes `rgba` (row-major, 4 bytes per pixel) as a PNG file. */
export const encodePng = (width: number, height: number, rgba: Uint8Array): Uint8Array => {
  if (rgba.length !== width * height * BYTES_PER_PIXEL)
    throw new Error("Pixel data doesn't match the size");
  const header = concat([u32(width), u32(height), Uint8Array.of(8, 6, 0, 0, 0)]);
  return concat([
    SIGNATURE,
    chunk("IHDR", header),
    chunk("IDAT", zlibCompress(scanlines(width, height, rgba))),
    chunk("IEND", new Uint8Array(0)),
  ]);
};
