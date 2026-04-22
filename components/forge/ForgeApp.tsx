'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import { clsx } from 'clsx'
import {
  Check,
  ChevronDown,
  Coins,
  Flame,
  ListChecks,
  Plus,
  Settings,
  Sparkles,
  Target,
  Trash2,
  Trophy,
  Wand2,
  X,
} from 'lucide-react'
import {
  getCategoryLevelProgress,
  getCharacterLevel,
  getCharacterLevelProgress,
  getLevelTitle,
  calculateDailyProgress,
  formatXp,
} from '@/lib/xpCalculations'
import type { Achievement, AchievementRarity, ForgeCategory, ForgeGameState, ForgeTask } from '@/lib/types'
import {
  addQuest,
  completeTask,
  deleteTask,
  loadDemoState,
  loadForgeState,
  resetGame,
  saveForgeState,
  uncompleteTask,
} from '@/lib/forge-state'

const RARITY: Record<AchievementRarity, { bg: string; border: string; text: string }> = {
  common: { bg: 'rgba(148, 163, 184, 0.1)', border: '#94a3b8', text: '#94a3b8' },
  uncommon: { bg: 'rgba(0, 255, 136, 0.1)', border: '#00ff88', text: '#00ff88' },
  rare: { bg: 'rgba(0, 212, 255, 0.1)', border: '#00d4ff', text: '#00d4ff' },
  epic: { bg: 'rgba(168, 85, 247, 0.1)', border: '#a855f7', text: '#a855f7' },
  legendary: { bg: 'rgba(255, 215, 0, 0.1)', border: '#ffd700', text: '#ffd700' },
}

const N = {
  fitness: { g: 'from-emerald-400 to-green-500', shadow: 'shadow-[0_0_15px_rgba(52,211,153,0.5)]' },
  business: { g: 'from-cyan-400 to-blue-500', shadow: 'shadow-[0_0_15px_rgba(34,211,238,0.5)]' },
  relationships: { g: 'from-pink-400 to-rose-500', shadow: 'shadow-[0_0_15px_rgba(244,114,182,0.5)]' },
  learning: { g: 'from-violet-400 to-purple-500', shadow: 'shadow-[0_0_15px_rgba(167,139,250,0.5)]' },
  health: { g: 'from-teal-400 to-cyan-500', shadow: 'shadow-[0_0_15px_rgba(45,212,191,0.5)]' },
  personal: { g: 'from-orange-400 to-amber-500', shadow: 'shadow-[0_0_15px_rgba(251,146,60,0.5)]' },
}

const BORDER: Record<string, string> = {
  fitness: 'border-emerald-500/20 hover:shadow-[0_0_30px_rgba(52,211,153,0.2)]',
  business: 'border-cyan-500/20 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]',
  relationships: 'border-pink-500/20 hover:shadow-[0_0_30px_rgba(244,114,182,0.2)]',
  learning: 'border-purple-500/20 hover:shadow-[0_0_30px_rgba(167,139,250,0.2)]',
  health: 'border-teal-500/20 hover:shadow-[0_0_30px_rgba(45,212,191,0.2)]',
  personal: 'border-orange-500/20 hover:shadow-[0_0_30px_rgba(251,146,60,0.2)]',
}

function strMultN(s: number) {
  if (s >= 30) return 3
  if (s >= 14) return 2.5
  if (s >= 7) return 2
  if (s >= 3) return 1.5
  return 1
}

const DIF: Record<ForgeTask['difficulty'], string> = {
  easy: 'text-green-400 bg-green-400/10 border-green-400/30',
  medium: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
  hard: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  legendary: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
}

function Prog(p: { pct: number; h?: number; catId?: string }) {
  const c = p.catId && p.catId in N ? N[p.catId as keyof typeof N] : N.business
  return (
    <div
      className="w-full bg-forge-border/50 rounded-full overflow-hidden relative"
      style={{ height: p.h ?? 8 }}
    >
      <motion.div
        className={clsx('h-full rounded-full bg-gradient-to-r', c.g, c.shadow)}
        initial={false}
        animate={{ width: `${Math.min(100, p.pct)}%` }}
        transition={{ duration: 0.4 }}
      />
    </div>
  )
}

