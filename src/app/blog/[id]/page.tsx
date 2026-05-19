import { notFound } from 'next/navigation'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import { ArrowLeft, Clock, User, Tag } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  author: string
  category: string
  image?: string
  readTime: string
  published: boolean
  createdAt: string
}

function getPosts(): BlogPost[] {
  try {
    const file = path.join(process.cwd(), 'data', 'blog.json')
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch {
    return []
  }
}

export async function generateStaticParams() {
  return getPosts()
    .filter(p => p.published)
    .map(p => ({ id: p.id }))
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = getPosts().find(p => p.id === params.id && p.published)
  if (!post) notFound()

  const date = new Date(post.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div style={{ background: '#FDFBF8', minHeight: '100vh' }}>
      {/* Header bar */}
      <div style={{ background: '#141414', borderBottom: '1px solid rgba(201,162,80,0.2)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-white text-lg">
            <span>Shreeji</span>
            <span style={{ color: '#C9A250' }}>Associate</span>
          </Link>
          <Link href="/#blog" className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Articles
          </Link>
        </div>
      </div>

      {/* Hero image */}
      {post.image && (
        <div className="w-full aspect-video max-h-[480px] overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        {/* Category badge */}
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-5"
          style={{ background: 'rgba(201,162,80,0.12)', color: '#C9A250', border: '1px solid rgba(201,162,80,0.3)' }}>
          {post.category}
        </span>

        <h1 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight" style={{ color: '#141414' }}>
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-5 mb-8 pb-8"
          style={{ borderBottom: '1px solid #EDE7DA' }}>
          <div className="flex items-center gap-2 text-sm" style={{ color: '#141414' + '88' }}>
            <User className="h-4 w-4" style={{ color: '#C9A250' }} />
            {post.author}
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: '#141414' + '88' }}>
            <Clock className="h-4 w-4" style={{ color: '#C9A250' }} />
            {post.readTime}
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: '#141414' + '88' }}>
            <Tag className="h-4 w-4" style={{ color: '#C9A250' }} />
            {date}
          </div>
        </div>

        {/* Body */}
        <div className="prose prose-lg max-w-none" style={{ color: '#141414CC' }}>
          <p className="text-lg leading-relaxed">{post.excerpt}</p>
        </div>

        {/* CTA */}
        <div className="mt-14 pt-10" style={{ borderTop: '1px solid #EDE7DA' }}>
          <p className="text-sm mb-4" style={{ color: '#141414' + '66' }}>
            Interested in our work? Get in touch.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/#contact"
              className="px-6 py-3 rounded-lg font-semibold text-sm"
              style={{ background: '#141414', color: '#C9A250' }}>
              Contact Us
            </Link>
            <Link href="/#blog"
              className="px-6 py-3 rounded-lg font-semibold text-sm border"
              style={{ borderColor: '#C9A250', color: '#C9A250' }}>
              More Articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
