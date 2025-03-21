import type { Metadata } from 'next'
import AuthForm from '../components/auth-form'

export const metadata: Metadata = {
  title: 'Login | OWASP Cebu',
  description: 'Sign in to your OWASP Cebu account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-md">
        <AuthForm mode="login" />
      </div>
    </div>
  )
} 