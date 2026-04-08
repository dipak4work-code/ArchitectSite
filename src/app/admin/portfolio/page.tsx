'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { MultiImageUpload } from '@/components/admin/MultiImageUpload'
import { Plus, Pencil, Trash2, Eye, Search, Loader2, X, Image as ImageIcon } from 'lucide-react'

const CATEGORIES = ['Residential', 'Commercial', 'Public', 'Hospitality', 'Education']

type Project = {
  id: string
  title: string
  category: string
  location: string
  description: string
  images: string[]
  featured: boolean
  createdAt: string
}

const emptyForm = { title: '', category: 'Residential', location: '', description: '', images: [] as string[], featured: false }

export default function AdminPortfolio() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [lightbox, setLightbox] = useState<{ images: string[]; idx: number } | null>(null)

  async function fetchProjects() {
    setLoading(true)
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      if (data.success) setProjects(data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProjects() }, [])

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter
    return matchSearch && matchCat
  })

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEdit(p: Project) {
    setEditingId(p.id)
    setForm({ title: p.title, category: p.category, location: p.location, description: p.description, images: p.images || [], featured: p.featured })
    setShowForm(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this project?')) return
    await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        const res = await fetch(`/api/projects/${editingId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
        })
        const data = await res.json()
        if (data.success) setProjects(prev => prev.map(p => p.id === editingId ? data.data : p))
      } else {
        const res = await fetch('/api/projects', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
        })
        const data = await res.json()
        if (data.success) setProjects(prev => [data.data, ...prev])
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
          <h1 className="text-2xl font-bold text-slate-900">Portfolio</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your architectural projects.</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors text-sm font-medium">
          <Plus className="h-4 w-4" /> Add Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)}
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
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Project', 'Images', 'Category', 'Location', 'Featured', 'Date', 'Actions'].map(h => (
                      <th key={h} className={`text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(p => {
                    const cover = p.images?.[0] || ''
                    const count = p.images?.length || 0
                    return (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* Cover thumbnail with count badge */}
                            <div
                              className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer"
                              onClick={() => count > 0 && setLightbox({ images: p.images, idx: 0 })}
                            >
                              {cover
                                ? <img src={cover} alt={p.title} className="w-full h-full object-cover" />
                                : <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <ImageIcon className="h-5 w-5 text-gray-400" />
                                  </div>
                              }
                              {count > 1 && (
                                <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-tl-md">
                                  +{count - 1}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{p.title}</div>
                              <div className="text-xs text-gray-400 line-clamp-1 max-w-xs">{p.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1.5 text-sm text-gray-600">
                            <ImageIcon className="h-4 w-4 text-gray-400" />
                            {count}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">{p.category}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{p.location}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${p.featured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {p.featured ? 'Featured' : 'Standard'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => count > 0 && setLightbox({ images: p.images, idx: 0 })} disabled={count === 0}
                              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-30">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {filtered.length === 0 && !loading && (
                    <tr><td colSpan={7} className="px-6 py-16 text-center text-gray-400 text-sm">No projects found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Project' : 'Add New Project'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <MultiImageUpload
                values={form.images}
                onChange={urls => setForm(f => ({ ...f, images: urls }))}
                folder="architect-site/portfolio"
                label="Project Images"
                maxImages={10}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input type="text" required value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea required rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none" />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                  className="rounded border-gray-300 text-slate-900" />
                <span className="text-sm font-medium text-gray-700">Featured project</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? 'Save Changes' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
            {/* Main image */}
            <img
              src={lightbox.images[lightbox.idx]}
              alt="Preview"
              className="w-full max-h-[75vh] object-contain rounded-xl"
            />

            {/* Prev / Next */}
            {lightbox.images.length > 1 && (
              <>
                <button
                  onClick={() => setLightbox(l => l && ({ ...l, idx: (l.idx - 1 + l.images.length) % l.images.length }))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl transition-colors"
                >‹</button>
                <button
                  onClick={() => setLightbox(l => l && ({ ...l, idx: (l.idx + 1) % l.images.length }))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl transition-colors"
                >›</button>
              </>
            )}

            {/* Thumbnails */}
            {lightbox.images.length > 1 && (
              <div className="flex gap-2 mt-3 justify-center flex-wrap">
                {lightbox.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setLightbox(l => l && ({ ...l, idx: i }))}
                    className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${lightbox.idx === i ? 'border-white' : 'border-transparent opacity-50 hover:opacity-80'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="text-center text-white/50 text-xs mt-2">
              {lightbox.idx + 1} / {lightbox.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
