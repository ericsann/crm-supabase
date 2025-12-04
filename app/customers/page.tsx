'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Customer } from '@/lib/services/customerService'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteCustomer = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este cliente?')) return

    try {
      await fetch(`/api/customers/${id}`, { method: 'DELETE' })
      setCustomers(customers.filter(c => c.id !== id))
    } catch (error) {
      console.error('Failed to delete customer:', error)
    }
  }

  if (loading) return <div className="p-4">Carregando...</div>

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Link
          href="/customers/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Novo Cliente
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 border-b text-left">Nome</th>
              <th className="px-4 py-2 border-b text-left">Email</th>
              <th className="px-4 py-2 border-b text-left">Telefone</th>
              <th className="px-4 py-2 border-b text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{customer.name}</td>
                <td className="px-4 py-2 border-b">{customer.email}</td>
                <td className="px-4 py-2 border-b">{customer.phone || '-'}</td>
                <td className="px-4 py-2 border-b">
                  <Link
                    href={`/customers/${customer.id}/edit`}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => deleteCustomer(customer.id)}
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