import { NextRequest, NextResponse } from 'next/server'
import { readStore, writeStore, generateId } from '@/lib/localStore'

type Post = {
  id: string
  title: string
  excerpt: string
  author: string
  category: string
  image: string
  readTime: string
  published: boolean
  createdAt: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')

    let posts = readStore<Post>('blog')
    if (published === 'true') posts = posts.filter(p => p.published)
    posts = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ success: true, data: posts })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, excerpt, author, category } = body

    if (!title || !excerpt || !author || !category) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const posts = readStore<Post>('blog')
    const newPost: Post = {
      id: generateId(),
      title,
      excerpt,
      author,
      category,
      image: body.image || '',
      readTime: body.readTime || '5 min read',
      published: body.published || false,
      createdAt: new Date().toISOString(),
    }

    posts.unshift(newPost)
    writeStore('blog', posts)

    return NextResponse.json({ success: true, data: newPost }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
