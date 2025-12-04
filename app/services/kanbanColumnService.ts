import { supabase } from '@/lib/supabase';
import { Tables, TablesInsert, TablesUpdate } from '@/database.types';

type KanbanColumn = Tables<'kanban_columns'>;
type KanbanColumnInsert = TablesInsert<'kanban_columns'>;
type KanbanColumnUpdate = TablesUpdate<'kanban_columns'>;

/**
 * Serviço para operações CRUD na tabela kanban_columns
 */
export class KanbanColumnService {
  /**
   * Criar uma nova coluna do kanban
   */
  static async create(data: KanbanColumnInsert): Promise<KanbanColumn> {
    const { data: column, error } = await supabase
      .from('kanban_columns')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar coluna do kanban: ${error.message}`);
    }

    return column;
  }

  /**
   * Buscar todas as colunas do kanban
   */
  static async getAll(): Promise<KanbanColumn[]> {
    const { data: columns, error } = await supabase
      .from('kanban_columns')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      throw new Error(`Erro ao buscar colunas do kanban: ${error.message}`);
    }

    return columns || [];
  }

  /**
   * Buscar coluna do kanban por ID
   */
  static async getById(id: string): Promise<KanbanColumn | null> {
    const { data: column, error } = await supabase
      .from('kanban_columns')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Coluna não encontrada
      }
      throw new Error(`Erro ao buscar coluna do kanban: ${error.message}`);
    }

    return column;
  }

  /**
   * Atualizar coluna do kanban
   */
  static async update(
    id: string,
    data: KanbanColumnUpdate
  ): Promise<KanbanColumn> {
    const { data: column, error } = await supabase
      .from('kanban_columns')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar coluna do kanban: ${error.message}`);
    }

    return column;
  }

  /**
   * Deletar coluna do kanban
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('kanban_columns')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao deletar coluna do kanban: ${error.message}`);
    }
  }
}
