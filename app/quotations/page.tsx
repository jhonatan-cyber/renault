"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, CheckCircle, AlertCircle, XCircle, ArrowRight } from "lucide-react"
import { ConvertQuotationDialog } from "@/components/quotations/convert-quotation-dialog"

interface Quotation {
  id: number
  clientName: string
  date: string
  total: number
  status: "activa" | "vencida" | "convertida"
  items: any[]
  clientId: number
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showConvertDialog, setShowConvertDialog] = useState(false)
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const res = await fetch("/api/quotations")
      setQuotations(await res.json())
    } catch (error) {
      console.error("Error loading quotations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConvertToSale = (quotation: Quotation) => {
    setSelectedQuotation(quotation)
    setShowConvertDialog(true)
  }

  const handleConfirmConversion = () => {
    if (selectedQuotation) {
      setQuotations(quotations.map((q) => (q.id === selectedQuotation.id ? { ...q, status: "convertida" } : q)))
      setShowConvertDialog(false)
      setSelectedQuotation(null)
    }
  }

  const active = quotations.filter((q) => q.status === "activa").length
  const expired = quotations.filter((q) => q.status === "vencida").length
  const converted = quotations.filter((q) => q.status === "convertida").length
  const totalValue = quotations.reduce((sum, q) => sum + q.total, 0)

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
      key: "status",
      label: "Estado",
      render: (value: string) => {
        const colors = {
          activa: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
          vencida: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
          convertida: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
        }
        const labels = { activa: "Activa", vencida: "Vencida", convertida: "Convertida" }
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
    {
      key: "actions",
      label: "Acciones",
      render: (_, row: Quotation) =>
        row.status === "activa" ? (
          <Button size="sm" onClick={() => handleConvertToSale(row)} className="gap-1">
            <ArrowRight size={16} />
            Convertir
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">
            {row.status === "convertida" ? "Convertida" : "Vencida"}
          </span>
        ),
    },
  ]

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando cotizaciones...</div>
  }

  return (
    <div>
      <PageHeader title="Cotizaciones" description="Gestiona cotizaciones y presupuestos para clientes" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Cotizaciones</p>
              <p className="text-2xl font-bold mt-2">{quotations.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <FileText size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Activas</p>
              <p className="text-2xl font-bold mt-2 text-green-600">{active}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <CheckCircle size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Vencidas</p>
              <p className="text-2xl font-bold mt-2 text-red-600">{expired}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-100 text-red-600">
              <XCircle size={24} />
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
              <AlertCircle size={24} />
            </div>
          </div>
        </Card>
      </div>

      <DataTable columns={columns} data={quotations} searchFields={["clientName", "id"]} />

      {selectedQuotation && (
        <ConvertQuotationDialog
          isOpen={showConvertDialog}
          onClose={() => {
            setShowConvertDialog(false)
            setSelectedQuotation(null)
          }}
          onConfirm={handleConfirmConversion}
          quotation={selectedQuotation}
        />
      )}
    </div>
  )
}
