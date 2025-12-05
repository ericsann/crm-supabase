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

export const PUT = withRateLimit(withErrorHandler(updateTicket));
export const PATCH = withRateLimit(withErrorHandler(moveTicket));