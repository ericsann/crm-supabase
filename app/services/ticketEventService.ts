import { supabase } from '@/lib/supabase';
import { Tables, TablesInsert, TablesUpdate } from '@/database.types';
import { unstable_cache, revalidateTag } from 'next/cache';

type TicketEvent = Tables<'ticket_events'>;
type TicketEventInsert = TablesInsert<'ticket_events'>;
type TicketEventUpdate = TablesUpdate<'ticket_events'>;

/**
 * Serviço para operações CRUD na tabela ticket_events
 */
export class TicketEventService {
  /**
    * Criar um novo evento de ticket
    */
  static async create(data: TicketEventInsert): Promise<TicketEvent> {
    const { data: event, error } = await supabase
      .from('ticket_events')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar evento de ticket: ${error.message}`);
    }

    // Revalidar cache após criação
    revalidateTag('ticket-events', 'max');
    revalidateTag(`ticket-events-${data.ticket_id}`, 'max');

    return event;
  }

  /**
    * Buscar todos os eventos de ticket
    */
  static async getAll(): Promise<TicketEvent[]> {
    return unstable_cache(
      async () => {
        const { data: events, error } = await supabase
          .from('ticket_events')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(`Erro ao buscar eventos de ticket: ${error.message}`);
        }

        return events || [];
      },
      ['ticket-events'],
      { tags: ['ticket-events'] }
    )();
  }

  /**
    * Buscar eventos de ticket por ID
    */
  static async getById(id: string): Promise<TicketEvent | null> {
    return unstable_cache(
      async () => {
        const { data: event, error } = await supabase
          .from('ticket_events')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            return null; // Evento não encontrado
          }
          throw new Error(`Erro ao buscar evento de ticket: ${error.message}`);
        }

        return event;
      },
      ['ticket-event', id],
      { tags: [`ticket-event-${id}`] }
    )();
  }

  /**
    * Buscar eventos por ticket_id
    */
  static async getByTicketId(ticketId: string): Promise<TicketEvent[]> {
    return unstable_cache(
      async () => {
        const { data: events, error } = await supabase
          .from('ticket_events')
          .select('*')
          .eq('ticket_id', ticketId)
          .order('created_at', { ascending: true });

        if (error) {
          throw new Error(`Erro ao buscar eventos do ticket: ${error.message}`);
        }

        return events || [];
      },
      ['ticket-events', ticketId],
      { tags: [`ticket-events-${ticketId}`] }
    )();
  }

  /**
    * Atualizar evento de ticket
    */
  static async update(
    id: string,
    data: TicketEventUpdate
  ): Promise<TicketEvent> {
    const { data: event, error } = await supabase
      .from('ticket_events')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar evento de ticket: ${error.message}`);
    }

    // Revalidar cache após atualização
    revalidateTag(`ticket-event-${id}`, 'max');
    revalidateTag('ticket-events', 'max');
    if (event.ticket_id) {
      revalidateTag(`ticket-events-${event.ticket_id}`, 'max');
    }

    return event;
  }

  /**
    * Deletar evento de ticket
    */
  static async delete(id: string): Promise<void> {
    // Primeiro buscar o evento para obter ticket_id
    const event = await this.getById(id);
    if (!event) {
      throw new Error('Evento não encontrado');
    }

    const { error } = await supabase
      .from('ticket_events')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao deletar evento de ticket: ${error.message}`);
    }

    // Revalidar cache após deleção
    revalidateTag(`ticket-event-${id}`, 'max');
    revalidateTag('ticket-events', 'max');
    revalidateTag(`ticket-events-${event.ticket_id}`, 'max');
  }
}
