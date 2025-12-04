'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Ticket } from '@/lib/services/ticketService'

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets')
      const data = await response.json()
      setTickets(data)
    } catch (error) {
      console.error('Failed to fetch tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteTicket = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este ticket?')) return

    try {
      await fetch(`/api/tickets/${id}`, { method: 'DELETE' })
      setTickets(tickets.filter(t => t.id !== id))
    } catch (error) {
      console.error('Failed to delete ticket:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto': return 'bg-red-100 text-red-800'
      case 'em_andamento': return 'bg-yellow-100 text-yellow-800'
      case 'fechado': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800'
      case 'media': return 'bg-yellow-100 text-yellow-800'
      case 'baixa': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) return <div className="p-4">Carregando...</div>

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <Link
          href="/tickets/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Novo Ticket
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 border-b text-left">Título</th>
              <th className="px-4 py-2 border-b text-left">Cliente ID</th>
              <th className="px-4 py-2 border-b text-left">Status</th>
              <th className="px-4 py-2 border-b text-left">Prioridade</th>
              <th className="px-4 py-2 border-b text-left">Categoria</th>
              <th className="px-4 py-2 border-b text-left">Criado em</th>
              <th className="px-4 py-2 border-b text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{ticket.title}</td>
                <td className="px-4 py-2 border-b">{ticket.customer_id}</td>
                <td className="px-4 py-2 border-b">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-4 py-2 border-b">
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-4 py-2 border-b">{ticket.category || '-'}</td>
                <td className="px-4 py-2 border-b">{new Date(ticket.created_at).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-2 border-b">
                  <Link
                    href={`/tickets/${ticket.id}`}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/tickets/${ticket.id}/edit`}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => deleteTicket(ticket.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}