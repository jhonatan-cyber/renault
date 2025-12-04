"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, TrendingUp, TrendingDown, DollarSign, Package } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/format-utils"
import { toast } from "sonner"

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState(new Date(new Date().setDate(1)).toISOString().split('T')[0])
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0])
  const [salesData, setSalesData] = useState<any[]>([])
  const [purchasesData, setPurchasesData] = useState<any[]>([])
  const [expensesData, setExpensesData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchReports()
  }, [dateFrom, dateTo])

  async function fetchReports() {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({ dateFrom, dateTo })
      
      const [sales, purchases, expenses] = await Promise.all([
        fetch(`/api/sales?${params}`).then(r => r.json()),
        fetch(`/api/purchases?${params}`).then(r => r.json()),
        fetch(`/api/expenses?${params}`).then(r => r.json()),
      ])

      setSalesData(Array.isArray(sales) ? sales : [])
      setPurchasesData(Array.isArray(purchases) ? purchases : [])
      setExpensesData(Array.isArray(expenses) ? expenses : [])
    } catch (error) {
      console.error("Error fetching reports:", error)
      toast.error("Error al cargar reportes")
    } finally {
      setIsLoading(false)
    }
  }

  const totalSales = salesData.reduce((sum, s) => sum + s.total, 0)
  const totalPurchases = purchasesData.reduce((sum, p) => sum + p.total, 0)
  const totalExpenses = expensesData.reduce((sum, e) => sum + e.amount, 0)
  const netProfit = totalSales - totalPurchases - totalExpenses

  const handleExport = (type: string) => {
    toast.info(`Exportando reporte de ${type}...`)
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Reportes"
        description="Análisis y reportes del negocio"
      />

      {/* Date Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="dateFrom">Fecha Desde</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="dateTo">Fecha Hasta</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <Button onClick={fetchReports} disabled={isLoading}>
              {isLoading ? "Cargando..." : "Actualizar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalSales)}</div>
            <p className="text-xs text-muted-foreground">{salesData.length} transacciones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compras Totales</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalPurchases)}</div>
            <p className="text-xs text-muted-foreground">{purchasesData.length} compras</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">{expensesData.length} gastos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilidad Neta</CardTitle>
            <DollarSign className={`h-4 w-4 ${netProfit >= 0 ? "text-green-500" : "text-red-500"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(netProfit)}
            </div>
            <p className="text-xs text-muted-foreground">
              {netProfit >= 0 ? "Ganancia" : "Pérdida"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Ventas</TabsTrigger>
          <TabsTrigger value="purchases">Compras</TabsTrigger>
          <TabsTrigger value="expenses">Gastos</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Reporte de Ventas</h3>
            <Button variant="outline" onClick={() => handleExport("ventas")}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="text-right">Descuento</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No hay ventas en este período
                    </TableCell>
                  </TableRow>
                ) : (
                  salesData.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-mono text-sm">{formatDate(sale.date)}</TableCell>
                      <TableCell>{sale.clientName}</TableCell>
                      <TableCell className="text-muted-foreground">{sale.sellerName}</TableCell>
                      <TableCell className="text-right">{formatCurrency(sale.subtotal)}</TableCell>
                      <TableCell className="text-right text-red-600">
                        -{formatCurrency(sale.discount)}
                      </TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(sale.total)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="purchases" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Reporte de Compras</h3>
            <Button variant="outline" onClick={() => handleExport("compras")}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Comprador</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="text-right">Impuesto</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchasesData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No hay compras en este período
                    </TableCell>
                  </TableRow>
                ) : (
                  purchasesData.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell className="font-mono text-sm">{formatDate(purchase.date)}</TableCell>
                      <TableCell>{purchase.supplierName}</TableCell>
                      <TableCell className="text-muted-foreground">{purchase.buyerName}</TableCell>
                      <TableCell className="text-right">{formatCurrency(purchase.subtotal)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(purchase.tax)}</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(purchase.total)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Reporte de Gastos</h3>
            <Button variant="outline" onClick={() => handleExport("gastos")}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expensesData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No hay gastos en este período
                    </TableCell>
                  </TableRow>
                ) : (
                  expensesData.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-mono text-sm">{formatDate(expense.date)}</TableCell>
                      <TableCell className="max-w-xs truncate">{expense.description}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell className="text-muted-foreground">{expense.responsibleName}</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(expense.amount)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
