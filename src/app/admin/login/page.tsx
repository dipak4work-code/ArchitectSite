'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Eye, EyeOff, Loader2, Lock, User } from 'lucide-react'

export default function AdminLogin() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        router.push('/admin')
        router.refresh()
      } else {
        setError(data.error || 'Invalid credentials')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0E0E0E' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(201,162,80,0.06) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(201,162,80,0.04) 0%, transparent 50%)'
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(201,162,80,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,80,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 shadow-xl"
            style={{ background: 'linear-gradient(135deg, #E8C97A, #9A7835)' }}>
            <Building2 className="h-8 w-8 text-[#141414]" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Panel</h1>
          <p className="text-white/35 text-sm mt-1.5">Shreeji Associate · Secure Access</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/8 p-8 shadow-2xl" style={{ background: '#1A1A1A' }}>
          <h2 className="text-lg font-semibold text-white mb-6">Sign in to continue</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-white/50 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  disabled={loading}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/20 transition-all outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.10)',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#C9A250'; e.target.style.background = 'rgba(201,162,80,0.06)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)'; e.target.style.background = 'rgba(255,255,255,0.06)' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white/50 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  disabled={loading}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm text-white placeholder-white/20 transition-all outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.10)',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#C9A250'; e.target.style.background = 'rgba(201,162,80,0.06)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)'; e.target.style.background = 'rgba(255,255,255,0.06)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-400 border border-red-500/20" style={{ background: 'rgba(239,68,68,0.08)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all"
              style={{
                background: 'linear-gradient(135deg, #E8C97A, #C9A250)',
                color: '#141414',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-white/20 mt-6">
          Protected area · Shreeji Associate Admin
        </p>
      </div>
    </div>
  )
}
