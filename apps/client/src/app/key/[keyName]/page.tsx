import Link from 'next/link'

import { fetchKey, fetchStats } from '@/lib/api/stats'
import { notFound } from 'next/navigation'

type KeyPageProps = {
  keyName: string
  count: number
  prevKey?: string | null
  nextKey?: string | null
}

// // Pre-generate all keys pages for SSG
export const generateStaticParams = async () => {
  const allKeys = await fetchStats()
  return allKeys.map((item: { keyName: string }) => ({
    keyName: encodeURIComponent(item.keyName),
  }))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const KeyPage = async (props: any) => {
  const { params } = (await props) as { params: { keyName: string } }

  const decodedKey = decodeURIComponent(params.keyName)

  const data = await fetchKey(decodedKey)

  if (!data) {
    notFound()
  }

  const { keyName, count, prevKey, nextKey }: KeyPageProps = data

  return (
    <div className="p-35">
      <h1 className="text-2xl font-bold mb-2">Key: {keyName}</h1>
      <p className="mb-4">Press count: {count}</p>
      <div className="flex gap-4">
        {prevKey && (
          <Link
            href={`/key/${encodeURIComponent(prevKey)}`}
            className="text-cyan-600 hover:underline"
          >
            ⬅ Back
          </Link>
        )}
        {nextKey && (
          <Link
            href={`/key/${encodeURIComponent(nextKey)}`}
            className="text-cyan-600 hover:underline"
          >
            Forward ➡
          </Link>
        )}
      </div>
    </div>
  )
}

export default KeyPage
