'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, Save, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

interface QItem {
  id: string
  label: string
  specs: string[]
  dimUnit: string
  rateType: 'fixed' | 'per_sqft' | 'per_unit'
  rate: number
  defaultDim: number
}

interface QSection {
  id: string
  label: string
  enabled: boolean
  items: QItem[]
}

interface BedroomConfig {
  enabled: boolean
  minCount: number
  maxCount: number
  defaultCount: number
  template: QItem[]
}

interface QData {
  sections: QSection[]
  bedroom: BedroomConfig
  specifications: string[]
  paymentTerms: { percent: number; label: string }[]
}

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900'

export default function AdminQuotation() {
  const [config, setConfig] = useState<QData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [expandedSec, setExpandedSec] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch('/api/quotation')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setConfig(data.data)
          const exp: Record<string, boolean> = {}
          data.data.sections?.forEach((s: QSection) => { exp[s.id] = false })
          setExpandedSec(exp)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    if (!config) return
    setSaving(true)
    setSaveError(false)
    try {
      const res = await fetch('/api/quotation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      const json = await res.json()
      if (json.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setSaveError(true)
        setTimeout(() => setSaveError(false), 4000)
      }
    } catch {
      setSaveError(true)
      setTimeout(() => setSaveError(false), 4000)
    } finally {
      setSaving(false)
    }
  }

  // Section helpers
  function updateSection(id: string, updates: Partial<QSection>) {
    setConfig(c => c ? { ...c, sections: c.sections.map(s => s.id === id ? { ...s, ...updates } : s) } : c)
  }

  // Item helpers
  function updateItem(secId: string, itemId: string, updates: Partial<QItem>) {
    setConfig(c => c ? {
      ...c,
      sections: c.sections.map(s => s.id !== secId ? s : {
        ...s, items: s.items.map(it => it.id !== itemId ? it : { ...it, ...updates })
      })
    } : c)
  }
  function addItem(secId: string) {
    const newItem: QItem = {
      id: 'item_' + Date.now(), label: '', specs: [],
      dimUnit: 'Sq.Ft', rateType: 'per_sqft', rate: 0, defaultDim: 10,
    }
    setConfig(c => c ? {
      ...c, sections: c.sections.map(s => s.id !== secId ? s : { ...s, items: [...s.items, newItem] })
    } : c)
  }
  function removeItem(secId: string, itemId: string) {
    setConfig(c => c ? {
      ...c, sections: c.sections.map(s => s.id !== secId ? s : { ...s, items: s.items.filter(it => it.id !== itemId) })
    } : c)
  }

  // Spec helpers
  function updateSpec(secId: string, itemId: string, idx: number, val: string) {
    setConfig(c => c ? {
      ...c, sections: c.sections.map(s => s.id !== secId ? s : {
        ...s, items: s.items.map(it => it.id !== itemId ? it : {
          ...it, specs: it.specs.map((sp, i) => i === idx ? val : sp)
        })
      })
    } : c)
  }
  function addSpec(secId: string, itemId: string) {
    setConfig(c => c ? {
      ...c, sections: c.sections.map(s => s.id !== secId ? s : {
        ...s, items: s.items.map(it => it.id !== itemId ? it : { ...it, specs: [...it.specs, ''] })
      })
    } : c)
  }
  function removeSpec(secId: string, itemId: string, idx: number) {
    setConfig(c => c ? {
      ...c, sections: c.sections.map(s => s.id !== secId ? s : {
        ...s, items: s.items.map(it => it.id !== itemId ? it : { ...it, specs: it.specs.filter((_, i) => i !== idx) })
      })
    } : c)
  }

  // Bedroom template helpers
  function updateBedroom(updates: Partial<BedroomConfig>) {
    setConfig(c => c ? { ...c, bedroom: { ...c.bedroom, ...updates } } : c)
  }
  function updateBrItem(itemId: string, updates: Partial<QItem>) {
    setConfig(c => c ? { ...c, bedroom: { ...c.bedroom, template: c.bedroom.template.map(it => it.id !== itemId ? it : { ...it, ...updates }) } } : c)
  }
  function addBrItem() {
    const newItem: QItem = { id: 'br_item_' + Date.now(), label: '', specs: [], dimUnit: 'Sq.Ft', rateType: 'per_sqft', rate: 0, defaultDim: 10 }
    setConfig(c => c ? { ...c, bedroom: { ...c.bedroom, template: [...c.bedroom.template, newItem] } } : c)
  }
  function removeBrItem(itemId: string) {
    setConfig(c => c ? { ...c, bedroom: { ...c.bedroom, template: c.bedroom.template.filter(it => it.id !== itemId) } } : c)
  }
  function updateBrSpec(itemId: string, idx: number, val: string) {
    setConfig(c => c ? { ...c, bedroom: { ...c.bedroom, template: c.bedroom.template.map(it => it.id !== itemId ? it : { ...it, specs: it.specs.map((s, i) => i === idx ? val : s) }) } } : c)
  }
  function addBrSpec(itemId: string) {
    setConfig(c => c ? { ...c, bedroom: { ...c.bedroom, template: c.bedroom.template.map(it => it.id !== itemId ? it : { ...it, specs: [...it.specs, ''] }) } } : c)
  }
  function removeBrSpec(itemId: string, idx: number) {
    setConfig(c => c ? { ...c, bedroom: { ...c.bedroom, template: c.bedroom.template.map(it => it.id !== itemId ? it : { ...it, specs: it.specs.filter((_, i) => i !== idx) }) } } : c)
  }

  // Specification list helpers
  function updateSpec2(idx: number, val: string) {
    setConfig(c => c ? { ...c, specifications: c.specifications.map((s, i) => i === idx ? val : s) } : c)
  }
  function addSpec2() {
    setConfig(c => c ? { ...c, specifications: [...c.specifications, ''] } : c)
  }
  function removeSpec2(idx: number) {
    setConfig(c => c ? { ...c, specifications: c.specifications.filter((_, i) => i !== idx) } : c)
  }

  // Payment term helpers
  function updateTerm(idx: number, updates: { percent?: number; label?: string }) {
    setConfig(c => c ? { ...c, paymentTerms: c.paymentTerms.map((t, i) => i === idx ? { ...t, ...updates } : t) } : c)
  }
  function addTerm() {
    setConfig(c => c ? { ...c, paymentTerms: [...c.paymentTerms, { percent: 0, label: '' }] } : c)
  }
  function removeTerm(idx: number) {
    setConfig(c => c ? { ...c, paymentTerms: c.paymentTerms.filter((_, i) => i !== idx) } : c)
  }

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
  if (!config) return <div className="text-red-500 p-6">Failed to load quotation config.</div>

  const termTotal = config.paymentTerms.reduce((s, t) => s + t.percent, 0)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quotation Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Configure the furniture estimate calculator shown on the main site.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-green-600 font-medium">Saved!</span>}
          {saveError && <span className="text-sm text-red-500 font-medium">Save failed. Try again.</span>}
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors text-sm font-medium">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Sections */}
      {config.sections.map(sec => {
        const exp = expandedSec[sec.id]
        return (
          <Card key={sec.id}>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={sec.enabled}
                      onChange={e => updateSection(sec.id, { enabled: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 accent-indigo-600" />
                    <CardTitle className="text-base">{sec.label || '(unnamed section)'}</CardTitle>
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input type="text" value={sec.label}
                    onChange={e => updateSection(sec.id, { label: e.target.value })}
                    placeholder="Section label"
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 w-40" />
                  <button onClick={() => setExpandedSec(e => ({ ...e, [sec.id]: !e[sec.id] }))}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
                    {exp ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </CardHeader>

            {exp && (
              <CardContent className="space-y-4 pt-0">
                {sec.items.map(item => (
                  <div key={item.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50 space-y-3">
                    {/* Item header */}
                    <div className="flex items-center justify-between gap-2">
                      <input type="text" value={item.label}
                        onChange={e => updateItem(sec.id, item.id, { label: e.target.value })}
                        placeholder="Item label"
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900" />
                      <button onClick={() => removeItem(sec.id, item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 flex-shrink-0">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Rate type, rate, dim */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Rate Type</label>
                        <select value={item.rateType}
                          onChange={e => updateItem(sec.id, item.id, { rateType: e.target.value as QItem['rateType'] })}
                          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
                          <option value="fixed">Fixed Price</option>
                          <option value="per_sqft">Per Sq.Ft</option>
                          <option value="per_unit">Per Unit</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Rate (Rs.)</label>
                        <input type="number" min={0} value={item.rate}
                          onChange={e => updateItem(sec.id, item.id, { rate: Number(e.target.value) })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                      </div>
                      {item.rateType !== 'fixed' && (
                        <>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Unit Label</label>
                            <input type="text" value={item.dimUnit}
                              onChange={e => updateItem(sec.id, item.id, { dimUnit: e.target.value })}
                              placeholder="e.g. Sq.Ft"
                              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Default Dim</label>
                            <input type="number" min={0} step={0.5} value={item.defaultDim}
                              onChange={e => updateItem(sec.id, item.id, { defaultDim: parseFloat(e.target.value) || 0 })}
                              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Specs */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-gray-500">Spec / Material Points</label>
                        <button onClick={() => addSpec(sec.id, item.id)}
                          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                          <Plus className="h-3 w-3" /> Add
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        {item.specs.map((sp, i) => (
                          <div key={i} className="flex gap-2">
                            <input type="text" value={sp}
                              onChange={e => updateSpec(sec.id, item.id, i, e.target.value)}
                              placeholder="e.g. Gurgen 18mm plywood"
                              className="flex-1 border border-gray-200 rounded-lg px-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900" />
                            <button onClick={() => removeSpec(sec.id, item.id, i)}
                              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 flex-shrink-0">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <button onClick={() => addItem(sec.id)}
                  className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors w-full justify-center border border-dashed border-indigo-200">
                  <Plus className="h-4 w-4" /> Add Item to {sec.label}
                </button>
              </CardContent>
            )}
          </Card>
        )
      })}

      {/* Bedroom Template */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-base">Bedroom Configuration</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Template applied to each bedroom. Users select count 1-5 on the main site.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Count settings */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Min Bedrooms</label>
              <input type="number" min={1} max={5} value={config.bedroom.minCount}
                onChange={e => updateBedroom({ minCount: Number(e.target.value) })}
                className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Max Bedrooms</label>
              <input type="number" min={1} max={10} value={config.bedroom.maxCount}
                onChange={e => updateBedroom({ maxCount: Number(e.target.value) })}
                className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Default Count</label>
              <input type="number" min={config.bedroom.minCount} max={config.bedroom.maxCount} value={config.bedroom.defaultCount}
                onChange={e => updateBedroom({ defaultCount: Number(e.target.value) })}
                className={inputCls} />
            </div>
          </div>

          {/* Template items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Items per Bedroom</span>
              <button onClick={addBrItem}
                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                <Plus className="h-3 w-3" /> Add Item
              </button>
            </div>
            {config.bedroom.template.map(item => (
              <div key={item.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <input type="text" value={item.label}
                    onChange={e => updateBrItem(item.id, { label: e.target.value })}
                    placeholder="Item label"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900" />
                  <button onClick={() => removeBrItem(item.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 flex-shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Rate Type</label>
                    <select value={item.rateType}
                      onChange={e => updateBrItem(item.id, { rateType: e.target.value as QItem['rateType'] })}
                      className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
                      <option value="fixed">Fixed Price</option>
                      <option value="per_sqft">Per Sq.Ft</option>
                      <option value="per_unit">Per Unit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Rate (Rs.)</label>
                    <input type="number" min={0} value={item.rate}
                      onChange={e => updateBrItem(item.id, { rate: Number(e.target.value) })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                  </div>
                  {item.rateType !== 'fixed' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Unit Label</label>
                        <input type="text" value={item.dimUnit}
                          onChange={e => updateBrItem(item.id, { dimUnit: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Default Dim</label>
                        <input type="number" min={0} step={0.5} value={item.defaultDim}
                          onChange={e => updateBrItem(item.id, { defaultDim: parseFloat(e.target.value) || 0 })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                      </div>
                    </>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-gray-500">Spec / Material Points</label>
                    <button onClick={() => addBrSpec(item.id)}
                      className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                      <Plus className="h-3 w-3" /> Add
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {item.specs.map((sp, i) => (
                      <div key={i} className="flex gap-2">
                        <input type="text" value={sp}
                          onChange={e => updateBrSpec(item.id, i, e.target.value)}
                          placeholder="e.g. Gurgen 18mm plywood"
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900" />
                        <button onClick={() => removeBrSpec(item.id, i)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 flex-shrink-0">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Specifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Specifications &amp; Terms</CardTitle>
            <button onClick={addSpec2}
              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium">
              <Plus className="h-3 w-3" /> Add
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {config.specifications.map((spec, idx) => (
            <div key={idx} className="flex gap-2">
              <input type="text" value={spec}
                onChange={e => updateSpec2(idx, e.target.value)}
                placeholder="e.g. Plywood: Gurgen Face Ply 18mm"
                className={inputCls} />
              <button onClick={() => removeSpec2(idx)}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 flex-shrink-0">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Payment Terms */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Payment Terms</CardTitle>
            <button onClick={addTerm}
              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium">
              <Plus className="h-3 w-3" /> Add Term
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {config.paymentTerms.map((term, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <input type="number" min={0} max={100} value={term.percent}
                    onChange={e => updateTerm(idx, { percent: Number(e.target.value) })}
                    className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                  <span className="text-gray-400 text-sm">%</span>
                </div>
                <input type="text" value={term.label} placeholder="e.g. Advance"
                  onChange={e => updateTerm(idx, { label: e.target.value })}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                <button onClick={() => removeTerm(idx)}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 flex-shrink-0">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-400">
            Total: <span className={termTotal === 100 ? 'text-green-600 font-semibold' : 'text-amber-600 font-semibold'}>{termTotal}%</span>
            {termTotal !== 100 && <span className="ml-2 text-amber-600">(must total 100%)</span>}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-4 pb-8">
        {saveError && <span className="text-sm text-red-500 font-medium">Save failed. Try again.</span>}
        {saved && <span className="text-sm text-green-600 font-medium">Saved successfully!</span>}
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors font-medium">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save All Changes
        </button>
      </div>
    </div>
  )
}
