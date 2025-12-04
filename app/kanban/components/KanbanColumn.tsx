import { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Tables } from '@/database.types';

type KanbanColumnType = Tables<'kanban_columns'>;

interface KanbanColumnProps {
  column: KanbanColumnType;
  children: ReactNode;
}

export function KanbanColumn({ column, children }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4 min-h-[600px] ${
        isOver ? 'bg-blue-50 border-2 border-blue-300' : 'border-2 border-transparent'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{column.name}</h3>
        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">
          {Array.isArray(children) ? children.length : 0}
        </span>
      </div>

      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}