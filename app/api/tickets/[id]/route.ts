import { NextRequest, NextResponse } from 'next/server'
import { ticketService } from '@/lib/services/ticketService'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticket = await ticketService.getById(params.id)
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }
    return NextResponse.json(ticket)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ticket' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const ticket = await ticketService.update(params.id, body)
    return NextResponse.json(ticket)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ticketService.delete(params.id)
    return NextResponse.json({ message: 'Ticket deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete ticket' }, { status: 500 })
  }
}