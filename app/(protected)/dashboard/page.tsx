"use client"

import { useEffect, useState } from "react"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { RecentSalesTable } from "@/components/dashboard/recent-sales-table"
import { LowStockAlerts } from "@/components/dashboard/low-stock-alerts"
import { PageHeader } from "@/components/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface DashboardData {
    todaySalesTotal: number
    todaySalesCount: number
    totalProducts: number
    lowStockCount: number
    recentSales: any[]
    lowStockProducts: any[]
}

interface ChartsData {
    salesByDay: { date: string; total: number }[]
    topProducts: { name: string; quantity: number; total: number }[]
    salesByCategory: { category: string; total: number }[]
    paymentMethods: { method: string; count: number }[]
}

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
    const [chartsData, setChartsData] = useState<ChartsData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true)
                setError(null)

                // Fetch dashboard stats
                const statsResponse = await fetch("/api/dashboard/stats")
                if (!statsResponse.ok) throw new Error("Error al cargar estadísticas")
                const stats = await statsResponse.json()

                // Fetch charts data
                const chartsResponse = await fetch("/api/dashboard/charts?period=7days")
                if (!chartsResponse.ok) throw new Error("Error al cargar gráficos")
                const charts = await chartsResponse.json()

                setDashboardData(stats)
                setChartsData(charts)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error desconocido")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    if (error) {
        return (
            <div className="p-6">
                <PageHeader title="Dashboard" description="Panel de control y estadísticas" />
                <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        )
    }

    if (isLoading || !dashboardData || !chartsData) {
        return (
            <div className="p-6 space-y-6">
                <PageHeader title="Dashboard" description="Panel de control y estadísticas" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-80" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            <PageHeader
                title="Dashboard"
                description="Panel de control y estadísticas en tiempo real"
            />

            {/* Stats Cards */}
            <DashboardStats
                todaySalesTotal={dashboardData.todaySalesTotal}
                todaySalesCount={dashboardData.todaySalesCount}
                totalProducts={dashboardData.totalProducts}
                lowStockCount={dashboardData.lowStockCount}
            />

            {/* Charts */}
            <DashboardCharts
                salesByDay={chartsData.salesByDay}
                topProducts={chartsData.topProducts}
                salesByCategory={chartsData.salesByCategory}
                paymentMethods={chartsData.paymentMethods}
            />

            {/* Recent Sales and Alerts */}
            <div className="grid gap-4 md:grid-cols-2">
                <RecentSalesTable sales={dashboardData.recentSales} />
                <LowStockAlerts products={dashboardData.lowStockProducts} />
            </div>
        </div>
    )
}
