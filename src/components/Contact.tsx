'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import { useState } from 'react'

const contactInfo = [
  { icon: MapPin, title: 'Address', details: ['123 Architecture Avenue', 'Mumbai, Maharashtra 400001', 'India'] },
  { icon: Phone, title: 'Phone', details: ['+91 98765 43210', '+91 98765 43211'] },
  { icon: Mail, title: 'Email', details: ['info@architectstudio.com', 'projects@architectstudio.com'] },
  { icon: Clock, title: 'Business Hours', details: ['Mon – Fri: 9:00 AM – 6:00 PM', 'Sat: 10:00 AM – 4:00 PM', 'Sun: Closed'] }
]

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <section id="contact" className="py-28" style={{ background: '#141414' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-label" style={{ color: '#C9A250' }}>Let's Talk</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight">
            Get In Touch
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed">
            Ready to bring your architectural vision to life? Let's discuss your project
            and create something extraordinary together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="p-8 rounded-2xl border border-white/8" style={{ background: '#1E1E1E' }}>
              <h3 className="text-xl font-bold text-white mb-7">Send us a Message</h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Full Name *</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange}
                      className="input-luxury" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Email Address *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange}
                      className="input-luxury" placeholder="your@email.com" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                      className="input-luxury" placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Service *</label>
                    <select name="subject" required value={formData.subject} onChange={handleChange} className="input-luxury">
                      <option value="" style={{ background: '#1E1E1E' }}>Select a service</option>
                      <option value="residential" style={{ background: '#1E1E1E' }}>Residential Design</option>
                      <option value="commercial" style={{ background: '#1E1E1E' }}>Commercial Architecture</option>
                      <option value="interior" style={{ background: '#1E1E1E' }}>Interior Design</option>
                      <option value="renovation" style={{ background: '#1E1E1E' }}>Renovation & Restoration</option>
                      <option value="consultation" style={{ background: '#1E1E1E' }}>Consultation Services</option>
                      <option value="other" style={{ background: '#1E1E1E' }}>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Message *</label>
                  <textarea name="message" required rows={5} value={formData.message} onChange={handleChange}
                    className="input-luxury resize-none" placeholder="Tell us about your project..." />
                </div>

                <button type="submit"
                  className="w-full btn-primary py-4 px-6 rounded-lg font-bold text-sm tracking-wide flex items-center justify-center gap-2.5 mt-2">
                  Send Message
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-5"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-4 p-5 rounded-2xl border border-white/8 hover:border-[#C9A250]/30 transition-colors"
                style={{ background: '#1E1E1E' }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, rgba(232,201,122,0.15), rgba(154,120,53,0.1))' }}>
                  <info.icon className="h-5 w-5" style={{ color: '#C9A250' }} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-1.5">{info.title}</h4>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-sm text-white/65 leading-relaxed">{detail}</p>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden border border-white/8 aspect-video flex items-center justify-center"
              style={{ background: '#1E1E1E' }}>
              <div className="text-center text-white/20">
                <MapPin className="h-10 w-10 mx-auto mb-2" style={{ color: '#C9A250', opacity: 0.5 }} />
                <p className="text-sm font-medium text-white/30">Interactive Map</p>
                <p className="text-xs text-white/20">Coming Soon</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
