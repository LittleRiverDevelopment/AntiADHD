import {
  FORGE_CATEGORY_LEVEL_THRESHOLDS,
  FORGE_CHARACTER_LEVEL_THRESHOLDS,
} from './forge-thresholds'

/** Aliases for xp engine (Netlify / zip parity: 100-segment curves). */
export const LEVEL_THRESHOLDS = FORGE_CATEGORY_LEVEL_THRESHOLDS
export const CHARACTER_LEVEL_THRESHOLDS = FORGE_CHARACTER_LEVEL_THRESHOLDS

export type TaskDifficulty = 'easy' | 'medium' | 'hard' | 'legendary'

export const XP_REWARDS: Record<TaskDifficulty, number> = {
  easy: 10,
  medium: 25,
  hard: 50,
  legendary: 100,
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

export interface ForgeTask {
  id: string
  categoryId: string
  name: string
  description?: string
  difficulty: TaskDifficulty
  xpReward: number
  completed: boolean
  isDaily: boolean
  completedAt?: string
}

export interface ForgeCategory {
  id: string
  name: string
  icon: string
  description: string
  color: string
  xp: number
  level: number
  tasks: ForgeTask[]
}

export interface ForgeUserStats {
  totalXp: number
  characterLevel: number
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  totalTasksCompleted: number
  joinedDate: string
}

export interface ForgeGameState {
  categories: ForgeCategory[]
  achievements: Achievement[]
  userStats: ForgeUserStats
  unlockedThemes: string[]
  activeTheme: string
}
