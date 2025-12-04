import { supabase } from '../supabase'

export interface Ticket {
  id: string
  created_at: string
  updated_at: string
  customer_id: string
  title: string
  description?: string
  status: string
  priority: string
  category?: string
  assigned_to?: string
}

export interface TicketMessage {
  id: string
  ticket_id: string
  created_at: string
  sender_type: string
  message: string
}

export interface TicketEvent {
  id: string
  ticket_id: string
  event_type: string
  old_value?: string
  new_value?: string
  created_at: string
}

export const ticketService = {
  async getAll(): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Ticket | null> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>): Promise<Ticket> {
    const { data, error } = await supabase
      .from('tickets')
      .insert(ticket)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Omit<Ticket, 'id' | 'created_at' | 'updated_at'>>): Promise<Ticket> {
    const { data, error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async getMessages(ticketId: string): Promise<TicketMessage[]> {
    const { data, error } = await supabase
      .from('ticket_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  },

  async addMessage(message: Omit<TicketMessage, 'id' | 'created_at'>): Promise<TicketMessage> {
    const { data, error } = await supabase
      .from('ticket_messages')
      .insert(message)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getEvents(ticketId: string): Promise<TicketEvent[]> {
    const { data, error } = await supabase
      .from('ticket_events')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  }
}