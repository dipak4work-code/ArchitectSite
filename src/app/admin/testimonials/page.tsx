'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Pencil, Trash2, Star, Search } from 'lucide-react'

const initialTestimonials = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    position: 'CEO',
    company: 'TechCorp India',
    content: 'The architectural vision brought our corporate headquarters to life in ways we never imagined. The attention to detail and innovative design solutions exceeded our expectations.',
    rating: 5,
    image: '/api/placeholder/80/80',
    approved: true
  },
  {
    id: 2,
    name: 'Priya Sharma',
    position: 'Homeowner',
    company: 'Private Residence',
    content: 'Our dream home became reality thanks to this exceptional team. They understood our vision perfectly and created a space that feels both luxurious and comfortable.',
    rating: 5,
    image: '/api/placeholder/80/80',
    approved: true
  },
  {
    id: 3,
    name: 'Dr. Amit Patel',
    position: 'Director',
    company: 'City Hospital',
    content: 'The healthcare facility design was outstanding. They incorporated modern medical requirements with patient comfort and created an environment conducive to healing.',
    rating: 5,
    image: '/api/placeholder/80/80',
    approved: true
  }
]

type Testimonial = typeof initialTestimonials[0]

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState(initialTestimonials)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null)
  const [form, setForm] = useState({
    name: '',
    position: '',
    company: '',
    content: '',
    rating: 5,
    approved: true
  })

  const filtered = testimonials.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.company.toLowerCase().includes(search.toLowerCase())
  )

  function openAdd() {
    setEditingItem(null)
    setForm({ name: '', position: '', company: '', content: '', rating: 5, approved: true })
    setShowForm(true)
  }

  function openEdit(item: Testimonial) {
    setEditingItem(item)
    setForm({
      name: item.name,
      position: item.position,
      company: item.company,
      content: item.content,
      rating: item.rating,
      approved: item.approved
    })
    setShowForm(true)
  }

  function handleDelete(id: number) {
    setTestimonials(prev => prev.filter(t => t.id !== id))
  }

  function handleToggleApproved(id: number) {
    setTestimonials(prev =>
      prev.map(t => t.id === id ? { ...t, approved: !t.approved } : t)
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editingItem) {
      setTestimonials(prev =>
        prev.map(t => t.id === editingItem.id ? { ...t, ...form } : t)
      )
    } else {
      setTestimonials(prev => [{
        id: Date.now(),
        ...form,
        image: '/api/placeholder/80/80'
      }, ...prev])
    }
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-600 mt-1">Manage client reviews and testimonials.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Testimonial
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search testimonials..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover bg-gray-100"
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.position}, {item.company}</div>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  item.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.approved ? 'Approved' : 'Pending'}
                </span>
              </div>

              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">"{item.content}"</p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleApproved(item.id)}
                  className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${
                    item.approved
                      ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  {item.approved ? 'Unpublish' : 'Approve'}
                </button>
                <button
                  onClick={() => openEdit(item)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 py-12 text-center text-gray-400">No testimonials found.</div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <input
                    type="text"
                    required
                    value={form.position}
                    onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  required
                  value={form.company}
                  onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial</label>
                <textarea
                  required
                  rows={4}
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, rating: star }))}
                    >
                      <Star className={`h-6 w-6 ${star <= form.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="approved"
                  checked={form.approved}
                  onChange={e => setForm(f => ({ ...f, approved: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="approved" className="text-sm font-medium text-gray-700">
                  Approved / Published
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors"
                >
                  {editingItem ? 'Save Changes' : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
