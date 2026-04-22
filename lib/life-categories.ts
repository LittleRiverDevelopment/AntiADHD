import type { Category, LifeTask, TaskDifficulty } from './types'

export type LifeCategoryId =
  | 'fitness'
  | 'business'
  | 'relationships'
  | 'learning'
  | 'health'
  | 'personal'

export const CATEGORY_CONFIG: Record<
  LifeCategoryId,
  { name: string; icon: string; accent: string; description: string }
> = {
  fitness: { name: 'Fitness', icon: '⚔️', accent: '#22d3ee', description: 'Body & movement' },
  business: { name: 'Business', icon: '📈', accent: '#a78bfa', description: 'Work & income' },
  relationships: {
    name: 'Relationships',
    icon: '💬',
    accent: '#f472b6',
    description: 'People you care about',
  },
  learning: { name: 'Learning', icon: '📚', accent: '#60a5fa', description: 'Books & skills' },
  health: { name: 'Health', icon: '❤️', accent: '#34d399', description: 'Sleep, mind, nutrition' },
  personal: { name: 'Personal', icon: '✨', accent: '#fbbf24', description: 'Hobbies & self' },
}

function makeTask(
  id: string,
  name: string,
  difficulty: TaskDifficulty,
  isDaily = true
): LifeTask {
  return { id, name, difficulty, isDaily, completed: false }
}

export function createInitialCategories(): Category[] {
  const c = CATEGORY_CONFIG
  return [
    {
      id: 'fitness',
      name: c.fitness.name,
      xp: 320,
      tasks: [
        makeTask('f1', 'Morning walk / cardio', 'easy', true),
        makeTask('f2', 'Strength block', 'medium', true),
        makeTask('f3', 'Stretch 10+ min', 'easy', true),
      ],
    },
    {
      id: 'business',
      name: c.business.name,
      xp: 150,
      tasks: [
        makeTask('b1', 'Deep work 90+ min', 'hard', true),
        makeTask('b2', 'Inbox to zero', 'medium', true),
        makeTask('b3', 'Outreach 3+ touches', 'medium', true),
      ],
    },
    {
      id: 'relationships',
      name: c.relationships.name,
      xp: 200,
      tasks: [
        makeTask('r1', 'Message someone you value', 'easy', true),
        makeTask('r2', 'Quality time / call', 'medium', true),
      ],
    },
    {
      id: 'learning',
      name: c.learning.name,
      xp: 280,
      tasks: [
        makeTask('l1', 'Read 20+ min', 'easy', true),
        makeTask('l2', 'Study / course unit', 'medium', true),
        makeTask('l3', 'Apply something new', 'hard', true),
      ],
    },
    {
      id: 'health',
      name: c.health.name,
      xp: 180,
      tasks: [
        makeTask('h1', 'Sleep 7+ hours target', 'medium', true),
        makeTask('h2', 'Mindful break / walk', 'easy', true),
      ],
    },
    {
      id: 'personal',
      name: c.personal.name,
      xp: 90,
      tasks: [
        makeTask('p1', 'Creative or hobby time', 'medium', true),
        makeTask('p2', 'Journal / plan tomorrow', 'easy', true),
      ],
    },
  ]
}

export const LIFE_CATEGORY_ORDER: LifeCategoryId[] = [
  'fitness',
  'business',
  'relationships',
  'learning',
  'health',
  'personal',
]
