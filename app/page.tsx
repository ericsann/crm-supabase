import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Sistema de Suporte ao Cliente
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/customers"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">
              Clientes
            </h2>
            <p className="text-gray-600">
              Gerencie seus clientes: adicione, edite e visualize informações.
            </p>
          </Link>

          <Link
            href="/tickets"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold text-green-600 mb-2">
              Tickets
            </h2>
            <p className="text-gray-600">
              Gerencie tickets de suporte e acompanhe o atendimento.
            </p>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Utilize o menu lateral para navegar rapidamente entre as seções.
          </p>
        </div>
      </div>
    </div>
  );
}
