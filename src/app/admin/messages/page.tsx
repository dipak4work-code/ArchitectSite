'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Mail, MailOpen, Trash2, Reply } from 'lucide-react'

const initialMessages = [
  {
    id: 1,
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    phone: '+91 98765 43210',
    subject: 'Residential Project Inquiry',
    message: 'I am interested in designing a modern villa in Gurgaon. Could we schedule a consultation to discuss the project scope and budget?',
    date: '2024-01-20',
    read: false
  },
  {
    id: 2,
    name: 'Meena Iyer',
    email: 'meena.iyer@example.com',
    phone: '+91 87654 32109',
    subject: 'Commercial Space Renovation',
    message: 'We need to renovate our office space in Bangalore. The area is approximately 5000 sq ft and we are looking for a modern, open-plan design.',
    date: '2024-01-18',
    read: true
  },
  {
    id: 3,
    name: 'Arjun Nair',
    email: 'arjun.nair@example.com',
    phone: '+91 76543 21098',
    subject: 'Interior Design Services',
    message: 'Hello, I recently purchased a new apartment and would like to discuss interior design options. Please let me know your availability for a meeting.',
    date: '2024-01-15',
    read: true
  },
  {
    id: 4,
    name: 'Sunita Reddy',
    email: 'sunita.reddy@example.com',
    phone: '+91 65432 10987',
    subject: 'School Building Design',
    message: 'We are planning to build a new school campus and are looking for an architect to help with the design. The project is in Hyderabad.',
    date: '2024-01-12',
    read: false
  }
]

type Message = typeof initialMessages[0]

export default function AdminMessages() {
  const [messages, setMessages] = useState(initialMessages)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [selected, setSelected] = useState<Message | null>(null)

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

  function handleSelect(msg: Message) {
    setSelected(msg)
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m))
  }

  function handleDelete(id: number) {
    setMessages(prev => prev.filter(m => m.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All messages read'}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Message List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'unread', 'read'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                    filter === f
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filtered.map(msg => (
              <div
                key={msg.id}
                onClick={() => handleSelect(msg)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selected?.id === msg.id
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {!msg.read && (
                      <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="min-w-0">
                      <div className={`text-sm truncate ${!msg.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {msg.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">{msg.subject}</div>
                      <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{msg.message}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 flex-shrink-0">{msg.date}</div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="py-12 text-center text-gray-400">No messages found.</div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selected.subject}</h2>
                    <p className="text-sm text-gray-500 mt-1">{selected.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(selected.id)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">From:</span>
                      <span className="ml-2 font-medium text-gray-900">{selected.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <span className="ml-2 font-medium text-gray-900">{selected.phone}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Email:</span>
                      <a
                        href={`mailto:${selected.email}`}
                        className="ml-2 font-medium text-blue-600 hover:underline"
                      >
                        {selected.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-700 leading-relaxed mb-6">
                  {selected.message}
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Reply via email:</p>
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                    className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors"
                  >
                    <Reply className="h-4 w-4" />
                    Reply to {selected.name}
                  </a>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              <MailOpen className="h-10 w-10 mb-3" />
              <p className="text-sm">Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
