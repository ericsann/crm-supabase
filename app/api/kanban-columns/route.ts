import { NextRequest, NextResponse } from 'next/server';
import { KanbanColumnService } from '@/app/services';

/**
 * GET /api/kanban-columns
 * Busca todas as colunas do kanban
 */
export async function GET() {
  try {
    const columns = await KanbanColumnService.getAll();
    return NextResponse.json(columns);
  } catch (error) {
    console.error('Erro ao buscar colunas do kanban:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}