'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, Loader2 } from 'lucide-react'

type Testimonial = {
  id: string
  name: string
  position: string
  content: string
  rating: number
  image: string
}

const stats = [
  { value: '98%', label: 'Client Satisfaction' },
  { value: '200+', label: 'Projects Completed' },
  { value: '15+', label: 'Years Experience' },
  { value: '50+', label: 'Awards Won' },
]

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/testimonials?approved=true')
      .then(r => r.json())
      .then(data => { if (data.success) setTestimonials(data.data) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="testimonials" className="py-28" style={{ background: '#1A1A1A' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-label" style={{ color: '#C9A250' }}>Client Stories</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight">What Our Clients Say</h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed">
            The success of our work is measured by the satisfaction of those we serve.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#C9A250' }} />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            <p>No testimonials yet. Add some from the admin panel.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative p-8 rounded-2xl border border-white/8 hover:border-[#C9A250]/30 transition-all duration-400 group"
                style={{ background: '#242424' }}
              >
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="h-10 w-10" style={{ color: '#C9A250' }} />
                </div>

                <div className="flex gap-1 mb-5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4" style={{ fill: '#C9A250', color: '#C9A250' }} />
                  ))}
                </div>

                <p className="text-white/60 mb-8 leading-relaxed text-sm">"{t.content}"</p>

                <div className="flex items-center gap-3 pt-6 border-t border-white/8">
                  <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0"
                    style={{ border: '2px solid #C9A25044' }}>
                    {t.image
                      ? <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white font-bold">{t.name[0]}</div>
                    }
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-white/40 mt-0.5">{t.position}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden"
          style={{ background: '#C9A250' }}
        >
          {stats.map(stat => (
            <div key={stat.label} className="flex flex-col items-center justify-center py-10 px-6 text-center"
              style={{ background: '#1E1E1E' }}>
              <div className="text-4xl font-bold mb-2" style={{ color: '#C9A250' }}>{stat.value}</div>
              <div className="text-xs uppercase tracking-widest text-white/40">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
