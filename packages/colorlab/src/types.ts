/** A 6-digit lowercase sRGB hex string such as `#f9f5ec`. */
export type Hex = `#${string}`;

/** Gamma-encoded sRGB. Channels are nominally in [0, 1]; values outside mean out of gamut. */
export interface Rgb {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

/** Linear-light sRGB (before the sRGB transfer function). */
export interface LinearRgb {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

export interface Oklab {
  readonly l: number;
  readonly a: number;
  readonly b: number;
}

/** OKLCH with lightness in [0, 1], chroma ≥ 0 and hue in degrees [0, 360). */
export interface Oklch {
  readonly l: number;
  readonly c: number;
  readonly h: number;
}

export interface Xyz {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

/** CIE 1931 chromaticity. */
export interface Xy {
  readonly x: number;
  readonly y: number;
}

/** CIE 1960 UCS chromaticity. */
export interface Uv {
  readonly u: number;
  readonly v: number;
}

/** Anything the contrast and difference functions accept. */
export type ColorLike = Hex | Rgb;
