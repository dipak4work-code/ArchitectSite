'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ChevronDown, ChevronUp, Loader2, Minus, Plus, Send, X } from 'lucide-react'

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

const fmt = (n: number) => 'Rs.' + Math.round(n).toLocaleString('en-IN')

// ── dim key helpers ──────────────────────────────────────────────
const brKey = (brIdx: number, itemId: string) => `br_${brIdx}_${itemId}`

export function Quotation() {
  const [data, setData] = useState<QData | null>(null)
  const [loading, setLoading] = useState(true)

  // Regular section state
  const [dims, setDims] = useState<Record<string, number>>({})
  const [secOn, setSecOn] = useState<Record<string, boolean>>({})
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  // Bedroom state
  const [bedroomCount, setBedroomCount] = useState(2)
  const [bedroomDims, setBedroomDims] = useState<Record<string, number>>({})
  const [bedroomExpanded, setBedroomExpanded] = useState<Record<number, boolean>>({})

  // UI state
  const [specsOpen, setSpecsOpen] = useState(false)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  useEffect(() => {
    fetch('/api/quotation')
      .then(r => r.json())
      .then(res => {
        if (!res.success) return
        const d: QData = res.data
        setData(d)

        // Init regular sections
        const di: Record<string, number> = {}
        const si: Record<string, boolean> = {}
        const ei: Record<string, boolean> = {}
        d.sections.forEach(sec => {
          si[sec.id] = sec.enabled
          ei[sec.id] = false
          sec.items.forEach(item => { di[item.id] = item.defaultDim })
        })
        setDims(di)
        setSecOn(si)
        setExpanded(ei)

        // Init bedroom dims for ALL possible bedrooms (up to maxCount)
        const bdi: Record<string, number> = {}
        const bex: Record<number, boolean> = {}
        for (let i = 0; i < d.bedroom.maxCount; i++) {
          bex[i] = false
          d.bedroom.template.forEach(item => {
            bdi[brKey(i, item.id)] = item.defaultDim
          })
        }
        setBedroomDims(bdi)
        setBedroomExpanded(bex)
        setBedroomCount(d.bedroom.defaultCount)
      })
      .finally(() => setLoading(false))
  }, [])

  // ── Calculations ─────────────────────────────────────────────────
  const itemTotal = (item: QItem, d = dims) => {
    if (item.rateType === 'fixed') return item.rate
    return (d[item.id] ?? item.defaultDim) * item.rate
  }

  const sectionTotal = (sec: QSection) =>
    secOn[sec.id] ? sec.items.reduce((s, it) => s + itemTotal(it), 0) : 0

  const brItemTotal = (item: QItem, brIdx: number) => {
    const dim = bedroomDims[brKey(brIdx, item.id)] ?? item.defaultDim
    if (item.rateType === 'fixed') return item.rate
    return dim * item.rate
  }

  const brSectionTotal = (brIdx: number) =>
    data?.bedroom.template.reduce((s, it) => s + brItemTotal(it, brIdx), 0) ?? 0

  const grandTotal = useMemo(() => {
    if (!data) return 0
    const secSum = data.sections.reduce((s, sec) => s + sectionTotal(sec), 0)
    const brSum = Array.from({ length: bedroomCount }, (_, i) => brSectionTotal(i))
      .reduce((s, t) => s + t, 0)
    return secSum + brSum
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, dims, secOn, bedroomDims, bedroomCount])

  // ── Quote text for message ────────────────────────────────────────
  const buildText = () => {
    if (!data) return ''
    const lines: string[] = ['FURNITURE ESTIMATE REQUEST', '']
    data.sections.forEach(sec => {
      if (!secOn[sec.id]) return
      lines.push(sec.label.toUpperCase())
      sec.items.forEach(item => {
        const dim = dims[item.id] ?? item.defaultDim
        const tot = itemTotal(item)
        lines.push(item.rateType === 'fixed'
          ? `  • ${item.label}: ${fmt(tot)}`
          : `  • ${item.label}: ${dim} ${item.dimUnit} x Rs.${item.rate}/- = ${fmt(tot)}`)
      })
      lines.push(`  Section Total: ${fmt(sectionTotal(sec))}`, '')
    })
    for (let i = 0; i < bedroomCount; i++) {
      lines.push(`BED ROOM (${i + 1})`)
      data.bedroom.template.forEach(item => {
        const dim = bedroomDims[brKey(i, item.id)] ?? item.defaultDim
        const tot = brItemTotal(item, i)
        lines.push(`  • ${item.label}: ${dim} ${item.dimUnit} x Rs.${item.rate}/- = ${fmt(tot)}`)
      })
      lines.push(`  Section Total: ${fmt(brSectionTotal(i))}`, '')
    }
    lines.push(`GRAND TOTAL: ${fmt(grandTotal)}`)
    return lines.join('\n')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email, phone: form.phone,
          subject: 'Furniture Estimate Request',
          message: buildText(),
        }),
      })
      if (!(await res.json()).success) throw new Error()
      setStatus('success')
      setForm({ name: '', email: '', phone: '' })
    } catch {
      setStatus('error')
    }
  }

  if (loading || !data) {
    return (
      <section id="quotation" className="py-28 flex items-center justify-center" style={{ background: '#0E0E0E' }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#C9A250' }} />
      </section>
    )
  }

  let srGlobal = 0

  return (
    <section id="quotation" className="py-28" style={{ background: '#0E0E0E' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }} viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-label" style={{ color: '#C9A250' }}>Get An Estimate</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight">Furniture Quotation</h2>
          <p className="text-white/40 max-w-xl mx-auto leading-relaxed">
            Adjust dimensions to get a live estimate. Toggle sections on or off based on your requirements.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* ── Left: Sections ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Regular sections */}
            {data.sections.map((sec, si) => {
              const on = secOn[sec.id]
              const exp = expanded[sec.id]
              const secTot = sectionTotal(sec)

              return (
                <motion.div key={sec.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: si * 0.07 }} viewport={{ once: true }}
                  className="rounded-2xl overflow-hidden"
                  style={{ border: `1px solid ${on ? 'rgba(201,162,80,0.25)' : 'rgba(255,255,255,0.06)'}`, background: '#1A1A1A' }}
                >
                  {/* Section header */}
                  <div className="flex items-center justify-between px-5 py-4"
                    style={{ background: on ? 'rgba(201,162,80,0.07)' : 'rgba(255,255,255,0.02)' }}>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSecOn(s => ({ ...s, [sec.id]: !s[sec.id] }))}
                        className="relative flex-shrink-0 w-10 h-5 rounded-full transition-colors duration-200"
                        style={{ background: on ? '#C9A250' : 'rgba(255,255,255,0.18)' }}
                      >
                        <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-200"
                          style={{ left: on ? '22px' : '2px' }} />
                      </button>
                      <h3 className="text-sm font-bold tracking-[0.15em] uppercase"
                        style={{ color: on ? '#C9A250' : 'rgba(255,255,255,0.3)' }}>
                        {sec.label}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4">
                      {on && <span className="text-sm font-bold" style={{ color: '#E8C97A' }}>{fmt(secTot)}</span>}
                      <button onClick={() => setExpanded(e => ({ ...e, [sec.id]: !e[sec.id] }))}
                        className="text-white/25 hover:text-white/60 transition-colors">
                        {exp ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {exp && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: on ? 1 : 0.4 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
                        {/* Column headers */}
                        <div className="hidden sm:grid px-5 py-2 border-t"
                          style={{ borderColor: 'rgba(255,255,255,0.05)', gridTemplateColumns: '1.5rem 1fr 7rem 6rem 6rem' }}>
                          {['SR', 'Description', 'Dimension', 'Rate', 'Total'].map(h => (
                            <span key={h} className="text-[10px] font-bold uppercase tracking-wider text-white/20 last:text-right">{h}</span>
                          ))}
                        </div>

                        {sec.items.map(item => {
                          srGlobal++
                          const sr = srGlobal
                          const dim = dims[item.id] ?? item.defaultDim
                          const tot = itemTotal(item)
                          const isFixed = item.rateType === 'fixed'
                          return <ItemRow key={item.id} sr={sr} item={item} dim={dim} tot={tot} isFixed={isFixed}
                            onDimChange={val => setDims(d => ({ ...d, [item.id]: val }))} />
                        })}

                        {on && (
                          <div className="flex justify-end items-center gap-6 px-5 py-3 border-t"
                            style={{ borderColor: 'rgba(201,162,80,0.12)', background: 'rgba(201,162,80,0.04)' }}>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Section Total</span>
                            <span className="text-base font-bold" style={{ color: '#C9A250' }}>{fmt(secTot)}</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}

            {/* ── Bedroom count selector ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }} viewport={{ once: true }}
              className="rounded-2xl px-5 py-5 flex items-center justify-between"
              style={{ border: '1px solid rgba(201,162,80,0.3)', background: 'rgba(201,162,80,0.06)' }}
            >
              <div>
                <h3 className="text-sm font-bold tracking-[0.15em] uppercase" style={{ color: '#C9A250' }}>
                  Bed Rooms
                </h3>
                <p className="text-xs text-white/35 mt-0.5">
                  {data.bedroom.minCount}-{data.bedroom.maxCount} bedrooms · same items per room
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setBedroomCount(c => Math.max(data.bedroom.minCount, c - 1))}
                  disabled={bedroomCount <= data.bedroom.minCount}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all disabled:opacity-30"
                  style={{ borderColor: 'rgba(201,162,80,0.4)', color: '#C9A250' }}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="w-12 h-9 rounded-xl flex items-center justify-center border font-bold text-lg"
                  style={{ borderColor: 'rgba(201,162,80,0.4)', color: '#E8C97A', background: 'rgba(201,162,80,0.1)' }}>
                  {bedroomCount}
                </div>
                <button
                  onClick={() => setBedroomCount(c => Math.min(data.bedroom.maxCount, c + 1))}
                  disabled={bedroomCount >= data.bedroom.maxCount}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all disabled:opacity-30"
                  style={{ borderColor: 'rgba(201,162,80,0.4)', color: '#C9A250' }}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </motion.div>

            {/* ── Dynamic bedroom sections ── */}
            {Array.from({ length: bedroomCount }, (_, brIdx) => {
              const label = `Bed Room (${brIdx + 1})`
              const brTot = brSectionTotal(brIdx)
              const exp = bedroomExpanded[brIdx]

              return (
                <motion.div key={brIdx}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ border: '1px solid rgba(201,162,80,0.25)', background: '#1A1A1A' }}
                >
                  {/* Bedroom header */}
                  <div className="flex items-center justify-between px-5 py-4"
                    style={{ background: 'rgba(201,162,80,0.07)' }}>
                    <h3 className="text-sm font-bold tracking-[0.15em] uppercase" style={{ color: '#C9A250' }}>
                      {label}
                    </h3>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold" style={{ color: '#E8C97A' }}>{fmt(brTot)}</span>
                      <button onClick={() => setBedroomExpanded(e => ({ ...e, [brIdx]: !e[brIdx] }))}
                        className="text-white/25 hover:text-white/60 transition-colors">
                        {exp ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {exp && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
                        <div className="hidden sm:grid px-5 py-2 border-t"
                          style={{ borderColor: 'rgba(255,255,255,0.05)', gridTemplateColumns: '1.5rem 1fr 7rem 6rem 6rem' }}>
                          {['SR', 'Description', 'Dimension', 'Rate', 'Total'].map(h => (
                            <span key={h} className="text-[10px] font-bold uppercase tracking-wider text-white/20 last:text-right">{h}</span>
                          ))}
                        </div>

                        {data.bedroom.template.map(item => {
                          srGlobal++
                          const sr = srGlobal
                          const key = brKey(brIdx, item.id)
                          const dim = bedroomDims[key] ?? item.defaultDim
                          const tot = brItemTotal(item, brIdx)
                          return (
                            <ItemRow key={item.id} sr={sr} item={item} dim={dim} tot={tot} isFixed={false}
                              onDimChange={val => setBedroomDims(d => ({ ...d, [key]: val }))} />
                          )
                        })}

                        <div className="flex justify-end items-center gap-6 px-5 py-3 border-t"
                          style={{ borderColor: 'rgba(201,162,80,0.12)', background: 'rgba(201,162,80,0.04)' }}>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Section Total</span>
                          <span className="text-base font-bold" style={{ color: '#C9A250' }}>{fmt(brTot)}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}

            {/* Specifications */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }} viewport={{ once: true }}
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.06)', background: '#1A1A1A' }}
            >
              <button onClick={() => setSpecsOpen(s => !s)}
                className="w-full flex items-center justify-between px-5 py-4 text-left">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/40">Specifications &amp; Terms</span>
                {specsOpen ? <ChevronUp className="h-4 w-4 text-white/25" /> : <ChevronDown className="h-4 w-4 text-white/25" />}
              </button>
              <AnimatePresence initial={false}>
                {specsOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
                    <ul className="px-5 py-4 border-t space-y-2.5" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                      {data.specifications.map((spec, i) => (
                        <li key={i} className="flex gap-2.5 text-sm text-white/45">
                          <span className="mt-0.5 flex-shrink-0 text-xs" style={{ color: '#C9A250' }}>*</span>
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ── Right: Summary panel ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">

              {/* Grand total card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }} viewport={{ once: true }}
                className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(201,162,80,0.2)', background: '#1A1A1A' }}
              >
                <div className="px-5 py-4 border-b"
                  style={{ borderColor: 'rgba(201,162,80,0.12)', background: 'rgba(201,162,80,0.06)' }}>
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: '#C9A250' }}>
                    Estimate Summary
                  </span>
                </div>
                <div className="px-5 py-4 space-y-2.5">
                  {data.sections.map(sec => {
                    if (!secOn[sec.id]) return null
                    return (
                      <div key={sec.id} className="flex justify-between items-center">
                        <span className="text-xs text-white/40 truncate pr-2">{sec.label}</span>
                        <span className="text-sm font-semibold text-white/65 flex-shrink-0">{fmt(sectionTotal(sec))}</span>
                      </div>
                    )
                  })}
                  {/* Bedroom rows */}
                  {Array.from({ length: bedroomCount }, (_, i) => (
                    <div key={`br-${i}`} className="flex justify-between items-center">
                      <span className="text-xs text-white/40 truncate pr-2">Bed Room ({i + 1})</span>
                      <span className="text-sm font-semibold text-white/65 flex-shrink-0">{fmt(brSectionTotal(i))}</span>
                    </div>
                  ))}
                  {Object.values(secOn).every(v => !v) && bedroomCount === 0 && (
                    <p className="text-xs text-white/25 text-center py-2">Enable at least one section</p>
                  )}
                </div>
                <div className="flex justify-between items-center px-5 py-4 border-t"
                  style={{ borderColor: 'rgba(201,162,80,0.12)' }}>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">Grand Total</span>
                  <span className="text-xl font-bold" style={{ color: '#C9A250' }}>{fmt(grandTotal)}</span>
                </div>
              </motion.div>

              {/* Payment schedule */}
              {grandTotal > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}
                  className="rounded-2xl overflow-hidden"
                  style={{ border: '1px solid rgba(255,255,255,0.06)', background: '#1A1A1A' }}
                >
                  <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/35">Payment Schedule</span>
                  </div>
                  <div className="px-5 py-4 space-y-3">
                    {data.paymentTerms.map((term, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-medium text-white/55">{term.label}</div>
                          <div className="text-[10px] text-white/25">{term.percent}% of total</div>
                        </div>
                        <span className="text-sm font-bold text-white/65">
                          {fmt(grandTotal * term.percent / 100)}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              <button
                onClick={() => { setModal(true); setStatus('idle') }}
                disabled={grandTotal === 0}
                className="w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #E8C97A, #C9A250)', color: '#141414' }}
              >
                Request This Estimate
              </button>

              <p className="text-center text-[11px] text-white/20 px-2 leading-relaxed">
                Approximate estimate only. Final pricing confirmed after site inspection.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Request Modal ── */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.78)' }}
            onClick={e => { if (e.target === e.currentTarget) { setModal(false); setStatus('idle') } }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }} transition={{ duration: 0.2 }}
              className="w-full max-w-md rounded-2xl overflow-hidden"
              style={{ background: '#1A1A1A', border: '1px solid rgba(201,162,80,0.2)' }}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b"
                style={{ borderColor: 'rgba(201,162,80,0.12)' }}>
                <div>
                  <h3 className="font-bold text-white">Request Estimate</h3>
                  <p className="text-xs text-white/35 mt-0.5">
                    {bedroomCount} bedroom{bedroomCount > 1 ? 's' : ''} · Total: <span style={{ color: '#C9A250' }}>{fmt(grandTotal)}</span>
                  </p>
                </div>
                <button onClick={() => { setModal(false); setStatus('idle') }}
                  className="text-white/30 hover:text-white/60 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-6 py-6">
                {status === 'success' ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                      style={{ background: 'rgba(201,162,80,0.15)' }}>
                      <CheckCircle className="h-7 w-7" style={{ color: '#C9A250' }} />
                    </div>
                    <h4 className="font-bold text-white mb-2">Request Sent!</h4>
                    <p className="text-sm text-white/45 max-w-xs">We'll reach out with your detailed estimate shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                      { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'Your full name', required: true },
                      { label: 'Phone *', key: 'phone', type: 'tel', placeholder: '+91 98765 43210', required: true },
                      { label: 'Email', key: 'email', type: 'email', placeholder: 'your@email.com', required: false },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-white/35 mb-1.5">{field.label}</label>
                        <input
                          type={field.type} required={field.required} placeholder={field.placeholder}
                          value={form[field.key as keyof typeof form]}
                          onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                          disabled={status === 'sending'}
                          className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none border transition-colors"
                          style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.10)' }}
                          onFocus={e => { e.target.style.borderColor = '#C9A250' }}
                          onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)' }}
                        />
                      </div>
                    ))}
                    {status === 'error' && <p className="text-sm text-red-400 text-center">Something went wrong. Please try again.</p>}
                    <button type="submit" disabled={status === 'sending'}
                      className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 mt-2 transition-all"
                      style={{ background: 'linear-gradient(135deg, #E8C97A, #C9A250)', color: '#141414', opacity: status === 'sending' ? 0.7 : 1 }}>
                      {status === 'sending'
                        ? <><Loader2 className="h-4 w-4 animate-spin" />Sending...</>
                        : <><Send className="h-4 w-4" />Send Request</>}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// ── Shared item row component ────────────────────────────────────────────────
function ItemRow({
  sr, item, dim, tot, isFixed, onDimChange,
}: {
  sr: number
  item: QItem
  dim: number
  tot: number
  isFixed: boolean
  onDimChange: (v: number) => void
}) {
  return (
    <div className="border-t px-5 py-4" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
      {/* Mobile */}
      <div className="sm:hidden space-y-2">
        <div className="flex justify-between items-start">
          <div className="flex gap-2 items-start">
            <span className="text-[11px] font-bold text-white/25 mt-0.5 w-5 flex-shrink-0">{sr}.</span>
            <span className="text-sm font-semibold text-white">{item.label}</span>
          </div>
          <span className="text-sm font-bold flex-shrink-0 ml-2" style={{ color: '#C9A250' }}>{fmt(tot)}</span>
        </div>
        {item.specs.length > 0 && (
          <ul className="pl-7 space-y-0.5">
            {item.specs.map((s, i) => (
              <li key={i} className="text-[11px] text-white/35 flex gap-1.5">
                <span style={{ color: '#C9A250' }} className="flex-shrink-0">•</span>{s}
              </li>
            ))}
          </ul>
        )}
        {!isFixed && (
          <div className="pl-7 flex items-center gap-2 text-xs text-white/40">
            <input type="number" min={0} step={0.5} value={dim}
              onChange={e => onDimChange(parseFloat(e.target.value) || 0)}
              className="w-20 text-center rounded-lg py-1.5 text-white text-xs font-medium outline-none border"
              style={{ background: 'rgba(201,162,80,0.08)', borderColor: 'rgba(201,162,80,0.35)' }} />
            <span>{item.dimUnit}</span>
            <span className="text-white/20">x Rs.{item.rate.toLocaleString('en-IN')}</span>
          </div>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden sm:grid gap-x-4 items-start"
        style={{ gridTemplateColumns: '1.5rem 1fr 7rem 6rem 6rem' }}>
        <span className="text-[11px] font-bold text-white/25 pt-0.5">{sr}.</span>
        <div>
          <div className="text-sm font-semibold text-white mb-1.5">{item.label}</div>
          {item.specs.length > 0 && (
            <ul className="space-y-0.5">
              {item.specs.map((s, i) => (
                <li key={i} className="text-[11px] text-white/35 flex gap-1.5">
                  <span style={{ color: '#C9A250' }} className="flex-shrink-0">•</span>{s}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col items-center gap-1 pt-0.5">
          {!isFixed ? (
            <>
              <input type="number" min={0} step={0.5} value={dim}
                onChange={e => onDimChange(parseFloat(e.target.value) || 0)}
                className="w-20 text-center rounded-lg py-1.5 text-white text-sm font-medium outline-none border transition-colors"
                style={{ background: 'rgba(201,162,80,0.08)', borderColor: 'rgba(201,162,80,0.35)' }}
                onFocus={e => { e.target.style.borderColor = '#C9A250' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(201,162,80,0.35)' }} />
              <span className="text-[10px] text-white/25">{item.dimUnit}</span>
            </>
          ) : (
            <span className="text-xs text-white/20">--</span>
          )}
        </div>
        <div className="text-right pt-0.5">
          {!isFixed ? (
            <>
              <div className="text-sm text-white/55">Rs.{item.rate.toLocaleString('en-IN')}</div>
              <div className="text-[10px] text-white/25">/{item.dimUnit}</div>
            </>
          ) : (
            <span className="text-xs text-white/20">Fixed</span>
          )}
        </div>
        <div className="text-right pt-0.5">
          <span className="text-sm font-bold" style={{ color: '#E8C97A' }}>{fmt(tot)}</span>
        </div>
      </div>
    </div>
  )
}
