import { NextRequest, NextResponse } from 'next/server'
import { readStore, writeStore } from '@/lib/localStore'

type Settings = {
  id: string
  general: Record<string, string>
  social: Record<string, string>
  seo: Record<string, string>
}

const defaults: Settings = {
  id: 'main',
  general: {
    siteName: 'Shreeji Associate',
    tagline: 'Building Dreams, Creating Spaces',
    email: 'jayshah5059@gmail.com',
    phone: '+91 9173034401',
    address: 'FF 1, Sheeltal Plaza, Ajwa Road, Vadodara, Gujarat'
  },
  social: {
    instagram: 'https://instagram.com/shreejiassociate',
    facebook: '',
    twitter: 'https://twitter.com/shreejiassociate',
    linkedin: 'https://linkedin.com/company/shreejiassociate'
  },
  seo: {
    metaTitle: 'Shreeji Associate - Construction & Interior Company Vadodara',
    metaDescription: 'Shreeji Associate - dedicated construction and interior company in Vadodara specializing in residential construction, commercial projects, and interior designing.',
    keywords: 'construction, interior design, Vadodara, Shreeji Associate, residential, commercial, renovation, turnkey solutions'
  }
}

export async function GET() {
  try {
    const items = await readStore<Settings>('settings')
    return NextResponse.json({ success: true, data: items[0] || defaults })
  } catch {
    return NextResponse.json({ success: true, data: defaults })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const updated: Settings = { ...defaults, ...body, id: 'main' }
    await writeStore('settings', [updated])
    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
