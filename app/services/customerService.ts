import { supabase } from '@/lib/supabase';
import { Tables, TablesInsert, TablesUpdate } from '@/database.types';
import { unstable_cache, revalidateTag } from 'next/cache';

type Customer = Tables<'customers'>;
type CustomerInsert = TablesInsert<'customers'>;
type CustomerUpdate = TablesUpdate<'customers'>;

/**
 * Serviço para operações CRUD na tabela customers
 */
export class CustomerService {
  /**
    * Criar um novo cliente
    */
  static async create(data: CustomerInsert): Promise<Customer> {
    const { data: customer, error } = await supabase
      .from('customers')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar cliente: ${error.message}`);
    }

    // Revalidar cache após criação
    revalidateTag('customers', 'max');

    return customer;
  }

  /**
    * Buscar todos os clientes
    */
  static async getAll(): Promise<Customer[]> {
    return unstable_cache(
      async () => {
        const { data: customers, error } = await supabase
          .from('customers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(`Erro ao buscar clientes: ${error.message}`);
        }

        return customers || [];
      },
      ['customers'],
      { tags: ['customers'] }
    )();
  }

  /**
    * Buscar cliente por ID
    */
  static async getById(id: string): Promise<Customer | null> {
    return unstable_cache(
      async () => {
        const { data: customer, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            return null; // Cliente não encontrado
          }
          throw new Error(`Erro ao buscar cliente: ${error.message}`);
        }

        return customer;
      },
      ['customer', id],
      { tags: [`customer-${id}`] }
    )();
  }

  /**
    * Atualizar cliente
    */
  static async update(id: string, data: CustomerUpdate): Promise<Customer> {
    const { data: customer, error } = await supabase
      .from('customers')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar cliente: ${error.message}`);
    }

    // Revalidar cache após atualização
    revalidateTag(`customer-${id}`, 'max');
    revalidateTag('customers', 'max');

    return customer;
  }

  /**
    * Deletar cliente
    */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase.from('customers').delete().eq('id', id);

    if (error) {
      throw new Error(`Erro ao deletar cliente: ${error.message}`);
    }

    // Revalidar cache após deleção
    revalidateTag(`customer-${id}`, 'max');
    revalidateTag('customers', 'max');
  }
}
