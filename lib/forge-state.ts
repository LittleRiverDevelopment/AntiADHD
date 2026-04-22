import { ACHIEVEMENTS_DATA } from './achievements'
import { createInitialCategories } from './forge-meta'
import type { Achievement, ForgeCategory, ForgeGameState, ForgeTask, ForgeUserStats } from './types'
import { XP_REWARDS } from './types'
import {
  getCategoryLevel,
  getCharacterLevel,
  getTotalXp,
} from './xpCalculations'

const KEY = 'lifeforge_game_state'
const LEGACY = 'lifeforge-persisted-v1'

export const forgeStorage = { key: KEY }

function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

function isYday(iso: string): boolean {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return iso === d.toISOString().split('T')[0]
}

function streakMult(s: number): number {
  if (s >= 30) return 3
  if (s >= 14) return 2.5
  if (s >= 7) return 2
  if (s >= 3) return 1.5
  return 1
}

function syncUserStats(
  c: ForgeCategory[],
  u: ForgeUserStats
): ForgeUserStats {
  const total = getTotalXp(c)
  return {
    ...u,
    totalXp: total,
    characterLevel: getCharacterLevel(total),
  }
}

function mergeAchievements(
  s: ForgeGameState
): { state: ForgeGameState; newUnlocks: Achievement[] } {
  const prev = new Set(s.achievements.filter((a) => a.unlocked).map((a) => a.id))
  const newUnlocks: Achievement[] = []
  const out = s.achievements.map((a) => {
    if (a.unlocked) return a
    let r = false
    const { requirement: req } = a
    const { userStats, categories } = s
    if (req.type === 'level') {
      r = userStats.characterLevel >= req.value
    } else if (req.type === 'tasks_completed') {
      r = userStats.totalTasksCompleted >= req.value
    } else if (req.type === 'streak') {
      r = userStats.currentStreak >= req.value
    } else if (req.type === 'total_xp') {
      r = userStats.totalXp >= req.value
    } else if (req.type === 'category_level' && req.categoryId) {
      const cat = categories.find((c) => c.id === req.categoryId)
      r = !!cat && cat.level >= req.value
    }
    if (r) {
      const n = { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
      if (!prev.has(n.id)) newUnlocks.push(n)
      return n
    }
    return a
  })
  return { state: { ...s, achievements: out }, newUnlocks }
}

export function createDefaultGameState(): ForgeGameState {
  const t = todayStr()
  return {
    categories: createInitialCategories(),
    achievements: ACHIEVEMENTS_DATA.map((a) => ({
      ...a,
      unlocked: false,
      unlockedAt: null,
    })),
    userStats: {
      totalXp: 0,
      characterLevel: 1,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: t,
      totalTasksCompleted: 0,
      joinedDate: t,
    },
    unlockedThemes: ['default'],
    activeTheme: 'default',
  }
}

function applyDayRollover(s: ForgeGameState): ForgeGameState {
  const t = todayStr()
  if (s.userStats.lastActiveDate === t) return s
  let { currentStreak, longestStreak } = s.userStats
  if (isYday(s.userStats.lastActiveDate)) {
    currentStreak += 1
  } else {
    currentStreak = 1
  }
  if (currentStreak > longestStreak) longestStreak = currentStreak
  const nextCats = s.categories.map((c) => ({
    ...c,
    tasks: c.tasks.map((q) => ({
      ...q,
      ...(q.isDaily
        ? { completed: false, completedAt: undefined }
        : {}),
    })),
  }))
  return {
    ...s,
    categories: nextCats,
    userStats: {
      ...s.userStats,
      lastActiveDate: t,
      currentStreak,
      longestStreak,
    },
  }
}

function migrateRaw(raw: unknown): ForgeGameState {
  if (!raw || typeof raw !== 'object') return createDefaultGameState()
  const o = raw as Record<string, unknown>
  if (o.categories && o.userStats && o.achievements) {
    return raw as ForgeGameState
  }
  return createDefaultGameState()
}

export function loadForgeState(): ForgeGameState {
  if (typeof window === 'undefined') return createDefaultGameState()
  try {
    const a = localStorage.getItem(KEY)
    if (a) return applyDayRollover(migrateRaw(JSON.parse(a)))
    const b = localStorage.getItem(LEGACY)
    if (b) {
      // minimal legacy: start fresh
      return createDefaultGameState()
    }
  } catch {
    /* ignore */
  }
  return createDefaultGameState()
}

export function saveForgeState(s: ForgeGameState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* ignore */
  }
}

function refreshLevels(cats: ForgeCategory[]): ForgeCategory[] {
  return cats.map((c) => ({ ...c, level: getCategoryLevel(c.xp) }))
}

