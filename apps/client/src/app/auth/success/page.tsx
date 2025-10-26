'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { authStore } from '@/stores'

const AuthSuccess = () => {
  const router = useRouter()

  useEffect(() => {
    authStore.loadMe().then(() => {
      router.replace('/')
    })
  }, [router])

  return <p className="p-8">Signing you in…</p>
}

export default AuthSuccess
