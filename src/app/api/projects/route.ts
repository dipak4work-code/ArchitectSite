import { NextRequest, NextResponse } from 'next/server'
import { readStore, writeStore, generateId } from '@/lib/localStore'

type Project = {
  id: string
  title: string
  category: string
  location: string
  description: string
  images: string[]
  featured: boolean
  createdAt: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    let projects = readStore<Project>('projects')

    if (category) projects = projects.filter(p => p.category.toLowerCase() === category.toLowerCase())
    if (featured === 'true') projects = projects.filter(p => p.featured)

    projects = projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ success: true, data: projects })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, category, location, description } = body

    if (!title || !category || !location || !description) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const projects = readStore<Project>('projects')
    const newProject: Project = {
      id: generateId(),
      title,
      category,
      location,
      description,
      images: Array.isArray(body.images) ? body.images : [],
      featured: body.featured || false,
      createdAt: new Date().toISOString(),
    }

    projects.unshift(newProject)
    writeStore('projects', projects)

    return NextResponse.json({ success: true, data: newProject }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