export function completeTask(
  s: ForgeGameState,
  categoryId: string,
  taskId: string
): {
  state: ForgeGameState
  newUnlocks: Achievement[]
  xpGained: number
  leveledCategory: boolean
  prevLevel: number
  newLevel: number
  charBefore: number
} | null {
  const ci = s.categories.findIndex((c) => c.id === categoryId)
  if (ci < 0) return null
  const cat = s.categories[ci]
  const ti = cat.tasks.findIndex((x) => x.id === taskId)
  if (ti < 0) return null
  const task = cat.tasks[ti]
  if (task.completed) return null
  const m = streakMult(s.userStats.currentStreak)
  const xpGained = Math.floor(task.xpReward * m)
  const prevLevel = cat.level
  const newXp = cat.xp + xpGained
  const newL = getCategoryLevel(newXp)
  const tsk: ForgeTask = { ...task, completed: true, completedAt: new Date().toISOString() }
  const tasks = [...cat.tasks]
  tasks[ti] = tsk
  const ncat: ForgeCategory = { ...cat, xp: newXp, level: newL, tasks }
  const cats = [...s.categories]
  cats[ci] = ncat
  const us: ForgeUserStats = {
    ...s.userStats,
    totalTasksCompleted: s.userStats.totalTasksCompleted + 1,
  }
  const sync = syncUserStats(cats, us)
  const base: ForgeGameState = { ...s, categories: refreshLevels(cats), userStats: sync }
  const { state, newUnlocks } = mergeAchievements(base)
  return {
    state,
    newUnlocks,
    xpGained,
    leveledCategory: newL > prevLevel,
    prevLevel,
    newLevel: newL,
    charBefore: getCharacterLevel(getTotalXp(s.categories)),
  }
}

export function uncompleteTask(
  s: ForgeGameState,
  categoryId: string,
  taskId: string
): ForgeGameState | null {
  const ci = s.categories.findIndex((c) => c.id === categoryId)
  if (ci < 0) return null
  const cat = s.categories[ci]
  const ti = cat.tasks.findIndex((x) => x.id === taskId)
  if (ti < 0) return null
  const task = cat.tasks[ti]
  if (!task.completed) return null
  const sub = task.xpReward
  const newXp = Math.max(0, cat.xp - sub)
  const tsk: ForgeTask = { ...task, completed: false, completedAt: undefined }
  const tasks = [...cat.tasks]
  tasks[ti] = tsk
  const ncat: ForgeCategory = { ...cat, xp: newXp, level: getCategoryLevel(newXp), tasks }
  const cats = [...s.categories]
  cats[ci] = ncat
  const us: ForgeUserStats = {
    ...s.userStats,
    totalTasksCompleted: Math.max(0, s.userStats.totalTasksCompleted - 1),
  }
  return mergeAchievements({
    ...s,
    categories: refreshLevels(cats),
    userStats: syncUserStats(cats, us),
  }).state
}

export function addQuest(
  s: ForgeGameState,
  categoryId: string,
  t: { name: string; difficulty: ForgeTask['difficulty']; isDaily: boolean }
): ForgeGameState {
  const ci = s.categories.findIndex((c) => c.id === categoryId)
  if (ci < 0) return s
  const c = s.categories[ci]
  const id = `${categoryId}-quest-${Date.now()}-${Math.random().toString(16).slice(2)}`
  const task: ForgeTask = {
    id,
    categoryId,
    name: t.name,
    difficulty: t.difficulty,
    xpReward: XP_REWARDS[t.difficulty],
    completed: false,
    isDaily: t.isDaily,
  }
  const ncat: ForgeCategory = { ...c, tasks: [...c.tasks, task] }
  const cats = [...s.categories]
  cats[ci] = ncat
  return { ...s, categories: refreshLevels(cats) }
}

export function deleteTask(
  s: ForgeGameState,
  categoryId: string,
  taskId: string
): ForgeGameState {
  if (!taskId.includes('quest-')) return s
  const ci = s.categories.findIndex((c) => c.id === categoryId)
  if (ci < 0) return s
  const c = s.categories[ci]
  const task = c.tasks.find((q) => q.id === taskId)
  let st = s
  if (task?.completed) {
    const u = uncompleteTask(s, categoryId, taskId)
    if (u) st = u
  }
  const c2 = st.categories.find((x) => x.id === categoryId)!
  const ncat: ForgeCategory = { ...c2, tasks: c2.tasks.filter((q) => q.id !== taskId) }
  const cats = st.categories.map((x) => (x.id === categoryId ? ncat : x))
  return { ...st, categories: refreshLevels(cats) }
}

export function resetGame(): ForgeGameState {
  return createDefaultGameState()
}

export function loadDemoState(): ForgeGameState {
  const c = createInitialCategories().map((cat, idx) => ({
    ...cat,
    xp: [250, 180, 120, 200, 150, 90][idx] ?? 100,
    level: [5, 4, 3, 4, 3, 2][idx] ?? 2,
    tasks: cat.tasks.map((task, ti) => ({
      ...task,
      completed: ti < 2,
      completedAt: ti < 2 ? new Date().toISOString() : undefined,
    })),
  }))
  const g = createDefaultGameState()
  g.categories = c.map((x) => ({ ...x, level: getCategoryLevel(x.xp) }))
  g.userStats = {
    ...g.userStats,
    totalTasksCompleted: 156,
    currentStreak: 7,
    longestStreak: 14,
  }
  g.userStats = syncUserStats(g.categories, g.userStats)
  g.achievements = g.achievements.map((a, i) => ({
    ...a,
    unlocked: i < 4,
    unlockedAt: i < 4 ? new Date().toISOString() : null,
  }))
  return g
}
