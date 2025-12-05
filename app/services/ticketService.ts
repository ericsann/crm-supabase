import { supabase } from '@/lib/supabase';
import { Tables, TablesInsert, TablesUpdate } from '@/database.types';
import { TicketEventService } from './ticketEventService';
import { TicketMessageService } from './ticketMessageService';
import { unstable_cache, revalidateTag } from 'next/cache';

type Ticket = Tables<'tickets'>;
type TicketInsert = TablesInsert<'tickets'>;
type TicketUpdate = TablesUpdate<'tickets'>;

// Tipos para queries com joins
type TicketWithRelations = Ticket & {
  customers: Pick<Tables<'customers'>, 'id' | 'name' | 'email' | 'phone'> | null;
  kanban_columns: Pick<Tables<'kanban_columns'>, 'id' | 'name' | 'position'> | null;
};

type TicketWithFullDetails = Ticket & {
  customers: Pick<Tables<'customers'>, 'id' | 'name' | 'email' | 'phone'> | null;
  kanban_columns: Pick<Tables<'kanban_columns'>, 'id' | 'name' | 'position'> | null;
  ticket_events: Tables<'ticket_events'>[];
  ticket_messages: Tables<'ticket_messages'>[];
};

/**
 * Serviço para operações CRUD na tabela tickets
 */
