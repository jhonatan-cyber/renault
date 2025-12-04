import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        // Fecha de hoy (inicio del día)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Ventas de hoy
        const todaySales = await prisma.sale.findMany({
            where: {
                date: {
                    gte: today,
                },
                status: "completada",
            },
        })

        const todaySalesTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0)

        // Total de productos
        const totalProducts = await prisma.product.count()

        // Productos con stock bajo
        const lowStockProducts = await prisma.product.findMany({
            where: {
                stock: {
                    lte: prisma.product.fields.minimumStock,
                },
            },
            include: {
                category: true,
                supplier: true,
            },
            orderBy: {
                stock: "asc",
            },
            take: 10,
        })

        // Ventas recientes (últimas 10)
        const recentSales = await prisma.sale.findMany({
            include: {
                client: true,
                seller: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 10,
        })

        // Transformar para compatibilidad con el frontend
        const transformedRecentSales = recentSales.map((sale) => ({
            id: sale.id,
            date: sale.date.toISOString(),
            clientId: sale.clientId,
            clientName: sale.client.name,
            sellerUserId: sale.sellerUserId,
            sellerName: sale.seller.name,
            subtotal: sale.subtotal,
            tax: sale.tax,
            discount: sale.discount,
            total: sale.total,
            paymentMethod: sale.paymentMethod,
            status: sale.status,
            createdAt: sale.createdAt.toISOString(),
        }))

        const transformedLowStock = lowStockProducts.map((product) => ({
            id: product.id,
            code: product.code,
            name: product.name,
            category: product.category.name,
            categoryId: product.categoryId,
            purchasePrice: product.purchasePrice,
            salePrice: product.salePrice,
            stock: product.stock,
            minimumStock: product.minimumStock,
            unit: product.unit,
            supplierId: product.supplierId,
            supplierName: product.supplier.name,
            createdAt: product.createdAt.toISOString(),
        }))

        return NextResponse.json({
            todaySalesTotal,
            todaySalesCount: todaySales.length,
            totalProducts,
            lowStockCount: lowStockProducts.length,
            recentSales: transformedRecentSales,
            lowStockProducts: transformedLowStock,
        })
    } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        return NextResponse.json(
            { error: "Failed to fetch dashboard statistics" },
            { status: 500 }
        )
    }
}
