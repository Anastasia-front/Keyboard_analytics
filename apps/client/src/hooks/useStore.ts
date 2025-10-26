import { useMemo } from 'react'

import { StatsStore, initializeStore } from '@/stores/stats.store'

export const useStore = (initialData?: StatsStore['stats']) => {
  return useMemo(() => initializeStore(initialData), [initialData])
}
