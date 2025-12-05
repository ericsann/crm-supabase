'use client';

export default function DevPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          🧪 Página de Desenvolvimento
        </h1>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">⚡</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Cache Implementado com Sucesso!
            </h2>
            <p className="text-gray-600 mb-6">
              Todos os serviços agora utilizam <code className="bg-gray-100 px-2 py-1 rounded">unstable_cache</code> do Next.js
              para otimizar o desempenho das consultas ao banco de dados.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Serviços com Cache Implementado:
              </h3>
              <ul className="text-blue-700 space-y-1">
                <li>• CustomerService - Cache de clientes</li>
                <li>• KanbanColumnService - Cache de colunas Kanban</li>
                <li>• TicketService - Cache de tickets e relações</li>
                <li>• TicketEventService - Cache de eventos de tickets</li>
                <li>• TicketMessageService - Cache de mensagens de tickets</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Funcionalidades:
              </h3>
              <ul className="text-green-700 space-y-1">
                <li>• Cache automático com tags granulares</li>
                <li>• Revalidação automática após operações CRUD</li>
                <li>• Stale-while-revalidate para melhor UX</li>
                <li>• Compatível apenas com Server Components/APIs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
