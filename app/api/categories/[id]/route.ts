import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { CategorySchema } from "@/lib/validations"

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id)
        const body = await request.json()

        const validated = CategorySchema.parse(body)

        const existingCategory = await prisma.category.findUnique({
            where: { id },
        })

        if (!existingCategory) {
            return NextResponse.json(
                { error: "Categoría no encontrada" },
                { status: 404 }
            )
        }

        const category = await prisma.category.update({
            where: { id },
            data: {
                name: validated.name,
                color: validated.color,
                icon: validated.icon || null,
                type: validated.type,
            },
        })

        return NextResponse.json(category)
    } catch (error) {
        console.error("Error updating category:", error)

        if (error instanceof Error && error.name === "ZodError") {
            return NextResponse.json(
                { error: "Datos inválidos", details: error },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: "Error al actualizar categoría" },
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

        const existingCategory = await prisma.category.findUnique({
            where: { id },
            include: {
                products: true,
            },
        })

        if (!existingCategory) {
            return NextResponse.json(
                { error: "Categoría no encontrada" },
                { status: 404 }
            )
        }

        if (existingCategory.products.length > 0) {
            return NextResponse.json(
                {
                    error: "No se puede eliminar la categoría porque tiene productos asociados",
                },
                { status: 400 }
            )
        }

        await prisma.category.delete({
            where: { id },
        })

        return NextResponse.json({ success: true, message: "Categoría eliminada" })
    } catch (error) {
        console.error("Error deleting category:", error)
        return NextResponse.json(
            { error: "Error al eliminar categoría" },
            { status: 500 }
        )
    }
}
