"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, AlertCircle, CreditCard, Plus, Edit2, Trash2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { CreateSaleDialog } from "@/components/sales/create-sale-dialog"
import { EditSaleDialog } from "@/components/sales/edit-sale-dialog"

interface Sale {
  id: number
  date: string
  clientId: number
  clientName?: string
  total: number
  paymentMethod: string
  status: string
  items: any[]
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingSale, setEditingSale] = useState<Sale | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [salesRes, clientsRes] = await Promise.all([fetch("/api/sales"), fetch("/api/clients")])

      const salesData = await salesRes.json()
      const clientsData = await clientsRes.json()

      setClients(clientsData)

      const enriched = salesData.map((s: Sale) => ({
        ...s,
        clientName: clientsData.find((c: any) => c.id === s.clientId)?.name,
      }))

      setSales(enriched)
    } catch (error) {
      console.error("Error loading sales:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateSale = (newSale: any) => {
    setSales([...sales, { ...newSale, clientName: clients.find((c) => c.id === newSale.clientId)?.name }])
    setShowCreateDialog(false)
  }

  const handleUpdateSale = (updatedSale: Sale) => {
    setSales(
      sales.map((s) =>
        s.id === updatedSale.id
          ? { ...updatedSale, clientName: clients.find((c) => c.id === updatedSale.clientId)?.name }
          : s,
      ),
    )
    setShowEditDialog(false)
    setEditingSale(null)
  }

  const handleDeleteSale = (saleId: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta venta?")) {
      setSales(sales.filter((s) => s.id !== saleId))
    }
  }

  const totalSales = sales.reduce((sum, s) => sum + s.total, 0)
  const averageSale = sales.length > 0 ? totalSales / sales.length : 0
  const completedSales = sales.filter((s) => s.status === "completada").length

  const salesByPayment = sales.reduce(
    (acc, sale) => {
      const existing = acc.find((p) => p.name === sale.paymentMethod)
      if (existing) {
        existing.value += sale.total
      } else {
        acc.push({ name: sale.paymentMethod, value: sale.total })
      }
      return acc
    },
    [] as Array<{ name: string; value: number }>,
  )

  const columns = [
    { key: "id", label: "ID" },
    { key: "date", label: "Fecha" },
    { key: "clientName", label: "Cliente" },
    {
      key: "total",
      label: "Total",
      render: (value: number) => `$${value.toFixed(0)}`,
    },
    {
      key: "paymentMethod",
      label: "Método Pago",
      render: (value: string) => {
        const labels: Record<string, string> = {
          efectivo: "Efectivo",
          transferencia: "Transferencia",
          crédito: "Crédito",
          qr: "QR",
        }
        return labels[value] || value
      },
    },
    {
      key: "status",
      label: "Estado",
      render: (value: string) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200">
          {value === "completada" ? "Completada" : value}
        </span>
      ),
    },
    {
      key: "items",
      label: "Items",
      render: (value: any[]) => value.length,
    },
    {
      key: "actions",
      label: "Acciones",
      render: (_, row: Sale) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditingSale(row)
              setShowEditDialog(true)
            }}
          >
            <Edit2 size={16} />
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleDeleteSale(row.id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ]

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando ventas...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Ventas" description="Registro de todas las ventas realizadas" />
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus size={20} />
          Nueva Venta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Ventas</p>
              <p className="text-2xl font-bold mt-2">${totalSales.toFixed(0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <DollarSign size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cantidad Ventas</p>
              <p className="text-2xl font-bold mt-2">{sales.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-chart-1/10 text-chart-1">
              <TrendingUp size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Venta Promedio</p>
              <p className="text-2xl font-bold mt-2">${averageSale.toFixed(0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-chart-2/10 text-chart-2">
              <CreditCard size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completadas</p>
              <p className="text-2xl font-bold mt-2 text-green-600">{completedSales}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <AlertCircle size={24} />
            </div>
          </div>
        </Card>
      </div>

      {salesByPayment.length > 0 && (
        <Card className="p-6 mb-8">
          <h3 className="font-semibold mb-4">Ventas por Método de Pago</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesByPayment}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
              <Bar dataKey="value" fill="var(--primary)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      <DataTable columns={columns} data={sales} searchFields={["clientName", "id"]} />

      {showCreateDialog && (
        <CreateSaleDialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSave={handleCreateSale}
          clients={clients}
        />
      )}

      {editingSale && showEditDialog && (
        <EditSaleDialog
          isOpen={showEditDialog}
          onClose={() => {
            setShowEditDialog(false)
            setEditingSale(null)
          }}
          onSave={handleUpdateSale}
          sale={editingSale}
          clients={clients}
        />
      )}
    </div>
  )
}
