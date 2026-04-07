'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save } from 'lucide-react'

export default function AdminSettings() {
  const [saved, setSaved] = useState(false)

  const [general, setGeneral] = useState({
    siteName: 'Architect Studio',
    tagline: 'Crafting Tomorrow\'s Architectural Dreams',
    email: 'contact@architectstudio.in',
    phone: '+91 98765 43210',
    address: 'Mumbai, Maharashtra, India'
  })

  const [social, setSocial] = useState({
    instagram: 'https://instagram.com/architectstudio',
    linkedin: 'https://linkedin.com/company/architectstudio',
    twitter: 'https://twitter.com/architectstudio',
    facebook: ''
  })

  const [seo, setSeo] = useState({
    metaTitle: 'Architect Studio - Modern Architectural Design',
    metaDescription: 'Leading architectural firm in India specializing in residential, commercial, and public spaces.',
    keywords: 'architecture, design, India, residential, commercial'
  })

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your site configuration.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                <input
                  type="text"
                  value={general.siteName}
                  onChange={e => setGeneral(g => ({ ...g, siteName: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={general.tagline}
                  onChange={e => setGeneral(g => ({ ...g, tagline: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={general.email}
                  onChange={e => setGeneral(g => ({ ...g, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={general.phone}
                  onChange={e => setGeneral(g => ({ ...g, phone: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={general.address}
                onChange={e => setGeneral(g => ({ ...g, address: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Social Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(Object.keys(social) as (keyof typeof social)[]).map(key => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key}</label>
                  <input
                    type="url"
                    value={social[key]}
                    onChange={e => setSocial(s => ({ ...s, [key]: e.target.value }))}
                    placeholder={`https://${key}.com/...`}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
              <input
                type="text"
                value={seo.metaTitle}
                onChange={e => setSeo(s => ({ ...s, metaTitle: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea
                rows={3}
                value={seo.metaDescription}
                onChange={e => setSeo(s => ({ ...s, metaDescription: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
              <input
                type="text"
                value={seo.keywords}
                onChange={e => setSeo(s => ({ ...s, keywords: e.target.value }))}
                placeholder="comma, separated, keywords"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </button>
          {saved && (
            <span className="text-sm text-green-600 font-medium">Settings saved successfully.</span>
          )}
        </div>
      </form>
    </div>
  )
}
