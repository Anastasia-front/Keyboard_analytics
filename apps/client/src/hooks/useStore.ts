import { useMemo } from 'react'

import { StatsStore, initializeStore } from '@/stores/statsStore'

export const useStore = (initialData?: StatsStore['stats']) => {
  return useMemo(() => initializeStore(initialData), [initialData])
}
