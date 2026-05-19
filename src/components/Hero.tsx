'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'

const stats = [
  { value: '50+', label: 'Projects' },
  { value: '6+', label: 'Years' },
  { value: '40+', label: 'Clients' },
]

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* ── Background ─────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 hero-gradient z-10" />
        <div className="absolute inset-0 z-10 opacity-25"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat', backgroundSize: '128px',
          }} />
        <img
          src="/api/placeholder/1920/1080"
          alt="Modern architectural design"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gold accent line -- top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 z-20"
        style={{ background: 'linear-gradient(90deg, transparent, #C9A250 30%, #C9A250 70%, transparent)' }} />

      {/* ── Main content -- centred, bottom-padded to clear stats ── */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        style={{ paddingBottom: '9rem' /* clears the stats row */ }}>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto"
        >
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="h-px w-10" style={{ background: '#C9A250' }} />
            <span className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: '#C9A250' }}>
              Construction &amp; Interior Experts
            </span>
            <div className="h-px w-10" style={{ background: '#C9A250' }} />
          </motion.div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[0.95] tracking-tight text-shadow-lg">
            Building
            <span className="block" style={{
              background: 'linear-gradient(135deg, #E8C97A 0%, #C9A250 50%, #9A7835 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Dreams,
            </span>
            <span className="block text-white">Creating Spaces</span>
          </h1>

          {/* Sub-copy */}
          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed font-light text-shadow">
            Complete construction and interior solutions -- from planning and design
            to execution and final finishing -- delivered with precision and passion.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="#portfolio"
              className="btn-primary group px-8 py-4 rounded-lg font-semibold text-sm tracking-wide flex items-center gap-2"
            >
              Explore Our Work
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button className="btn-outline group px-8 py-4 rounded-lg font-semibold text-sm tracking-wide flex items-center gap-2 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center group-hover:border-white/70 transition-colors">
                <Play className="h-3 w-3 fill-white ml-0.5" />
              </div>
              Watch Showreel
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── Stats bar -- direct child of section (bottom-anchored) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="absolute bottom-16 left-0 right-0 z-20 px-4"
      >
        {/* Subtle separator */}
        <div className="max-w-xs mx-auto h-px mb-8 opacity-30"
          style={{ background: 'linear-gradient(90deg, transparent, #C9A250, transparent)' }} />

        <div className="flex justify-center gap-10 sm:gap-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white text-shadow">{stat.value}</div>
              <div className="text-[10px] sm:text-xs tracking-[0.2em] uppercase mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Scroll indicator -- direct child of section ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-5 h-8 border border-white/25 rounded-full flex justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2 rounded-full"
            style={{ background: '#C9A250' }}
          />
        </div>
      </motion.div>

    </section>
  )
}
