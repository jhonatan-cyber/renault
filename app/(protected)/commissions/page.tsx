"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, TrendingUp, Users, CheckCircle2 } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/format-utils"
import { toast } from "sonner"
import type { Commission } from "@/lib/types"

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCommissions()
  }, [])

  async function fetchCommissions() {
    try {
      setIsLoading(true)
      const response = await fetch("/api/commissions")
      const data = await response.json()
      setCommissions(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching commissions:", error)
      toast.error("Error al cargar comisiones")
    } finally {
      setIsLoading(false)
    }
  }

  const totalCommissions = commissions.reduce((sum, c) => sum + c.amount, 0)
  const pendingCommissions = commissions.filter((c) => c.status === "pendiente")
  const paidCommissions = commissions.filter((c) => c.status === "completada")
  const totalPending = pendingCommissions.reduce((sum, c) => sum + c.amount, 0)
  const totalPaid = paidCommissions.reduce((sum, c) => sum + c.amount, 0)
  const uniqueSellers = new Set(commissions.map((c) => c.sellerId)).size

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Comisiones"
        description="Seguimiento de comisiones de ventas por vendedor"
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comisiones</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCommissions)}</div>
            <p className="text-xs text-muted-foreground">{commissions.length} comisiones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalPending)}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingCommissions.length} por pagar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagadas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalPaid)}
            </div>
            <p className="text-xs text-muted-foreground">{paidCommissions.length} completadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendedores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueSellers}</div>
            <p className="text-xs text-muted-foreground">con comisiones</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Vendedor</TableHead>
              <TableHead>Venta</TableHead>
              <TableHead className="text-right">Porcentaje</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : commissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No hay comisiones registradas
                </TableCell>
              </TableRow>
            ) : (
              commissions.map((commission) => (
                <TableRow key={commission.id}>
                  <TableCell className="font-mono text-sm">
                    {formatDate(commission.date)}
                  </TableCell>
                  <TableCell className="font-medium">{commission.sellerName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    Venta #{commission.saleId}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {commission.percentage.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(commission.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        commission.status === "completada" ? "default" : "secondary"
                      }
                    >
                      {commission.status === "completada" ? "Pagada" : "Pendiente"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Note */}
      {pendingCommissions.length > 0 && (
        <div className="rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 p-4">
          <p className="text-sm text-orange-800 dark:text-orange-200">
            <strong>Nota:</strong> Hay {pendingCommissions.length} comisión(es) pendiente(s) de pago
            por un total de <strong>{formatCurrency(totalPending)}</strong>.
          </p>
        </div>
      )}
    </div>
  )
}
