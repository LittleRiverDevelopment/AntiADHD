import { Game, LineDiscrepancy, EVBet, PlayerProp, PlayerGameLog } from './types'

const generateRandomOdds = (base: number, variance: number = 15): number => {
  const offset = Math.floor(Math.random() * variance * 2) - variance
  return base + offset
}

export const MOCK_GAMES: Game[] = [
  {
    id: '1',
    sport: 'basketball_nba',
    league: 'NBA',
    homeTeam: 'Los Angeles Lakers',
    awayTeam: 'Boston Celtics',
    commenceTime: new Date(Date.now() + 3600000 * 4).toISOString(),
    bookmakers: [
      {
        key: 'draftkings',
        title: 'DraftKings',
        markets: [
          { key: 'h2h', outcomes: [{ name: 'Los Angeles Lakers', price: -110 }, { name: 'Boston Celtics', price: -110 }] },
          { key: 'spreads', outcomes: [{ name: 'Los Angeles Lakers', price: -110, point: 2.5 }, { name: 'Boston Celtics', price: -110, point: -2.5 }] },
          { key: 'totals', outcomes: [{ name: 'Over', price: -110, point: 224.5 }, { name: 'Under', price: -110, point: 224.5 }] }
        ]
      },
      {
        key: 'fanduel',
        title: 'FanDuel',
        markets: [
          { key: 'h2h', outcomes: [{ name: 'Los Angeles Lakers', price: -105 }, { name: 'Boston Celtics', price: -115 }] },
          { key: 'spreads', outcomes: [{ name: 'Los Angeles Lakers', price: -108, point: 2.5 }, { name: 'Boston Celtics', price: -112, point: -2.5 }] },
          { key: 'totals', outcomes: [{ name: 'Over', price: -105, point: 225 }, { name: 'Under', price: -115, point: 225 }] }
        ]
      },
      {
        key: 'betmgm',
        title: 'BetMGM',
        markets: [
          { key: 'h2h', outcomes: [{ name: 'Los Angeles Lakers', price: -115 }, { name: 'Boston Celtics', price: -105 }] },
          { key: 'spreads', outcomes: [{ name: 'Los Angeles Lakers', price: -105, point: 3 }, { name: 'Boston Celtics', price: -115, point: -3 }] },
          { key: 'totals', outcomes: [{ name: 'Over', price: -108, point: 224 }, { name: 'Under', price: -112, point: 224 }] }
        ]
      },
      {
        key: 'caesars',
        title: 'Caesars',
        markets: [
          { key: 'h2h', outcomes: [{ name: 'Los Angeles Lakers', price: -108 }, { name: 'Boston Celtics', price: -112 }] },
          { key: 'spreads', outcomes: [{ name: 'Los Angeles Lakers', price: -110, point: 2.5 }, { name: 'Boston Celtics', price: -110, point: -2.5 }] },
          { key: 'totals', outcomes: [{ name: 'Over', price: -110, point: 224.5 }, { name: 'Under', price: -110, point: 224.5 }] }
        ]
      }
    ]
  },
  {
    id: '2',
    sport: 'basketball_nba',
    league: 'NBA',
    homeTeam: 'Golden State Warriors',
    awayTeam: 'Phoenix Suns',
    commenceTime: new Date(Date.now() + 3600000 * 6).toISOString(),
    bookmakers: [
      {
        key: 'draftkings',
        title: 'DraftKings',
        markets: [
          { key: 'h2h', outcomes: [{ name: 'Golden State Warriors', price: -135 }, { name: 'Phoenix Suns', price: +115 }] },
          { key: 'spreads', outcomes: [{ name: 'Golden State Warriors', price: -110, point: -3 }, { name: 'Phoenix Suns', price: -110, point: 3 }] },
          { key: 'totals', outcomes: [{ name: 'Over', price: -110, point: 230 }, { name: 'Under', price: -110, point: 230 }] }
        ]
      },
      {
        key: 'fanduel',
        title: 'FanDuel',
        markets: [
          { key: 'h2h', outcomes: [{ name: 'Golden State Warriors', price: -130 }, { name: 'Phoenix Suns', price: +110 }] },
          { key: 'spreads', outcomes: [{ name: 'Golden State Warriors', price: -108, point: -2.5 }, { name: 'Phoenix Suns', price: -112, point: 2.5 }] },
          { key: 'totals', outcomes: [{ name: 'Over', price: -108, point: 229.5 }, { name: 'Under', price: -112, point: 229.5 }] }
        ]
      },
      {
        key: 'betmgm',
        title: 'BetMGM',
        markets: [
          { key: 'h2h', outcomes: [{ name: 'Golden State Warriors', price: -140 }, { name: 'Phoenix Suns', price: +120 }] },
          { key: 'spreads', outcomes: [{ name: 'Golden State Warriors', price: -110, point: -3.5 }, { name: 'Phoenix Suns', price: -110, point: 3.5 }] },
          { key: 'totals', outcomes: [{ name: 'Over', price: -105, point: 230.5 }, { name: 'Under', price: -115, point: 230.5 }] }
        ]
      },
      {
        key: 'caesars',
        title: 'Caesars',
        markets: [
          { key: 'h2h', outcomes: [{ name: 'Golden State Warriors', price: -132 }, { name: 'Phoenix Suns', price: +112 }] },
          { key: 'spreads', outcomes: [{ name: 'Golden State Warriors', price: -110, point: -3 }, { name: 'Phoenix Suns', price: -110, point: 3 }] },
          { key: 'totals', outcomes: [{ name: 'Over', price: -110, point: 230 }, { name: 'Under', price: -110, point: 230 }] }
        ]
      }
    ]
  },
  {
    id: '3',
    sport: 'basketball_nba',
    league: 'NBA',
    homeTeam: 'Denver Nuggets',
    awayTeam: 'Oklahoma City Thunder',
    commenceTime: new Date(Date.now() + 3600000 * 8).toISOString(),
    bookmakers: [
      {
        key: 'draftkings',
        title: 'DraftKings',
        markets: [
          { key: 'h2h', outcomes: [{ name: 'Denver Nuggets', price: -150 }, { name: 'Oklahoma City Thunder', price: +130 }] },
          { key: 'spreads', outcomes: [{ name: 'Denver Nuggets', price: -110, point: -4 }, { name: 'Oklahoma City Thunder', price: -110, point: 4 }] },
          { key: 'totals', outcomes: [{ name: 'Over', price: -110, point: 227.5 }, { name: 'Under', price: -110, point: 227.5 }] }
        ]
      },
      {
        key: 'fanduel',
        title: 'FanDuel',
        markets: [
          { key: 'h2h', outcomes: [{ name: 'Denver Nuggets', price: -145 }, { name: 'Oklahoma City Thunder', price: +125 }] },
          { key: 'spreads', outcomes: [{ name: 'Denver Nuggets', price: -105, point: -3.5 }, { name: 'Oklahoma City Thunder', price: -115, point: 3.5 }] },
          { key: 'totals', outcomes: [{ name: 'Over', price: -112, point: 228 }, { name: 'Under', price: -108, point: 228 }] }
        ]
      },
      {
        key: 'betmgm',
        title: 'BetMGM',
        markets: [
          { key: 'h2h', outcomes: [{ name: 'Denver Nuggets', price: -155 }, { name: 'Oklahoma City Thunder', price: +135 }] },
          { key: 'spreads', outcomes: [{ name: 'Denver Nuggets', price: -110, point: -4.5 }, { name: 'Oklahoma City Thunder', price: -110, point: 4.5 }] },
          { key: 'totals', outcomes: [{ name: 'Over', price: -110, point: 227 }, { name: 'Under', price: -110, point: 227 }] }
        ]
      },
      {
        key: 'caesars',
        title: 'Caesars',
        markets: [
          { key: 'h2h', outcomes: [{ name: 'Denver Nuggets', price: -148 }, { name: 'Oklahoma City Thunder', price: +128 }] },
          { key: 'spreads', outcomes: [{ name: 'Denver Nuggets', price: -108, point: -4 }, { name: 'Oklahoma City Thunder', price: -112, point: 4 }] },
          { key: 'totals', outcomes: [{ name: 'Over', price: -108, point: 227.5 }, { name: 'Under', price: -112, point: 227.5 }] }
        ]
      }
    ]
  }
]

