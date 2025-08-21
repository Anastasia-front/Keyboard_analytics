import Link from 'next/link'

import { fetchKey, fetchStats } from '@/lib/api/stats'

type KeyPageProps = {
  keyName: string
  count: number
  prevKey?: string | null
  nextKey?: string | null
}

// Pre-generate all keys pages for SSG
export async function generateStaticParams() {
  const allKeys = await fetchStats()
  return allKeys.map((item: { keyName: string }) => ({
    keyName: item.keyName,
  }))
}

interface PageParams {
  params: {
    keyName: string
  }
}

export default async function KeyPage({ params }: PageParams) {
  try {
    const { keyName, count, prevKey, nextKey }: KeyPageProps = await fetchKey(
      params.keyName,
    )

    return (
      <div className="p-35">
        <h1 className="text-2xl font-bold mb-2">Key: {keyName}</h1>
        <p className="mb-4">Press count: {count}</p>
        <div className="flex gap-4">
          {prevKey && (
            <Link
              href={`/key/${prevKey}`}
              className="text-cyan-600 hover:underline"
            >
              ⬅ Back
            </Link>
          )}
          {nextKey && (
            <Link
              href={`/key/${nextKey}`}
              className="text-cyan-600 hover:underline"
            >
              Forward ➡
            </Link>
          )}
        </div>
      </div>
    )
  } catch (error) {
    return <p>{`Error fetching key, ${params.keyName} with error ${error}`}</p>
  }
}
