import {
  LEVEL_THRESHOLDS,
  CHARACTER_LEVEL_THRESHOLDS,
  XP_REWARDS,
  type TaskDifficulty,
  type Category,
} from './types'

/**
 * Calculate the level based on XP and thresholds
 */
export function calculateLevel(xp: number, thresholds: number[]): number {
  let level = 1
  let totalXpNeeded = 0
  
  for (let i = 0; i < thresholds.length; i++) {
    totalXpNeeded += thresholds[i]
    if (xp >= totalXpNeeded) {
      level = i + 2
    } else {
      break
    }
  }
  
  return Math.min(level, 100)
}

/**
 * Calculate category level from XP
 */
export function getCategoryLevel(xp: number): number {
  return calculateLevel(xp, LEVEL_THRESHOLDS)
}

/**
 * Calculate character level from total XP
 */
export function getCharacterLevel(totalXp: number): number {
  return calculateLevel(totalXp, CHARACTER_LEVEL_THRESHOLDS)
}

/**
 * Get XP progress within current level
 */
export function getLevelProgress(xp: number, thresholds: number[]): {
  currentLevelXp: number
  xpNeededForNextLevel: number
  progressPercent: number
} {
  let totalXpNeeded = 0
  let previousTotal = 0
  
  for (let i = 0; i < thresholds.length; i++) {
    previousTotal = totalXpNeeded
    totalXpNeeded += thresholds[i]
    
    if (xp < totalXpNeeded) {
      const currentLevelXp = xp - previousTotal
      const xpNeededForNextLevel = thresholds[i]
      const progressPercent = (currentLevelXp / xpNeededForNextLevel) * 100
      
      return {
        currentLevelXp,
        xpNeededForNextLevel,
        progressPercent: Math.min(progressPercent, 100),
      }
    }
  }
  
  // Max level reached
  return {
    currentLevelXp: 0,
    xpNeededForNextLevel: 0,
    progressPercent: 100,
  }
}

/**
 * Get category level progress
 */
export function getCategoryLevelProgress(xp: number) {
  return getLevelProgress(xp, LEVEL_THRESHOLDS)
}

/**
 * Get character level progress
 */
export function getCharacterLevelProgress(totalXp: number) {
  return getLevelProgress(totalXp, CHARACTER_LEVEL_THRESHOLDS)
}

/**
 * Calculate XP reward for a task with multipliers
 */
export function calculateXpReward(
  difficulty: TaskDifficulty,
  streakDays: number,
  bonusMultipliers: number[] = []
): number {
  const baseXp = XP_REWARDS[difficulty]
  
  // Streak multiplier: 7+ days = 2x, 14+ = 2.5x, 30+ = 3x
  let streakMultiplier = 1
  if (streakDays >= 30) {
    streakMultiplier = 3
  } else if (streakDays >= 14) {
    streakMultiplier = 2.5
  } else if (streakDays >= 7) {
    streakMultiplier = 2
  } else if (streakDays >= 3) {
    streakMultiplier = 1.5
  }
  
  // Apply all multipliers
  const totalMultiplier = bonusMultipliers.reduce(
    (acc, mult) => acc * mult,
    streakMultiplier
  )
  
  return Math.floor(baseXp * totalMultiplier)
}

/**
 * Get total XP across all categories
 */
export function getTotalXp(categories: Category[]): number {
  return categories.reduce((total, cat) => total + cat.xp, 0)
}

/**
 * Get XP needed to reach a specific level
 */
export function getXpForLevel(targetLevel: number, thresholds: number[]): number {
  let totalXp = 0
  for (let i = 0; i < Math.min(targetLevel - 1, thresholds.length); i++) {
    totalXp += thresholds[i]
  }
  return totalXp
}

/**
 * Calculate streak multiplier text
 */
export function getStreakMultiplierText(streakDays: number): string {
  if (streakDays >= 30) return '3x XP'
  if (streakDays >= 14) return '2.5x XP'
  if (streakDays >= 7) return '2x XP'
  if (streakDays >= 3) return '1.5x XP'
  return '1x XP'
}

/**
 * Format large XP numbers
 */
export function formatXp(xp: number): string {
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M`
  }
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K`
  }
  return xp.toString()
}

/**
 * Check if a level up occurred
 */
export function checkLevelUp(
  previousXp: number,
  newXp: number,
  thresholds: number[]
): { leveledUp: boolean; previousLevel: number; newLevel: number } {
  const previousLevel = calculateLevel(previousXp, thresholds)
  const newLevel = calculateLevel(newXp, thresholds)
  
  return {
    leveledUp: newLevel > previousLevel,
    previousLevel,
    newLevel,
  }
}

/**
 * Calculate daily progress
 */
export function calculateDailyProgress(categories: Category[]): {
  completed: number
  total: number
  percentage: number
} {
  let completed = 0
  let total = 0
  
  categories.forEach(category => {
    category.tasks.forEach(task => {
      if (task.isDaily) {
        total++
        if (task.completed) {
          completed++
        }
      }
    })
  })
  
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  }
}

/**
 * Get level title based on level number (Skyrim-inspired)
 */
export function getLevelTitle(level: number, categoryId?: string): string {
  const titles: Record<number, string> = {
    1: 'Novice',
    5: 'Apprentice',
    10: 'Journeyman',
    25: 'Expert',
    50: 'Master',
    75: 'Grandmaster',
    100: 'Legend',
  }
  
  let title = 'Novice'
  for (const [threshold, t] of Object.entries(titles)) {
    if (level >= parseInt(threshold)) {
      title = t
    }
  }
  
  return title
}

