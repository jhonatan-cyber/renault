"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Package } from "lucide-react"
import type { Product } from "@/lib/types"
import Link from "next/link"

interface LowStockAlertsProps {
    products: Product[]
}

export function LowStockAlerts({ products }: LowStockAlertsProps) {
    if (products.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Alertas de Stock
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert>
                        <AlertDescription className="text-sm">
                            ✅ Todos los productos tienen stock suficiente
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        )
    }

    const getStockStatus = (stock: number, minimumStock: number) => {
        const percentage = (stock / minimumStock) * 100
        if (percentage <= 0) return { label: "Sin stock", variant: "destructive" as const, color: "text-red-600" }
        if (percentage <= 50) return { label: "Crítico", variant: "destructive" as const, color: "text-red-600" }
        if (percentage <= 100) return { label: "Bajo", variant: "secondary" as const, color: "text-orange-600" }
        return { label: "Normal", variant: "default" as const, color: "text-green-600" }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Alertas de Stock Bajo
                </CardTitle>
                <Link
                    href="/inventory"
                    className="text-sm text-primary hover:underline"
                >
                    Ver inventario
                </Link>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {products.map((product) => {
                        const status = getStockStatus(product.stock, product.minimumStock)
                        return (
                            <div
                                key={product.id}
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-sm">{product.name}</p>
                                        <Badge variant={status.variant} className="text-xs">
                                            {status.label}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Código: {product.code} • {product.category}
                                    </p>
                                </div>
                                <div className="text-right ml-4">
                                    <p className={`text-sm font-semibold ${status.color}`}>
                                        {product.stock} {product.unit}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Mínimo: {product.minimumStock}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
