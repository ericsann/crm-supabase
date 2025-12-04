import { supabase } from '@/lib/supabase';
import { Tables, TablesInsert, TablesUpdate } from '@/database.types';

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

    return event;
  }

  /**
   * Buscar todos os eventos de ticket
   */
  static async getAll(): Promise<TicketEvent[]> {
    const { data: events, error } = await supabase
      .from('ticket_events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar eventos de ticket: ${error.message}`);
    }

    return events || [];
  }

  /**
   * Buscar eventos de ticket por ID
   */
  static async getById(id: string): Promise<TicketEvent | null> {
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
  }

  /**
   * Buscar eventos por ticket_id
   */
  static async getByTicketId(ticketId: string): Promise<TicketEvent[]> {
    const { data: events, error } = await supabase
      .from('ticket_events')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Erro ao buscar eventos do ticket: ${error.message}`);
    }

    return events || [];
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

    return event;
  }

  /**
   * Deletar evento de ticket
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('ticket_events')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao deletar evento de ticket: ${error.message}`);
    }
  }
}
