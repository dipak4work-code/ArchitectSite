import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const adminUser = process.env.ADMIN_USERNAME || 'admin'
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123'
    const secret = process.env.SESSION_SECRET || 'architect-studio-auth-secret-2024'

    if (username !== adminUser || password !== adminPass) {
      return NextResponse.json({ success: false, error: 'Invalid username or password' }, { status: 401 })
    }

    const token = crypto
      .createHash('sha256')
      .update(`${username}:${password}:${secret}`)
      .digest('hex')

    const res = NextResponse.json({ success: true })
    res.cookies.set('admin_auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    return res
  } catch {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
