import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const period = searchParams.get("period") || "7days"

        // Calcular fecha de inicio según el período
        const startDate = new Date()
        if (period === "7days") {
            startDate.setDate(startDate.getDate() - 7)
        } else if (period === "30days") {
            startDate.setDate(startDate.getDate() - 30)
        } else if (period === "90days") {
            startDate.setDate(startDate.getDate() - 90)
        } else if (period === "year") {
            startDate.setFullYear(startDate.getFullYear() - 1)
        }

        // Ventas por día
        const sales = await prisma.sale.findMany({
            where: {
                date: {
                    gte: startDate,
                },
                status: "completada",
            },
            orderBy: {
                date: "asc",
            },
        })

        // Agrupar ventas por día
        const salesByDay = sales.reduce((acc: Record<string, number>, sale) => {
            const dateKey = sale.date.toISOString().split("T")[0]
            acc[dateKey] = (acc[dateKey] || 0) + sale.total
            return acc
        }, {})

        const salesByDayArray = Object.entries(salesByDay).map(([date, total]) => ({
            date,
            total,
        }))

        // Top productos más vendidos
        const saleItems = await prisma.saleItem.findMany({
            where: {
                sale: {
                    date: {
                        gte: startDate,
                    },
                    status: "completada",
                },
            },
            include: {
                product: true,
            },
        })

        const productSales = saleItems.reduce(
            (acc: Record<number, { name: string; quantity: number; total: number }>, item) => {
                const productId = item.productId
                if (!acc[productId]) {
                    acc[productId] = {
                        name: item.product.name,
                        quantity: 0,
                        total: 0,
                    }
                }
                acc[productId].quantity += item.quantity
                acc[productId].total += item.subtotal
                return acc
            },
            {}
        )

        const topProducts = Object.values(productSales)
            .sort((a, b) => b.total - a.total)
            .slice(0, 10)

        // Ventas por categoría
        const salesByCategory = await prisma.saleItem.findMany({
            where: {
                sale: {
                    date: {
                        gte: startDate,
                    },
                    status: "completada",
                },
            },
            include: {
                product: {
                    include: {
                        category: true,
                    },
                },
            },
        })

        const categorySales = salesByCategory.reduce(
            (acc: Record<string, number>, item) => {
                const categoryName = item.product.category.name
                acc[categoryName] = (acc[categoryName] || 0) + item.subtotal
                return acc
            },
            {}
        )

        const salesByCategoryArray = Object.entries(categorySales).map(([category, total]) => ({
            category,
            total,
        }))

        // Métodos de pago
        const paymentMethods = sales.reduce(
            (acc: Record<string, number>, sale) => {
                acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + 1
                return acc
            },
            {}
        )

        const paymentMethodsArray = Object.entries(paymentMethods).map(([method, count]) => ({
            method,
            count,
        }))

        return NextResponse.json({
            salesByDay: salesByDayArray,
            topProducts,
            salesByCategory: salesByCategoryArray,
            paymentMethods: paymentMethodsArray,
        })
    } catch (error) {
        console.error("Error fetching dashboard charts data:", error)
        return NextResponse.json(
            { error: "Failed to fetch dashboard charts data" },
            { status: 500 }
        )
    }
}
