import { KanbanColumnService } from '@/app/services';
import { createSuccessResponse, withErrorHandler, withRateLimit } from '@/lib/api-utils';

/**
 * GET /api/kanban-columns
 * Busca todas as colunas do kanban
 */
const getKanbanColumns = async () => {
  const columns = await KanbanColumnService.getAll();
  return createSuccessResponse(columns);
};

export const GET = withRateLimit(withErrorHandler(getKanbanColumns));