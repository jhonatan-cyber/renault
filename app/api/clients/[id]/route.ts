import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { ClientSchema } from "@/lib/validations"

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id)
        const body = await request.json()

        // Validar datos
        const validated = ClientSchema.parse(body)

        // Verificar que el cliente existe
        const existingClient = await prisma.client.findUnique({
            where: { id },
        })

        if (!existingClient) {
            return NextResponse.json(
                { error: "Cliente no encontrado" },
                { status: 404 }
            )
        }

        // Actualizar cliente
        const client = await prisma.client.update({
            where: { id },
            data: {
                name: validated.name,
                phone: validated.phone,
                email: validated.email || null,
                nit: validated.nit || null,
                address: validated.address || null,
            },
        })

        return NextResponse.json(client)
    } catch (error) {
        console.error("Error updating client:", error)

        if (error instanceof Error && error.name === "ZodError") {
            return NextResponse.json(
                { error: "Datos inválidos", details: error },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: "Error al actualizar cliente" },
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

        // Verificar que el cliente existe
        const existingClient = await prisma.client.findUnique({
            where: { id },
            include: {
                sales: true,
                quotations: true,
            },
        })

        if (!existingClient) {
            return NextResponse.json(
                { error: "Cliente no encontrado" },
                { status: 404 }
            )
        }

        // Verificar si el cliente tiene ventas o cotizaciones
        if (existingClient.sales.length > 0 || existingClient.quotations.length > 0) {
            return NextResponse.json(
                {
                    error:
                        "No se puede eliminar el cliente porque tiene ventas o cotizaciones asociadas",
                },
                { status: 400 }
            )
        }

        // Eliminar cliente
        await prisma.client.delete({
            where: { id },
        })

        return NextResponse.json({ success: true, message: "Cliente eliminado" })
    } catch (error) {
        console.error("Error deleting client:", error)
        return NextResponse.json(
            { error: "Error al eliminar cliente" },
            { status: 500 }
        )
    }
}
