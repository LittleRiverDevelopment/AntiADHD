export interface Sportsbook {
  key: string
  name: string
  logo?: string
}

export interface Odds {
  price: number
  point?: number
}

export interface Outcome {
  name: string
  price: number
  point?: number
}

export interface Market {
  key: string
  outcomes: Outcome[]
  lastUpdate?: string
}

export interface BookmakerOdds {
  key: string
  title: string
  markets: Market[]
}

export interface Game {
  id: string
  sport: string
  league: string
  homeTeam: string
  awayTeam: string
  commenceTime: string
  bookmakers: BookmakerOdds[]
}

export interface LineDiscrepancy {
  gameId: string
  homeTeam: string
  awayTeam: string
  market: string
  betType: string
  bestOdds: number
  bestBook: string
  worstOdds: number
  worstBook: string
  spread: number
  impliedProbBest: number
  impliedProbWorst: number
  commenceTime: string
}

export interface EVBet {
  gameId: string
  homeTeam: string
  awayTeam: string
  market: string
  selection: string
  odds: number
  book: string
  fairOdds: number
  ev: number
  evPercent: number
  kellyCriterion: number
  commenceTime: string
}

export interface PlayerGameLog {
  date: string
  matchup: string
  result: string
  minutes: number
  points: number
  rebounds: number
  assists: number
  blocks: number
  steals?: number
  turnovers?: number
}

export interface PlayerProp {
  playerId: string
  playerName: string
  team: string
  stat: 'PTS' | 'REB' | 'AST' | 'BLK' | 'STL' | 'PRA' | '3PM'
  line: number
  overOdds: Record<string, number>
  underOdds: Record<string, number>
  historicalHitRate: number
  last10HitRate: number
  recentGames: PlayerGameLog[]
}

export interface Sport {
  key: string
  group: string
  title: string
  description: string
  active: boolean
}

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

export type StatType = 'PTS' | 'REB' | 'AST' | 'BLK' | 'STL' | 'PRA' | '3PM'

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

export const STAT_LABELS: Record<StatType, string> = {
  PTS: 'Points',
  REB: 'Rebounds',
  AST: 'Assists',
  BLK: 'Blocks',
  STL: 'Steals',
  PRA: 'Pts+Reb+Ast',
  '3PM': '3-Pointers Made'
}

export const SPORTSBOOKS: Sportsbook[] = [
  { key: 'draftkings', name: 'DraftKings' },
  { key: 'fanduel', name: 'FanDuel' },
  { key: 'betmgm', name: 'BetMGM' },
  { key: 'caesars', name: 'Caesars' },
  { key: 'pointsbet', name: 'PointsBet' },
  { key: 'betrivers', name: 'BetRivers' },
  { key: 'unibet', name: 'Unibet' },
  { key: 'wynnbet', name: 'WynnBet' }
]
