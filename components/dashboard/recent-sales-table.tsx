"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/format-utils"
import type { Sale } from "@/lib/types"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

interface RecentSalesTableProps {
    sales: Sale[]
}

const STATUS_LABELS: Record<string, string> = {
    completada: "Completada",
    pendiente: "Pendiente",
    cancelada: "Cancelada",
}

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    completada: "default",
    pendiente: "secondary",
    cancelada: "destructive",
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
    efectivo: "Efectivo",
    transferencia: "Transferencia",
    crédito: "Crédito",
    qr: "QR",
}

export function RecentSalesTable({ sales }: RecentSalesTableProps) {
    if (sales.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Ventas Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No hay ventas registradas aún
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Ventas Recientes</CardTitle>
                <Link
                    href="/sales"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                    Ver todas
                    <ExternalLink className="h-3 w-3" />
                </Link>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-2 text-sm font-medium">Fecha</th>
                                <th className="text-left py-3 px-2 text-sm font-medium">Cliente</th>
                                <th className="text-left py-3 px-2 text-sm font-medium">Vendedor</th>
                                <th className="text-right py-3 px-2 text-sm font-medium">Total</th>
                                <th className="text-left py-3 px-2 text-sm font-medium">Método</th>
                                <th className="text-left py-3 px-2 text-sm font-medium">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map((sale) => (
                                <tr key={sale.id} className="border-b hover:bg-muted/50 transition-colors">
                                    <td className="py-3 px-2 text-sm">{formatDate(sale.date)}</td>
                                    <td className="py-3 px-2 text-sm font-medium">{sale.clientName}</td>
                                    <td className="py-3 px-2 text-sm text-muted-foreground">{sale.sellerName}</td>
                                    <td className="py-3 px-2 text-sm font-semibold text-right">
                                        {formatCurrency(sale.total)}
                                    </td>
                                    <td className="py-3 px-2 text-sm">
                                        {PAYMENT_METHOD_LABELS[sale.paymentMethod] || sale.paymentMethod}
                                    </td>
                                    <td className="py-3 px-2">
                                        <Badge variant={STATUS_VARIANTS[sale.status]}>
                                            {STATUS_LABELS[sale.status] || sale.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
