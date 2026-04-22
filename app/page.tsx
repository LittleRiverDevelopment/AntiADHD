'use client'

import dynamic from 'next/dynamic'

const Dashboard = dynamic(() => import('@/components/Dashboard'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-forge-bg">
      <div className="text-center">
        <div className="relative w-20 h-20 flex items-center justify-center mx-auto">
          <div className="w-20 h-20 border-4 border-forge-border rounded-full border-t-cyan-400 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-3xl" aria-hidden>⚔️</div>
        </div>
        <p className="mt-4 text-forge-text-secondary font-display">Loading LifeForge...</p>
      </div>
    </div>
  ),
})

export default function Home() {
  return <Dashboard />
}
