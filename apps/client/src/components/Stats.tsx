'use client'

import { useStore, useWebSocket } from '@/hooks'
import { authStore, KeyStat } from '@/stores'
import { handleDelete } from '@/utils'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import { useEffect } from 'react'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface StatsProps {
  initialStats: KeyStat[]
}

export const Stats = observer(({ initialStats }: StatsProps) => {
  const store = useStore(initialStats)
  useWebSocket(store)

  useEffect(() => {
    authStore.loadMe()
  }, [])

  const isLoggedIn = !!authStore.me

  const statsArray = toJS(store.stats).map((item) => ({
    ...item,
    key: item.keyName,
  }))

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Content wrapper (blurred when not logged in) */}
      <div
        className={`transition-all duration-300 ${
          !isLoggedIn ? 'blur-lg pointer-events-none select-none' : ''
        }`}
      >
        <div className="p-5 pt-20 sm:p-10 md:p-20 lg:p-30">
          <div className="w-full h-[300px] md:h-[400px] m-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={statsArray}>
                <XAxis type="number" />
                <YAxis type="category" dataKey="key" width={40} />
                <Tooltip
                  formatter={(value, _name, props) => [
                    value,
                    props.payload.key,
                  ]}
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
                  const isSpecialChar =
                    /[^a-zA-Z0-9]/.test(keyName) || keyName === 'Space'

                  const renderCheck = (condition: boolean) =>
                    condition ? '✔️' : '✖️'

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
      </div>

      {/* Overlay Login Button when not logged in */}
      {!isLoggedIn && (
        <div className="fixed inset-0 flex items-center justify-center">
          {/* content card */}
          <div className="backdrop-blur-xl bg-white/40 p-10 rounded-3xl shadow-lg max-w-md flex flex-col items-center justify-center">
            <h1 className="text-3xl font-semibold text-gray-800 mb-4 uppercase">
              Welcome back 👋🏼
            </h1>
            <p className="text-gray-800 mb-8">
              Please log in to access your personalized key stats
            </p>
            <Link
              href="/login"
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-medium shadow-md hover:shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
            >
              Go to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  )
})

{
  /* <div className="fixed inset-0 flex items-center justify-center bg-white/20 backdrop-blur-xs">
        <Link
            href="/login"
            className="px-6
            py-2
            rounded-2xl
            bg-gradient-to-r
            from-orange-500
            to-orange-400
            text-white
            font-medium
            shadow-md
            hover:shadow-lg
            transition duration-300 ease-in-out
            hover:scale-105
            active:scale-95"
          >
            Sign in
          </Link>
        </div>
      ) */
}
