import { StatsStore, initializeStore } from '@/stores/statsStore'
import { useMemo } from 'react'

export function useStore(initialData?: StatsStore['stats']) {
  return useMemo(() => initializeStore(initialData), [initialData])
}
