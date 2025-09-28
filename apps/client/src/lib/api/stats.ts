const API_URL = process.env.NEXT_PUBLIC_BACK_API_URL || 'http://localhost:4000'

export const fetchStats = async () => {
  const res = await fetch(`${API_URL}/counter`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch stats: ${res.status}`)
  return res.json()
}

export const fetchKey = async (key: string) => {
  const res = await fetch(`${API_URL}/counter/${key}`, {
    next: { revalidate: 30 }, // ISR(Incremental Static Regeneration) every 30 seconds
  })
  if (!res.ok) throw new Error(`Failed to fetch stats: ${res.status}`)
  return res.json()
}

export const deleteKey = async (key: string) => {
  const res = await fetch(`${API_URL}/counter/${key}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`Failed to send key press: ${res.status}`)
  return res.json()
}
