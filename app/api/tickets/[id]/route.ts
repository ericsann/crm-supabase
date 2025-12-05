import { NextRequest } from 'next/server';
import { TicketService } from '@/app/services';
import { updateTicketSchema, moveTicketSchema, validateData } from '@/lib/validations';
import { createSuccessResponse, withErrorHandler, withRateLimit } from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/tickets/[id]
 * Busca um ticket com detalhes completos
 */
const getTicket = async (request: NextRequest, { params }: RouteParams) => {
  const resolvedParams = await params;
  const ticket = await TicketService.getTicketWithFullDetails(resolvedParams.id);

  if (!ticket) {
    throw new Error('Ticket não encontrado');
  }

  return createSuccessResponse(ticket);
};

/**
 * PUT /api/tickets/[id]
 * Atualiza um ticket
 */
const updateTicket = async (request: NextRequest, { params }: RouteParams) => {
  const body = await request.json();
  const resolvedParams = await params;
  const validatedData = validateData(updateTicketSchema, body);
  const ticket = await TicketService.update(resolvedParams.id, validatedData);
  return createSuccessResponse(ticket);
};

/**
 * DELETE /api/tickets/[id]
 * Exclui um ticket
 */
const deleteTicket = async (request: NextRequest, { params }: RouteParams) => {
  const resolvedParams = await params;
  await TicketService.delete(resolvedParams.id);
  return createSuccessResponse({ message: 'Ticket excluído com sucesso' });
};

/**
 * PATCH /api/tickets/[id]/move
 * Move um ticket para outra coluna e atualiza a ordem
 */
const moveTicket = async (request: NextRequest, { params }: RouteParams) => {
  const body = await request.json();
  const resolvedParams = await params;
  const validatedData = validateData(moveTicketSchema, body);

  const updateData = {
    ...validatedData,
    updated_at: new Date().toISOString()
  };

  const ticket = await TicketService.update(resolvedParams.id, updateData);
  return createSuccessResponse(ticket);
};

export const GET = withRateLimit(withErrorHandler(getTicket));
export const PUT = withRateLimit(withErrorHandler(updateTicket));
export const DELETE = withRateLimit(withErrorHandler(deleteTicket));
export const PATCH = withRateLimit(withErrorHandler(moveTicket));