'use client'

import { usePathname } from 'next/navigation'
import { AdminNavigation } from '@/components/admin/AdminNavigation'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavigation />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <AdminHeader />
        <main className="flex-1 py-8 px-6">{children}</main>
      </div>
    </div>
  )
}
