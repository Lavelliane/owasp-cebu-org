import type { Metadata } from 'next'
import AuthForm from '../components/auth-form'

export const metadata: Metadata = {
  title: 'Register | OWASP Cebu',
  description: 'Create an OWASP Cebu account',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-md">
        <AuthForm mode="register" />
      </div>
    </div>
  )
} 