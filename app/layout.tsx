import type { Metadata, Viewport } from 'next'
import './globals.css'

const base = process.env.SITE_BASE_PATH || ''

export const metadata: Metadata = {
  title: 'Sharp Edge | Sports Betting Analytics',
  description:
    'Find edges in sports betting lines. Line discrepancies, +EV bets, and player prop analysis.',
}

export const viewport: Viewport = {
  themeColor: '#0a0b0f',
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
