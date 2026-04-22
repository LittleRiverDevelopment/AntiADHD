import { ACHIEVEMENTS_DATA } from './achievements'
import type { Achievement, AchievementRequirement } from './types'
import { getCategoryLevel, getCharacterLevel, getTotalXp } from './xpCalculations'
import type { PersistedGame } from './persisted-game'

function isReqMet(
  r: AchievementRequirement,
  game: Pick<PersistedGame, 'categories' | 'currentStreak' | 'totalTasksCompleted'>
): boolean {
  const categories = game.categories
  const totalXp = getTotalXp(categories)
  const charLevel = getCharacterLevel(totalXp)
  const catLevel = (id: string) =>
    getCategoryLevel(categories.find((c) => c.id === id)?.xp ?? 0)

  switch (r.type) {
    case 'category_level':
      return catLevel(r.categoryId) >= r.value
    case 'streak':
      return game.currentStreak >= r.value
    case 'tasks_completed':
      return game.totalTasksCompleted >= r.value
    case 'level':
      return charLevel >= r.value
    case 'total_xp':
      return totalXp >= r.value
    default:
      return false
  }
}

/** Merge static definitions with unlock state from the game. */
export function buildAchievementList(
  game: Pick<PersistedGame, 'categories' | 'currentStreak' | 'totalTasksCompleted' | 'unlockedAchievementIds'>
): Achievement[] {
  const set = new Set(game.unlockedAchievementIds)
  return ACHIEVEMENTS_DATA.map((def) => {
    const met = isReqMet(def.requirement, game)
    const was = set.has(def.id)
    const unlocked = was || met
    return {
      id: def.id,
      name: def.name,
      description: def.description,
      icon: def.icon,
      categoryId: def.categoryId,
      requirement: def.requirement,
      rarity: def.rarity,
      unlocked,
      unlockedAt: null,
    } satisfies Achievement
  })
}

/**
 * Merges newly met achievements with a previously stored id list
 * (once unlocked, stays unlocked; pass previouslyUnlocked as [] to reset).
 */
export function recomputeUnlockedIds(
  state: Pick<PersistedGame, 'categories' | 'currentStreak' | 'totalTasksCompleted'>,
  previouslyUnlockedIds: string[]
): string[] {
  const have = new Set(previouslyUnlockedIds)
  for (const d of ACHIEVEMENTS_DATA) {
    if (isReqMet(d.requirement, state) || have.has(d.id)) {
      have.add(d.id)
    }
  }
  return Array.from(have)
}

export function findNewlyUnlocked(before: string[], after: string[]): string[] {
  const s = new Set(before)
  return after.filter((id) => !s.has(id))
}
