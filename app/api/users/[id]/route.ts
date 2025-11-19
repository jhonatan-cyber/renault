import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { UserSchema } from "@/lib/validations"
import bcrypt from "bcryptjs"

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id)
        const body = await request.json()

        // Validar datos (excepto password que es opcional en update)
        const { password, ...userData } = body

        const existingUser = await prisma.user.findUnique({
            where: { id },
        })

        if (!existingUser) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            )
        }

        const updateData: any = {
            name: userData.name,
            email: userData.email,
            role: userData.role,
            status: userData.status,
        }

        // Solo actualizar password si se proporciona uno nuevo
        if (password && password.length >= 6) {
            updateData.password = await bcrypt.hash(password, 10)
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
            },
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error("Error updating user:", error)

        if (error instanceof Error && error.name === "ZodError") {
            return NextResponse.json(
                { error: "Datos inválidos", details: error },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: "Error al actualizar usuario" },
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

        const existingUser = await prisma.user.findUnique({
            where: { id },
            include: {
                salesAsSeller: true,
                purchasesAsBuyer: true,
                expenses: true,
            },
        })

        if (!existingUser) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            )
        }

        // No permitir eliminar usuarios con actividad
        if (
            existingUser.salesAsSeller.length > 0 ||
            existingUser.purchasesAsBuyer.length > 0 ||
            existingUser.expenses.length > 0
        ) {
            return NextResponse.json(
                {
                    error: "No se puede eliminar el usuario porque tiene ventas, compras o gastos asociados",
                },
                { status: 400 }
            )
        }

        await prisma.user.delete({
            where: { id },
        })

        return NextResponse.json({ success: true, message: "Usuario eliminado" })
    } catch (error) {
        console.error("Error deleting user:", error)
        return NextResponse.json(
            { error: "Error al eliminar usuario" },
            { status: 500 }
        )
    }
}
