import { z } from 'zod';

/**
 * Validações para as APIs usando Zod
 */

// Schema para criação de cliente
export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo'),
  email: z.string().email('Email inválido').max(255, 'Email muito longo'),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

// Schema para atualização de cliente
export const updateCustomerSchema = createCustomerSchema.partial();

// Schema para criação de ticket
export const createTicketSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(255, 'Título muito longo'),
  description: z.string().optional().nullable(),
  customer_id: z.string().uuid('ID do cliente inválido'),
  kanban_column_id: z.string().uuid('ID da coluna inválido'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().default('medium'),
  category: z.enum(['technical', 'financial', 'operational', 'account', 'billing', 'general']).optional().default('general'),
  assigned_to: z.string().optional().nullable(),
  due_date: z.string().optional().nullable(),
});

// Schema para atualização de ticket
export const updateTicketSchema = createTicketSchema.partial();

// Schema para mover ticket
export const moveTicketSchema = z.object({
  kanban_column_id: z.string().uuid('ID da coluna inválido'),
  order_in_column: z.number().int().min(0, 'Ordem deve ser positiva'),
});

// Schema para criação de coluna kanban
export const createKanbanColumnSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  position: z.number().int().min(0, 'Posição deve ser positiva'),
  color: z.string().optional().nullable(),
});

// Schema para atualização de coluna kanban
export const updateKanbanColumnSchema = createKanbanColumnSchema.partial();

// Função utilitária para validar dados
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Dados inválidos: ${error.issues.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}