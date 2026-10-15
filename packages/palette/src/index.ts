import { resolveVariant } from "./solve.ts";
import type { Variant, VariantId, VariantSpec } from "./types.ts";
import { day } from "./variants/day.ts";
import { dusk } from "./variants/dusk.ts";
import { night } from "./variants/night.ts";

export * from "./budget.ts";
export * from "./families.ts";
export * from "./labels.ts";
export * from "./roles.ts";
export * from "./scopes.ts";
export * from "./solve.ts";
export * from "./types.ts";

export const specs: Readonly<Record<VariantId, VariantSpec>> = { day, dusk, night };

/** The resolved palette: every variant's colors as 8-bit hex, computed deterministically. */
export const palette: Readonly<Record<VariantId, Variant>> = {
  day: resolveVariant(day),
  dusk: resolveVariant(dusk),
  night: resolveVariant(night),
};

export const variants: readonly Variant[] = [palette.day, palette.dusk, palette.night];