export function generateLineDiscrepancies(): LineDiscrepancy[] {
  const discrepancies: LineDiscrepancy[] = []
  
  MOCK_GAMES.forEach(game => {
    const markets = ['Moneyline', 'Spread', 'Total']
    
    markets.forEach(market => {
      const bookOdds = game.bookmakers.map(book => {
        const marketData = book.markets.find(m => 
          (market === 'Moneyline' && m.key === 'h2h') ||
          (market === 'Spread' && m.key === 'spreads') ||
          (market === 'Total' && m.key === 'totals')
        )
        if (!marketData) return null
        const outcome = marketData.outcomes[0]
        return { book: book.title, odds: outcome.price, point: outcome.point }
      }).filter(Boolean) as { book: string; odds: number; point?: number }[]
      
      if (bookOdds.length < 2) return
      
      const sorted = [...bookOdds].sort((a, b) => b.odds - a.odds)
      const best = sorted[0]
      const worst = sorted[sorted.length - 1]
      const spread = best.odds - worst.odds
      
      if (spread >= 5) {
        discrepancies.push({
          gameId: game.id,
          homeTeam: game.homeTeam,
          awayTeam: game.awayTeam,
          market,
          betType: market === 'Total' ? `Over ${best.point}` : game.homeTeam,
          bestOdds: best.odds,
          bestBook: best.book,
          worstOdds: worst.odds,
          worstBook: worst.book,
          spread,
          impliedProbBest: best.odds > 0 ? 100 / (best.odds + 100) : Math.abs(best.odds) / (Math.abs(best.odds) + 100),
          impliedProbWorst: worst.odds > 0 ? 100 / (worst.odds + 100) : Math.abs(worst.odds) / (Math.abs(worst.odds) + 100),
          commenceTime: game.commenceTime
        })
      }
    })
  })
  
  return discrepancies.sort((a, b) => b.spread - a.spread)
}

