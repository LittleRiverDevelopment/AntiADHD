import { XP_REWARDS, type ForgeCategory, type ForgeTask, type TaskDifficulty } from './types'

const D = (diff: TaskDifficulty) => XP_REWARDS[diff]

const T: Record<
  string,
  Array<{ name: string; diff: TaskDifficulty; isDaily: boolean }>
> = {
  fitness: [
    { name: 'Complete a workout', diff: 'medium', isDaily: true },
    { name: 'Walk 10,000 steps', diff: 'medium', isDaily: true },
    { name: 'Do 50 push-ups', diff: 'easy', isDaily: true },
    { name: 'Stretch for 15 minutes', diff: 'easy', isDaily: true },
    { name: 'Hit a new PR', diff: 'legendary', isDaily: false },
  ],
  business: [
    { name: 'Complete 3 major tasks', diff: 'medium', isDaily: true },
    { name: 'Clear inbox to zero', diff: 'easy', isDaily: true },
    { name: 'Deep work session (2+ hrs)', diff: 'hard', isDaily: true },
    { name: 'Contact a new lead', diff: 'medium', isDaily: true },
    { name: 'Ship a project', diff: 'legendary', isDaily: false },
  ],
  relationships: [
    { name: 'Have a quality conversation', diff: 'easy', isDaily: true },
    { name: 'Call a friend or family member', diff: 'medium', isDaily: true },
    { name: 'Write a gratitude note', diff: 'easy', isDaily: true },
    { name: 'Plan a date or hangout', diff: 'medium', isDaily: false },
    { name: 'Reconnect with old friend', diff: 'hard', isDaily: false },
  ],
  learning: [
    { name: 'Read for 30 minutes', diff: 'easy', isDaily: true },
    { name: 'Complete a course lesson', diff: 'medium', isDaily: true },
    { name: 'Practice a new skill', diff: 'medium', isDaily: true },
    { name: 'Take detailed notes', diff: 'easy', isDaily: true },
    { name: 'Finish a book', diff: 'legendary', isDaily: false },
  ],
  health: [
    { name: 'Drink 8 glasses of water', diff: 'easy', isDaily: true },
    { name: 'Meditate for 10 minutes', diff: 'easy', isDaily: true },
    { name: 'Get 7+ hours of sleep', diff: 'medium', isDaily: true },
    { name: 'Eat a healthy meal', diff: 'easy', isDaily: true },
    { name: 'Complete a digital detox day', diff: 'legendary', isDaily: false },
  ],
  personal: [
    { name: 'Write in journal', diff: 'easy', isDaily: true },
    { name: 'Complete a chore', diff: 'easy', isDaily: true },
    { name: 'Work on a hobby', diff: 'medium', isDaily: true },
    { name: 'Stay under screen time limit', diff: 'medium', isDaily: true },
    { name: 'Achieve a personal goal', diff: 'legendary', isDaily: false },
  ],
}

export const FORGE_CATEGORY_DEFS: Record<
  string,
  { id: string; name: string; icon: string; description: string; color: string }
> = {
  fitness: {
    id: 'fitness',
    name: 'Fitness',
    icon: '💪',
    description: 'Physical strength and endurance',
    color: '#00ff88',
  },
  business: {
    id: 'business',
    name: 'Business',
    icon: '💼',
    description: 'Professional growth and productivity',
    color: '#00d4ff',
  },
  relationships: {
    id: 'relationships',
    name: 'Relationships',
    icon: '❤️',
    description: 'Social connections and bonds',
    color: '#ff006e',
  },
  learning: {
    id: 'learning',
    name: 'Learning',
    icon: '📚',
    description: 'Knowledge and skill acquisition',
    color: '#a855f7',
  },
  health: {
    id: 'health',
    name: 'Health',
    icon: '🧘',
    description: 'Mental and physical wellness',
    color: '#2dd4bf',
  },
  personal: {
    id: 'personal',
    name: 'Personal',
    icon: '✨',
    description: 'Self-improvement and growth',
    color: '#ff8c00',
  },
}

const ORDER = ['fitness', 'business', 'relationships', 'learning', 'health', 'personal'] as const

function buildTasks(categoryId: string): ForgeTask[] {
  return (T[categoryId] || []).map((x, i) => ({
    id: `${categoryId}-task-${i}`,
    categoryId,
    name: x.name,
    difficulty: x.diff,
    xpReward: D(x.diff),
    completed: false,
    isDaily: x.isDaily,
  }))
}

export function createInitialCategories(): ForgeCategory[] {
  return ORDER.map((key) => {
    const d = FORGE_CATEGORY_DEFS[key]
    return {
      ...d,
      xp: 0,
      level: 1,
      tasks: buildTasks(key),
    }
  })
}
