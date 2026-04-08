import { NextRequest, NextResponse } from 'next/server'
import { readStore, writeStore } from '@/lib/localStore'

type Post = { id: string; [key: string]: any }

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const posts = readStore<Post>('blog')
    const idx = posts.findIndex(p => p.id === params.id)
    if (idx === -1) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    posts[idx] = { ...posts[idx], ...body, id: params.id }
    writeStore('blog', posts)

    return NextResponse.json({ success: true, data: posts[idx] })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const posts = readStore<Post>('blog')
    writeStore('blog', posts.filter(p => p.id !== params.id))
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
