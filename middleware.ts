import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAuthenticated = !!token
  
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isAuthRoute = req.nextUrl.pathname.startsWith('/login') || 
                      req.nextUrl.pathname.startsWith('/register')

  console.log('Middleware token:', JSON.stringify(token, null, 2))
  
  // Redirect unauthenticated users to login
  if (!isAuthenticated && !isAuthRoute) {
    console.log('Redirecting unauthenticated user to login')
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  // The role might be stored as string or enum, check both possibilities
  const isAdmin = token?.role === 'ADMIN' || token?.role === 'admin'
  
  // Redirect admin users to admin dashboard
  if (isAuthenticated && isAdmin && !isAdminRoute && !isAuthRoute) {
    console.log('Redirecting admin to admin dashboard')
    return NextResponse.redirect(new URL('/admin', req.url))
  }
  
  // Prevent non-admin users from accessing admin routes
  if (isAuthenticated && !isAdmin && isAdminRoute) {
    console.log('Preventing non-admin from accessing admin routes')
    return NextResponse.redirect(new URL('/', req.url))
  }
  
  // Prevent authenticated users from accessing auth routes
  if (isAuthenticated && isAuthRoute) {
    console.log('Preventing authenticated user from accessing auth routes')
    return NextResponse.redirect(new URL('/', req.url))
  }

  console.log('Middleware allowing request to proceed')
  return NextResponse.next()
}