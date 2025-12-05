import { useState } from 'react';
import { Tables } from '@/database.types';

type TicketType = Tables<'tickets'> & {
  customers?: Tables<'customers'>;
  kanban_columns?: Tables<'kanban_columns'>;
  ticket_events?: Tables<'ticket_events'>[];
  ticket_messages?: Tables<'ticket_messages'>[];
};

interface TicketDetailsModalProps {
  ticket: TicketType;
  onClose: () => void;
  onUpdate: () => void;
}

export function TicketDetailsModal({ ticket, onClose, onUpdate }: TicketDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'messages' | 'events'>('details');

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-800">Ticket #{ticket.id.slice(-6)}</h2>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(ticket.status || 'open')}`}>
                {(ticket.status || 'open') === 'open' ? 'Aberto' :
                 (ticket.status || 'open') === 'in_progress' ? 'Em Andamento' :
                 (ticket.status || 'open') === 'waiting_customer' ? 'Aguardando Cliente' :
                 (ticket.status || 'open') === 'resolved' ? 'Resolvido' : 'Fechado'}
              </span>
              {ticket.priority && (
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                  Prioridade {ticket.priority === 'low' ? 'Baixa' :
                             ticket.priority === 'medium' ? 'Média' :
                             ticket.priority === 'high' ? 'Alta' : 'Urgente'}
                </span>
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{ticket.title}</h3>
            {ticket.description && (
              <p className="text-gray-600">{ticket.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl ml-4"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Detalhes
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'messages'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Mensagens ({ticket.ticket_messages?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'events'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Histórico ({ticket.ticket_events?.length || 0})
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Informações do Cliente */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Cliente</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Nome</label>
                      <p className="text-gray-900">{ticket.customers?.name || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{ticket.customers?.email || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Telefone</label>
                      <p className="text-gray-900">{ticket.customers?.phone || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Empresa</label>
                      <p className="text-gray-900">Não informado</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações do Ticket */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Informações do Ticket</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Coluna Kanban</label>
                      <p className="text-gray-900">{ticket.kanban_columns?.name || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Categoria</label>
                      <p className="text-gray-900">{ticket.category || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Criado em</label>
                      <p className="text-gray-900">
                        {ticket.created_at ? new Date(ticket.created_at).toLocaleString('pt-BR') : 'Não informado'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Última atualização</label>
                      <p className="text-gray-900">
                        {ticket.updated_at ? new Date(ticket.updated_at).toLocaleString('pt-BR') : 'Não informado'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-4">
              {ticket.ticket_messages && ticket.ticket_messages.length > 0 ? (
                ticket.ticket_messages
                  .sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime())
                  .map((message) => (
                    <div key={message.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm text-gray-600">
                          {message.created_at ? new Date(message.created_at).toLocaleString('pt-BR') : 'Data desconhecida'}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {message.id.slice(-6)}
                        </div>
                      </div>
                      <div className="text-gray-900 whitespace-pre-wrap">{message.message}</div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma mensagem encontrada para este ticket.
                </div>
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-4">
              {ticket.ticket_events && ticket.ticket_events.length > 0 ? (
                ticket.ticket_events
                  .sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime())
                  .map((event) => (
                    <div key={event.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm font-medium text-gray-800">
                          {event.event_type || 'Evento'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {event.created_at ? new Date(event.created_at).toLocaleString('pt-BR') : 'Data desconhecida'}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {event.id.slice(-6)}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhum evento encontrado para este ticket.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}