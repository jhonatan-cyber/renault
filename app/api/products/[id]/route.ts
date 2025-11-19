import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { ProductSchema } from "@/lib/validations"

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id)
        const body = await request.json()

        // Validar datos
        const validated = ProductSchema.parse(body)

        // Verificar que el producto existe
        const existingProduct = await prisma.product.findUnique({
            where: { id },
        })

        if (!existingProduct) {
            return NextResponse.json(
                { error: "Producto no encontrado" },
                { status: 404 }
            )
        }

        // Actualizar producto
        const product = await prisma.product.update({
            where: { id },
            data: {
                code: validated.code,
                name: validated.name,
                categoryId: validated.categoryId,
                purchasePrice: validated.purchasePrice,
                salePrice: validated.salePrice,
                stock: validated.stock,
                minimumStock: validated.minimumStock,
                unit: validated.unit,
                supplierId: validated.supplierId,
            },
            include: {
                category: true,
                supplier: true,
            },
        })

        // Transformar respuesta
        const response = {
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
        }

        return NextResponse.json(response)
    } catch (error) {
        console.error("Error updating product:", error)

        if (error instanceof Error && error.name === "ZodError") {
            return NextResponse.json(
                { error: "Datos inválidos", details: error },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: "Error al actualizar producto" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id)

        // Verificar que el producto existe
        const existingProduct = await prisma.product.findUnique({
            where: { id },
            include: {
                saleItems: true,
                purchaseItems: true,
                quotationItems: true,
            },
        })

        if (!existingProduct) {
            return NextResponse.json(
                { error: "Producto no encontrado" },
                { status: 404 }
            )
        }

        // Verificar si el producto tiene ventas, compras o cotizaciones
        if (
            existingProduct.saleItems.length > 0 ||
            existingProduct.purchaseItems.length > 0 ||
            existingProduct.quotationItems.length > 0
        ) {
            return NextResponse.json(
                {
                    error:
                        "No se puede eliminar el producto porque tiene ventas, compras o cotizaciones asociadas",
                },
                { status: 400 }
            )
        }

        // Eliminar producto
        await prisma.product.delete({
            where: { id },
        })

        return NextResponse.json({ success: true, message: "Producto eliminado" })
    } catch (error) {
        console.error("Error deleting product:", error)
        return NextResponse.json(
            { error: "Error al eliminar producto" },
            { status: 500 }
        )
    }
}
