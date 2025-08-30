'use client'

const GlobalError = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <h1 className="text-5xl font-bold mb-4">500</h1>
      <h2 className="text-2xl mb-4">Something went wrong ...</h2>
      <p className="mb-6 text-red-600">
        {error?.message || 'Unexpected error occurred ...'}
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Try Again
      </button>
    </div>
  )
}

export default GlobalError
