'use client'

import { useEffect } from 'react'

import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'

import { Stats } from '@/components/Stats'
import { fetchStats } from '@/lib/api/stats'
import { initializeStore } from '@/stores'

const Page = observer(() => {
  const statsStore = initializeStore()

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchStats()
        statsStore.setStats(data)
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      }
    }
    loadStats()
  }, [statsStore])

  const statsArray = toJS(statsStore.stats)

  return (
    <div>
      <h1 className="invisible">Stats</h1>
      <Stats initialStats={statsArray} />
    </div>
  )
})

export default Page
