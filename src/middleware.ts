import { NextRequest, NextResponse } from 'next/server'

const COOKIE = 'admin_auth'

async function expectedToken(): Promise<string> {
  const u = process.env.ADMIN_USERNAME || 'admin'
  const p = process.env.ADMIN_PASSWORD || 'admin123'
  const s = process.env.SESSION_SECRET || 'architect-studio-auth-secret-2024'
  const data = new TextEncoder().encode(`${u}:${p}:${s}`)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const cookie = request.cookies.get(COOKIE)?.value
    const token = await expectedToken()

    if (!cookie || cookie !== token) {
      const url = new URL('/admin/login', request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
