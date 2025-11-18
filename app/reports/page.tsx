"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Download, FileText, BarChart3, TrendingUp } from "lucide-react"
import type { Sale, Purchase } from "@/lib/data-loader"

export default function ReportsPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [expenses, setExpenses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [salesRes, purchasesRes, expensesRes] = await Promise.all([
          fetch("/api/sales"),
          fetch("/api/purchases"),
          fetch("/api/expenses"),
        ])

        setSales(await salesRes.json())
        setPurchases(await purchasesRes.json())
        setExpenses(await expensesRes.json())
      } catch (error) {
        console.error("Error loading reports data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const totalSales = sales.reduce((sum, s) => sum + s.total, 0)
  const totalPurchases = purchases.reduce((sum, p) => sum + p.total, 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const profit = totalSales - totalPurchases - totalExpenses

  const salesByMonth = sales.reduce(
    (acc, sale) => {
      const date = new Date(sale.date)
      const month = date.toLocaleDateString("es-ES", { month: "short", year: "2-digit" })
      const existing = acc.find((item) => item.month === month)
      if (existing) {
        existing.ventas += sale.total
      } else {
        acc.push({ month, ventas: sale.total, compras: 0, gastos: 0 })
      }
      return acc
    },
    [] as Array<{ month: string; ventas: number; compras: number; gastos: number }>,
  )

  const purchasesByMonth = purchases.reduce((acc, purchase) => {
    const date = new Date(purchase.date)
    const month = date.toLocaleDateString("es-ES", { month: "short", year: "2-digit" })
    const existing = acc.find((item) => item.month === month)
    if (existing) {
      existing.compras += purchase.total
    }
    return acc
  }, salesByMonth)

  const expensesByMonth = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date)
    const month = date.toLocaleDateString("es-ES", { month: "short", year: "2-digit" })
    const existing = acc.find((item) => item.month === month)
    if (existing) {
      existing.gastos += expense.amount
    } else {
      acc.push({ month, ventas: 0, compras: 0, gastos: expense.amount })
    }
    return acc
  }, purchasesByMonth)

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando reportes...</div>
  }

  return (
    <div>
      <PageHeader title="Reportes" description="Análisis financiero y reportes del negocio" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ventas Totales</p>
              <p className="text-2xl font-bold mt-2">${totalSales.toFixed(0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <TrendingUp size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Compras Totales</p>
              <p className="text-2xl font-bold mt-2">${totalPurchases.toFixed(0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-chart-2/10 text-chart-2">
              <BarChart3 size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Gastos Totales</p>
              <p className="text-2xl font-bold mt-2">${totalExpenses.toFixed(0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-100 text-red-600">
              <FileText size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ganancia Neta</p>
              <p className={`text-2xl font-bold mt-2 ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${profit.toFixed(0)}
              </p>
            </div>
            <div
              className={`p-3 rounded-lg ${profit >= 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
            >
              <TrendingUp size={24} />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Análisis por Período</h3>
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Exportar
          </Button>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={expensesByMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
            <Legend />
            <Line type="monotone" dataKey="ventas" stroke="var(--primary)" name="Ventas" strokeWidth={2} />
            <Line type="monotone" dataKey="compras" stroke="var(--chart-2)" name="Compras" strokeWidth={2} />
            <Line type="monotone" dataKey="gastos" stroke="var(--destructive)" name="Gastos" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Resumen de Ventas vs Compras</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expensesByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
              <Legend />
              <Bar dataKey="ventas" fill="var(--primary)" name="Ventas" />
              <Bar dataKey="compras" fill="var(--chart-2)" name="Compras" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Estado de Resultados</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between pb-2 border-b">
              <span className="text-muted-foreground">Ventas</span>
              <span className="font-semibold text-green-600">${totalSales.toFixed(0)}</span>
            </div>
            <div className="flex justify-between pb-2 border-b">
              <span className="text-muted-foreground">(-) Compras</span>
              <span className="font-semibold text-red-600">-${totalPurchases.toFixed(0)}</span>
            </div>
            <div className="flex justify-between pb-2 border-b">
              <span className="text-muted-foreground">(-) Gastos</span>
              <span className="font-semibold text-red-600">-${totalExpenses.toFixed(0)}</span>
            </div>
            <div
              className={`flex justify-between pt-2 text-base font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              <span>Utilidad Neta</span>
              <span>${profit.toFixed(0)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
