import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware de autenticação básica
 * Em produção, implemente uma solução mais robusta
 */

const API_KEY = process.env.API_KEY || 'dev-api-key';

/**
 * Verifica se a requisição tem autenticação válida
 */
export function authenticateRequest(request: NextRequest): boolean {
  // Para desenvolvimento, permite requisições sem auth
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  // Verifica API key no header
  const apiKey = request.headers.get('x-api-key');
  return apiKey === API_KEY;
}

/**
 * Wrapper para handlers autenticados
 */
export function withAuth<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    const request = args[0] as NextRequest;

    if (!authenticateRequest(request)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Acesso não autorizado',
            code: 'UNAUTHORIZED'
          }
        },
        { status: 401 }
      );
    }

    return handler(...args);
  };
}

/**
 * Middleware para rotas que requerem autenticação
 * Adicione este middleware ao next.config.ts para proteger rotas
 */
export function authMiddleware(request: NextRequest) {
  if (!authenticateRequest(request)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Acesso não autorizado',
          code: 'UNAUTHORIZED'
        }
      },
      { status: 401 }
    );
  }

  return NextResponse.next();
}