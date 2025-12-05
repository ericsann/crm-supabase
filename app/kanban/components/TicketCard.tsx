import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tables } from '@/database.types';

type TicketType = Tables<'tickets'> & {
  customers?: Tables<'customers'>;
  kanban_columns?: Tables<'kanban_columns'>;
};

interface TicketCardProps {
  ticket: TicketType;
  isDragging?: boolean;
  onClick?: () => void;
}

export function TicketCard({ ticket, isDragging = false, onClick }: TicketCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };

  const statusColors = {
    open: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-purple-100 text-purple-800',
    waiting_customer: 'bg-gray-100 text-gray-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
  };

  const handleClick = () => {
    if (!isSortableDragging && onClick) {
      onClick();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow ${
        isDragging || isSortableDragging ? 'opacity-50 rotate-2' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
          {ticket.title}
        </h4>
        {ticket.priority && (
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[ticket.priority]}`}>
            {ticket.priority === 'low' ? 'Baixa' :
             ticket.priority === 'medium' ? 'Média' :
             ticket.priority === 'high' ? 'Alta' : 'Urgente'}
          </span>
        )}
      </div>

      {ticket.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {ticket.description}
        </p>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {ticket.customers && (
            <span className="text-xs text-gray-500">
              {ticket.customers.name}
            </span>
          )}
          {ticket.status && (
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[ticket.status]}`}>
              {ticket.status === 'open' ? 'Aberto' :
               ticket.status === 'in_progress' ? 'Em Andamento' :
               ticket.status === 'waiting_customer' ? 'Aguardando Cliente' :
               ticket.status === 'resolved' ? 'Resolvido' : 'Fechado'}
            </span>
          )}
        </div>

        <div className="text-xs text-gray-400">
          #{ticket.id.slice(-4)}
        </div>
      </div>
    </div>
  );
}