import { LoginButtons } from '@/components/LoginButtons'

const LoginPage = () => (
  <main className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-6 text-white">WELCOME BACK 👋🏻</h1>
      <p className="text-gray-100 mb-8">
        Sign in to continue to your account ⬇️
      </p>
      <LoginButtons />
    </div>
  </main>
)

export default LoginPage
