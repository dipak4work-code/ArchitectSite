'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Image,
  FileText,
  MessageSquare,
  Users,
  Settings,
  Menu,
  X,
  Building2,
  ChevronRight,
  Calculator,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Portfolio', href: '/admin/portfolio', icon: Image },
  { name: 'Blog', href: '/admin/blog', icon: FileText },
  { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { name: 'Messages', href: '/admin/messages', icon: Users },
  { name: 'Quotation', href: '/admin/quotation', icon: Calculator },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminNavigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar -- always fixed, never static */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 flex flex-col
        bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800
        shadow-2xl transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700/50 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-sm leading-none">Admin Panel</span>
              <span className="block text-slate-400 text-xs mt-0.5">Shreeji Associate</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
          <p className="px-3 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Main Menu
          </p>
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-400 hover:bg-slate-700/60 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`h-4.5 w-4.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} style={{ width: '1.125rem', height: '1.125rem' }} />
                  {item.name}
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-indigo-200" />}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-slate-700/50">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-700/60 hover:text-white transition-all duration-200"
          >
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-300">SA</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-slate-300 truncate">Back to Website</div>
              <div className="text-xs text-slate-500">View live site →</div>
            </div>
          </Link>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 bg-slate-900 p-2 rounded-xl shadow-lg text-slate-300 hover:text-white transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>
    </>
  )
}
