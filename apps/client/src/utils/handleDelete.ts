import { StatsStore } from '@/stores'

export const handleDelete = async (store: StatsStore, key: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_API_URL}/counter/${encodeURIComponent(key)}`,
      {
        method: 'DELETE',
      },
    )
    if (!res.ok) throw new Error('Failed to delete key')

    store.setStats(store.stats.filter((s) => s.keyName !== key))
  } catch (err) {
    console.error(err)
    alert('Failed to delete key')
  }
}
