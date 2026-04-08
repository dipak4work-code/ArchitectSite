import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'general'

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Only image files are allowed' }, { status: 400 })
    }

    // Build upload directory inside public/uploads/<folder>
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Unique filename: timestamp + original name sanitised
    const ext = path.extname(file.name) || '.jpg'
    const base = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, '-').slice(0, 40)
    const filename = `${Date.now()}-${base}${ext}`
    const filepath = path.join(uploadDir, filename)

    const bytes = await file.arrayBuffer()
    fs.writeFileSync(filepath, Buffer.from(bytes))

    // Public URL accessible from the browser
    const url = `/uploads/${folder}/${filename}`

    return NextResponse.json({ success: true, url })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Upload failed' }, { status: 500 })
  }
}
