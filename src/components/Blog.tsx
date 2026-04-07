'use client'

import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const blogPosts = [
  {
    id: 1,
    title: 'Sustainable Architecture: Building for Tomorrow',
    excerpt: 'Exploring innovative sustainable design practices that reduce environmental impact while creating beautiful, functional spaces.',
    author: 'Arun Sharma',
    date: '2024-01-15',
    category: 'Sustainability',
    image: '/api/placeholder/600/380',
    readTime: '5 min read'
  },
  {
    id: 2,
    title: 'The Evolution of Modern Indian Architecture',
    excerpt: 'How contemporary Indian architecture blends traditional elements with modern design principles to create unique cultural spaces.',
    author: 'Priya Patel',
    date: '2024-01-10',
    category: 'Design Trends',
    image: '/api/placeholder/600/380',
    readTime: '7 min read'
  },
  {
    id: 3,
    title: 'Smart Homes: Technology Meets Architecture',
    excerpt: 'Integrating cutting-edge technology into residential design for enhanced comfort, security, and energy efficiency.',
    author: 'Rajesh Kumar',
    date: '2024-01-05',
    category: 'Technology',
    image: '/api/placeholder/600/380',
    readTime: '6 min read'
  }
]

export function Blog() {
  return (
    <section id="blog" className="py-28" style={{ background: '#F7F4EF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-label">Insights</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#141414] mb-5 tracking-tight">
            Architectural Insights
          </h2>
          <p className="text-[#141414]/50 max-w-2xl mx-auto text-lg leading-relaxed">
            Stay updated with the latest trends, innovations, and insights from
            the world of architecture and design.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group rounded-2xl overflow-hidden shadow-sm hover-lift"
              style={{ background: '#FFFFFF' }}
            >
              {/* Image */}
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-7">
                {/* Meta */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                    style={{ background: 'rgba(201,162,80,0.12)', color: '#C9A250' }}>
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-[#141414]/40">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#141414] mb-3 leading-snug group-hover:text-[#C9A250] transition-colors duration-300">
                  {post.title}
                </h3>

                <p className="text-[#141414]/55 text-sm leading-relaxed mb-5">
                  {post.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-5 border-t border-[#EDE7DA]">
                  <div className="flex items-center gap-2 text-xs text-[#141414]/40">
                    <User className="h-3.5 w-3.5" />
                    <span>{post.author}</span>
                    <span className="w-1 h-1 rounded-full bg-[#141414]/20" />
                    <span>{post.readTime}</span>
                  </div>

                  <Link
                    href={`/blog/${post.id}`}
                    className="flex items-center gap-1.5 text-xs font-semibold tracking-wide group-hover:gap-2.5 transition-all"
                    style={{ color: '#C9A250' }}
                  >
                    Read More
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.article>
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
            href="/blog"
            className="inline-flex items-center gap-2.5 btn-primary px-8 py-4 rounded-lg font-semibold text-sm tracking-wide"
          >
            View All Articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
