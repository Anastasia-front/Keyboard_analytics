import type { Metadata } from 'next'
import { Karla, Outfit } from 'next/font/google'
import Link from 'next/link'

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
        <Link
          href="/"
          className="text-white
                    text-3xl
                    text-center
                    font-extrabold
                    uppercase
                    tracking-wide
                    px-6 py-3
                    shadow-md
                    bg-gradient-to-r from-cyan-700 to-blue-800
                    hover:shadow-lg
                    hover:scale-105
                    transition
                    duration-300
                    ease-in-out
                    font-sans 
                    flex 
                    justify-center 
                    pt-7 
                    mb-[-50px]
    "
        >
          Keyboard analytics
        </Link>
        {children}
      </body>
    </html>
  )
}
