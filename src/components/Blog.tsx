'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

type Post = {
  id: string
  title: string
  excerpt: string
  author: string
  createdAt: string
  category: string
  image: string
  readTime: string
}

export function Blog() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blog?published=true')
      .then(r => r.json())
      .then(data => { if (data.success) setPosts(data.data.slice(0, 3)) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="blog" className="py-28" style={{ background: '#F7F4EF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-label">Insights</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#141414] mb-5 tracking-tight">Architectural Insights</h2>
          <p className="text-[#141414]/50 max-w-2xl mx-auto text-lg leading-relaxed">
            Stay updated with the latest trends, innovations, and insights from the world of architecture and design.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#C9A250' }} />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 text-[#141414]/40">
            <p>No published posts yet. Add some from the admin panel.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group rounded-2xl overflow-hidden shadow-sm hover-lift"
                style={{ background: '#FFFFFF' }}
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image || '/api/placeholder/600/380'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                      style={{ background: 'rgba(201,162,80,0.12)', color: '#C9A250' }}>
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-[#141414]/40">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#141414] mb-3 leading-snug group-hover:text-[#C9A250] transition-colors duration-300">
                    {post.title}
                  </h3>

                  <p className="text-[#141414]/55 text-sm leading-relaxed mb-5">{post.excerpt}</p>

                  <div className="flex items-center justify-between pt-5 border-t border-[#EDE7DA]">
                    <div className="flex items-center gap-2 text-xs text-[#141414]/40">
                      <User className="h-3.5 w-3.5" />
                      <span>{post.author}</span>
                      <span className="w-1 h-1 rounded-full bg-[#141414]/20" />
                      <span>{post.readTime}</span>
                    </div>
                    <Link href={`/blog/${post.id}`}
                      className="flex items-center gap-1.5 text-xs font-semibold tracking-wide group-hover:gap-2.5 transition-all"
                      style={{ color: '#C9A250' }}>
                      Read More <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
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
          <Link href="/blog" className="inline-flex items-center gap-2.5 btn-primary px-8 py-4 rounded-lg font-semibold text-sm tracking-wide">
            View All Articles <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
