import { NextRequest, NextResponse } from 'next/server'
import { readStore, writeStore } from '@/lib/localStore'

type Message = { id: string; read: boolean; [key: string]: any }

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const messages = readStore<Message>('messages')
    const idx = messages.findIndex(m => m.id === params.id)
    if (idx === -1) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    messages[idx] = { ...messages[idx], ...body, id: params.id }
    writeStore('messages', messages)

    return NextResponse.json({ success: true, data: messages[idx] })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const messages = readStore<Message>('messages')
    writeStore('messages', messages.filter(m => m.id !== params.id))
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
