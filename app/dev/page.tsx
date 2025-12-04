'use client';

import { useState } from 'react';
import {
  CustomerService,
  KanbanColumnService,
  TicketEventService,
  TicketMessageService,
  TicketService
} from '@/app/services';

export default function DevPage() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const executeOperation = async (serviceName: string, operation: string, data?: any) => {
    const key = `${serviceName}-${operation}`;
    setLoading(prev => ({ ...prev, [key]: true }));

    try {
      let result: any;
      switch (serviceName) {
        case 'customer':
          result = await executeCustomerOperation(operation, data);
          break;
        case 'kanbanColumn':
          result = await executeKanbanColumnOperation(operation, data);
          break;
        case 'ticketEvent':
          result = await executeTicketEventOperation(operation, data);
          break;
        case 'ticketMessage':
          result = await executeTicketMessageOperation(operation, data);
          break;
        case 'ticket':
          result = await executeTicketOperation(operation, data);
          break;
      }

      setResults(prev => ({ ...prev, [key]: { success: true, data: result } }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [key]: {
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const executeCustomerOperation = async (operation: string, data?: any) => {
    switch (operation) {
      case 'getAll':
        return await CustomerService.getAll();
      case 'getById':
        return await CustomerService.getById(data.id);
      case 'create':
        return await CustomerService.create(data);
      case 'update':
        return await CustomerService.update(data.id, data);
      case 'delete':
        return await CustomerService.delete(data.id);
      default:
        throw new Error('Operação não suportada');
    }
  };

  const executeKanbanColumnOperation = async (operation: string, data?: any) => {
    switch (operation) {
      case 'getAll':
        return await KanbanColumnService.getAll();
      case 'getById':
        return await KanbanColumnService.getById(data.id);
      case 'create':
        return await KanbanColumnService.create(data);
      case 'update':
        return await KanbanColumnService.update(data.id, data);
      case 'delete':
        return await KanbanColumnService.delete(data.id);
      default:
        throw new Error('Operação não suportada');
    }
  };

  const executeTicketEventOperation = async (operation: string, data?: any) => {
    switch (operation) {
      case 'getAll':
        return await TicketEventService.getAll();
      case 'getById':
        return await TicketEventService.getById(data.id);
      case 'create':
        return await TicketEventService.create(data);
      case 'update':
        return await TicketEventService.update(data.id, data);
      case 'delete':
        return await TicketEventService.delete(data.id);
      default:
        throw new Error('Operação não suportada');
    }
  };

  const executeTicketMessageOperation = async (operation: string, data?: any) => {
    switch (operation) {
      case 'getAll':
        return await TicketMessageService.getAll();
      case 'getById':
        return await TicketMessageService.getById(data.id);
      case 'create':
        return await TicketMessageService.create(data);
      case 'update':
        return await TicketMessageService.update(data.id, data);
      case 'delete':
        return await TicketMessageService.delete(data.id);
      default:
        throw new Error('Operação não suportada');
    }
  };

  const executeTicketOperation = async (operation: string, data?: any) => {
    switch (operation) {
      case 'getAll':
        return await TicketService.getAll();
      case 'getById':
        return await TicketService.getById(data.id);
      case 'create':
        return await TicketService.create(data);
      case 'update':
        return await TicketService.update(data.id, data);
      case 'delete':
        return await TicketService.delete(data.id);
      default:
        throw new Error('Operação não suportada');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          🧪 Página de Teste dos Services
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Customer Service */}
          <ServiceCard
            title="👥 Customer Service"
            serviceName="customer"
            operations={['getAll', 'getById', 'create', 'update', 'delete']}
            executeOperation={executeOperation}
            loading={loading}
            results={results}
          />

          {/* Kanban Column Service */}
          <ServiceCard
            title="📋 Kanban Column Service"
            serviceName="kanbanColumn"
            operations={['getAll', 'getById', 'create', 'update', 'delete']}
            executeOperation={executeOperation}
            loading={loading}
            results={results}
          />

          {/* Ticket Event Service */}
          <ServiceCard
            title="📝 Ticket Event Service"
            serviceName="ticketEvent"
            operations={['getAll', 'getById', 'create', 'update', 'delete']}
            executeOperation={executeOperation}
            loading={loading}
            results={results}
          />

          {/* Ticket Message Service */}
          <ServiceCard
            title="💬 Ticket Message Service"
            serviceName="ticketMessage"
            operations={['getAll', 'getById', 'create', 'update', 'delete']}
            executeOperation={executeOperation}
            loading={loading}
            results={results}
          />

          {/* Ticket Service */}
          <ServiceCard
            title="🎫 Ticket Service"
            serviceName="ticket"
            operations={['getAll', 'getById', 'create', 'update', 'delete']}
            executeOperation={executeOperation}
            loading={loading}
            results={results}
          />
        </div>
      </div>
    </div>
  );
}

interface ServiceCardProps {
  title: string;
  serviceName: string;
  operations: string[];
  executeOperation: (serviceName: string, operation: string, data?: any) => Promise<void>;
  loading: Record<string, boolean>;
  results: Record<string, any>;
}

function ServiceCard({ title, serviceName, operations, executeOperation, loading, results }: ServiceCardProps) {
  const [activeTab, setActiveTab] = useState<string>('getAll');
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOperation = async (operation: string) => {
    let data;
    if (operation === 'getById' || operation === 'delete') {
      data = { id: formData.id };
    } else if (operation === 'create' || operation === 'update') {
      data = formData;
    }
    await executeOperation(serviceName, operation, data);
  };

  const clearForm = () => {
    setFormData({});
  };

  const getResultKey = (operation: string) => `${serviceName}-${operation}`;
  const result = results[getResultKey(activeTab)];

  const renderForm = (operation: string) => {
    if (operation === 'getAll') {
      return (
        <div className="text-center py-4 text-gray-500">
          Esta operação não requer parâmetros
        </div>
      );
    }

    if (operation === 'getById' || operation === 'delete') {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
            <input
              type="text"
              placeholder="Digite o ID"
              value={formData.id || ''}
              onChange={(e) => handleInputChange('id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      );
    }

    if (operation === 'create' || operation === 'update') {
      if (operation === 'update') {
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
              <input
                type="text"
                placeholder="Digite o ID"
                value={formData.id || ''}
                onChange={(e) => handleInputChange('id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {renderEntityForm()}
          </div>
        );
      }
      return renderEntityForm();
    }

    return null;
  };

  const renderEntityForm = () => {
    switch (serviceName) {
      case 'customer':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                placeholder="Nome do cliente"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="email@exemplo.com"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                type="text"
                placeholder="(11) 99999-9999"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'kanbanColumn':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                placeholder="Nome da coluna"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Posição</label>
              <input
                type="number"
                placeholder="0"
                value={formData.position || ''}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'ticketEvent':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ticket ID</label>
              <input
                type="text"
                placeholder="ID do ticket"
                value={formData.ticket_id || ''}
                onChange={(e) => handleInputChange('ticket_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Evento</label>
              <select
                value={formData.event_type || ''}
                onChange={(e) => handleInputChange('event_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione o tipo</option>
                <option value="ticket_created">Ticket Criado</option>
                <option value="ticket_closed">Ticket Fechado</option>
                <option value="status_changed">Status Alterado</option>
                <option value="assigned">Atribuído</option>
                <option value="unassigned">Desatribuído</option>
                <option value="title_changed">Título Alterado</option>
                <option value="description_changed">Descrição Alterada</option>
                <option value="priority_changed">Prioridade Alterada</option>
                <option value="category_changed">Categoria Alterada</option>
                <option value="customer_changed">Cliente Alterado</option>
                <option value="message_added">Mensagem Adicionada</option>
              </select>
            </div>
          </div>
        );

      case 'ticketMessage':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ticket ID</label>
              <input
                type="text"
                placeholder="ID do ticket"
                value={formData.ticket_id || ''}
                onChange={(e) => handleInputChange('ticket_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
              <textarea
                placeholder="Digite a mensagem"
                value={formData.message || ''}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Remetente</label>
              <select
                value={formData.sender_type || ''}
                onChange={(e) => handleInputChange('sender_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione o tipo</option>
                <option value="agent">Agente</option>
                <option value="customer">Cliente</option>
              </select>
            </div>
          </div>
        );

      case 'ticket':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                placeholder="Título do ticket"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
              <input
                type="text"
                placeholder="ID do cliente"
                value={formData.customer_id || ''}
                onChange={(e) => handleInputChange('customer_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kanban Column ID</label>
              <input
                type="text"
                placeholder="ID da coluna kanban"
                value={formData.kanban_column_id || ''}
                onChange={(e) => handleInputChange('kanban_column_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                placeholder="Descrição do ticket (opcional)"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>

      <div className="p-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
          {operations.map(operation => (
            <button
              key={operation}
              onClick={() => setActiveTab(operation)}
              className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
                activeTab === operation
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {operation.charAt(0).toUpperCase() + operation.slice(1)}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="mb-6">
          {renderForm(activeTab)}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => handleOperation(activeTab)}
            disabled={loading[getResultKey(activeTab)]}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            {loading[getResultKey(activeTab)] ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Executando...
              </span>
            ) : (
              `Executar ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`
            )}
          </button>

          {(activeTab === 'create' || activeTab === 'update') && (
            <button
              onClick={clearForm}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium transition-colors"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Resultado:</h3>
            {result.success ? (
              <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-700 font-medium">Erro:</span>
                </div>
                <p className="text-red-600 mt-1">{result.error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}