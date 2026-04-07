import { NextRequest, NextResponse } from 'next/server'

// Mock data - replace with actual database queries
const projects = [
  {
    id: 1,
    title: 'Modern Villa Retreat',
    category: 'Residential',
    location: 'Mumbai, India',
    description: 'A contemporary villa design blending traditional Indian elements with modern aesthetics.',
    image: '/api/placeholder/600/400',
    featured: true,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'Corporate Headquarters',
    category: 'Commercial',
    location: 'Delhi, India',
    description: 'State-of-the-art office complex designed for productivity and employee well-being.',
    image: '/api/placeholder/600/400',
    featured: true,
    createdAt: '2024-01-10T10:00:00Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    let filteredProjects = projects

    if (category) {
      filteredProjects = filteredProjects.filter(p => p.category.toLowerCase() === category.toLowerCase())
    }

    if (featured === 'true') {
      filteredProjects = filteredProjects.filter(p => p.featured)
    }

    return NextResponse.json({
      success: true,
      data: filteredProjects
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { title, category, location, description } = body
    if (!title || !category || !location || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new project (mock implementation)
    const newProject = {
      id: projects.length + 1,
      ...body,
      createdAt: new Date().toISOString()
    }

    projects.push(newProject)

    return NextResponse.json({
      success: true,
      data: newProject
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
}