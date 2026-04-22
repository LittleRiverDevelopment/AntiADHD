export function americanToDecimal(american: number): number {
  if (american > 0) {
    return (american / 100) + 1
  }
  return (100 / Math.abs(american)) + 1
}

export function decimalToAmerican(decimal: number): number {
  if (decimal >= 2) {
    return Math.round((decimal - 1) * 100)
  }
  return Math.round(-100 / (decimal - 1))
}

export function impliedProbability(american: number): number {
  if (american > 0) {
    return 100 / (american + 100)
  }
  return Math.abs(american) / (Math.abs(american) + 100)
}

export function calculateEV(odds: number, trueProbability: number): number {
  const decimalOdds = americanToDecimal(odds)
  return (trueProbability * (decimalOdds - 1)) - (1 - trueProbability)
}

export function calculateKellyCriterion(odds: number, trueProbability: number): number {
  const decimalOdds = americanToDecimal(odds)
  const q = 1 - trueProbability
  const kelly = (trueProbability * decimalOdds - 1) / (decimalOdds - 1)
  return Math.max(0, kelly)
}

export function findArbitrageOpportunity(odds1: number, odds2: number): { 
  isArbitrage: boolean
  profit: number
  stake1: number
  stake2: number 
} {
  const decimal1 = americanToDecimal(odds1)
  const decimal2 = americanToDecimal(odds2)
  
  const impliedSum = (1 / decimal1) + (1 / decimal2)
  const isArbitrage = impliedSum < 1
  
  if (!isArbitrage) {
    return { isArbitrage: false, profit: 0, stake1: 0, stake2: 0 }
  }
  
  const totalStake = 100
  const stake1 = totalStake / (decimal1 * impliedSum)
  const stake2 = totalStake / (decimal2 * impliedSum)
  const profit = ((1 / impliedSum) - 1) * 100
  
  return { isArbitrage, profit, stake1, stake2 }
}

export function formatOdds(american: number): string {
  return american > 0 ? `+${american}` : `${american}`
}

export function getEdgeColor(edge: number): string {
  if (edge >= 5) return 'text-green-400'
  if (edge >= 2) return 'text-yellow-400'
  if (edge > 0) return 'text-orange-400'
  return 'text-slate-400'
}

export function getEVColor(ev: number): string {
  if (ev >= 0.05) return 'text-green-400'
  if (ev >= 0.02) return 'text-emerald-400'
  if (ev > 0) return 'text-yellow-400'
  return 'text-red-400'
}
