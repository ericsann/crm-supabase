'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/database.types';
import { TicketDetailsModal } from './components/TicketDetailsModal';

type TicketType = Tables<'tickets'> & {
  customers?: Tables<'customers'>;
  kanban_columns?: Tables<'kanban_columns'>;
  ticket_events?: Tables<'ticket_events'>[];
  ticket_messages?: Tables<'ticket_messages'>[];
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'waiting_customer'>('all');

  // Carregar tickets abertos
  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await fetch('/api/tickets/open');
      if (response.ok) {
        const responseData = await response.json();
        setTickets(responseData.success ? responseData.data : []);
      }
    } catch (error) {
      console.error('Erro ao carregar tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'waiting_customer': return 'bg-gray-100 text-gray-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando tickets...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Tickets Abertos</h1>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="open">Abertos</option>
              <option value="in_progress">Em Andamento</option>
              <option value="waiting_customer">Aguardando Cliente</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Atividade
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.map((ticket) => {
                  const lastActivity = ticket.ticket_messages?.length
                    ? Math.max(
                        ...(ticket.ticket_messages?.map(m => m.created_at ? new Date(m.created_at).getTime() : 0) || []),
                        ...(ticket.ticket_events?.map(e => e.created_at ? new Date(e.created_at).getTime() : 0) || [])
                      )
                    : (ticket.created_at ? new Date(ticket.created_at).getTime() : 0);

                  return (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{ticket.id.slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {ticket.title}
                        </div>
                        {ticket.description && (
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {ticket.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {ticket.customers?.name || 'Cliente não informado'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {ticket.customers?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status || 'open')}`}>
                          {(ticket.status || 'open') === 'open' ? 'Aberto' :
                           (ticket.status || 'open') === 'in_progress' ? 'Em Andamento' :
                           (ticket.status || 'open') === 'waiting_customer' ? 'Aguardando Cliente' :
                           (ticket.status || 'open') === 'resolved' ? 'Resolvido' : 'Fechado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ticket.priority && (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority === 'low' ? 'Baixa' :
                             ticket.priority === 'medium' ? 'Média' :
                             ticket.priority === 'high' ? 'Alta' : 'Urgente'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(lastActivity).toLocaleDateString('pt-BR')}
                        <div className="text-xs text-gray-500">
                          {ticket.ticket_messages?.length || 0} mensagens
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Ver Detalhes
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredTickets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {filter === 'all'
                  ? 'Nenhum ticket aberto encontrado.'
                  : `Nenhum ticket com status "${filter}" encontrado.`
                }
              </p>
            </div>
          )}
        </div>

        {selectedTicket && (
          <TicketDetailsModal
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            onUpdate={loadTickets}
          />
        )}
      </div>
    </div>
  );
}