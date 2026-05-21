import { NextRequest, NextResponse } from 'next/server'
import { readStore, writeStore, generateId } from '@/lib/localStore'

type Testimonial = {
  id: string; name: string; position: string; company: string
  content: string; rating: number; image: string; approved: boolean; createdAt: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const approved = searchParams.get('approved')
    let items = await readStore<Testimonial>('testimonials')
    if (approved === 'true') items = items.filter(t => t.approved)
    items = items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return NextResponse.json({ success: true, data: items })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, position, company, content } = body
    if (!name || !position || !company || !content)
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })

    const items = await readStore<Testimonial>('testimonials')
    const newItem: Testimonial = {
      id: generateId(), name, position, company, content,
      rating: body.rating || 5, image: body.image || '',
      approved: body.approved || false, createdAt: new Date().toISOString(),
    }
    items.unshift(newItem)
    await writeStore('testimonials', items)
    return NextResponse.json({ success: true, data: newItem }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
