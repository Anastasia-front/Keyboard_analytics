import Link from 'next/link'

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-6">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  )
}

export default NotFoundPage
