import { NextRequest, NextResponse } from 'next/server';
import { CustomerService } from '@/app/services';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * PUT /api/customers/[id]
 * Atualiza um cliente
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const customer = await CustomerService.update(params.id, body);
    return NextResponse.json(customer);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/customers/[id]
 * Deleta um cliente
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await CustomerService.delete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}