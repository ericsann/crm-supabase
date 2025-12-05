import { NextRequest } from 'next/server';
import { TicketService } from '../../services/ticketService';
import { createTicketSchema, validateData } from '@/lib/validations';
import { createSuccessResponse, withErrorHandler, withRateLimit } from '@/lib/api-utils';

/**
 * GET /api/tickets
 * Busca todos os tickets com relações
 */
const getTickets = async () => {
  const tickets = await TicketService.getAllWithRelations();
  return createSuccessResponse(tickets);
};

/**
 * POST /api/tickets
 * Cria um novo ticket
 */
const createTicket = async (request: NextRequest) => {
  const body = await request.json();
  const validatedData = validateData(createTicketSchema, body);
  const ticket = await TicketService.create(validatedData);
  return createSuccessResponse(ticket, 201);
};

export const GET = withRateLimit(withErrorHandler(getTickets));
export const POST = withRateLimit(withErrorHandler(createTicket));