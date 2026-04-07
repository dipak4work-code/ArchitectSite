'use client'

import { motion } from 'framer-motion'
import { Home, Building, Palette, Wrench, TreePine, Zap } from 'lucide-react'

const services = [
  {
    icon: Home,
    title: 'Residential Design',
    description: 'Custom home designs that reflect your lifestyle and create comfortable, beautiful living spaces.',
    features: ['Concept Development', 'Interior Design', 'Sustainable Solutions', 'Project Management']
  },
  {
    icon: Building,
    title: 'Commercial Architecture',
    description: 'Modern commercial spaces that enhance productivity and create lasting impressions.',
    features: ['Office Buildings', 'Retail Spaces', 'Hospitality Design', 'Workspace Planning']
  },
  {
    icon: Palette,
    title: 'Interior Design',
    description: 'Thoughtful interior solutions that blend functionality with aesthetic excellence.',
    features: ['Space Planning', 'Material Selection', 'Lighting Design', 'Furniture Layout']
  },
  {
    icon: Wrench,
    title: 'Renovation & Restoration',
    description: 'Breathe new life into existing spaces while preserving architectural heritage.',
    features: ['Historic Restoration', 'Modern Updates', 'Structural Renovation', 'Adaptive Reuse']
  },
  {
    icon: TreePine,
    title: 'Sustainable Design',
    description: 'Eco-friendly architectural solutions that minimize environmental impact.',
    features: ['Green Building', 'Energy Efficiency', 'Sustainable Materials', 'LEED Certification']
  },
  {
    icon: Zap,
    title: 'Consultation Services',
    description: 'Expert architectural consultation for planning, feasibility, and project guidance.',
    features: ['Site Analysis', 'Feasibility Studies', 'Cost Estimation', 'Regulatory Guidance']
  }
]

export function Services() {
  return (
    <section id="services" className="py-28" style={{ background: '#141414' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-label" style={{ color: '#C9A250' }}>What We Do</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight">
            Our Services
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed">
            From concept to completion, comprehensive architectural services tailored
            to your unique vision and requirements.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="group relative p-8 rounded-2xl border border-white/8 hover:border-[#C9A250]/40 transition-all duration-400 hover-lift overflow-hidden"
              style={{ background: '#1E1E1E' }}
            >
              {/* Subtle gold glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ background: 'radial-gradient(circle at 30% 20%, rgba(201,162,80,0.07) 0%, transparent 60%)' }} />

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 relative z-10"
                style={{ background: 'linear-gradient(135deg, rgba(232,201,122,0.15), rgba(154,120,53,0.1))' }}>
                <service.icon className="h-7 w-7" style={{ color: '#C9A250' }} />
              </div>

              <h3 className="text-xl font-bold text-white mb-3 relative z-10">
                {service.title}
              </h3>

              <p className="text-white/50 mb-6 leading-relaxed text-sm relative z-10">
                {service.description}
              </p>

              <ul className="space-y-2 relative z-10">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-white/40 group-hover:text-white/60 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#C9A250' }} />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Bottom gold line on hover */}
              <div className="absolute bottom-0 left-8 right-8 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                style={{ background: 'linear-gradient(90deg, #C9A250, transparent)' }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
