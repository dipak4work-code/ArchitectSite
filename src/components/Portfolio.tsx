'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Eye } from 'lucide-react'
import Link from 'next/link'

const projects = [
  { id: 1, title: 'Modern Villa Retreat', category: 'Residential', location: 'Mumbai, India', image: '/api/placeholder/600/400', description: 'A contemporary villa blending traditional Indian elements with modern aesthetics.' },
  { id: 2, title: 'Corporate Headquarters', category: 'Commercial', location: 'Delhi, India', image: '/api/placeholder/600/400', description: 'State-of-the-art office complex designed for productivity and well-being.' },
  { id: 3, title: 'Cultural Center', category: 'Public', location: 'Bangalore, India', image: '/api/placeholder/600/400', description: 'Community space celebrating local culture with sustainable architectural practices.' },
  { id: 4, title: 'Luxury Apartment Complex', category: 'Residential', location: 'Chennai, India', image: '/api/placeholder/600/400', description: 'High-end residential development with premium amenities and green spaces.' },
  { id: 5, title: 'Restaurant & Bar', category: 'Hospitality', location: 'Pune, India', image: '/api/placeholder/600/400', description: 'Elegant dining space combining contemporary design with local culinary traditions.' },
  { id: 6, title: 'Educational Campus', category: 'Education', location: 'Hyderabad, India', image: '/api/placeholder/600/400', description: 'Modern learning environment designed to inspire creativity and collaboration.' }
]

export function Portfolio() {
  return (
    <section id="portfolio" className="py-28" style={{ background: '#FDFBF8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-label">Our Work</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#141414] mb-5 tracking-tight">
            Featured Projects
          </h2>
          <p className="text-[#141414]/50 max-w-2xl mx-auto text-lg leading-relaxed">
            Explore our diverse collection of projects showcasing innovation,
            sustainability, and timeless design excellence.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl shadow-md hover-lift"
              style={{ background: '#141414' }}
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  style={{ '--tw-scale-x': '1.08', '--tw-scale-y': '1.08' } as React.CSSProperties}
                />
              </div>

              {/* Category pill */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{ background: '#C9A250', color: '#141414' }}>
                  {project.category}
                </span>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: 'linear-gradient(to top, rgba(20,20,20,0.95) 0%, rgba(20,20,20,0.5) 60%, transparent 100%)' }} />

              {/* Content on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                <div className="flex items-end justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="text-lg font-bold text-white mb-1 leading-tight">{project.title}</h3>
                    <p className="text-xs text-white/50 mb-2">{project.location}</p>
                    <p className="text-sm text-white/60 line-clamp-2">{project.description}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="w-9 h-9 rounded-full flex items-center justify-center border border-white/25 hover:border-[#C9A250] hover:text-[#C9A250] text-white/70 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="w-9 h-9 rounded-full flex items-center justify-center border border-white/25 hover:border-[#C9A250] hover:text-[#C9A250] text-white/70 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2.5 btn-primary px-8 py-4 rounded-lg font-semibold text-sm tracking-wide"
          >
            View All Projects
            <ExternalLink className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
