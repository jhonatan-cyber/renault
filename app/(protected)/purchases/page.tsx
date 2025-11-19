"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Eye, TrendingUp, Package } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { formatCurrency, formatDate } from "@/lib/format-utils"
import { toast } from "sonner"
import type { Purchase } from "@/lib/types"

const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive"> = {
    recibida: "default",
    pendiente: "secondary",
    cancelada: "destructive",
}

export default function PurchasesPage() {
    const [purchases, setPurchases] = useState<Purchase[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        fetchPurchases()
    }, [refreshKey])

    async function fetchPurchases() {
        try {
            setIsLoading(true)
            const response = await fetch("/api/purchases")
            const data = await response.json()
            setPurchases(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error("Error fetching purchases:", error)
            toast.error("Error al cargar compras")
        } finally {
            setIsLoading(false)
        }
    }

    function handleViewDetails(purchase: Purchase) {
        setSelectedPurchase(purchase)
        setDetailsOpen(true)
    }

    const totalPurchases = purchases.reduce((sum, p) => sum + p.total, 0)
    const receivedPurchases = purchases.filter((p) => p.status === "recibida")
    const pendingPurchases = purchases.filter((p) => p.status === "pendiente")

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Compras"
                    description="Gestiona las compras a proveedores"
                />
                <Button onClick={() => toast.info("Formulario de compra en desarrollo")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Compra
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Compras</p>
                                <p className="text-2xl font-bold">{formatCurrency(totalPurchases)}</p>
                            </div>
                            <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Cantidad</p>
                                <p className="text-2xl font-bold">{purchases.length}</p>
                            </div>
                            <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Recibidas</p>
                                <p className="text-2xl font-bold text-green-600">{receivedPurchases.length}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                                <p className="text-2xl font-bold text-orange-600">{pendingPurchases.length}</p>
                            </div>
                            <Package className="h-8 w-8 text-orange-500" />
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
                            <TableHead>Proveedor</TableHead>
                            <TableHead>Comprador</TableHead>
                            <TableHead className="text-right">Subtotal</TableHead>
                            <TableHead className="text-right">Impuesto</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8">
                                    Cargando...
                                </TableCell>
                            </TableRow>
                        ) : purchases.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                    No hay compras registradas
                                </TableCell>
                            </TableRow>
                        ) : (
                            purchases.map((purchase) => (
                                <TableRow key={purchase.id}>
                                    <TableCell className="font-mono text-sm">{formatDate(purchase.date)}</TableCell>
                                    <TableCell className="font-medium">{purchase.supplierName}</TableCell>
                                    <TableCell className="text-muted-foreground">{purchase.buyerName}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(purchase.subtotal)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(purchase.tax)}</TableCell>
                                    <TableCell className="text-right font-bold">{formatCurrency(purchase.total)}</TableCell>
                                    <TableCell>
                                        <Badge variant={STATUS_COLORS[purchase.status] || "default"}>
                                            {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" variant="ghost" onClick={() => handleViewDetails(purchase)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
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
                        <DialogTitle>Detalles de Compra #{selectedPurchase?.id}</DialogTitle>
                        <DialogDescription>
                            Fecha: {selectedPurchase && formatDate(selectedPurchase.date)}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedPurchase && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Proveedor</p>
                                    <p className="font-semibold">{selectedPurchase.supplierName}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Comprador</p>
                                    <p className="font-semibold">{selectedPurchase.buyerName}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Estado</p>
                                    <Badge variant={STATUS_COLORS[selectedPurchase.status] || "default"}>
                                        {selectedPurchase.status.charAt(0).toUpperCase() + selectedPurchase.status.slice(1)}
                                    </Badge>
                                </div>
                            </div>

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
                                        {selectedPurchase.items?.map((item: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.productName}</TableCell>
                                                <TableCell className="text-right">{item.quantity}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                                                <TableCell className="text-right font-semibold">
                                                    {formatCurrency(item.quantity * item.price)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal:</span>
                                    <span className="font-semibold">{formatCurrency(selectedPurchase.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Impuesto:</span>
                                    <span className="font-semibold">{formatCurrency(selectedPurchase.tax)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-2">
                                    <span>Total:</span>
                                    <span>{formatCurrency(selectedPurchase.total)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
