import { TicketService } from '../../../services/ticketService';
import { createSuccessResponse, withErrorHandler, withRateLimit } from '@/lib/api-utils';

/**
 * GET /api/tickets/open
 * Busca todos os tickets abertos com detalhes completos (customer, kanban_column, events, messages)
 */
const getOpenTickets = async () => {
  const tickets = await TicketService.getOpenTicketsWithFullDetails();
  return createSuccessResponse(tickets);
};

export const GET = withRateLimit(withErrorHandler(getOpenTickets));