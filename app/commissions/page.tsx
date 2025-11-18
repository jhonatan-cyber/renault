"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, DollarSign, AlertCircle, CheckCircle } from "lucide-react"
import { CommissionPaymentDialog } from "@/components/commissions/commission-payment-dialog"

interface Commission {
  id: number
  sellerId: number
  sellerName: string
  amount: number
  percentage: number
  date: string
  status: string
}

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const res = await fetch("/api/commissions")
      setCommissions(await res.json())
    } catch (error) {
      console.error("Error loading commissions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsPaid = (commission: Commission) => {
    setSelectedCommission(commission)
    setShowPaymentDialog(true)
  }

  const handleConfirmPayment = () => {
    if (selectedCommission) {
      setCommissions(commissions.map((c) => (c.id === selectedCommission.id ? { ...c, status: "completada" } : c)))
      setShowPaymentDialog(false)
      setSelectedCommission(null)
    }
  }

  const totalCommissions = commissions.reduce((sum, c) => sum + c.amount, 0)
  const completedCommissions = commissions.filter((c) => c.status === "completada").length
  const pendingCommissions = commissions.filter((c) => c.status === "pendiente").length
  const uniqueSellers = new Set(commissions.map((c) => c.sellerId)).size

  const sellerCommissions = commissions
    .reduce(
      (acc, c) => {
        const existing = acc.find((s) => s.sellerId === c.sellerId)
        if (existing) {
          existing.total += c.amount
          existing.count += 1
          existing.pending += c.status === "pendiente" ? c.amount : 0
        } else {
          acc.push({
            sellerId: c.sellerId,
            sellerName: c.sellerName,
            total: c.amount,
            pending: c.status === "pendiente" ? c.amount : 0,
            count: 1,
          })
        }
        return acc
      },
      [] as Array<{ sellerId: number; sellerName: string; total: number; pending: number; count: number }>,
    )
    .sort((a, b) => b.total - a.total)

  const columns = [
    { key: "id", label: "ID" },
    { key: "date", label: "Fecha" },
    { key: "sellerName", label: "Vendedor" },
    {
      key: "percentage",
      label: "% Comisión",
      render: (value: number) => `${value}%`,
    },
    {
      key: "amount",
      label: "Monto",
      render: (value: number) => `$${value.toFixed(0)}`,
    },
    {
      key: "status",
      label: "Estado",
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "completada"
              ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200"
          }`}
        >
          {value === "completada" ? "Pagada" : "Pendiente"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (_, row: Commission) =>
        row.status === "pendiente" ? (
          <Button size="sm" onClick={() => handleMarkAsPaid(row)}>
            <CheckCircle size={16} className="mr-1" />
            Pagar
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">Pagada</span>
        ),
    },
  ]

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando comisiones...</div>
  }

  return (
    <div>
      <PageHeader title="Comisiones" description="Gestiona comisiones de vendedores" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Comisiones</p>
              <p className="text-2xl font-bold mt-2">${totalCommissions.toFixed(0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <DollarSign size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pendiente de Pagar</p>
              <p className="text-2xl font-bold mt-2 text-yellow-600">
                $
                {commissions
                  .filter((c) => c.status === "pendiente")
                  .reduce((sum, c) => sum + c.amount, 0)
                  .toFixed(0)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
              <AlertCircle size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pagadas</p>
              <p className="text-2xl font-bold mt-2 text-green-600">
                $
                {commissions
                  .filter((c) => c.status === "completada")
                  .reduce((sum, c) => sum + c.amount, 0)
                  .toFixed(0)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Vendedores</p>
              <p className="text-2xl font-bold mt-2">{uniqueSellers}</p>
            </div>
            <div className="p-3 rounded-lg bg-chart-1/10 text-chart-1">
              <Users size={24} />
            </div>
          </div>
        </Card>
      </div>

      {sellerCommissions.length > 0 && (
        <Card className="p-6 mb-8">
          <h3 className="font-semibold mb-4">Comisiones por Vendedor</h3>
          <div className="space-y-3">
            {sellerCommissions.map((seller) => (
              <div key={seller.sellerId} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{seller.sellerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {seller.count} comisiones | Pendiente: ${seller.pending.toFixed(0)}
                  </p>
                </div>
                <p className="text-lg font-semibold text-primary">${seller.total.toFixed(0)}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <DataTable columns={columns} data={commissions} searchFields={["sellerName"]} />

      {selectedCommission && (
        <CommissionPaymentDialog
          isOpen={showPaymentDialog}
          onClose={() => {
            setShowPaymentDialog(false)
            setSelectedCommission(null)
          }}
          onConfirm={handleConfirmPayment}
          commission={selectedCommission}
        />
      )}
    </div>
  )
}
