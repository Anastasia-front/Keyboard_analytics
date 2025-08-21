import { makeAutoObservable } from 'mobx'

export interface KeyStat {
  keyName: string
  count: number
  prevKey?: string | null
  nextKey?: string | null
}

export function createStatsStore(initialData: KeyStat[] = []) {
  return makeAutoObservable({
    stats: initialData,

    setStats(newStats: KeyStat[]) {
      this.stats = newStats
    },

    updateKeyCount(
      keyName: string,
      count: number,
      prevKey?: string | null,
      nextKey?: string | null,
    ) {
      const existing = this.stats.find((s) => s.keyName === keyName)
      if (existing) {
        existing.count = count
        existing.prevKey = prevKey
        existing.nextKey = nextKey
      } else {
        this.stats.push({ keyName, count, prevKey, nextKey })
      }
      this.stats.sort((a, b) => b.count - a.count)
    },
  })
}

export class StatsStore {
  stats: KeyStat[] = []

  constructor(initialData: KeyStat[] = []) {
    makeAutoObservable(this)
    this.stats = initialData
  }

  setStats(newStats: KeyStat[]) {
    this.stats = newStats
  }

  updateKeyCount(
    keyName: string,
    count: number,
    prevKey?: string | null,
    nextKey?: string | null,
  ) {
    const existing = this.stats.find((s) => s.keyName === keyName)
    if (existing) {
      existing.count = count
      existing.prevKey = prevKey
      existing.nextKey = nextKey
    } else {
      this.stats.push({ keyName, count, prevKey, nextKey })
    }
    this.stats.sort((a, b) => b.count - a.count)
  }
}

// Singleton for client-side
let store: StatsStore | undefined

export const initializeStore = (initialData?: KeyStat[]) => {
  const _store = store ?? new StatsStore(initialData ?? [])

  if (typeof window !== 'undefined' && !store) {
    store = _store
  }

  return _store
}
