"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Card } from "@/components/ui/card"
import { ShoppingCart, CheckCircle, AlertCircle } from "lucide-react"

interface Purchase {
  id: number
  date: string
  supplierId: number
  items: any[]
  total: number
  status: "pendiente" | "recibida" | "cancelada"
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [purchasesRes, suppliersRes] = await Promise.all([fetch("/api/purchases"), fetch("/api/suppliers")])

        const purchasesData = await purchasesRes.json()
        const suppliersData = await suppliersRes.json()

        setSuppliers(suppliersData)

        const enriched = purchasesData.map((p: Purchase) => ({
          ...p,
          supplierName: suppliersData.find((s: any) => s.id === p.supplierId)?.name,
        }))

        setPurchases(enriched)
      } catch (error) {
        console.error("Error loading purchases:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const pending = purchases.filter((p) => p.status === "pendiente").length
  const received = purchases.filter((p) => p.status === "recibida").length
  const totalValue = purchases.reduce((sum, p) => sum + p.total, 0)

  const columns = [
    { key: "id", label: "ID" },
    { key: "date", label: "Fecha" },
    { key: "supplierName", label: "Proveedor" },
    {
      key: "total",
      label: "Total",
      render: (value: number) => `$${value.toFixed(0)}`,
    },
    {
      key: "status",
      label: "Estado",
      render: (value: string) => {
        const colors = {
          pendiente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
          recibida: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
          cancelada: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
        }
        const labels = { pendiente: "Pendiente", recibida: "Recibida", cancelada: "Cancelada" }
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[value as keyof typeof colors]}`}>
            {labels[value as keyof typeof labels]}
          </span>
        )
      },
    },
    {
      key: "items",
      label: "Items",
      render: (value: any[]) => value.length,
    },
  ]

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando compras...</div>
  }

  return (
    <div>
      <PageHeader title="Compras" description="Gestiona órdenes de compra a proveedores" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Compras</p>
              <p className="text-2xl font-bold mt-2">{purchases.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <ShoppingCart size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pendientes</p>
              <p className="text-2xl font-bold mt-2 text-yellow-600">{pending}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
              <AlertCircle size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Recibidas</p>
              <p className="text-2xl font-bold mt-2 text-green-600">{received}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <CheckCircle size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-2xl font-bold mt-2">${totalValue.toFixed(0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-chart-2/10 text-chart-2">
              <ShoppingCart size={24} />
            </div>
          </div>
        </Card>
      </div>

      <DataTable columns={columns} data={purchases} searchFields={["supplierName", "id"]} />
    </div>
  )
}
