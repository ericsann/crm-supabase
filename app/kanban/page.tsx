'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { KanbanColumn } from './components/KanbanColumn';
import { TicketCard } from './components/TicketCard';
import { CreateTicketModal } from './components/CreateTicketModal';
import { Tables, Database } from '@/database.types';

type KanbanColumnType = Tables<'kanban_columns'>;
type TicketType = Tables<'tickets'> & {
  customers?: Tables<'customers'>;
  kanban_columns?: Tables<'kanban_columns'>;
};

export default function KanbanPage() {
  const [columns, setColumns] = useState<KanbanColumnType[]>([]);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [customers, setCustomers] = useState<Tables<'customers'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState<TicketType | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Carregar dados iniciais
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [columnsRes, ticketsRes, customersRes] = await Promise.all([
        fetch('/api/kanban-columns'),
        fetch('/api/tickets'),
        fetch('/api/customers'),
      ]);

      if (columnsRes.ok) {
        const response = await columnsRes.json();
        setColumns(response.success ? response.data : []);
      }

      if (ticketsRes.ok) {
        const response = await ticketsRes.json();
        setTickets(response.success ? response.data : []);
      }

      if (customersRes.ok) {
        const response = await customersRes.json();
        setCustomers(response.success ? response.data : []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const ticket = tickets.find(t => t.id === active.id);
    setActiveTicket(ticket || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Não atualizar estado aqui - será feito no handleDragEnd após confirmação da API
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTicket(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Encontrar o ticket sendo arrastado
    const activeTicket = tickets.find(ticket => ticket.id === activeId);
    if (!activeTicket) {
      setActiveTicket(null);
      return;
    }

    // Verificar se está sobre uma coluna
    const targetColumn = columns.find(col => col.id === overId);
    if (targetColumn) {
      // Mover para nova coluna
      if (activeTicket.kanban_column_id !== targetColumn.id) {
        await moveTicketToColumn(activeTicket.id, targetColumn.id);
      }
    } else {
      // Verificar se está sobre outro ticket (reordenação na mesma coluna)
      const overTicket = tickets.find(ticket => ticket.id === overId);
      if (overTicket && activeTicket.kanban_column_id === overTicket.kanban_column_id) {
        // Reordenar na mesma coluna
        await reorderTicketInColumn(activeTicket.id, overTicket.id, activeTicket.kanban_column_id);
      }
    }

    setActiveTicket(null);
  };

  const moveTicketToColumn = async (ticketId: string, columnId: string) => {
    try {
      console.log('🚀 Iniciando movimento do ticket:', ticketId, 'para coluna:', columnId);

      // Calcular nova ordem na coluna (última posição)
      const ticketsInColumn = tickets.filter(t => t.kanban_column_id === columnId && t.id !== ticketId);
      const newOrder = ticketsInColumn.length;
      console.log('📊 Nova ordem calculada:', newOrder);

      // Encontrar a coluna para determinar o status
      const targetColumn = columns.find(col => col.id === columnId);
      if (!targetColumn) {
        console.error('❌ Coluna não encontrada:', columnId);
        return;
      }

      // Mapear nome da coluna para status
      const getStatusFromColumnName = (columnName: string): string => {
        const name = columnName.toLowerCase();
        if (name.includes('fazer') || name.includes('todo') || name.includes('aberto') || name.includes('aberta')) {
          return 'open';
        }
        if (name.includes('andamento') || name.includes('doing') || name.includes('progress') || name.includes('em andamento')) {
          return 'in_progress';
        }
        if (name.includes('cliente') || name.includes('waiting') || name.includes('aguardando') || name.includes('aguardando cliente')) {
          return 'waiting_customer';
        }
        if (name.includes('concluído') || name.includes('concluída') || name.includes('done') || name.includes('closed') || name.includes('fechado') || name.includes('fechada')) {
          return 'closed';
        }
        if (name.includes('resolvido') || name.includes('resolvida') || name.includes('resolved')) {
          return 'resolved';
        }
        return 'open'; // fallback
      };

      const newStatus = getStatusFromColumnName(targetColumn.name) as Database['public']['Enums']['status'];
      console.log('🏷️ Status mapeado:', newStatus, 'para coluna:', targetColumn.name);

      const requestData = {
        kanban_column_id: columnId,
        order_in_column: newOrder,
        status: newStatus,
      };
      console.log('📤 Enviando dados para API:', requestData);

      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('📥 Resposta da API - Status:', response.status, 'OK:', response.ok);

      if (response.ok) {
        const responseData = await response.json();
        console.log('📦 Dados da resposta:', responseData);

        if (responseData.success) {
          console.log('✅ Atualizando estado local');
          // Atualizar estado local
          setTickets(prev => prev.map(ticket =>
            ticket.id === ticketId
              ? {
                  ...ticket,
                  kanban_column_id: columnId,
                  order_in_column: newOrder,
                  status: newStatus
                }
              : ticket
          ));
          console.log('🎉 Estado local atualizado com sucesso');
        } else {
          console.error('❌ API retornou success: false');
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Erro na resposta da API:', errorText);
      }
    } catch (error) {
      console.error('💥 Erro ao mover ticket:', error);
    }
  };

  const reorderTicketInColumn = async (activeId: string, overId: string, columnId: string) => {
    try {
      const columnTickets = tickets
        .filter(t => t.kanban_column_id === columnId)
        .sort((a, b) => (a.order_in_column || 0) - (b.order_in_column || 0));

      const activeIndex = columnTickets.findIndex(t => t.id === activeId);
      const overIndex = columnTickets.findIndex(t => t.id === overId);

      if (activeIndex === -1 || overIndex === -1) return;

      // Reordenar array
      const reorderedTickets = [...columnTickets];
      const [removed] = reorderedTickets.splice(activeIndex, 1);
      reorderedTickets.splice(overIndex, 0, removed);

      // Atualizar ordens
      const updates = reorderedTickets.map((ticket, index) => ({
        id: ticket.id,
        order_in_column: index,
      }));

      // Atualizar no backend
      const responses = await Promise.all(
        updates.map(update =>
          fetch(`/api/tickets/${update.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              order_in_column: update.order_in_column,
            }),
          })
        )
      );

      // Verificar se todas as respostas foram bem-sucedidas
      const results = await Promise.all(
        responses.map(async (res) => {
          if (res.ok) {
            const data = await res.json();
            return data.success;
          }
          return false;
        })
      );
      const allSuccessful = results.every(r => r);

      if (allSuccessful) {
        // Atualizar estado local
        setTickets(prev => prev.map(ticket => {
          const update = updates.find(u => u.id === ticket.id);
          return update ? { ...ticket, order_in_column: update.order_in_column } : ticket;
        }));
      } else {
        console.error('❌ Falha ao reordenar tickets no backend');
      }
    } catch (error) {
      console.error('Erro ao reordenar ticket:', error);
    }
  };

  const handleCreateTicket = async (ticketData: any) => {
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success && responseData.data) {
          setTickets(prev => [...prev, responseData.data]);
          setShowCreateModal(false);
        }
      }
    } catch (error) {
      console.error('Erro ao criar ticket:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Kanban</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Novo Ticket
          </button>
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-6">
            {columns.map((column) => {
              const columnTickets = tickets
                .filter(ticket => ticket.kanban_column_id === column.id)
                .sort((a, b) => (a.order_in_column || 0) - (b.order_in_column || 0));

              return (
                <KanbanColumn key={column.id} column={column}>
                  <SortableContext
                    items={columnTickets.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {columnTickets.map((ticket) => (
                      <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                  </SortableContext>
                </KanbanColumn>
              );
            })}
          </div>

          <DragOverlay>
            {activeTicket ? (
              <TicketCard ticket={activeTicket} isDragging />
            ) : null}
          </DragOverlay>
        </DndContext>

        {showCreateModal && (
          <CreateTicketModal
            customers={customers}
            columns={columns}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateTicket}
          />
        )}
      </div>
    </div>
  );
}