export function generateEVBets(): EVBet[] {
  const evBets: EVBet[] = [
    {
      gameId: '1',
      homeTeam: 'Los Angeles Lakers',
      awayTeam: 'Boston Celtics',
      market: 'Moneyline',
      selection: 'Los Angeles Lakers',
      odds: -105,
      book: 'FanDuel',
      fairOdds: -115,
      ev: 0.043,
      evPercent: 4.3,
      kellyCriterion: 0.089,
      commenceTime: new Date(Date.now() + 3600000 * 4).toISOString()
    },
    {
      gameId: '2',
      homeTeam: 'Golden State Warriors',
      awayTeam: 'Phoenix Suns',
      market: 'Spread',
      selection: 'Phoenix Suns +3.5',
      odds: -110,
      book: 'BetMGM',
      fairOdds: -120,
      ev: 0.038,
      evPercent: 3.8,
      kellyCriterion: 0.076,
      commenceTime: new Date(Date.now() + 3600000 * 6).toISOString()
    },
    {
      gameId: '3',
      homeTeam: 'Denver Nuggets',
      awayTeam: 'Oklahoma City Thunder',
      market: 'Total',
      selection: 'Under 228',
      odds: -108,
      book: 'FanDuel',
      fairOdds: -115,
      ev: 0.031,
      evPercent: 3.1,
      kellyCriterion: 0.063,
      commenceTime: new Date(Date.now() + 3600000 * 8).toISOString()
    },
    {
      gameId: '2',
      homeTeam: 'Golden State Warriors',
      awayTeam: 'Phoenix Suns',
      market: 'Moneyline',
      selection: 'Phoenix Suns',
      odds: +120,
      book: 'BetMGM',
      fairOdds: +105,
      ev: 0.056,
      evPercent: 5.6,
      kellyCriterion: 0.112,
      commenceTime: new Date(Date.now() + 3600000 * 6).toISOString()
    },
    {
      gameId: '1',
      homeTeam: 'Los Angeles Lakers',
      awayTeam: 'Boston Celtics',
      market: 'Total',
      selection: 'Over 224',
      odds: -108,
      book: 'BetMGM',
      fairOdds: -118,
      ev: 0.041,
      evPercent: 4.1,
      kellyCriterion: 0.082,
      commenceTime: new Date(Date.now() + 3600000 * 4).toISOString()
    }
  ]
  
  return evBets.sort((a, b) => b.evPercent - a.evPercent)
}

const generateGameLogs = (playerName: string, avgStats: { pts: number; reb: number; ast: number; blk: number }): PlayerGameLog[] => {
  const teams = ['BOS', 'LAL', 'GSW', 'PHX', 'DEN', 'MIA', 'NYK', 'CHI', 'DAL', 'MIL']
  const results: ('W' | 'L')[] = ['W', 'L']
  const logs: PlayerGameLog[] = []
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i * 2 - Math.floor(Math.random() * 2))
    
    const variance = 0.4
    logs.push({
      date: date.toISOString().split('T')[0],
      matchup: `vs ${teams[Math.floor(Math.random() * teams.length)]}`,
      result: results[Math.floor(Math.random() * 2)],
      minutes: 28 + Math.floor(Math.random() * 12),
      points: Math.max(0, Math.round(avgStats.pts * (1 + (Math.random() - 0.5) * variance))),
      rebounds: Math.max(0, Math.round(avgStats.reb * (1 + (Math.random() - 0.5) * variance))),
      assists: Math.max(0, Math.round(avgStats.ast * (1 + (Math.random() - 0.5) * variance))),
      blocks: Math.max(0, Math.round(avgStats.blk * (1 + (Math.random() - 0.5) * variance * 2)))
    })
  }
  
  return logs
}

