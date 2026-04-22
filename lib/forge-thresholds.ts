/** Level curves from the Netlify LifeForge build (per-step XP, length 100). */
export const FORGE_CATEGORY_LEVEL_THRESHOLDS: number[] = Array.from(
  { length: 100 },
  (_, t) => Math.floor(25 * (t + 1) ** 1.5)
)

export const FORGE_CHARACTER_LEVEL_THRESHOLDS: number[] = Array.from(
  { length: 100 },
  (_, t) => Math.floor(100 * (t + 1) ** 1.6)
)
