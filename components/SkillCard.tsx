'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { clsx } from 'clsx'
import type { Category, LifeTask, TaskDifficulty } from '@/lib/types'
import { CATEGORY_CONFIG, type LifeCategoryId } from '@/lib/life-categories'
import {
  getCategoryLevel,
  getCategoryLevelProgress,
  getLevelTitle,
} from '@/lib/xpCalculations'
import { XP_REWARDS } from '@/lib/types'

const DIF_LABEL: Record<TaskDifficulty, string> = {
  easy: 'Easy',
  medium: 'Med',
  hard: 'Hard',
  legendary: 'Leg+',
}

const DIF_CLS: Record<TaskDifficulty, string> = {
  easy: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  medium: 'bg-violet-500/15 text-violet-200 border-violet-500/30',
  hard: 'bg-amber-500/15 text-amber-200 border-amber-500/30',
  legendary: 'bg-rose-500/15 text-rose-200 border-rose-500/30',
}

type Props = {
  category: Category
  onToggleTask: (catId: string, taskId: string) => void
  onAddTask: (catId: string) => void
}

export default function SkillCard({ category, onToggleTask, onAddTask }: Props) {
  const cfg = CATEGORY_CONFIG[category.id as LifeCategoryId]
  const level = getCategoryLevel(category.xp)
  const pg = getCategoryLevelProgress(category.xp)
  const title = getLevelTitle(level)
  const color = cfg?.accent ?? '#22d3ee'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card overflow-hidden"
      style={{ borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <div
        className="p-4 border-b border-white/5 flex items-start justify-between gap-2"
        style={{ boxShadow: `inset 0 -1px 0 ${color}22` }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl shrink-0" aria-hidden>
            {cfg?.icon ?? '⭐️'}
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-100 leading-tight truncate">
              {category.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Level {level} · {title}</p>
          </div>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>XP in level</span>
            <span>
              {pg.currentLevelXp} / {pg.xpNeededForNextLevel} XP
            </span>
          </div>
          <div
            className="h-2.5 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pg.progressPercent}%`,
                background: `linear-gradient(90deg, ${color}99, ${color}dd)`,
                boxShadow: `0 0 12px ${color}55`,
              }}
            />
          </div>
        </div>
        <ul className="space-y-2 pt-1">
          {category.tasks.map((t) => (
            <li key={t.id}>
              <TaskRow task={t} onToggle={() => onToggleTask(category.id, t.id)} />
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => onAddTask(category.id)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm text-slate-500 hover:text-cyan-200 hover:bg-cyan-500/10 border border-dashed border-slate-700/80 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add quest
        </button>
      </div>
    </motion.div>
  )
}

function TaskRow({ task, onToggle }: { task: LifeTask; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full text-left group flex items-start gap-2 p-2 rounded-lg border border-slate-800/80 hover:border-cyan-500/25 hover:bg-cyan-500/5 transition-colors"
    >
      <span
        className={clsx(
          'mt-0.5 w-5 h-5 rounded border flex items-center justify-center text-[10px] font-bold shrink-0',
          task.completed
            ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-200'
            : 'border-slate-600 text-transparent group-hover:border-slate-500'
        )}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed ? '✓' : ''}
      </span>
      <span
        className={clsx(
          'text-sm flex-1 min-w-0',
          task.completed ? 'text-slate-500 line-through' : 'text-slate-200'
        )}
      >
        {task.name}
        {task.isDaily ? (
          <span className="ml-1.5 text-[10px] text-slate-600">Daily</span>
        ) : null}
      </span>
      <span
        className={clsx('text-[10px] px-1.5 py-0.5 rounded border shrink-0', DIF_CLS[task.difficulty])}
        title="Base XP (before streak)"
      >
        {DIF_LABEL[task.difficulty]} {XP_REWARDS[task.difficulty]} XP
      </span>
    </button>
  )
}
