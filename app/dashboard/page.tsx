"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, DollarSign, ShoppingCart, AlertTriangle } from "lucide-react"
import type { Sale, Purchase, Product, Client } from "@/lib/data-loader"

export default function DashboardPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [salesRes, purchasesRes, productsRes, clientsRes] = await Promise.all([
          fetch("/api/sales"),
          fetch("/api/purchases"),
          fetch("/api/products"),
          fetch("/api/clients"),
        ])

        setSales(await salesRes.json())
        setPurchases(await purchasesRes.json())
        setProducts(await productsRes.json())
        setClients(await clientsRes.json())
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Calculate metrics
  const totalSales = sales.reduce((sum, s) => sum + s.total, 0)
  const totalPurchases = purchases.reduce((sum, p) => sum + p.total, 0)
  const profit = totalSales - totalPurchases
  const profitMargin = totalSales > 0 ? ((profit / totalSales) * 100).toFixed(1) : "0"

  // Low stock products
  const lowStockProducts = products.filter((p) => p.stock <= p.minimumStock)

  // Sales by month
  const salesByMonth = sales.reduce(
    (acc, sale) => {
      const date = new Date(sale.date)
      const month = date.toLocaleDateString("es-ES", { month: "short" })
      const existing = acc.find((item) => item.month === month)
      if (existing) {
        existing.total += sale.total
      } else {
        acc.push({ month, total: sale.total })
      }
      return acc
    },
    [] as Array<{ month: string; total: number }>,
  )

  // Top products
  const topProducts = sales
    .flatMap((s) => s.items)
    .reduce(
      (acc, item) => {
        const existing = acc.find((p) => p.productId === item.productId)
        if (existing) {
          existing.quantity += item.quantity
          existing.revenue += item.subtotal
        } else {
          acc.push({ productId: item.productId, quantity: item.quantity, revenue: item.subtotal })
        }
        return acc
      },
      [] as Array<{ productId: number; quantity: number; revenue: number }>,
    )
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((p) => ({
      ...p,
      name: products.find((prod) => prod.id === p.productId)?.name || "Unknown",
    }))

  // Payment methods distribution
  const paymentMethods = sales.reduce(
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

  const COLORS = ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Cargando dashboard...</div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Dashboard" description="Resumen general del negocio y métricas clave" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ventas Totales</p>
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
              <p className="text-sm text-muted-foreground">Compras Totales</p>
              <p className="text-2xl font-bold mt-2">${totalPurchases.toFixed(0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-chart-2/10 text-chart-2">
              <ShoppingCart size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ganancia Neta</p>
              <p className="text-2xl font-bold mt-2 text-green-600">${profit.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground mt-1">Margen: {profitMargin}%</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Stock Crítico</p>
              <p className="text-2xl font-bold mt-2 text-orange-600">{lowStockProducts.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Productos</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
              <AlertTriangle size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales by Month */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Ventas por Mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ fill: "var(--primary)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Products */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Productos Más Vendidos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
              <Bar dataKey="revenue" fill="var(--chart-1)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Payment Methods & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Métodos de Pago</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethods}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentMethods.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(0)}`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Low Stock Products */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Productos con Stock Crítico</h3>
          <div className="space-y-3">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-start justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800"
                >
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Stock: {product.stock}/{product.minimumStock}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-200 font-medium">
                    {product.stock <= 0 ? "Agotado" : "Bajo"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Todos los productos tienen stock adecuado</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
