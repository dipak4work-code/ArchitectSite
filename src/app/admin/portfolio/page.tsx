'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Pencil, Trash2, Eye, Search } from 'lucide-react'

const initialProjects = [
  {
    id: 1,
    title: 'Modern Villa Retreat',
    category: 'Residential',
    location: 'Mumbai, India',
    description: 'A contemporary villa design blending traditional Indian elements with modern aesthetics.',
    image: '/api/placeholder/600/400',
    featured: true,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'Corporate Headquarters',
    category: 'Commercial',
    location: 'Delhi, India',
    description: 'State-of-the-art office complex designed for productivity and employee well-being.',
    image: '/api/placeholder/600/400',
    featured: true,
    createdAt: '2024-01-10'
  },
  {
    id: 3,
    title: 'Cultural Center',
    category: 'Public',
    location: 'Bangalore, India',
    description: 'Community space celebrating local culture with sustainable architectural practices.',
    image: '/api/placeholder/600/400',
    featured: false,
    createdAt: '2024-01-05'
  },
  {
    id: 4,
    title: 'Luxury Apartment Complex',
    category: 'Residential',
    location: 'Chennai, India',
    description: 'High-end residential development with premium amenities and green spaces.',
    image: '/api/placeholder/600/400',
    featured: false,
    createdAt: '2023-12-20'
  },
  {
    id: 5,
    title: 'Restaurant & Bar',
    category: 'Hospitality',
    location: 'Pune, India',
    description: 'Elegant dining space combining contemporary design with local culinary traditions.',
    image: '/api/placeholder/600/400',
    featured: false,
    createdAt: '2023-12-10'
  },
  {
    id: 6,
    title: 'Educational Campus',
    category: 'Education',
    location: 'Hyderabad, India',
    description: 'Modern learning environment designed to inspire creativity and collaboration.',
    image: '/api/placeholder/600/400',
    featured: false,
    createdAt: '2023-11-25'
  }
]

const categories = ['All', 'Residential', 'Commercial', 'Public', 'Hospitality', 'Education']

type Project = typeof initialProjects[0]

export default function AdminPortfolio() {
  const [projects, setProjects] = useState(initialProjects)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [form, setForm] = useState({
    title: '',
    category: 'Residential',
    location: '',
    description: '',
    featured: false
  })

  const filtered = projects.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  function openAdd() {
    setEditingProject(null)
    setForm({ title: '', category: 'Residential', location: '', description: '', featured: false })
    setShowForm(true)
  }

  function openEdit(project: Project) {
    setEditingProject(project)
    setForm({
      title: project.title,
      category: project.category,
      location: project.location,
      description: project.description,
      featured: project.featured
    })
    setShowForm(true)
  }

  function handleDelete(id: number) {
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editingProject) {
      setProjects(prev =>
        prev.map(p => p.id === editingProject.id ? { ...p, ...form } : p)
      )
    } else {
      const newProject = {
        id: Date.now(),
        ...form,
        image: '/api/placeholder/600/400',
        createdAt: new Date().toISOString().split('T')[0]
      }
      setProjects(prev => [newProject, ...prev])
    }
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-gray-600 mt-1">Manage your architectural projects.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                categoryFilter === cat
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Project</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Category</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Location</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Featured</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Date</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(project => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-12 h-9 rounded object-cover bg-gray-100"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{project.title}</div>
                          <div className="text-xs text-gray-500 line-clamp-1 max-w-xs">{project.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{project.location}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {project.featured ? 'Featured' : 'Standard'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{project.createdAt}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEdit(project)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">No projects found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  Featured project
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
                  {editingProject ? 'Save Changes' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
