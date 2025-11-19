import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { SupplierSchema } from "@/lib/validations"

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id)
        const body = await request.json()

        // Validar datos
        const validated = SupplierSchema.parse(body)

        // Verificar que el proveedor existe
        const existingSupplier = await prisma.supplier.findUnique({
            where: { id },
        })

        if (!existingSupplier) {
            return NextResponse.json(
                { error: "Proveedor no encontrado" },
                { status: 404 }
            )
        }

        // Actualizar proveedor
        const supplier = await prisma.supplier.update({
            where: { id },
            data: {
                name: validated.name,
                company: validated.company || null,
                phone: validated.phone,
                email: validated.email || null,
                address: validated.address || null,
            },
        })

        return NextResponse.json(supplier)
    } catch (error) {
        console.error("Error updating supplier:", error)

        if (error instanceof Error && error.name === "ZodError") {
            return NextResponse.json(
                { error: "Datos inválidos", details: error },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: "Error al actualizar proveedor" },
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

        // Verificar que el proveedor existe
        const existingSupplier = await prisma.supplier.findUnique({
            where: { id },
            include: {
                products: true,
                purchases: true,
            },
        })

        if (!existingSupplier) {
            return NextResponse.json(
                { error: "Proveedor no encontrado" },
                { status: 404 }
            )
        }

        // Verificar si el proveedor tiene productos o compras
        if (existingSupplier.products.length > 0 || existingSupplier.purchases.length > 0) {
            return NextResponse.json(
                {
                    error:
                        "No se puede eliminar el proveedor porque tiene productos o compras asociadas",
                },
                { status: 400 }
            )
        }

        // Eliminar proveedor
        await prisma.supplier.delete({
            where: { id },
        })

        return NextResponse.json({ success: true, message: "Proveedor eliminado" })
    } catch (error) {
        console.error("Error deleting supplier:", error)
        return NextResponse.json(
            { error: "Error al eliminar proveedor" },
            { status: 500 }
        )
    }
}
