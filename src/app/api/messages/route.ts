import { NextRequest, NextResponse } from 'next/server'
import { readStore, writeStore, generateId } from '@/lib/localStore'

type Message = {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export async function GET() {
  try {
    const messages = readStore<Message>('messages')
    messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return NextResponse.json({ success: true, data: messages })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const messages = readStore<Message>('messages')
    const newMessage: Message = {
      id: generateId(),
      name,
      email,
      phone: body.phone || '',
      subject,
      message,
      read: false,
      createdAt: new Date().toISOString(),
    }

    messages.unshift(newMessage)
    writeStore('messages', messages)

    return NextResponse.json({ success: true, data: newMessage }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
