import { subDays, format } from 'date-fns'

/** Run when the user checks off a task (completing it). */
export function bumpStreak(
  currentStreak: number,
  lastActiveDate: string | null
): { currentStreak: number; lastActiveDate: string } {
  const today = format(new Date(), 'yyyy-MM-dd')
  if (lastActiveDate === today) {
    return { currentStreak, lastActiveDate: today }
  }
  const y = format(subDays(new Date(), 1), 'yyyy-MM-dd')
  if (lastActiveDate === y) {
    return { currentStreak: currentStreak + 1, lastActiveDate: today }
  }
  return { currentStreak: 1, lastActiveDate: today }
}
