'use client'

import { makeAutoObservable, runInAction } from 'mobx'

export interface Me {
  id: string
  email: string | null
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
  createdAt: string
}

class AuthStore {
  me: Me | null = null
  loading = false

  constructor() {
    makeAutoObservable(this)
  }

  async loadMe() {
    this.loading = true
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_API_URL}/auth/me`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        runInAction(() => (this.me = data))
      } else {
        runInAction(() => (this.me = null))
      }
    } finally {
      runInAction(() => (this.loading = false))
    }
  }

  async logout() {
    await fetch(`${process.env.NEXT_PUBLIC_BACK_API_URL}/auth/logout`, {
      credentials: 'include',
    })
    this.me = null
  }
}

export const authStore = new AuthStore()
