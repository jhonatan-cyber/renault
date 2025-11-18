"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Card } from "@/components/ui/card"
import { FileText, DollarSign, TrendingDown, AlertCircle } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface Expense {
  id: number
  date: string
  description: string
  amount: number
  category: string
  responsibleName: string
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/expenses")
        setExpenses(await res.json())
      } catch (error) {
        console.error("Error loading expenses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0

  const expensesByCategory = expenses.reduce(
    (acc, e) => {
      const existing = acc.find((c) => c.name === e.category)
      if (existing) {
        existing.value += e.amount
      } else {
        acc.push({ name: e.category, value: e.amount })
      }
      return acc
    },
    [] as Array<{ name: string; value: number }>,
  )

  const COLORS = ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"]

  const columns = [
    { key: "date", label: "Fecha" },
    { key: "description", label: "Descripción" },
    { key: "category", label: "Categoría" },
    {
      key: "amount",
      label: "Monto",
      render: (value: number) => `$${value.toFixed(0)}`,
    },
    { key: "responsibleName", label: "Responsable" },
  ]

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando gastos...</div>
  }

  return (
    <div>
      <PageHeader title="Gastos" description="Registro de gastos internos de la empresa" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Gastos</p>
              <p className="text-2xl font-bold mt-2">${totalExpenses.toFixed(0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive">
              <FileText size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cantidad Gastos</p>
              <p className="text-2xl font-bold mt-2">{expenses.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-chart-1/10 text-chart-1">
              <TrendingDown size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Gasto Promedio</p>
              <p className="text-2xl font-bold mt-2">${averageExpense.toFixed(0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-chart-2/10 text-chart-2">
              <DollarSign size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Categorías</p>
              <p className="text-2xl font-bold mt-2">{expensesByCategory.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <AlertCircle size={24} />
            </div>
          </div>
        </Card>
      </div>

      {expensesByCategory.length > 0 && (
        <Card className="p-6 mb-8">
          <h3 className="font-semibold mb-4">Gastos por Categoría</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expensesByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {expensesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(0)}`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}

      <DataTable columns={columns} data={expenses} searchFields={["description", "category"]} />
    </div>
  )
}
