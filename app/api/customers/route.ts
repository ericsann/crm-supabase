import { NextRequest, NextResponse } from 'next/server';
import { CustomerService } from '@/app/services';

/**
 * GET /api/customers
 * Busca todos os clientes
 */
export async function GET() {
  try {
    const customers = await CustomerService.getAll();
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/customers
 * Cria um novo cliente
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const customer = await CustomerService.create(body);
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}