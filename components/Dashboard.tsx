'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { Sword, Sparkles, Flame, Trophy, RotateCcw, X, ChevronUp } from 'lucide-react'
import { clsx } from 'clsx'
import type { LifeTask, TaskDifficulty } from '@/lib/types'
import {
  calculateXpReward,
  getCharacterLevel,
  getLevelTitle,
  getStreakMultiplierText,
  getTotalXp,
} from '@/lib/xpCalculations'
import { loadGame, saveGame, type PersistedGame } from '@/lib/persisted-game'
import { bumpStreak } from '@/lib/streak-utils'
import {
  buildAchievementList,
  recomputeUnlockedIds,
  findNewlyUnlocked,
} from '@/lib/achievementsEngine'
import { createInitialCategories, LIFE_CATEGORY_ORDER, CATEGORY_CONFIG } from '@/lib/life-categories'
import SkillCard from './SkillCard'

const RARITY: Record<string, string> = {
  common: 'text-slate-500 border-slate-700/60',
  uncommon: 'text-emerald-400/90 border-emerald-500/30',
  rare: 'text-sky-400/90 border-sky-500/30',
  epic: 'text-violet-300 border-violet-500/30',
  legendary: 'text-amber-200 border-amber-500/30',
}

export default function LifeForgeDashboard() {
  const [game, setGame] = useState<PersistedGame | null>(null)
  const [achToast, setAchToast] = useState<string | null>(null)
  const [charModal, setCharModal] = useState(false)
  const prevChar = useRef(1)
  const [addState, setAddState] = useState<{
    open: boolean
    categoryId: string
    name: string
    difficulty: TaskDifficulty
    isDaily: boolean
  }>({ open: false, categoryId: 'fitness', name: '', difficulty: 'medium', isDaily: true })
  const [showAchieve, setShowAchieve] = useState(true)

  useEffect(() => {
    const g = loadGame()
    setGame(g)
    const total = getTotalXp(g.categories)
    prevChar.current = getCharacterLevel(total)
  }, [])

  const totalXp = game ? getTotalXp(game.categories) : 0
  const charLevel = getCharacterLevel(totalXp)
  const charTitle = getLevelTitle(charLevel)
  const achievements = useMemo(
    () => (game ? buildAchievementList(game) : []),
    [game]
  )
  const unlockedN = useMemo(
    () => achievements.filter((a) => a.unlocked).length,
    [achievements]
  )

  const applyAndSave = useCallback((next: PersistedGame, previousUnlockedIds: string[]) => {
    const merged = recomputeUnlockedIds(
      {
        categories: next.categories,
        currentStreak: next.currentStreak,
        totalTasksCompleted: next.totalTasksCompleted,
      },
      previousUnlockedIds
    )
    const withAch: PersistedGame = { ...next, unlockedAchievementIds: merged }
    const newOnes = findNewlyUnlocked(previousUnlockedIds, merged)
    if (newOnes.length) {
      const a = buildAchievementList(withAch).find((x) => x.id === newOnes[0])
      if (a) {
        setAchToast(`${a.icon} ${a.name}`)
        setTimeout(() => setAchToast(null), 5000)
      }
    }
    const newChar = getCharacterLevel(getTotalXp(withAch.categories))
    if (newChar > prevChar.current) {
      setCharModal(true)
    }
    prevChar.current = newChar
    setGame(withAch)
    saveGame(withAch)
  }, [])

  const onToggle = useCallback(
    (catId: string, taskId: string) => {
      if (!game) return
      const cats = game.categories.map((c) => {
        if (c.id !== catId) return c
        return {
          ...c,
          tasks: c.tasks.map((t) => {
            if (t.id !== taskId) return t
            if (!t.completed) {
              return { ...t, completed: true }
            }
            return { ...t, completed: false }
          }),
        }
      })
      const cat = game.categories.find((c) => c.id === catId)
      const task = cat?.tasks.find((t) => t.id === taskId)
      if (!cat || !task) return
      if (!task.completed) {
        const s = bumpStreak(game.currentStreak, game.lastActiveDate)
        const xpGained = calculateXpReward(task.difficulty, s.currentStreak, [])
        const nextCats = cats.map((c) => {
          if (c.id !== catId) return c
          return { ...c, xp: c.xp + xpGained }
        })
        applyAndSave(
          {
            ...game,
            categories: nextCats,
            currentStreak: s.currentStreak,
            lastActiveDate: s.lastActiveDate,
            totalTasksCompleted: game.totalTasksCompleted + 1,
            unlockedAchievementIds: game.unlockedAchievementIds,
          },
          game.unlockedAchievementIds
        )
        return
      }
      const xpSub = Math.min(
        cat.xp,
        calculateXpReward(task.difficulty, game.currentStreak, [])
      )
      const nextCats = cats.map((c) => {
        if (c.id !== catId) return c
        return { ...c, xp: Math.max(0, c.xp - xpSub) }
      })
      applyAndSave(
        {
          ...game,
          categories: nextCats,
          currentStreak: game.currentStreak,
          lastActiveDate: game.lastActiveDate,
          totalTasksCompleted: Math.max(0, game.totalTasksCompleted - 1),
          unlockedAchievementIds: game.unlockedAchievementIds,
        },
        game.unlockedAchievementIds
      )
    },
    [game, applyAndSave]
  )

  const onAdd = useCallback(
    (catId: string) => {
      setAddState((s) => ({ ...s, open: true, categoryId: catId, name: '' }))
    },
    []
  )

  const submitAdd = useCallback(() => {
    if (!game) return
    const name = addState.name.trim()
    if (name.length < 1) return
    const id = `q-${Date.now()}-${Math.random().toString(16).slice(2)}`
    const task: LifeTask = {
      id,
      name,
      difficulty: addState.difficulty,
      isDaily: addState.isDaily,
      completed: false,
    }
    const categories = game.categories.map((c) => {
      if (c.id !== addState.categoryId) return c
      return { ...c, tasks: [...c.tasks, task] }
    })
    applyAndSave(
      { ...game, categories, unlockedAchievementIds: game.unlockedAchievementIds },
      game.unlockedAchievementIds
    )
    setAddState((s) => ({ ...s, open: false, name: '' }))
  }, [addState, game, applyAndSave])

  const reset = useCallback(() => {
    if (typeof window === 'undefined' || !window.confirm('Reset all progress?')) return
    const base: PersistedGame = {
      categories: createInitialCategories(),
      currentStreak: 0,
      lastActiveDate: null,
      totalTasksCompleted: 0,
      unlockedAchievementIds: [],
    }
    const u = recomputeUnlockedIds(
      {
        categories: base.categories,
        currentStreak: base.currentStreak,
        totalTasksCompleted: base.totalTasksCompleted,
      },
      []
    )
    const g = { ...base, unlockedAchievementIds: u }
    setGame(g)
    saveGame(g)
    prevChar.current = 1
  }, [])

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-16">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0f]/85 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
              <Sword className="w-5 h-5" aria-hidden />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-100">
                Life<span className="text-cyan-400">Forge</span>
              </h1>
              <p className="text-[11px] text-slate-500">Skyrim-style life progression</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm">
            <div className="px-2.5 py-1.5 rounded-lg border border-slate-800/80 bg-slate-900/50">
              <div className="text-[10px] text-slate-500 uppercase">Character</div>
              <div className="font-mono text-cyan-200">
                Lv. {charLevel} <span className="text-slate-500 text-xs">{charTitle}</span>
              </div>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg border border-slate-800/80 bg-slate-900/50">
              <div className="text-[10px] text-slate-500 uppercase">Total XP</div>
              <div className="font-mono text-amber-200/90 tabular-nums">
                {totalXp.toLocaleString()}
              </div>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg border border-orange-500/20 bg-orange-500/5 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <div>
                <div className="text-[10px] text-slate-500">Streak</div>
                <div className="text-orange-200 font-medium">{game.currentStreak}d</div>
                <div className="text-[9px] text-slate-600 max-w-[120px] leading-tight">
                  {getStreakMultiplierText(game.currentStreak)}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={reset}
              className="p-2 rounded-lg text-slate-500 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent"
              title="Reset progress"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        <section className="text-center sm:text-left">
          <p className="text-slate-400 text-sm max-w-2xl">
            Complete daily quests, earn multipliers from your streak, and level each skill. Progress is
            saved in this browser via{' '}
            <code className="text-cyan-200/80 text-xs">localStorage</code>. Today is{' '}
            {format(new Date(), 'EEE, MMM d')}.
          </p>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LIFE_CATEGORY_ORDER.map((id) => {
            const c = game.categories.find((x) => x.id === id)
            if (!c) return null
            return <SkillCard key={id} category={c} onToggleTask={onToggle} onAddTask={onAdd} />
          })}
        </div>

        <section className="space-y-3">
          <button
            type="button"
            onClick={() => setShowAchieve((s) => !s)}
            className="flex items-center gap-2 text-slate-200 font-medium"
          >
            <Trophy className="w-5 h-5 text-amber-400" />
            Achievements
            <span className="text-xs font-normal text-slate-500">
              {unlockedN} / {achievements.length} unlocked
            </span>
            <ChevronUp
              className={clsx('w-4 h-4 text-slate-500 transition', showAchieve && 'rotate-180')}
            />
          </button>
          <AnimatePresence>
            {showAchieve && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 overflow-hidden"
              >
                {achievements.map((a) => (
                  <div
                    key={a.id}
                    className={clsx(
                      'p-2.5 rounded-lg border text-xs',
                      a.unlocked ? RARITY[a.rarity] : 'text-slate-600 border-slate-800/50 opacity-60',
                      a.unlocked && 'opacity-100'
                    )}
                  >
                    <div className="flex gap-2">
                      <span className="text-lg">{a.icon}</span>
                      <div>
                        <div className="font-medium text-slate-200">{a.name}</div>
                        <p className="text-slate-500 mt-0.5 text-[11px] leading-relaxed">
                          {a.description}
                        </p>
                        {!a.unlocked && (
                          <p className="text-[10px] text-slate-600 mt-1">Locked</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <AnimatePresence>
        {achToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-6 right-4 left-4 sm:left-auto z-50"
          >
            <div className="mx-auto max-w-sm sm:max-w-sm rounded-lg border border-amber-500/30 bg-[#0f0f16]/95 backdrop-blur p-3 flex items-center gap-2 shadow-lg shadow-amber-500/10">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <p className="text-sm text-amber-100/95">
                Achievement unlocked: <span className="font-semibold">{achToast}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {charModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCharModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-sm w-full p-6 rounded-2xl border border-cyan-500/30 bg-slate-900/95 text-center"
            >
              <div className="text-4xl mb-2" aria-hidden>
                ⚔️
              </div>
              <h2 className="text-xl font-bold text-cyan-200">Level up</h2>
              <p className="text-slate-300 mt-2">You are now level {getCharacterLevel(totalXp)}.</p>
              <p className="text-sm text-slate-500 mt-1">{getLevelTitle(getCharacterLevel(totalXp))}</p>
              <button
                type="button"
                onClick={() => setCharModal(false)}
                className="mt-6 w-full py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-100"
              >
                Onward
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {addState.open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAddState((s) => ({ ...s, open: false }))}
          >
            <motion.div
              className="w-full sm:max-w-md border border-slate-700/80 sm:rounded-xl bg-[#0c0c12] p-4 sm:p-5 shadow-2xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg text-slate-100 font-medium">Add quest</h2>
                <button
                  type="button"
                  onClick={() => setAddState((s) => ({ ...s, open: false }))}
                  className="p-1 text-slate-500 hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <label className="block text-slate-500 text-xs uppercase">Category</label>
                <select
                  value={addState.categoryId}
                  onChange={(e) => setAddState((s) => ({ ...s, categoryId: e.target.value }))}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                >
                  {LIFE_CATEGORY_ORDER.map((id) => (
                    <option key={id} value={id}>
                      {CATEGORY_CONFIG[id].icon} {CATEGORY_CONFIG[id].name}
                    </option>
                  ))}
                </select>
                <label className="block text-slate-500 text-xs uppercase">Name</label>
                <input
                  value={addState.name}
                  onChange={(e) => setAddState((s) => ({ ...s, name: e.target.value }))}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  placeholder="What will you do?"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs text-slate-500">Difficulty</span>
                    <select
                      value={addState.difficulty}
                      onChange={(e) =>
                        setAddState((s) => ({ ...s, difficulty: e.target.value as TaskDifficulty }))
                      }
                      className="mt-1 w-full bg-slate-900/80 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200"
                    >
                      {(['easy', 'medium', 'hard', 'legendary'] as const).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500">Daily</span>
                    <label className="mt-2 flex items-center gap-2 text-slate-300 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addState.isDaily}
                        onChange={(e) =>
                          setAddState((s) => ({ ...s, isDaily: e.target.checked }))
                        }
                      />
                      Repeating daily quest
                    </label>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={submitAdd}
                  className="w-full py-2.5 mt-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-100 font-medium"
                >
                  Add
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
