'use client'

import { motion } from 'framer-motion'
import { Award, Users, MapPin, Calendar } from 'lucide-react'

const stats = [
  { icon: Award, label: 'Projects Done', value: '50+' },
  { icon: Users, label: 'Happy Clients', value: '40+' },
  { icon: Calendar, label: 'Years Experience', value: '6+' },
  { icon: MapPin, label: 'Services Offered', value: '6' },
]

export function About() {
  return (
    <section id="about" className="py-28" style={{ background: '#FDFBF8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/api/placeholder/600/750"
                alt="Shreeji Associate team at work"
                className="w-full h-full object-cover"
              />
              {/* Gold corner accent */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 rounded-tl-2xl"
                style={{ borderColor: '#C9A250' }} />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 rounded-br-2xl"
                style={{ borderColor: '#C9A250' }} />
            </div>

            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="absolute -bottom-6 -right-6 bg-[#141414] p-6 rounded-2xl shadow-2xl border border-white/8"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #E8C97A, #9A7835)' }}>
                  <Award className="h-6 w-6 text-[#141414]" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Trusted Partner</div>
                  <div className="text-xs text-white/50 mt-0.5">Jeevandeep Trust College</div>
                </div>
              </div>
            </motion.div>

            {/* Years badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              viewport={{ once: true }}
              className="absolute -top-4 -right-4 w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-xl"
              style={{ background: 'linear-gradient(135deg, #E8C97A, #9A7835)' }}
            >
              <div className="text-2xl font-bold text-[#141414] leading-none">6+</div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-[#141414]/70">Years</div>
            </motion.div>
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <span className="section-label">Our Story</span>

            <h2 className="text-4xl md:text-5xl font-bold text-[#141414] mb-6 leading-tight tracking-tight">
              Building Dreams,
              <span className="block" style={{ color: '#C9A250' }}>Creating Spaces</span>
            </h2>

            <div className="gold-divider" />

            <p className="text-[#141414]/65 mb-5 leading-relaxed text-lg">
              Shreeji Associate is a dedicated construction and interior company built on quality, trust,
              innovation, and commitment. Founded by <strong className="text-[#141414]/80">Mr. Jay B. Shah</strong> (Civil Engineer),
              with 6+ years of practical site experience, our mission is to deliver complete construction
              and interior solutions that turn our clients' dreams into reality.
            </p>

            <p className="text-[#141414]/55 mb-10 leading-relaxed">
              We specialize in residential construction, commercial projects, interior designing,
              renovation, turnkey solutions, and site consultancy -- managing every stage with
              professionalism and attention to detail. One of our proud achievements is securing the
              commercial project contract for <em>Jeevandeep Trust College</em>, reflecting the trust
              clients place in our work.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 p-4 rounded-xl border"
                  style={{ borderColor: '#EDE7DA', background: '#F7F4EF' }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #E8C97A22, #C9A25022)' }}>
                    <stat.icon className="h-5 w-5" style={{ color: '#C9A250' }} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#141414]">{stat.value}</div>
                    <div className="text-xs text-[#141414]/50 mt-0.5">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
