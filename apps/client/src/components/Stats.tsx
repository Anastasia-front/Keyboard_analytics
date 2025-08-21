'use client'

import Link from 'next/link'

import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'

import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts'

import { useStore, useWebSocket } from '@/hooks'
import { KeyStat } from '@/stores'
import { handleDelete } from '@/utils'

interface StatsProps {
  initialStats: KeyStat[]
}

export const Stats = observer(({ initialStats }: StatsProps) => {
  const store = useStore(initialStats)
  useWebSocket(store)

  // Convert to plain JS
  const statsArray = toJS(store.stats).map((item) => ({
    ...item,
    key: item.keyName === ' ' ? 'space' : item.keyName, // normalize space
  }))

  return (
    <div className="p-10">
      <BarChart
        layout="vertical"
        width={600}
        height={400}
        data={statsArray}
        className="w-5xl mt-5 mx-auto outline-hidden"
      >
        <XAxis type="number" />
        <YAxis type="category" dataKey="key" />
        <Tooltip
          formatter={(value, _name, props) => [value, props.payload.key]}
          labelFormatter={() => 'Key'}
        />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>

      <table className="w-5xl mt-5 mx-auto border-collapse">
        <thead>
          <tr className="border-b border-gray-100 text-left">
            <th className="pb-2">Key</th>
            <th className="pb-2">Presses</th>
            <th className="pb-2">Link</th>
          </tr>
        </thead>
        <tbody>
          {statsArray.map(({ keyName, count }) => (
            <tr key={keyName} className="border-b-[0.1px] border-lightgray-100">
              <td className="py-2">{keyName}</td>
              <td className="py-2">{count}</td>
              <td className="py-2">
                <Link
                  href={`/key/${encodeURIComponent(keyName)}`}
                  className="text-cyan-600 hover:underline"
                >
                  {`/key/${keyName}`}
                </Link>
              </td>
              <td className="py-2">
                <button
                  onClick={() => handleDelete(store, keyName)}
                  className="px-3 py-1 bg-cyan-700 text-white rounded hover:bg-cyan-800 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})
