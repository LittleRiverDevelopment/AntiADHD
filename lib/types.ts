/** Per-level XP to reach the next level (index 0 = 1→2, …, length 99 = 99→100) */
const makeLevelThresholds = (base: number, growth: number): number[] =>
  Array.from({ length: 99 }, (_, i) => Math.max(100, Math.floor(base * growth ** i)))

export const LEVEL_THRESHOLDS: number[] = makeLevelThresholds(100, 1.1)
export const CHARACTER_LEVEL_THRESHOLDS: number[] = makeLevelThresholds(200, 1.12)

export type TaskDifficulty = 'easy' | 'medium' | 'hard' | 'legendary'

export const XP_REWARDS: Record<TaskDifficulty, number> = {
  easy: 10,
  medium: 25,
  hard: 50,
  legendary: 100,
}

export interface LifeTask {
  id: string
  name: string
  isDaily: boolean
  completed: boolean
  difficulty: TaskDifficulty
}

export interface Category {
  id: string
  name: string
  xp: number
  tasks: LifeTask[]
}

export interface UserStats {
  totalXp: number
  currentStreak: number
  categories: Category[]
}

export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export type AchievementRequirement =
  | { type: 'category_level'; value: number; categoryId: string }
  | { type: 'streak'; value: number }
  | { type: 'tasks_completed'; value: number }
  | { type: 'level'; value: number }
  | { type: 'total_xp'; value: number }

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  categoryId?: string
  requirement: AchievementRequirement
  rarity: AchievementRarity
  unlocked: boolean
  unlockedAt: string | null
}
