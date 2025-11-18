"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Card } from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react"

interface CashRecord {
  id: number
  date: string
  openingBalance: number
  cashIncome: number
  cashExpenses: number
  closingBalance: number
  userName: string
}

export default function CashPage() {
  const [cashRecords, setCashRecords] = useState<CashRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/cash")
        setCashRecords(await res.json())
      } catch (error) {
        console.error("Error loading cash records:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const currentCash = cashRecords.length > 0 ? cashRecords[cashRecords.length - 1].closingBalance : 0
  const totalIncome = cashRecords.reduce((sum, r) => sum + r.cashIncome, 0)
  const totalExpenses = cashRecords.reduce((sum, r) => sum + r.cashExpenses, 0)

  const columns = [
    { key: "date", label: "Fecha" },
    {
      key: "openingBalance",
      label: "Saldo Inicial",
      render: (value: number) => `$${value.toFixed(0)}`,
    },
    {
      key: "cashIncome",
      label: "Ingresos",
      render: (value: number) => <span className="text-green-600 font-medium">+$${value.toFixed(0)}</span>,
    },
    {
      key: "cashExpenses",
      label: "Egresos",
      render: (value: number) => <span className="text-red-600 font-medium">-$${value.toFixed(0)}</span>,
    },
    {
      key: "closingBalance",
      label: "Saldo Final",
      render: (value: number) => `$${value.toFixed(0)}`,
    },
    { key: "userName", label: "Usuario" },
  ]

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando caja...</div>
  }

  return (
    <div>
      <PageHeader title="Caja Diaria" description="Registro y control del efectivo diario" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Saldo Actual</p>
              <p className="text-2xl font-bold mt-2">${currentCash.toFixed(0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <DollarSign size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Ingresos</p>
              <p className="text-2xl font-bold mt-2 text-green-600">${totalIncome.toFixed(0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Egresos</p>
              <p className="text-2xl font-bold mt-2 text-red-600">${totalExpenses.toFixed(0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-100 text-red-600">
              <TrendingDown size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Registros Diarios</p>
              <p className="text-2xl font-bold mt-2">{cashRecords.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-chart-2/10 text-chart-2">
              <DollarSign size={24} />
            </div>
          </div>
        </Card>
      </div>

      <DataTable columns={columns} data={[...cashRecords].reverse()} />
    </div>
  )
}
