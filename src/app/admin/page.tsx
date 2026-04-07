'use client'

import { FileText, Image, MessageSquare, TrendingUp, Users, ArrowUpRight, Activity } from 'lucide-react'

const stats = [
  {
    title: 'Total Projects',
    value: '24',
    change: '+12%',
    icon: Image,
    gradient: 'from-indigo-500 to-indigo-600',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600'
  },
  {
    title: 'Blog Posts',
    value: '18',
    change: '+8%',
    icon: FileText,
    gradient: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600'
  },
  {
    title: 'Testimonials',
    value: '12',
    change: '+4%',
    icon: MessageSquare,
    gradient: 'from-violet-500 to-violet-600',
    bg: 'bg-violet-50',
    text: 'text-violet-600'
  },
  {
    title: 'Page Views',
    value: '2,847',
    change: '+23%',
    icon: TrendingUp,
    gradient: 'from-amber-500 to-amber-600',
    bg: 'bg-amber-50',
    text: 'text-amber-600'
  }
]

const recentActivity = [
  { action: 'New project added', item: 'Modern Villa Retreat', time: '2 hours ago', color: 'bg-indigo-500' },
  { action: 'Testimonial updated', item: 'Rajesh Kumar', time: '4 hours ago', color: 'bg-violet-500' },
  { action: 'Blog post published', item: 'Sustainable Architecture', time: '1 day ago', color: 'bg-emerald-500' },
  { action: 'Contact form submission', item: 'New inquiry received', time: '2 days ago', color: 'bg-amber-500' }
]

const quickActions = [
  { label: 'Add Project', sub: 'Upload new portfolio item', icon: Image, href: '/admin/portfolio', color: 'from-indigo-500 to-indigo-600' },
  { label: 'Write Blog Post', sub: 'Create new article', icon: FileText, href: '/admin/blog', color: 'from-emerald-500 to-emerald-600' },
  { label: 'Manage Testimonials', sub: 'Update client reviews', icon: MessageSquare, href: '/admin/testimonials', color: 'from-violet-500 to-violet-600' },
  { label: 'View Messages', sub: 'Check contact forms', icon: Users, href: '/admin/messages', color: 'from-amber-500 to-amber-600' },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm">Welcome back! Here's what's happening with your site.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
          <Activity className="h-4 w-4 text-emerald-500" />
          <span>Site is live</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 ${stat.text}`} />
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="h-3 w-3" />
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
            <div className="text-sm text-slate-500">{stat.title}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-slate-900">Recent Activity</h2>
            <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Last 7 days</span>
          </div>
          <div className="space-y-5">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`w-2 h-2 rounded-full ${activity.color} mt-2 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                  <p className="text-sm text-slate-500 truncate">{activity.item}</p>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-sm flex-shrink-0`}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-800 group-hover:text-slate-900">{action.label}</div>
                  <div className="text-xs text-slate-400">{action.sub}</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 ml-auto flex-shrink-0 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
