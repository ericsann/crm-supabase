import { NextRequest, NextResponse } from 'next/server';
import { TicketService } from '@/app/services';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * PUT /api/tickets/[id]
 * Atualiza um ticket
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const ticket = await TicketService.update(params.id, body);
    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Erro ao atualizar ticket:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/tickets/[id]/move
 * Move um ticket para outra coluna e atualiza a ordem
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const { kanban_column_id, order_in_column } = body;

    const updateData = {
      kanban_column_id,
      order_in_column,
      updated_at: new Date().toISOString()
    };

    const ticket = await TicketService.update(params.id, updateData);
    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Erro ao mover ticket:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}