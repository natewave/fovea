import { fromLinear, toLinear } from "./convert.ts";
import { formatHex, toRgb } from "./hex.ts";
import type { Hex, LinearRgb, Rgb } from "./types.ts";

/**
 * The full-severity simulations Fovea checks against:
 * - protanopia and deuteranopia: Machado, Oliveira & Fernandes 2009;
 * - tritanopia: Brettel, Viénot & Mollon 1997, because Machado et al. do not model it;
 * - tritanomaly: Machado's tritan matrix, which its authors describe as an approximation of
 *   tritanomaly.
 */
export type CvdKind = "protanopia" | "deuteranopia" | "tritanopia" | "tritanomaly";

export const CVD_KINDS: readonly CvdKind[] = [
  "protanopia",
  "deuteranopia",
  "tritanopia",
  "tritanomaly",
];

export type Matrix3 = readonly [
  readonly [number, number, number],
  readonly [number, number, number],
  readonly [number, number, number],
];

export type MachadoKind = "protan" | "deutan" | "tritan";

export const MACHADO_KINDS: readonly MachadoKind[] = ["protan", "deutan", "tritan"];

/**
 * Machado, Oliveira & Fernandes (2009), severity 1.0 matrices, as published on the authors'
 * project page. They operate on linear-light RGB.
 */
export const MACHADO_2009: Readonly<Record<MachadoKind, Matrix3>> = {
  protan: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deutan: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  tritan: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039],
  ],
};

/** Brettel's two half-plane projections, folded into linear-RGB matrices. */
export interface Brettel1997 {
  /** Used on the non-negative side of the separation plane. */
  readonly plane1: Matrix3;
  readonly plane2: Matrix3;
  readonly separationNormal: readonly [number, number, number];
}

/**
 * Brettel, Viénot & Mollon (1997) tritanopia, precomputed for linear sRGB by libDaltonLens
 * (public domain): Smith & Pokorny 1975 cone fundamentals, sRGB white as the neutral axis.
 */
export const BRETTEL_1997_TRITAN: Brettel1997 = {
  plane1: [
    [1.01277, 0.13548, -0.14826],
    [-0.01243, 0.86812, 0.14431],
    [0.07589, 0.805, 0.11911],
  ],
  plane2: [
    [0.93678, 0.18979, -0.12657],
    [0.06154, 0.81526, 0.1232],
    [-0.37562, 1.12767, 0.24796],
  ],
  separationNormal: [0.03901, -0.02788, -0.01113],
};

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

export const applyMatrix = (m: Matrix3, lin: LinearRgb): LinearRgb => ({
  r: m[0][0] * lin.r + m[0][1] * lin.g + m[0][2] * lin.b,
  g: m[1][0] * lin.r + m[1][1] * lin.g + m[1][2] * lin.b,
  b: m[2][0] * lin.r + m[2][1] * lin.g + m[2][2] * lin.b,
});

export const applyBrettel = (p: Brettel1997, lin: LinearRgb): LinearRgb => {
  const [nr, ng, nb] = p.separationNormal;
  const side = nr * lin.r + ng * lin.g + nb * lin.b;
  return applyMatrix(side >= 0 ? p.plane1 : p.plane2, lin);
};

const simulateLinear = (lin: LinearRgb, kind: CvdKind): LinearRgb => {
  switch (kind) {
    case "protanopia":
      return applyMatrix(MACHADO_2009.protan, lin);
    case "deuteranopia":
      return applyMatrix(MACHADO_2009.deutan, lin);
    case "tritanopia":
      return applyBrettel(BRETTEL_1997_TRITAN, lin);
    case "tritanomaly":
      return applyMatrix(MACHADO_2009.tritan, lin);
  }
};

/** Simulates a full-severity deficiency: linearise, project, clamp, re-encode. */
export const simulateCvd = (color: Hex | Rgb, kind: CvdKind): Rgb => {
  const out = simulateLinear(toLinear(toRgb(color)), kind);
  return fromLinear({ r: clamp01(out.r), g: clamp01(out.g), b: clamp01(out.b) });
};

export const simulateCvdHex = (color: Hex | Rgb, kind: CvdKind): Hex =>
  formatHex(simulateCvd(color, kind));

/** A 4×5 row-major matrix for SVG `<feColorMatrix type="matrix">`, which works in linearRGB. */
export const feColorMatrixValues = (m: Matrix3): string => {
  const rgbRows = m.map((row) => `${row.join(" ")} 0 0`).join(" ");
  return `${rgbRows} 0 0 0 1 0`;
};
