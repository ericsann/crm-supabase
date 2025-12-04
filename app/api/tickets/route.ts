import { NextRequest, NextResponse } from 'next/server';
import { TicketService } from '@/app/services';

/**
 * GET /api/tickets
 * Busca todos os tickets com relações
 */
export async function GET() {
  try {
    const tickets = await TicketService.getAllWithRelations();
    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Erro ao buscar tickets:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tickets
 * Cria um novo ticket
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ticket = await TicketService.create(body);
    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}