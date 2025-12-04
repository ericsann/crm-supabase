import { supabase } from '@/lib/supabase';
import { Tables, TablesInsert, TablesUpdate } from '@/database.types';

type TicketMessage = Tables<'ticket_messages'>;
type TicketMessageInsert = TablesInsert<'ticket_messages'>;
type TicketMessageUpdate = TablesUpdate<'ticket_messages'>;

/**
 * Serviço para operações CRUD na tabela ticket_messages
 */
export class TicketMessageService {
  /**
   * Criar uma nova mensagem de ticket
   */
  static async create(data: TicketMessageInsert): Promise<TicketMessage> {
    const { data: message, error } = await supabase
      .from('ticket_messages')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar mensagem de ticket: ${error.message}`);
    }

    return message;
  }

  /**
   * Buscar todas as mensagens de ticket
   */
  static async getAll(): Promise<TicketMessage[]> {
    const { data: messages, error } = await supabase
      .from('ticket_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar mensagens de ticket: ${error.message}`);
    }

    return messages || [];
  }

  /**
   * Buscar mensagem de ticket por ID
   */
  static async getById(id: string): Promise<TicketMessage | null> {
    const { data: message, error } = await supabase
      .from('ticket_messages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Mensagem não encontrada
      }
      throw new Error(`Erro ao buscar mensagem de ticket: ${error.message}`);
    }

    return message;
  }

  /**
   * Buscar mensagens por ticket_id
   */
  static async getByTicketId(ticketId: string): Promise<TicketMessage[]> {
    const { data: messages, error } = await supabase
      .from('ticket_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Erro ao buscar mensagens do ticket: ${error.message}`);
    }

    return messages || [];
  }

  /**
   * Atualizar mensagem de ticket
   */
  static async update(
    id: string,
    data: TicketMessageUpdate
  ): Promise<TicketMessage> {
    const { data: message, error } = await supabase
      .from('ticket_messages')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar mensagem de ticket: ${error.message}`);
    }

    return message;
  }

  /**
   * Deletar mensagem de ticket
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('ticket_messages')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao deletar mensagem de ticket: ${error.message}`);
    }
  }
}
