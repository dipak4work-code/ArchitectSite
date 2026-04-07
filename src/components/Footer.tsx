'use client'

import { Building2, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'

const footerLinks = {
  services: [
    { name: 'Residential Design', href: '#services' },
    { name: 'Commercial Architecture', href: '#services' },
    { name: 'Interior Design', href: '#services' },
    { name: 'Renovation & Restoration', href: '#services' },
    { name: 'Sustainable Design', href: '#services' },
    { name: 'Consultation Services', href: '#services' }
  ],
  company: [
    { name: 'About Us', href: '#about' },
    { name: 'Our Portfolio', href: '#portfolio' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Blog', href: '#blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '#contact' }
  ]
}

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' }
]

export function Footer() {
  return (
    <footer style={{ background: '#0D0D0D' }}>
      {/* Gold top line */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #C9A250 20%, #C9A250 80%, transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #E8C97A, #9A7835)' }}>
                <Building2 className="h-5 w-5 text-[#141414]" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                Architect<span style={{ color: '#C9A250' }}>Studio</span>
              </span>
            </Link>

            <p className="text-white/35 text-sm leading-relaxed mb-7">
              Crafting architectural excellence with innovative design solutions
              that blend functionality, aesthetics, and sustainability.
            </p>

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center border border-white/10 text-white/35 hover:border-[#C9A250]/50 hover:text-[#C9A250] transition-all duration-300"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-5">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}
                    className="text-sm text-white/35 hover:text-[#C9A250] transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-5">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}
                    className="text-sm text-white/35 hover:text-[#C9A250] transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-5">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: '#C9A250' }} />
                <div className="text-sm text-white/35 leading-relaxed">
                  123 Architecture Avenue<br />Mumbai, Maharashtra 400001<br />India
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0" style={{ color: '#C9A250' }} />
                <span className="text-sm text-white/35">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0" style={{ color: '#C9A250' }} />
                <span className="text-sm text-white/35">info@architectstudio.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/6">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} Architect Studio. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map(item => (
              <Link key={item} href={`/${item.toLowerCase()}`}
                className="text-xs text-white/25 hover:text-[#C9A250] transition-colors duration-200">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
