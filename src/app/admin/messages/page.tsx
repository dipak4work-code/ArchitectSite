'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Search, MailOpen, Trash2, Reply, Loader2, RefreshCw } from 'lucide-react'

type Message = {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [selected, setSelected] = useState<Message | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function fetchMessages() {
    setLoading(true)
    try {
      const res = await fetch('/api/messages')
      const data = await res.json()
      if (data.success) setMessages(data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMessages() }, [])

  const filtered = messages.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
    const matchesFilter =
      filter === 'all' ||
      (filter === 'unread' && !m.read) ||
      (filter === 'read' && m.read)
    return matchesSearch && matchesFilter
  })

  async function handleSelect(msg: Message) {
    setSelected(msg)
    if (!msg.read) {
      // Mark as read
      await fetch(`/api/messages/${msg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      })
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m))
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this message?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setMessages(prev => prev.filter(m => m.id !== id))
        if (selected?.id === id) setSelected(null)
      } else {
        setError('Delete failed. Please try again.')
        setTimeout(() => setError(''), 4000)
      }
    } catch {
      setError('Delete failed. Please try again.')
      setTimeout(() => setError(''), 4000)
    } finally {
      setDeletingId(null)
    }
  }

  const unreadCount = messages.filter(m => !m.read).length

  function formatDate(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
          <p className="text-slate-500 text-sm mt-1">
            {loading ? 'Loading...' : unreadCount > 0
              ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`
              : 'All messages read'}
          </p>
        </div>
        <button onClick={fetchMessages}
          className="flex items-center gap-2 border border-gray-200 text-gray-600 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors text-sm">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Message List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex flex-col gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search messages..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
            </div>
            <div className="flex gap-2">
              {(['all', 'unread', 'read'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-slate-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  {f}
                  {f === 'unread' && unreadCount > 0 && (
                    <span className="ml-1.5 bg-indigo-500 text-white text-xs rounded-full px-1.5 py-0.5">{unreadCount}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(msg => (
                <div key={msg.id} onClick={() => handleSelect(msg)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selected?.id === msg.id
                      ? 'border-slate-900 bg-slate-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      {/* Unread dot */}
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${!msg.read ? 'bg-indigo-500' : 'bg-transparent'}`} />
                      <div className="min-w-0">
                        <div className={`text-sm truncate ${!msg.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-600'}`}>
                          {msg.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{msg.subject}</div>
                        <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{msg.message}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 flex-shrink-0 text-right">
                      <div>{formatDate(msg.createdAt)}</div>
                      <div>{formatTime(msg.createdAt)}</div>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && !loading && (
                <div className="py-16 text-center text-gray-400 text-sm">
                  <MailOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  No messages found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{selected.subject}</h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {formatDate(selected.createdAt)} at {formatTime(selected.createdAt)}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(selected.id)} disabled={deletingId === selected.id}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-40">
                    {deletingId === selected.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>

                {/* Sender info */}
                <div className="rounded-xl p-4 mb-5 space-y-2" style={{ background: '#F7F4EF' }}>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="text-gray-400 text-xs uppercase tracking-wide font-semibold">From</span>
                      <div className="font-semibold text-gray-900 mt-0.5">{selected.name}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs uppercase tracking-wide font-semibold">Phone</span>
                      <div className="font-medium text-gray-700 mt-0.5">{selected.phone || '--'}</div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400 text-xs uppercase tracking-wide font-semibold">Email</span>
                      <div className="mt-0.5">
                        <a href={`mailto:${selected.email}`} className="font-medium text-indigo-600 hover:underline">
                          {selected.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message body */}
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-6 p-4 border border-gray-100 rounded-xl">
                  {selected.message}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
                    <Reply className="h-4 w-4" />
                    Reply to {selected.name}
                  </a>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 rounded-2xl">
              <MailOpen className="h-10 w-10 mb-3" />
              <p className="text-sm text-gray-400">Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
