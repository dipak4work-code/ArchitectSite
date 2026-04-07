'use client'

import { Bell, Search, User, ChevronDown } from 'lucide-react'

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Search */}
        <div className="relative w-72 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search anything..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all placeholder-gray-400"
          />
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* Notifications */}
          <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200" />

          {/* User */}
          <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-semibold text-gray-800 leading-none">Admin</div>
              <div className="text-xs text-gray-500 mt-0.5">Administrator</div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors hidden md:block" />
          </button>
        </div>
      </div>
    </header>
  )
}
