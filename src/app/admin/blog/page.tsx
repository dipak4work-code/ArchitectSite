'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react'

const CATEGORIES = ['Sustainability', 'Design Trends', 'Technology', 'Materials', 'Urban Planning']

type Post = {
  id: string
  title: string
  excerpt: string
  author: string
  category: string
  image: string
  readTime: string
  published: boolean
  createdAt: string
}

const emptyForm = { title: '', excerpt: '', author: '', category: 'Sustainability', image: '', readTime: '5 min read', published: false }

export default function AdminBlog() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function fetchPosts() {
    setLoading(true)
    try {
      const res = await fetch('/api/blog')
      const data = await res.json()
      if (data.success) setPosts(data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPosts() }, [])

  const filtered = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter
    return matchSearch && matchCat
  })

  function openAdd() { setEditingId(null); setForm(emptyForm); setShowForm(true) }
  function openEdit(p: Post) {
    setEditingId(p.id)
    setForm({ title: p.title, excerpt: p.excerpt, author: p.author, category: p.category, image: p.image, readTime: p.readTime, published: p.published })
    setShowForm(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this post?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setPosts(prev => prev.filter(p => p.id !== id))
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

  async function handleTogglePublish(p: Post) {
    setTogglingId(p.id)
    try {
      const res = await fetch(`/api/blog/${p.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !p.published })
      })
      const data = await res.json()
      if (data.success) {
        setPosts(prev => prev.map(post => post.id === p.id ? data.data : post))
      } else {
        setError('Update failed. Please try again.')
        setTimeout(() => setError(''), 4000)
      }
    } catch {
      setError('Update failed. Please try again.')
      setTimeout(() => setError(''), 4000)
    } finally {
      setTogglingId(null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        const res = await fetch(`/api/blog/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        const data = await res.json()
        if (data.success) setPosts(prev => prev.map(p => p.id === editingId ? data.data : p))
        else { setError('Save failed. Please try again.'); setTimeout(() => setError(''), 4000) }
      } else {
        const res = await fetch('/api/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        const data = await res.json()
        if (data.success) setPosts(prev => [data.data, ...prev])
        else { setError('Add failed. Please try again.'); setTimeout(() => setError(''), 4000) }
      }
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your blog posts and articles.</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors text-sm font-medium">
          <Plus className="h-4 w-4" /> New Post
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', ...CATEGORIES].map(cat => (
            <button key={cat} onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${categoryFilter === cat ? 'bg-slate-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Post', 'Author', 'Category', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className={`text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {p.image ? <img src={p.image} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200" />}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 line-clamp-1 max-w-xs">{p.title}</div>
                            <div className="text-xs text-gray-400">{p.readTime}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{p.author}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">{p.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${p.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {p.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleTogglePublish(p)} disabled={togglingId === p.id}
                            className={`text-xs px-2 py-1 rounded-lg font-medium transition-colors disabled:opacity-40 ${p.published ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                            {togglingId === p.id ? <Loader2 className="h-3 w-3 animate-spin" /> : (p.published ? 'Unpublish' : 'Publish')}
                          </button>
                          <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(p.id)} disabled={deletingId === p.id}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-40">
                            {deletingId === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && !loading && (
                    <tr><td colSpan={6} className="px-6 py-16 text-center text-gray-400 text-sm">No posts found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Post' : 'New Blog Post'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <ImageUpload
                value={form.image}
                onChange={url => setForm(f => ({ ...f, image: url }))}
                folder="architect-site/blog"
                label="Cover Image"
                aspectRatio="aspect-video"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt *</label>
                <textarea required rows={3} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                  <input type="text" required value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label>
                  <input type="text" value={form.readTime} onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
                  className="rounded border-gray-300" />
                <span className="text-sm font-medium text-gray-700">Publish immediately</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? 'Save Changes' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
