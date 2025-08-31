import Link from 'next/link'

import { fetchKey/* , fetchStats */ } from '@/lib/api/stats'

type KeyPageProps = {
  keyName: string
  count: number
  prevKey?: string | null
  nextKey?: string | null
}

// // Pre-generate all keys pages for SSG
// export const generateStaticParams = async () => {
//   const allKeys = await fetchStats()
//   return allKeys.map((item: { keyName: string }) => ({
//     keyName: item.keyName,
//   }))
// }

const KeyPage = async ({ params }: { params: Promise<{ key: string }> }) => {
  const { key } = await params
  try {
    const { keyName, count, prevKey, nextKey }: KeyPageProps =
      await fetchKey(key)

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
    return <p>{`Error fetching key, ${key} with error ${error}`}</p>
  }
}

export default KeyPage
