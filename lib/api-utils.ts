import { NextResponse } from 'next/server';

/**
 * Utilitários para padronizar respostas das APIs
 */

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

/**
 * Cria uma resposta de sucesso padronizada
 */
export function createSuccessResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Cria uma resposta de erro padronizada
 */
export function createErrorResponse(
  message: string,
  status = 500,
  code?: string,
  details?: any
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code,
        details,
      },
    },
    { status }
  );
}

/**
 * Wrapper para handlers de API com tratamento de erro padronizado
 */
export function withErrorHandler<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('Erro na API:', error);

      if (error instanceof Error) {
        // Erro de validação
        if (error.message.startsWith('Dados inválidos:')) {
          return createErrorResponse(error.message, 400, 'VALIDATION_ERROR');
        }

        // Erro do Supabase
        if (error.message.includes('Erro ao')) {
          return createErrorResponse('Erro interno do servidor', 500, 'DATABASE_ERROR');
        }

        // Outros erros
        return createErrorResponse(error.message, 500, 'INTERNAL_ERROR');
      }

      return createErrorResponse('Erro interno do servidor', 500, 'UNKNOWN_ERROR');
    }
  };
}

/**
 * Middleware básico de rate limiting (simples, baseado em memória)
 * Em produção, use Redis ou similar
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests = 100,
  windowMs = 15 * 60 * 1000 // 15 minutos
): boolean {
  const now = Date.now();
  const userRequests = requestCounts.get(identifier);

  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userRequests.count >= maxRequests) {
    return false;
  }

  userRequests.count++;
  return true;
}

/**
 * Wrapper com rate limiting
 */
export function withRateLimit<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>,
  maxRequests = 100,
  windowMs = 15 * 60 * 1000
) {
  return async (...args: T): Promise<NextResponse> => {
    // Para simplificar, usa IP como identificador
    // Em produção, considere usar user ID se autenticado
    const identifier = 'global'; // ou extrair IP do request

    if (!checkRateLimit(identifier, maxRequests, windowMs)) {
      return createErrorResponse('Muitas requisições. Tente novamente mais tarde.', 429, 'RATE_LIMIT_EXCEEDED');
    }

    return handler(...args);
  };
}