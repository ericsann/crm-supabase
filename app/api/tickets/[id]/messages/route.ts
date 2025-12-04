import { NextRequest, NextResponse } from 'next/server'
import { ticketService } from '@/lib/services/ticketService'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const messages = await ticketService.getMessages(params.id)
    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const message = await ticketService.addMessage({
      ...body,
      ticket_id: params.id
    })
    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add message' }, { status: 500 })
  }
}