import type { Category } from './types'
import { createInitialCategories } from './life-categories'

const KEY = 'lifeforge-persisted-v1'

export interface PersistedGame {
  categories: Category[]
  currentStreak: number
  /** YYYY-MM-DD in local time — last day user completed a task */
  lastActiveDate: string | null
  /** Lifetime checkbox completes (increments on first complete) */
  totalTasksCompleted: number
  /** Achievement ids that are unlocked and saved */
  unlockedAchievementIds: string[]
}

function empty(): PersistedGame {
  return {
    categories: createInitialCategories(),
    currentStreak: 0,
    lastActiveDate: null,
    totalTasksCompleted: 0,
    unlockedAchievementIds: [],
  }
}

function migrate(raw: unknown): PersistedGame {
  const base = empty()
  if (!raw || typeof raw !== 'object') return base
  const o = raw as Record<string, unknown>
  if (Array.isArray(o.categories) && o.categories.length > 0) {
    return {
      categories: o.categories as Category[],
      currentStreak: typeof o.currentStreak === 'number' ? o.currentStreak : base.currentStreak,
      lastActiveDate: typeof o.lastActiveDate === 'string' || o.lastActiveDate === null
        ? (o.lastActiveDate as string | null)
        : base.lastActiveDate,
      totalTasksCompleted:
        typeof o.totalTasksCompleted === 'number' ? o.totalTasksCompleted : base.totalTasksCompleted,
      unlockedAchievementIds: Array.isArray(o.unlockedAchievementIds)
        ? (o.unlockedAchievementIds as string[])
        : base.unlockedAchievementIds,
    }
  }
  return base
}

export function loadGame(): PersistedGame {
  if (typeof window === 'undefined') return empty()
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty()
    return migrate(JSON.parse(raw))
  } catch {
    return empty()
  }
}

export function saveGame(state: PersistedGame): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}
