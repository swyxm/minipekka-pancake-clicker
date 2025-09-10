import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mini Pekka Pancake Clicker',
  description: 'A Clash Royale themed pancake clicker game featuring Mini Pekka!',
  keywords: 'clash royale, mini pekka, pancake, clicker, game, idle',
  authors: [{ name: 'Mini Pekka Pancake Clicker' }],
}

export const viewport = {
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
      <body className="clash-font min-h-screen bg-pekka-navy-dark">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