export class TicketService {
  /**
    * Criar um novo ticket
    */
  static async create(data: TicketInsert): Promise<Ticket> {
    const { data: ticket, error } = await supabase
      .from('tickets')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar ticket: ${error.message}`);
    }

    // Revalidar cache após criação
    revalidateTag('tickets', 'max');
    revalidateTag('tickets-with-relations', 'max');
    revalidateTag('tickets-open-full', 'max');

    return ticket;
  }

  /**
    * Buscar todos os tickets
    */
  static async getAll(): Promise<Ticket[]> {
    return unstable_cache(
      async () => {
        const { data: tickets, error } = await supabase
          .from('tickets')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(`Erro ao buscar tickets: ${error.message}`);
        }

        return tickets || [];
      },
      ['tickets'],
      { tags: ['tickets'] }
    )();
  }

  /**
    * Buscar ticket por ID
    */
  static async getById(id: string): Promise<Ticket | null> {
    return unstable_cache(
      async () => {
        const { data: ticket, error } = await supabase
          .from('tickets')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            return null; // Ticket não encontrado
          }
          throw new Error(`Erro ao buscar ticket: ${error.message}`);
        }

        return ticket;
      },
      ['ticket', id],
      { tags: [`ticket-${id}`] }
    )();
  }

  /**
    * Buscar tickets por customer_id
    */
  static async getByCustomerId(customerId: string): Promise<Ticket[]> {
    return unstable_cache(
      async () => {
        const { data: tickets, error } = await supabase
          .from('tickets')
          .select('*')
          .eq('customer_id', customerId)
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(`Erro ao buscar tickets do cliente: ${error.message}`);
        }

        return tickets || [];
      },
      ['tickets-customer', customerId],
      { tags: [`tickets-customer-${customerId}`] }
    )();
  }

  /**
    * Buscar tickets por kanban_column_id
    */
  static async getByKanbanColumnId(columnId: string): Promise<Ticket[]> {
    return unstable_cache(
      async () => {
        const { data: tickets, error } = await supabase
          .from('tickets')
          .select('*')
          .eq('kanban_column_id', columnId)
          .order('order_in_column', { ascending: true });

        if (error) {
          throw new Error(`Erro ao buscar tickets da coluna: ${error.message}`);
        }

        return tickets || [];
      },
      ['tickets-column', columnId],
      { tags: [`tickets-column-${columnId}`] }
    )();
  }

  /**
    * Buscar tickets por assigned_to
    */
  static async getByAssignedTo(assignedTo: string): Promise<Ticket[]> {
    return unstable_cache(
      async () => {
        const { data: tickets, error } = await supabase
          .from('tickets')
          .select('*')
          .eq('assigned_to', assignedTo)
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(`Erro ao buscar tickets atribuídos: ${error.message}`);
        }

        return tickets || [];
      },
      ['tickets-assigned', assignedTo],
      { tags: [`tickets-assigned-${assignedTo}`] }
    )();
  }

  /**
    * Buscar tickets com joins (customer e kanban_column)
    */
  static async getAllWithRelations(): Promise<TicketWithRelations[]> {
    return unstable_cache(
      async () => {
        const { data: tickets, error } = await supabase
          .from('tickets')
          .select(
            `
            *,
            customers:customer_id (
              id,
              name,
              email,
              phone
            ),
            kanban_columns:kanban_column_id (
              id,
              name,
              position
            )
          `
          )
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(`Erro ao buscar tickets com relações: ${error.message}`);
        }

        return tickets || [];
      },
      ['tickets-with-relations'],
      { tags: ['tickets-with-relations'] }
    )();
  }

  /**
    * Buscar tickets abertos com todas as relações (customer, kanban_column, events, messages)
    */
  static async getOpenTicketsWithFullDetails(): Promise<TicketWithFullDetails[]> {
    return unstable_cache(
      async () => {
        // Primeiro buscar tickets abertos (não fechados)
        const { data: tickets, error: ticketsError } = await supabase
          .from('tickets')
          .select(
            `
            *,
            customers:customer_id (
              id,
              name,
              email,
              phone
            ),
            kanban_columns:kanban_column_id (
              id,
              name,
              position
            )
          `
          )
          .or('status.is.null,status.neq.closed')
          .order('created_at', { ascending: false });

        if (ticketsError) {
          throw new Error(`Erro ao buscar tickets abertos: ${ticketsError.message}`);
        }

        if (!tickets || tickets.length === 0) {
          return [];
        }

        // Para cada ticket, buscar events e messages
        const ticketsWithDetails = await Promise.all(
          tickets.map(async (ticket) => {
            const [events, messages] = await Promise.all([
              TicketEventService.getByTicketId(ticket.id),
              TicketMessageService.getByTicketId(ticket.id)
            ]);

            return {
              ...ticket,
              ticket_events: events,
              ticket_messages: messages
            };
          })
        );

        return ticketsWithDetails;
      },
      ['tickets-open-full'],
      { tags: ['tickets-open-full'] }
    )();
  }

  /**
    * Buscar ticket específico com todas as relações completas
    */
  static async getTicketWithFullDetails(id: string): Promise<TicketWithFullDetails | null> {
    return unstable_cache(
      async () => {
        // Buscar ticket com relações básicas
        const { data: ticket, error: ticketError } = await supabase
          .from('tickets')
          .select(
            `
            *,
            customers:customer_id (
              id,
              name,
              email,
              phone
            ),
            kanban_columns:kanban_column_id (
              id,
              name,
              position
            )
          `
          )
          .eq('id', id)
          .single();

        if (ticketError) {
          if (ticketError.code === 'PGRST116') {
            return null; // Ticket não encontrado
          }
          throw new Error(`Erro ao buscar ticket: ${ticketError.message}`);
        }

        // Buscar events e messages
        const [events, messages] = await Promise.all([
          TicketEventService.getByTicketId(ticket.id),
          TicketMessageService.getByTicketId(ticket.id)
        ]);

        return {
          ...ticket,
          ticket_events: events,
          ticket_messages: messages
        };
      },
      ['ticket-full', id],
      { tags: [`ticket-full-${id}`] }
    )();
  }

  /**
    * Atualizar ticket
    */
  static async update(id: string, data: TicketUpdate): Promise<Ticket> {
    const { data: ticket, error } = await supabase
      .from('tickets')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar ticket: ${error.message}`);
    }

    // Revalidar cache após atualização
    revalidateTag(`ticket-${id}`, 'max');
    revalidateTag(`ticket-full-${id}`, 'max');
    revalidateTag('tickets', 'max');
    revalidateTag('tickets-with-relations', 'max');
    revalidateTag('tickets-open-full', 'max');

    return ticket;
  }

  /**
    * Deletar ticket
    */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase.from('tickets').delete().eq('id', id);

    if (error) {
      throw new Error(`Erro ao deletar ticket: ${error.message}`);
    }

    // Revalidar cache após deleção
    revalidateTag(`ticket-${id}`, 'max');
    revalidateTag(`ticket-full-${id}`, 'max');
    revalidateTag('tickets', 'max');
    revalidateTag('tickets-with-relations', 'max');
    revalidateTag('tickets-open-full', 'max');
  }
}
