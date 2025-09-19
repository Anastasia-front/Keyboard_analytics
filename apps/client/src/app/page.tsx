'use client'

import { useEffect, useState } from 'react'

import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'

import { Stats } from '@/components/Stats'
import { fetchStats } from '@/lib/api/stats'
import { initializeStore } from '@/stores'

const Page = observer(() => {
  const statsStore = initializeStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchStats()
        statsStore.setStats(data)
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [statsStore])

  const statsArray = toJS(statsStore.stats)

if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-lg text-gray-600">Loading stats, please wait…</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="invisible">Stats</h1>
      <Stats initialStats={statsArray} />
    </div>
  )
})

export default Page
