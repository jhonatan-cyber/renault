import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { ClientSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { nit: { contains: search, mode: "insensitive" } },
      ]
    }

    const clients = await prisma.client.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    // Transformar para mantener compatibilidad
    const transformed = clients.map((client) => ({
      id: client.id,
      name: client.name,
      phone: client.phone,
      email: client.email,
      nit: client.nit,
      address: client.address,
      totalPurchases: client.totalPurchases,
      createdAt: client.createdAt.toISOString(),
    }))

    return NextResponse.json(transformed)
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar con Zod
    const validated = ClientSchema.parse(body)

    const client = await prisma.client.create({
      data: {
        name: validated.name,
        phone: validated.phone,
        email: validated.email || null,
        nit: validated.nit || null,
        address: validated.address || null,
        totalPurchases: 0,
      },
    })

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    console.error("Error creating client:", error)

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: "Failed to create client" }, { status: 500 })
  }
}
