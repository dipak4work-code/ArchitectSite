import { NextRequest, NextResponse } from 'next/server'
import { readStore, writeStore } from '@/lib/localStore'

type Testimonial = { id: string; [key: string]: any }

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const items = await readStore<Testimonial>('testimonials')
    const idx = items.findIndex(t => t.id === params.id)
    if (idx === -1) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    items[idx] = { ...items[idx], ...body, id: params.id }
    await writeStore('testimonials', items)
    return NextResponse.json({ success: true, data: items[idx] })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const items = await readStore<Testimonial>('testimonials')
    await writeStore('testimonials', items.filter(t => t.id !== params.id))
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
