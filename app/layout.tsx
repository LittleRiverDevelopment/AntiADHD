import type { Metadata, Viewport } from 'next'
import './globals.css'

const base = process.env.SITE_BASE_PATH || ''

export const metadata: Metadata = {
  title: 'LifeForge Tracker | Skyrim-style life progression',
  description:
    'Gamified life stats: 6 skills, daily quests, XP & streaks, 30+ achievements. Progress saved locally.',
}

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={`${base}/favicon.svg`} type="image/svg+xml" />
        <link rel="manifest" href={`${base}/manifest.json`} />
      </head>
      <body className="antialiased">
        <div className="grid-bg min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
