"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"
import { formatCurrency } from "@/lib/format-utils"

interface ChartData {
    salesByDay: { date: string; total: number }[]
    topProducts: { name: string; quantity: number; total: number }[]
    salesByCategory: { category: string; total: number }[]
    paymentMethods: { method: string; count: number }[]
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6", "#14B8A6"]

const PAYMENT_METHOD_LABELS: Record<string, string> = {
    efectivo: "Efectivo",
    transferencia: "Transferencia",
    crédito: "Crédito",
    qr: "QR",
}

export function DashboardCharts({ salesByDay, topProducts, salesByCategory, paymentMethods }: ChartData) {
    // Formatear datos de ventas por día
    const formattedSalesByDay = salesByDay.map((item) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString("es-CO", { month: "short", day: "numeric" }),
    }))

    // Formatear métodos de pago
    const formattedPaymentMethods = paymentMethods.map((item) => ({
        ...item,
        name: PAYMENT_METHOD_LABELS[item.method] || item.method,
    }))

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {/* Ventas por Día */}
            <Card>
                <CardHeader>
                    <CardTitle>Ventas por Día (Últimos 7 días)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={formattedSalesByDay}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize={12} />
                            <YAxis fontSize={12} tickFormatter={(value) => formatCurrency(value)} />
                            <Tooltip
                                formatter={(value: number) => formatCurrency(value)}
                                labelStyle={{ color: "#000" }}
                            />
                            <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Top Productos */}
            <Card>
                <CardHeader>
                    <CardTitle>Top 10 Productos Más Vendidos</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topProducts.slice(0, 5)} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" fontSize={12} tickFormatter={(value) => formatCurrency(value)} />
                            <YAxis dataKey="name" type="category" width={100} fontSize={12} />
                            <Tooltip
                                formatter={(value: number) => formatCurrency(value)}
                                labelStyle={{ color: "#000" }}
                            />
                            <Bar dataKey="total" fill="#10B981" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Ventas por Categoría */}
            <Card>
                <CardHeader>
                    <CardTitle>Ventas por Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={salesByCategory}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(entry: any) => {
                                    const category = entry.category || ''
                                    const percent = entry.percent || 0
                                    return `${category} (${(percent * 100).toFixed(0)}%)`
                                }}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="total"
                            >
                                {salesByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Métodos de Pago */}
            <Card>
                <CardHeader>
                    <CardTitle>Métodos de Pago</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={formattedPaymentMethods}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip labelStyle={{ color: "#000" }} />
                            <Bar dataKey="count" fill="#8B5CF6" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
