import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'data', 'quotation.json')

export async function GET() {
  try {
    const raw = fs.readFileSync(FILE, 'utf-8')
    return NextResponse.json({ success: true, data: JSON.parse(raw) })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    fs.writeFileSync(FILE, JSON.stringify(body, null, 2), 'utf-8')
    return NextResponse.json({ success: true, data: body })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
