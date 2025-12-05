import { NextRequest } from 'next/server';
import { CustomerService } from '@/app/services';
import { createCustomerSchema, validateData } from '@/lib/validations';
import { createSuccessResponse, createErrorResponse, withErrorHandler, withRateLimit } from '@/lib/api-utils';

/**
 * GET /api/customers
 * Busca todos os clientes
 */
const getCustomers = async () => {
  const customers = await CustomerService.getAll();
  return createSuccessResponse(customers);
};

/**
 * POST /api/customers
 * Cria um novo cliente
 */
const createCustomer = async (request: NextRequest) => {
  const body = await request.json();
  const validatedData = validateData(createCustomerSchema, body);
  const customer = await CustomerService.create(validatedData);
  return createSuccessResponse(customer, 201);
};

export const GET = withRateLimit(withErrorHandler(getCustomers));
export const POST = withRateLimit(withErrorHandler(createCustomer));