export const MOCK_PLAYER_PROPS: PlayerProp[] = [
  {
    playerId: 'jokic',
    playerName: 'Nikola Jokić',
    team: 'DEN',
    stat: 'PTS',
    line: 29.5,
    overOdds: { draftkings: -115, fanduel: -110, betmgm: -118, caesars: -112 },
    underOdds: { draftkings: -105, fanduel: -110, betmgm: -102, caesars: -108 },
    historicalHitRate: 0.58,
    last10HitRate: 0.70,
    recentGames: generateGameLogs('Nikola Jokić', { pts: 31, reb: 13, ast: 10, blk: 1 })
  },
  {
    playerId: 'lebron',
    playerName: 'LeBron James',
    team: 'LAL',
    stat: 'PTS',
    line: 25.5,
    overOdds: { draftkings: -110, fanduel: -108, betmgm: -115, caesars: -110 },
    underOdds: { draftkings: -110, fanduel: -112, betmgm: -105, caesars: -110 },
    historicalHitRate: 0.52,
    last10HitRate: 0.60,
    recentGames: generateGameLogs('LeBron James', { pts: 26, reb: 8, ast: 8, blk: 1 })
  },
  {
    playerId: 'sga',
    playerName: 'Shai Gilgeous-Alexander',
    team: 'OKC',
    stat: 'PTS',
    line: 31.5,
    overOdds: { draftkings: -105, fanduel: -108, betmgm: -110, caesars: -105 },
    underOdds: { draftkings: -115, fanduel: -112, betmgm: -110, caesars: -115 },
    historicalHitRate: 0.62,
    last10HitRate: 0.80,
    recentGames: generateGameLogs('Shai Gilgeous-Alexander', { pts: 33, reb: 5, ast: 6, blk: 1 })
  },
  {
    playerId: 'luka',
    playerName: 'Luka Dončić',
    team: 'DAL',
    stat: 'PTS',
    line: 33.5,
    overOdds: { draftkings: -112, fanduel: -110, betmgm: -108, caesars: -110 },
    underOdds: { draftkings: -108, fanduel: -110, betmgm: -112, caesars: -110 },
    historicalHitRate: 0.55,
    last10HitRate: 0.50,
    recentGames: generateGameLogs('Luka Dončić', { pts: 34, reb: 9, ast: 10, blk: 0 })
  },
  {
    playerId: 'giannis',
    playerName: 'Giannis Antetokounmpo',
    team: 'MIL',
    stat: 'PTS',
    line: 30.5,
    overOdds: { draftkings: -110, fanduel: -105, betmgm: -112, caesars: -108 },
    underOdds: { draftkings: -110, fanduel: -115, betmgm: -108, caesars: -112 },
    historicalHitRate: 0.60,
    last10HitRate: 0.70,
    recentGames: generateGameLogs('Giannis Antetokounmpo', { pts: 32, reb: 12, ast: 6, blk: 1 })
  },
  {
    playerId: 'curry',
    playerName: 'Stephen Curry',
    team: 'GSW',
    stat: 'PTS',
    line: 27.5,
    overOdds: { draftkings: -108, fanduel: -110, betmgm: -105, caesars: -108 },
    underOdds: { draftkings: -112, fanduel: -110, betmgm: -115, caesars: -112 },
    historicalHitRate: 0.54,
    last10HitRate: 0.60,
    recentGames: generateGameLogs('Stephen Curry', { pts: 28, reb: 5, ast: 5, blk: 0 })
  }
]

export function getPlayerPropWithStat(playerId: string, stat: 'PTS' | 'REB' | 'AST' | 'BLK'): PlayerProp | undefined {
  const baseProp = MOCK_PLAYER_PROPS.find(p => p.playerId === playerId)
  if (!baseProp) return undefined
  
  const statLines: Record<string, Record<string, number>> = {
    jokic: { PTS: 29.5, REB: 11.5, AST: 9.5, BLK: 0.5 },
    lebron: { PTS: 25.5, REB: 8.5, AST: 8.5, BLK: 0.5 },
    sga: { PTS: 31.5, REB: 5.5, AST: 6.5, BLK: 0.5 },
    luka: { PTS: 33.5, REB: 9.5, AST: 9.5, BLK: 0.5 },
    giannis: { PTS: 30.5, REB: 11.5, AST: 6.5, BLK: 1.5 },
    curry: { PTS: 27.5, REB: 4.5, AST: 5.5, BLK: 0.5 }
  }
  
  return {
    ...baseProp,
    stat,
    line: statLines[playerId]?.[stat] || baseProp.line
  }
}
