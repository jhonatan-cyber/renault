"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, AlertTriangle, TrendingUp } from "lucide-react"
import { formatCurrency, formatNumber } from "@/lib/format-utils"

interface DashboardStatsProps {
    todaySalesTotal: number
    todaySalesCount: number
    totalProducts: number
    lowStockCount: number
    pendingCommissionsTotal: number
    pendingCommissionsCount: number
}

export function DashboardStats({
    todaySalesTotal,
    todaySalesCount,
    totalProducts,
    lowStockCount,
    pendingCommissionsTotal,
    pendingCommissionsCount,
}: DashboardStatsProps) {
    const stats = [
        {
            title: "Ventas de Hoy",
            value: formatCurrency(todaySalesTotal),
            subtitle: `${todaySalesCount} ${todaySalesCount === 1 ? 'venta' : 'ventas'}`,
            icon: DollarSign,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Productos en Inventario",
            value: formatNumber(totalProducts),
            subtitle: "productos totales",
            icon: Package,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Stock Bajo",
            value: formatNumber(lowStockCount),
            subtitle: lowStockCount > 0 ? "requieren atención" : "todo en orden",
            icon: AlertTriangle,
            color: lowStockCount > 0 ? "text-orange-600" : "text-gray-400",
            bgColor: lowStockCount > 0 ? "bg-orange-50" : "bg-gray-50",
        },
        {
            title: "Comisiones Pendientes",
            value: formatCurrency(pendingCommissionsTotal),
            subtitle: `${pendingCommissionsCount} ${pendingCommissionsCount === 1 ? 'comisión' : 'comisiones'}`,
            icon: TrendingUp,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <div className={`${stat.bgColor} p-2 rounded-lg`}>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
