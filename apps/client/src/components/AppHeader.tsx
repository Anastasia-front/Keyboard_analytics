'use client'

import { useEffect } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { observer } from 'mobx-react-lite'

import { authStore } from '@/stores/auth.store'

export const AppHeader = observer(() => {
  useEffect(() => {
    authStore.loadMe()
  }, [])

  return (
    <header className="flex items-center mb-20 z-50 relative">
      <Link
        href="/"
        className="group
            text-white
            text-3xl
            text-center
            font-extrabold
            uppercase
            tracking-wide
            px-6 py-7
            w-full
            shadow-md
            bg-gradient-to-r from-cyan-700 to-blue-800
            hover:shadow-lg
            transition duration-300 ease-in-out
            font-sans 
            flex 
            justify-center 
            mb-[-50px]"
      >
        <span className="transition duration-300 ease-in-out group-hover:scale-105">
          Keyboard analytics
        </span>
      </Link>
      <div className="absolute right-10 top-10 z-1">
        {authStore.me && (
          <div className="flex items-center gap-2">
            {authStore.me.avatarUrl && (
              <Image
                src={authStore.me.avatarUrl}
                alt="avatar"
                className="w-7 h-7 rounded-full"
              />
            )}
            <span>{authStore.me.firstName || authStore.me.email}</span>
            <button
              onClick={() => authStore.logout()}
              className="px-6
              py-2
              rounded-2xl
              bg-gradient-to-r
              from-gray-400
              to-gray-500text-white
              font-medium
              shadow-md
              hover:shadow-lg
              hover:scale-105
              transition
              duration-300
              ease-in-out
              active:scale-95"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
})
