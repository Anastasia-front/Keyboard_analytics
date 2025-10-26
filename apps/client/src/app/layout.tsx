import type { Metadata } from 'next'
import { Karla, Outfit } from 'next/font/google'

import { AppHeader } from '@/components/AppHeader'

import './globals.css'

const karla = Karla({
  variable: '--font-karla',
  subsets: ['latin'],
})

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Keyboard analytics',
  description:
    'CLIENT: Next.js + TypeScript + MobX; SERVER: NestJS + TypeORM  + PostgreSQL; CONTAINERIZATION: Docker; API: WebSocket API',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${karla.variable} ${outfit.variable} antialiased`}>
        <AppHeader />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