function streakM(s: number) {
  if (s >= 30) return '3x'
  if (s >= 14) return '2.5x'
  if (s >= 7) return '2x'
  if (s >= 3) return '1.5x'
  return '1x'
}

export default function ForgeApp() {
  const [g, setG] = useState<ForgeGameState | null>(null)
  const [load, setLoad] = useState(true)
  const [exp, setExp] = useState<string | null>(null)
  const [st, setSt] = useState(false)
  const [lvl, setLvl] = useState<{
    char?: boolean
    catId?: string
    p: number
    n: number
    a: Achievement[]
  } | null>(null)
  const [dim, setDim] = useState({ w: 0, h: 0 })

  useEffect(() => {
    setG(loadForgeState())
    setLoad(false)
  }, [])

  useEffect(() => {
    const w = () => setDim({ w: window.innerWidth, h: window.innerHeight })
    w()
    window.addEventListener('resize', w)
    return () => window.removeEventListener('resize', w)
  }, [])

  const persist = useCallback((n: ForgeGameState) => {
    setG(n)
    saveForgeState(n)
  }, [])

  const mult = g ? streakM(g.userStats.currentStreak) : '1x'

  const onDone = (c: string, id: string) => {
    if (!g) return
    const r = completeTask(g, c, id)
    if (!r) return
    persist(r.state)
    if (r.newUnlocks[0] && r.newUnlocks[0].name) setExp(`${r.newUnlocks[0].icon} ${r.newUnlocks[0].name}`)
    setTimeout(() => setExp(null), 4500)
    const charA = getCharacterLevel(r.state.userStats.totalXp)
    const cl = r.charBefore
    if (r.leveledCategory) {
      setLvl({
        char: false,
        catId: c,
        p: r.prevLevel,
        n: r.newLevel,
        a: r.newUnlocks,
      })
    } else if (charA > cl) {
      setLvl({ char: true, p: cl, n: charA, a: r.newUnlocks })
    }
  }

  const onUndo = (c: string, id: string) => {
    if (!g) return
    const n = uncompleteTask(g, c, id)
    if (n) persist(n)
  }

  if (load || !g) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <Sparkles className="w-8 h-8 text-forge-accent-cyan" />
        </motion.div>
      </div>
    )
  }

  const d = g.userStats
  const cprog = getCharacterLevelProgress(d.totalXp)
  const dp = calculateDailyProgress(g.categories)

  return (
    <div className="min-h-screen relative z-0">
      <div className="particles-bg" aria-hidden>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{ left: `${100 * Math.random()}%`, animationDuration: `${15 + 10 * Math.random()}s`, animationDelay: `${15 * Math.random()}s` }}
          />
        ))}
      </div>

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-forge-bg/80 border-b border-forge-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }} className="text-2xl" aria-hidden>
              ⚔️
            </motion.div>
            <div>
              <h1 className="font-display font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">LifeForge</h1>
              <p className="text-xs text-forge-text-muted -mt-0.5">Tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {d.currentStreak > 0 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-400 text-sm">
                <span>🔥</span>
                <span className="font-bold">{d.currentStreak}</span>
                {streakM(d.currentStreak) !== '1x' && <span className="text-xs">({streakM(d.currentStreak)}x)</span>}
              </motion.div>
            )}
            <button type="button" onClick={() => setSt(!st)} className="p-2 rounded-lg hover:bg-white/10">
              {st ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {st && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed top-16 right-4 z-50 w-64 glass-card border border-forge-border p-4"
          >
            <h3 className="font-semibold mb-3">Settings</h3>
            <div className="space-y-2 text-sm">
              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-forge-bg/50 hover:bg-forge-border"
                onClick={() => { persist(loadDemoState()); setSt(false) }}
              >
                <Wand2 className="w-4 h-4" />
                Load demo
              </button>
              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-400"
                onClick={() => { if (confirm('Reset?')) { persist(resetGame()) ; setSt(false) } }}
              >
                <Trash2 className="w-4 h-4" />
                Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card border border-forge-border p-6">
            <div className="flex flex-col md:flex-row gap-6 mb-4">
              <div className="flex gap-4">
                <div className="w-24 h-24 md:w-28 h-28 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center relative">
                  <span className="font-display text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-purple-400">{d.characterLevel}</span>
                </div>
                <div className="self-center text-center md:text-left">
                  <h2 className="font-display text-2xl font-bold">Character Level {d.characterLevel}</h2>
                  {d.currentStreak >= 7 && (
                    <span className="text-xs text-orange-400">🔥 {mult} streak bonus on quests</span>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-forge-text-secondary mb-3">Keep crushing daily quests to level up and unlock achievements!</p>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-forge-text-secondary">
                    <span className="text-cyan-400 font-mono font-bold">{formatXp(cprog.currentLevelXp)}</span>
                    <span> / {formatXp(cprog.xpNeededForNextLevel)} XP to {d.characterLevel + 1}</span>
                  </span>
                  <span className="text-forge-text-muted">{Math.round(cprog.progressPercent)}%</span>
                </div>
                <Prog pct={cprog.progressPercent} h={12} />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { Icon: Coins, l: 'Total XP', v: formatXp(d.totalXp), c: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                { Icon: Target, l: 'Daily', v: `${dp.completed}/${dp.total}`, c: 'text-cyan-400', bg: 'bg-cyan-400/10' },
                { Icon: Flame, l: 'Streak', v: `${d.currentStreak}d`, c: 'text-orange-400', bg: 'bg-orange-400/10', b: mult !== '1x' ? `${mult} XP` : undefined },
                { Icon: ListChecks, l: 'Tasks', v: d.totalTasksCompleted.toLocaleString(), c: 'text-purple-400', bg: 'bg-purple-400/10' },
              ].map((x) => (
                <div key={x.l} className={clsx('p-3 rounded-xl border border-white/5', x.bg)}>
                  <div className="flex items-center gap-1 mb-1 text-xs text-forge-text-muted">
                    <x.Icon className="w-3.5 h-3.5" />
                    {x.l}
                  </div>
                  <div className={clsx('font-display font-bold text-lg', x.c)}>{x.v} {x.b && <span className="text-xs text-orange-400 font-normal"> {x.b}</span>}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-forge-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="font-semibold">Today&apos;s progress</h3>
                <p className="text-sm text-forge-text-muted">Complete daily quests to maintain your streak</p>
              </div>
              <div className="text-2xl font-display font-bold text-cyan-400">{dp.percentage}%</div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <h2 className="font-display font-bold text-xl flex items-center gap-2">
                <span>⚡</span> Skill trees
              </h2>
              {g.categories.map((c) => (
                <Tree
                  key={c.id}
                  cat={c}
                  streak={d.currentStreak}
                  onDone={onDone}
                  onUndo={onUndo}
                  onAdd={(cid, t) => persist(addQuest(g, cid, t))}
                  onDel={(ci, id) => persist(deleteTask(g, ci, id))}
                />
              ))}
            </div>
            <div className="space-y-4">
              <Achs ach={g.achievements} />
              <div className="glass-card border border-forge-border p-5 text-forge-text-secondary text-sm italic">
                &ldquo;The only way to do great work is to love what you do.&rdquo;
                <p className="not-italic text-right text-forge-text-muted mt-2">— Steve Jobs</p>
              </div>
              <div className="glass-card border border-forge-border p-4 text-sm text-forge-text-muted space-y-2">
                <h3 className="text-forge-text-primary font-medium flex items-center gap-1"><Sparkles className="w-4 h-4 text-amber-400" /> Pro tips</h3>
                <p>· Complete dailies to build streaks and bonus XP.</p>
                <p>· 7+ day streak: 2× on multipliers (see quest XP).</p>
                <p>· Focus a category to level it faster.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {exp && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm glass-card border border-amber-500/30 p-3 text-sm">Achievement: {exp}</div>
      )}

      <footer className="border-t border-forge-border mt-8 py-6 text-center sm:flex sm:justify-between max-w-7xl mx-auto px-4 text-sm text-forge-text-muted">
        <p>LifeForge — level up your life, one quest at a time.</p>
        <p>Built with Next.js · Skyrim-inspired</p>
      </footer>

      <AnimatePresence>
        {lvl && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setLvl(null)}>
            {typeof window !== 'undefined' && dim.w > 0 && (
              <Confetti width={dim.w} height={dim.h} numberOfPieces={200} gravity={0.2} colors={['#00d4ff', '#00ff88', '#ffd700', '#a855f7', '#ff006e']} recycle={false} />
            )}
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative z-10 glass-card max-w-md w-full p-8 text-center border border-forge-border"
            >
              <h2 className="font-display text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">LEVEL UP!</h2>
              {lvl.char ? <p className="mt-2">Character {lvl.p} → {lvl.n}</p> : <p className="mt-2">Skill {lvl.p} → {lvl.n}</p>}
              {lvl.a[0] && <p className="text-forge-text-secondary text-sm mt-4">Also unlocked: {lvl.a[0].name}</p>}
              <button type="button" onClick={() => setLvl(null)} className="mt-6 w-full py-2 rounded-lg bg-cyan-500/20 text-cyan-200 border border-cyan-500/50">Continue</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Tree(p: { cat: ForgeCategory; streak: number; onDone: (c: string, t: string) => void; onUndo: (c: string, t: string) => void; onAdd: (c: string, t: { name: string; difficulty: ForgeTask['difficulty']; isDaily: boolean }) => void; onDel: (c: string, t: string) => void }) {
  const [open, setOpen] = useState(false)
  const [add, setAdd] = useState(false)
  const [n, setN] = useState('')
  const [d, setD] = useState<ForgeTask['difficulty']>('medium')
  const pgt = getCategoryLevelProgress(p.cat.xp)
  const t = p.cat
  return (
    <motion.div layout className={clsx('glass-card border', t.id in BORDER ? BORDER[t.id as keyof typeof BORDER] : 'border-slate-700/40')}>
      <button type="button" onClick={() => setOpen((o) => !o)} className="p-4 w-full text-left flex items-start justify-between">
        <div className="flex items-start gap-2">
          <span className="text-2xl">{t.icon}</span>
          <div>
            <h3 className="font-display font-bold">{t.name}</h3>
            <p className="text-forge-text-muted text-sm">{t.description}</p>
          </div>
        </div>
        <ChevronDown className={clsx('w-5 h-5 transition', open && 'rotate-180')} />
      </button>
      <div className="px-4 pb-3">
        <div className="text-xs text-forge-text-secondary mb-1">Level {t.level} · {getLevelTitle(t.level)}</div>
        <div className="text-xs text-forge-text-muted mb-1">
          {formatXp(pgt.currentLevelXp)}/{formatXp(pgt.xpNeededForNextLevel)} XP
        </div>
        <Prog pct={pgt.progressPercent} h={10} catId={t.id} />
        <p className="text-xs text-forge-text-secondary mt-2">Total: {formatXp(t.xp)} · Daily {t.tasks.filter((q) => q.isDaily).filter((q) => q.completed).length}/{t.tasks.filter((q) => q.isDaily).length}</p>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="border-t border-forge-border/50 p-3 space-y-1">
            <p className="text-forge-text-secondary text-sm font-medium mb-1">Daily</p>
            {t.tasks.filter((q) => q.isDaily).map((q) => (
              <TaskRow key={q.id} task={q} cat={t} streak={p.streak} onD={() => p.onDone(t.id, q.id)} onU={() => p.onUndo(t.id, q.id)} onX={() => p.onDel(t.id, q.id)} />
            ))}
            {t.tasks.some((q) => !q.isDaily) && (
              <>
                <p className="text-forge-text-secondary text-sm font-medium mt-2">Bonus</p>
                {t.tasks.filter((q) => !q.isDaily).map((q) => (
                  <TaskRow key={q.id} task={q} cat={t} streak={p.streak} onD={() => p.onDone(t.id, q.id)} onU={() => p.onUndo(t.id, q.id)} onX={() => p.onDel(t.id, q.id)} />
                ))}
              </>
            )}
            {add ? (
              <div className="flex flex-col gap-2 p-2 border border-forge-border rounded-lg mt-2">
                <input value={n} onChange={(e) => setN(e.target.value)} placeholder="Quest name" className="bg-forge-bg border border-forge-border rounded px-2 py-1 text-sm" />
                <div className="flex gap-2">
                  <select value={d} onChange={(e) => setD(e.target.value as ForgeTask['difficulty'])} className="bg-forge-bg border border-forge-border rounded px-2 py-1 text-sm">
                    {(['easy', 'medium', 'hard', 'legendary'] as const).map((x) => <option key={x}>{x}</option>)}
                  </select>
                  <button type="button" onClick={() => { if (n.trim()) { p.onAdd(t.id, { name: n.trim(), difficulty: d, isDaily: true }); setN(''); setAdd(false) } }} className="px-3 py-1 bg-cyan-500/30 text-cyan-200 rounded">Add</button>
                  <button type="button" onClick={() => setAdd(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setAdd(true)} className="w-full mt-2 border border-dashed border-forge-border py-2 text-forge-text-muted text-sm flex items-center justify-center gap-1 rounded-lg">
                <Plus className="w-4 h-4" />
                Add quest
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function TaskRow(p: { task: ForgeTask; cat: ForgeCategory; streak: number; onD: () => void; onU: () => void; onX: () => void }) {
  const b = strMultN(p.streak)
  const gained = Math.floor(p.task.xpReward * b)
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg border border-forge-border/60 bg-forge-card/40">
      <button
        type="button"
        onClick={() => (p.task.completed ? p.onU() : p.onD())}
        className={clsx('w-6 h-6 rounded border-2 flex items-center justify-center', p.task.completed ? 'bg-emerald-500 border-emerald-400' : 'border-forge-border')}
      >
        {p.task.completed && <Check className="w-4 h-4 text-slate-950" strokeWidth={3} />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={clsx('text-sm', p.task.completed && 'line-through text-forge-text-muted')}>{p.task.name}</p>
        <span className={clsx('text-[10px] border rounded px-1', DIF[p.task.difficulty])}>{p.task.difficulty}</span>
        <span className="ml-1 text-forge-text-secondary text-xs">
          +{gained} XP {b > 1 && <span className="text-forge-text-muted">(base {p.task.xpReward} ×{b})</span>}
        </span>
      </div>
      {p.task.id.includes('quest-') && (
        <button type="button" onClick={p.onX} className="p-1 text-forge-text-muted hover:text-rose-400">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

function Achs(p: { ach: Achievement[] }) {
  const [f, setF] = useState('all')
  const [o, setO] = useState(true)
  const d = p.ach.filter((a) => a.unlocked).length
  const m = p.ach.length
  const l = p.ach.filter((a) => {
    if (f === 'unlocked') return a.unlocked
    if (f === 'locked') return !a.unlocked
    if (['common', 'uncommon', 'rare', 'epic', 'legendary'].includes(f)) return a.rarity === f
    return true
  })
  return (
    <div className="glass-card border border-forge-border overflow-hidden">
      <button type="button" onClick={() => setO(!o)} className="p-4 w-full text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold">Achievements</h3>
            <span className="text-sm text-forge-text-muted">{d}/{m}</span>
          </div>
        </div>
        <div className="h-1.5 bg-forge-border/50 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: `${(d / m) * 100}%` }} />
        </div>
      </button>
      {o && (
        <div className="px-3 pb-3 text-xs max-h-72 overflow-y-auto">
          <div className="flex flex-wrap gap-1 mb-2">
            {['all', 'unlocked', 'locked', 'epic', 'rare'].map((x) => (
              <button type="button" key={x} onClick={() => setF(x)} className={clsx('px-2 py-0.5 rounded', f === x ? 'bg-cyan-500/30' : 'bg-forge-bg/50')}>{x}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {l.map((a) => (
              <div key={a.id} className={clsx('p-1.5 rounded text-center', !a.unlocked && 'opacity-45')}>
                <div className="w-10 h-10 mx-auto flex items-center justify-center rounded" style={a.unlocked ? { background: RARITY[a.rarity].bg, border: `1px solid ${RARITY[a.rarity].border}` } : {}}>
                  {a.unlocked ? a.icon : '🔒'}
                </div>
                <p className="font-medium line-clamp-1">{a.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
