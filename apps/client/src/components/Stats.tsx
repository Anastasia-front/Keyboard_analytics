'use client'

import Link from 'next/link'

import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'

import { Bar, BarChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts'

import { useStore, useWebSocket } from '@/hooks'
import { KeyStat } from '@/stores'
import { handleDelete } from '@/utils'

interface StatsProps {
  initialStats: KeyStat[]
}

export const Stats = observer(({ initialStats }: StatsProps) => {
  const store = useStore(initialStats)
  useWebSocket(store)

  const statsArray = toJS(store.stats).map((item) => ({
    ...item,
    key: item.keyName,
  }))

  return (
    <div className="p-5 pt-20 sm:p-10 md:p-20 lg:p-30">
      <div className="w-full h-[300px] md:h-[400px] m-auto">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={statsArray}>
            <XAxis type="number" />
            <YAxis type="category" dataKey="key" width={40} />
            <Tooltip
              formatter={(value, _name, props) => [value, props.payload.key]}
              labelFormatter={() => 'Key'}
            />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="overflow-x-auto mt-15">
        <table className="m-auto min-w-full border-collapse text-sm md:text-base">
          <thead>
            <tr className="border-b border-gray-100 text-left text-wrap">
              <th className="pb-2">Key</th>
              <th className="pb-2">Presses</th>
              <th className="pb-2">Link</th>
              <th className="pb-2">Number</th>
              <th className="pb-2">Letter</th>
              <th className="pb-2">CapsLock</th>
              <th className="pb-2">Special</th>
              <th className="pb-2 text-right">Remove</th>
            </tr>
          </thead>
          <tbody>
            {statsArray.map(({ keyName, count }) => {
              const isNumber = /^[0-9]$/.test(keyName)
              const isLetter = /^[a-zA-Z]$/.test(keyName)
              const isUpperCase = /^[A-Z]$/.test(keyName)
              const isSpecialChar = /[^a-zA-Z0-9]/.test(keyName) || keyName === 'Space'

              const renderCheck = (condition: boolean) => (condition ? '✔️' : '✖️')

              return (
                <tr key={keyName} className="border-b border-gray-100">
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
                  <td className="py-2">{renderCheck(isNumber)}</td>
                  <td className="py-2">{renderCheck(isLetter)}</td>
                  <td className="py-2">{renderCheck(isUpperCase)}</td>
                  <td className="py-2">{renderCheck(isSpecialChar)}</td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => handleDelete(store, keyName)}
                      className="px-3 py-1 bg-cyan-700 text-white rounded hover:bg-cyan-800 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
})
