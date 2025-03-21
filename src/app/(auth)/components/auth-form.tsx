'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import * as Form from '@radix-ui/react-form'
import * as Label from '@radix-ui/react-label'
import { isStrongPassword } from '@/lib/auth/utils'

// Define Zod schemas for validation
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
})

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .refine(
      (password) => isStrongPassword(password),
      'Password must include uppercase, lowercase, number, and symbol'
    )
})

// Define form data types based on schemas
type LoginFormData = z.infer<typeof loginSchema>
type RegisterFormData = z.infer<typeof registerSchema>

interface AuthFormProps {
  mode: 'login' | 'register'
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  return (
    <div className="w-full max-w-md mx-auto bg-black p-8 rounded-lg border border-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {mode === 'login' ? 'Sign In to Your Account' : 'Create an Account'}
      </h2>
      
      {generalError && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded text-red-300 text-sm">
          {generalError}
        </div>
      )}
      
      {mode === 'login' ? (
        <LoginForm 
          setError={setGeneralError} 
          isLoading={isLoading} 
          setIsLoading={setIsLoading} 
          router={router} 
        />
      ) : (
        <RegisterForm 
          setError={setGeneralError} 
          isLoading={isLoading} 
          setIsLoading={setIsLoading} 
          router={router} 
        />
      )}
      
      <div className="mt-6 text-center text-sm">
        {mode === 'login' ? (
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-white hover:underline">
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-white hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}

// Login form component
function LoginForm({ 
  setError, 
  isLoading, 
  setIsLoading, 
  router 
}: { 
  setError: (error: string) => void, 
  isLoading: boolean, 
  setIsLoading: (loading: boolean) => void, 
  router: ReturnType<typeof useRouter>
}) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    setError('')
    setIsLoading(true)
    
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      })
      
      if (result?.error) {
        throw new Error(result.error)
      }
      
      router.push('/')
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form.Root className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label.Root className="block text-sm font-medium" htmlFor="email">
          Email
        </Label.Root>
        <Form.Field className="space-y-1" name="email">
          <Form.Control asChild>
            <input
              id="email"
              className={`w-full p-2 bg-black border ${
                errors.email ? 'border-red-500' : 'border-gray-700'
              } rounded-md focus:outline-none focus:ring-1 focus:ring-white`}
              type="email"
              disabled={isLoading}
              {...register('email')}
            />
          </Form.Control>
          {errors.email && (
            <Form.Message className="text-sm text-red-500">
              {errors.email.message}
            </Form.Message>
          )}
        </Form.Field>
      </div>
      
      <div className="space-y-2">
        <Label.Root className="block text-sm font-medium" htmlFor="password">
          Password
        </Label.Root>
        <Form.Field className="space-y-1" name="password">
          <Form.Control asChild>
            <input
              id="password"
              className={`w-full p-2 bg-black border ${
                errors.password ? 'border-red-500' : 'border-gray-700'
              } rounded-md focus:outline-none focus:ring-1 focus:ring-white`}
              type="password"
              disabled={isLoading}
              {...register('password')}
            />
          </Form.Control>
          {errors.password && (
            <Form.Message className="text-sm text-red-500">
              {errors.password.message}
            </Form.Message>
          )}
        </Form.Field>
      </div>
      
      <Form.Submit asChild>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-white text-black py-2 px-4 rounded-md font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition mt-6"
        >
          {isLoading ? 'Processing...' : 'Sign In'}
        </button>
      </Form.Submit>
    </Form.Root>
  )
}

// Register form component
function RegisterForm({ 
  setError, 
  isLoading, 
  setIsLoading, 
  router 
}: { 
  setError: (error: string) => void, 
  isLoading: boolean, 
  setIsLoading: (loading: boolean) => void, 
  router: ReturnType<typeof useRouter>
}) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: RegisterFormData) => {
    setError('')
    setIsLoading(true)
    
    try {
      // Register the user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.message || 'Registration failed')
      }
      
      // Automatically sign in after registration
      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      })
      
      if (signInResult?.error) {
        throw new Error(signInResult.error)
      }
      
      router.push('/')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form.Root className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label.Root className="block text-sm font-medium" htmlFor="name">
          Name
        </Label.Root>
        <Form.Field className="space-y-1" name="name">
          <Form.Control asChild>
            <input
              id="name"
              className={`w-full p-2 bg-black border ${
                errors.name ? 'border-red-500' : 'border-gray-700'
              } rounded-md focus:outline-none focus:ring-1 focus:ring-white`}
              type="text"
              disabled={isLoading}
              {...register('name')}
            />
          </Form.Control>
          {errors.name && (
            <Form.Message className="text-sm text-red-500">
              {errors.name.message}
            </Form.Message>
          )}
        </Form.Field>
      </div>
      
      <div className="space-y-2">
        <Label.Root className="block text-sm font-medium" htmlFor="register-email">
          Email
        </Label.Root>
        <Form.Field className="space-y-1" name="email">
          <Form.Control asChild>
            <input
              id="register-email"
              className={`w-full p-2 bg-black border ${
                errors.email ? 'border-red-500' : 'border-gray-700'
              } rounded-md focus:outline-none focus:ring-1 focus:ring-white`}
              type="email"
              disabled={isLoading}
              {...register('email')}
            />
          </Form.Control>
          {errors.email && (
            <Form.Message className="text-sm text-red-500">
              {errors.email.message}
            </Form.Message>
          )}
        </Form.Field>
      </div>
      
      <div className="space-y-2">
        <Label.Root className="block text-sm font-medium" htmlFor="register-password">
          Password
        </Label.Root>
        <Form.Field className="space-y-1" name="password">
          <Form.Control asChild>
            <input
              id="register-password"
              className={`w-full p-2 bg-black border ${
                errors.password ? 'border-red-500' : 'border-gray-700'
              } rounded-md focus:outline-none focus:ring-1 focus:ring-white`}
              type="password"
              disabled={isLoading}
              {...register('password')}
            />
          </Form.Control>
          {errors.password && (
            <Form.Message className="text-sm text-red-500">
              {errors.password.message}
            </Form.Message>
          )}
        </Form.Field>
      </div>
      
      <Form.Submit asChild>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-white text-black py-2 px-4 rounded-md font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition mt-6"
        >
          {isLoading ? 'Processing...' : 'Sign Up'}
        </button>
      </Form.Submit>
    </Form.Root>
  )
} 