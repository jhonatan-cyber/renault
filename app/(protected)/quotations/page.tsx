"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Eye, FileText, CheckCircle2, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ConvertQuotationDialog } from "@/components/quotations/convert-quotation-dialog"
import { formatCurrency, formatDate } from "@/lib/format-utils"
import { toast } from "sonner"
import type { Quotation } from "@/lib/types"

const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive"> = {
  pendiente: "secondary",
  aprobada: "default",
  rechazada: "destructive",
  convertida: "default",
}

const STATUS_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
  convertida: "Convertida",
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [convertOpen, setConvertOpen] = useState(false)
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    fetchQuotations()
  }, [refreshKey])

  async function fetchQuotations() {
    try {
      setIsLoading(true)
      const response = await fetch("/api/quotations")
      const data = await response.json()
      setQuotations(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching quotations:", error)
      toast.error("Error al cargar cotizaciones")
    } finally {
      setIsLoading(false)
    }
  }

  function handleViewDetails(quotation: Quotation) {
    setSelectedQuotation(quotation)
    setDetailsOpen(true)
  }

  function handleConvert(quotation: Quotation) {
    setSelectedQuotation(quotation)
    setConvertOpen(true)
  }

  function handleConvertSuccess() {
    toast.success("Cotización convertida a venta exitosamente")
    setRefreshKey((prev) => prev + 1)
    setConvertOpen(false)
    setSelectedQuotation(null)
  }

  const totalQuotations = quotations.reduce((sum, q) => sum + q.total, 0)
  const pendingQuotations = quotations.filter((q) => q.status === "pendiente")
  const approvedQuotations = quotations.filter((q) => q.status === "aprobada")
  const convertedQuotations = quotations.filter((q) => q.status === "convertida")

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Cotizaciones"
          description="Gestiona cotizaciones y conviértelas en ventas"
        />
        <Button onClick={() => toast.info("Formulario de cotización en desarrollo")}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Cotización
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Cotizaciones</p>
                <p className="text-2xl font-bold">{formatCurrency(totalQuotations)}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-orange-600">{pendingQuotations.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aprobadas</p>
                <p className="text-2xl font-bold text-blue-600">{approvedQuotations.length}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Convertidas</p>
                <p className="text-2xl font-bold text-green-600">{convertedQuotations.length}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
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
              <TableHead>Estado</TableHead>
              <TableHead>Válida Hasta</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : quotations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No hay cotizaciones registradas
                </TableCell>
              </TableRow>
            ) : (
              quotations.map((quotation) => (
                <TableRow key={quotation.id}>
                  <TableCell className="font-mono text-sm">{formatDate(quotation.date)}</TableCell>
                  <TableCell className="font-medium">{quotation.clientName}</TableCell>
                  <TableCell className="text-muted-foreground">{quotation.sellerName}</TableCell>
                  <TableCell className="text-right">{formatCurrency(quotation.subtotal)}</TableCell>
                  <TableCell className="text-right text-orange-600">
                    -{formatCurrency(quotation.discount)}
                  </TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(quotation.total)}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_COLORS[quotation.status] || "default"}>
                      {STATUS_LABELS[quotation.status] || quotation.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {formatDate(quotation.validUntil)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleViewDetails(quotation)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {quotation.status === "aprobada" && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleConvert(quotation)}
                        >
                          Convertir
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles de Cotización #{selectedQuotation?.id}</DialogTitle>
            <DialogDescription>
              Fecha: {selectedQuotation && formatDate(selectedQuotation.date)}
            </DialogDescription>
          </DialogHeader>

          {selectedQuotation && (
            <div className="space-y-4">
              {/* Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cliente</p>
                  <p className="font-semibold">{selectedQuotation.clientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Vendedor</p>
                  <p className="font-semibold">{selectedQuotation.sellerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estado</p>
                  <Badge variant={STATUS_COLORS[selectedQuotation.status] || "default"}>
                    {STATUS_LABELS[selectedQuotation.status] || selectedQuotation.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Válida Hasta</p>
                  <p className="font-semibold">{formatDate(selectedQuotation.validUntil)}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold mb-2">Productos</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead className="text-right">Precio</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedQuotation.items?.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(item.subtotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-semibold">{formatCurrency(selectedQuotation.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Impuesto:</span>
                  <span className="font-semibold">{formatCurrency(selectedQuotation.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Descuento:</span>
                  <span className="font-semibold text-orange-600">
                    -{formatCurrency(selectedQuotation.discount)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(selectedQuotation.total)}</span>
                </div>
              </div>

              {selectedQuotation.notes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Notas</p>
                  <p className="text-sm">{selectedQuotation.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Convert Dialog */}
      {selectedQuotation && (
        <ConvertQuotationDialog
          open={convertOpen}
          onOpenChange={setConvertOpen}
          quotation={selectedQuotation}
          onSuccess={handleConvertSuccess}
        />
      )}
    </div>
  )
}
