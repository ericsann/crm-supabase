import { NextRequest, NextResponse } from 'next/server'
import { ticketService } from '@/lib/services/ticketService'

export async function GET() {
  try {
    const tickets = await ticketService.getAll()
    return NextResponse.json(tickets)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const ticket = await ticketService.create(body)
    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
  }
}