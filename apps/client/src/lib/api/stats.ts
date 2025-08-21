const API_URL = process.env.NEXT_PUBLIC_BACK_API_URL || 'http://localhost:4000'

export async function fetchStats() {
  const res = await fetch(`${API_URL}/counter`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch stats: ${res.status}`)
  return res.json()
}

export async function fetchKey(key: string) {
  const res = await fetch(`${API_URL}/counter/${key}`, {
    next: { revalidate: 60 }, // ISR every 60 seconds
  })
  if (!res.ok) throw new Error(`Failed to fetch stats: ${res.status}`)
  return res.json()
}

export async function deleteKey(key: string) {
  const res = await fetch(`${API_URL}/counter/${key}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`Failed to send key press: ${res.status}`)
  return res.json()
}
