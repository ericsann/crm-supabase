'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Ticket, TicketMessage } from '@/lib/services/ticketService'

export default function TicketDetailPage() {
  const params = useParams()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [messages, setMessages] = useState<TicketMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchTicket()
      fetchMessages()
    }
  }, [params.id])

  const fetchTicket = async () => {
    try {
      const response = await fetch(`/api/tickets/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setTicket(data)
      }
    } catch (error) {
      console.error('Failed to fetch ticket:', error)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/tickets/${params.id}/messages`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const addMessage = async () => {
    if (!newMessage.trim()) return

    try {
      const response = await fetch(`/api/tickets/${params.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_type: 'support',
          message: newMessage
        })
      })

      if (response.ok) {
        setNewMessage('')
        fetchMessages()
      }
    } catch (error) {
      console.error('Failed to add message:', error)
    }
  }

  if (loading) return <div className="p-4">Carregando...</div>
  if (!ticket) return <div className="p-4">Ticket não encontrado</div>

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold mb-4">{ticket.title}</h1>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <strong>Cliente ID:</strong> {ticket.customer_id}
          </div>
          <div>
            <strong>Status:</strong> {ticket.status}
          </div>
          <div>
            <strong>Prioridade:</strong> {ticket.priority}
          </div>
          <div>
            <strong>Categoria:</strong> {ticket.category || 'N/A'}
          </div>
          <div>
            <strong>Criado em:</strong> {new Date(ticket.created_at).toLocaleString('pt-BR')}
          </div>
          <div>
            <strong>Atualizado em:</strong> {new Date(ticket.updated_at).toLocaleString('pt-BR')}
          </div>
        </div>
        {ticket.description && (
          <div>
            <strong>Descrição:</strong>
            <p className="mt-2 text-gray-700">{ticket.description}</p>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Mensagens</h2>
        <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className="border-l-4 border-blue-500 pl-4">
              <div className="flex justify-between items-start">
                <span className="font-medium capitalize">{message.sender_type}</span>
                <span className="text-sm text-gray-500">
                  {new Date(message.created_at).toLocaleString('pt-BR')}
                </span>
              </div>
              <p className="mt-1 text-gray-700">{message.message}</p>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <button
            onClick={addMessage}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Enviar Mensagem
          </button>
        </div>
      </div>
    </div>
  )
}