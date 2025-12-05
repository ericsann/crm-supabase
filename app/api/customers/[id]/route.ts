import { NextRequest } from 'next/server';
import { CustomerService } from '@/app/services';
import { updateCustomerSchema, validateData } from '@/lib/validations';
import { createSuccessResponse, withErrorHandler, withRateLimit } from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * PUT /api/customers/[id]
 * Atualiza um cliente
 */
const updateCustomer = async (request: NextRequest, { params }: RouteParams) => {
  const body = await request.json();
  const resolvedParams = await params;
  const validatedData = validateData(updateCustomerSchema, body);
  const customer = await CustomerService.update(resolvedParams.id, validatedData);
  return createSuccessResponse(customer);
};

/**
 * DELETE /api/customers/[id]
 * Deleta um cliente
 */
const deleteCustomer = async (request: NextRequest, { params }: RouteParams) => {
  const resolvedParams = await params;
  await CustomerService.delete(resolvedParams.id);
  return createSuccessResponse({ success: true });
};

export const PUT = withRateLimit(withErrorHandler(updateCustomer));
export const DELETE = withRateLimit(withErrorHandler(deleteCustomer));