'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 hero-gradient z-10" />
        {/* Subtle grain texture overlay */}
        <div className="absolute inset-0 z-10 opacity-30"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat', backgroundSize: '128px' }} />
        <img
          src="/api/placeholder/1920/1080"
          alt="Modern architectural design"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gold accent line — top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 z-20"
        style={{ background: 'linear-gradient(90deg, transparent, #C9A250 30%, #C9A250 70%, transparent)' }} />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
              Award-Winning Architecture
            </span>
            <div className="h-px w-10" style={{ background: '#C9A250' }} />
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[0.95] tracking-tight text-shadow-lg">
            Crafting
            <span className="block" style={{
              background: 'linear-gradient(135deg, #E8C97A 0%, #C9A250 50%, #9A7835 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Tomorrow's
            </span>
            <span className="block text-white">Dreams</span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed font-light text-shadow">
            We create innovative, sustainable architectural solutions that blend
            functionality with timeless aesthetic excellence.
          </p>

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

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-2xl"
        >
          <div className="flex justify-center gap-12">
            {[
              { value: '200+', label: 'Projects' },
              { value: '15+', label: 'Years' },
              { value: '50+', label: 'Awards' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white text-shadow">{stat.value}</div>
                <div className="text-xs tracking-widest uppercase text-white/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="w-5 h-8 border border-white/30 rounded-full flex justify-center pt-1.5">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1 h-2 rounded-full"
                style={{ background: '#C9A250' }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
