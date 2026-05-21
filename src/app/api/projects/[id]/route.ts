import { NextRequest, NextResponse } from 'next/server'
import { readStore, writeStore } from '@/lib/localStore'

type Project = { id: string; images: string[]; [key: string]: any }

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const projects = await readStore<Project>('projects')
    const idx = projects.findIndex(p => p.id === params.id)
    if (idx === -1) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    if (body.images !== undefined && !Array.isArray(body.images)) body.images = []
    projects[idx] = { ...projects[idx], ...body, id: params.id }
    await writeStore('projects', projects)
    return NextResponse.json({ success: true, data: projects[idx] })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projects = await readStore<Project>('projects')
    await writeStore('projects', projects.filter(p => p.id !== params.id))
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
