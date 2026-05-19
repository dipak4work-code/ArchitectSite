'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, ChevronLeft, ChevronRight, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import Link from 'next/link'

type Project = {
  id: string
  title: string
  category: string
  location: string
  images: string[]
  description: string
}

/* ── Per-card mini carousel ───────────────────────────── */
function ProjectCard({ project, index, onExpand }: {
  project: Project
  index: number
  onExpand: (p: Project, idx: number) => void
}) {
  const [current, setCurrent] = useState(0)
  const images = project.images?.length ? project.images : ['']
  const total = images.length

  function prev(e: React.MouseEvent) {
    e.stopPropagation()
    setCurrent(c => (c - 1 + total) % total)
  }
  function next(e: React.MouseEvent) {
    e.stopPropagation()
    setCurrent(c => (c + 1) % total)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-2xl shadow-md hover-lift"
      style={{ background: '#141414' }}
    >
      {/* Image area */}
      <div className="aspect-[4/3] overflow-hidden relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={current}
            src={images[current] || '/api/placeholder/600/400'}
            alt={project.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Category pill */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ background: '#C9A250', color: '#141414' }}>
            {project.category}
          </span>
        </div>

        {/* Image counter */}
        {total > 1 && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
            <ImageIcon className="h-3 w-3" />
            {current + 1}/{total}
          </div>
        )}

        {/* Carousel controls -- visible on hover when multiple images */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setCurrent(i) }}
                className={`rounded-full transition-all ${i === current ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'}`}
              />
            ))}
          </div>
        )}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{ background: 'linear-gradient(to top, rgba(20,20,20,0.95) 0%, rgba(20,20,20,0.3) 60%, transparent 100%)' }} />
      </div>

      {/* Content overlay on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
        <div className="flex items-end justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white mb-0.5 leading-tight">{project.title}</h3>
            <p className="text-xs text-white/50 mb-1.5">{project.location}</p>
            <p className="text-xs text-white/60 line-clamp-2">{project.description}</p>
          </div>
          <button
            onClick={() => onExpand(project, current)}
            className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center border border-white/25 hover:border-[#C9A250] hover:text-[#C9A250] text-white/70 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Fullscreen lightbox ──────────────────────────────── */
function Lightbox({ project, startIdx, onClose }: {
  project: Project
  startIdx: number
  onClose: () => void
}) {
  const [current, setCurrent] = useState(startIdx)
  const images = project.images || []
  const total = images.length

  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total])
  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next, onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col"
      onClick={onClose}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" onClick={e => e.stopPropagation()}>
        <div>
          <h3 className="text-white font-bold text-lg">{project.title}</h3>
          <p className="text-white/40 text-sm">{project.location} · {project.category}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-sm">{current + 1} / {total}</span>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main image */}
      <div className="flex-1 flex items-center justify-center px-16 relative min-h-0" onClick={e => e.stopPropagation()}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={current}
            src={images[current]}
            alt={`${project.title} ${current + 1}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="max-w-full max-h-full object-contain rounded-xl"
          />
        </AnimatePresence>

        {total > 1 && (
          <>
            <button onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors">
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {total > 1 && (
        <div className="flex-shrink-0 px-6 py-4 flex gap-2 justify-center overflow-x-auto" onClick={e => e.stopPropagation()}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === current ? 'border-[#C9A250] opacity-100' : 'border-transparent opacity-40 hover:opacity-70'}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  )
}

/* ── Main section ─────────────────────────────────────── */
export function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<{ project: Project; idx: number } | null>(null)

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => { if (data.success) setProjects(data.data) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="portfolio" className="py-28" style={{ background: '#FDFBF8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-label">Our Work</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#141414] mb-5 tracking-tight">Featured Projects</h2>
          <p className="text-[#141414]/50 max-w-2xl mx-auto text-lg leading-relaxed">
            Explore our diverse collection of projects. Hover to browse images, click to view full gallery.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#C9A250' }} />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 text-[#141414]/40">
            <p>No projects yet. Add some from the admin panel.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onExpand={(p, idx) => setLightbox({ project: p, idx })}
              />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/#portfolio" className="inline-flex items-center gap-2.5 btn-primary px-8 py-4 rounded-lg font-semibold text-sm tracking-wide">
            View All Projects <ExternalLink className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>

      {/* Fullscreen lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            project={lightbox.project}
            startIdx={lightbox.idx}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
