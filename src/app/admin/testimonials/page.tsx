'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { Plus, Pencil, Trash2, Star, Search, Loader2 } from 'lucide-react'

type Testimonial = {
  id: string; name: string; position: string; company: string
  content: string; rating: number; image: string; approved: boolean; createdAt: string
}

const emptyForm = { name: '', position: '', company: '', content: '', rating: 5, image: '', approved: true }

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  async function fetchItems() {
    setLoading(true)
    try {
      const res = await fetch('/api/testimonials')
      const data = await res.json()
      if (data.success) setItems(data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  const filtered = items.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.company.toLowerCase().includes(search.toLowerCase())
  )

  function openAdd() { setEditingId(null); setForm(emptyForm); setShowForm(true) }
  function openEdit(t: Testimonial) {
    setEditingId(t.id)
    setForm({ name: t.name, position: t.position, company: t.company, content: t.content, rating: t.rating, image: t.image, approved: t.approved })
    setShowForm(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this testimonial?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setItems(prev => prev.filter(t => t.id !== id))
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

  async function handleToggle(t: Testimonial) {
    const res = await fetch(`/api/testimonials/${t.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: !t.approved })
    })
    const data = await res.json()
    if (data.success) {
      setItems(prev => prev.map(i => i.id === t.id ? data.data : i))
    } else {
      setError('Update failed. Please try again.')
      setTimeout(() => setError(''), 4000)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        const res = await fetch(`/api/testimonials/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        const data = await res.json()
        if (data.success) setItems(prev => prev.map(i => i.id === editingId ? data.data : i))
        else { setError('Save failed.'); setTimeout(() => setError(''), 4000) }
      } else {
        const res = await fetch('/api/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        const data = await res.json()
        if (data.success) setItems(prev => [data.data, ...prev])
        else { setError('Add failed.'); setTimeout(() => setError(''), 4000) }
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
          <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>
          <p className="text-slate-500 text-sm mt-1">Manage client reviews and testimonials.</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors text-sm font-medium">
          <Plus className="h-4 w-4" /> Add Testimonial
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" placeholder="Search testimonials..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(t => (
            <Card key={t.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      {t.image
                        ? <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-500 font-bold text-lg">{t.name[0]}</div>
                      }
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                      <div className="text-xs text-gray-400">{t.position}, {t.company}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {t.approved ? 'Live' : 'Pending'}
                  </span>
                </div>

                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`h-4 w-4 ${s <= t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>

                <p className="text-sm text-gray-500 mb-4 line-clamp-3">"{t.content}"</p>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button onClick={() => handleToggle(t)}
                    className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${t.approved ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                    {t.approved ? 'Unpublish' : 'Approve'}
                  </button>
                  <button onClick={() => openEdit(t)} className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(t.id)} disabled={deletingId === t.id}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-40">
                    {deletingId === t.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 py-16 text-center text-gray-400 text-sm">No testimonials found.</div>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <ImageUpload value={form.image} onChange={url => setForm(f => ({ ...f, image: url }))}
                folder="architect-site/testimonials" label="Client Photo" aspectRatio="aspect-square" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                  <input type="text" required value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                <input type="text" required value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial *</label>
                <textarea required rows={4} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setForm(f => ({ ...f, rating: s }))}>
                      <Star className={`h-7 w-7 transition-colors ${s <= form.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.approved} onChange={e => setForm(f => ({ ...f, approved: e.target.checked }))}
                  className="rounded border-gray-300" />
                <span className="text-sm font-medium text-gray-700">Approved / Publish on site</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? 'Save Changes' : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
