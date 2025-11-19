import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { SupplierSchema } from "@/lib/validations"
import { ZodError } from "zod"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    }

    const suppliers = await prisma.supplier.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    const transformed = suppliers.map((supplier) => ({
      id: supplier.id,
      name: supplier.name,
      company: supplier.company,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      totalPurchases: supplier.totalPurchases,
      createdAt: supplier.createdAt.toISOString(),
    }))

    return NextResponse.json(transformed)
  } catch (error) {
    console.error("Error fetching suppliers:", error)
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar con Zod
    const validated = SupplierSchema.parse(body)

    const supplier = await prisma.supplier.create({
      data: {
        name: validated.name,
        company: validated.company || null,
        phone: validated.phone,
        email: validated.email || null,
        address: validated.address || null,
        totalPurchases: 0,
      },
    })

    return NextResponse.json(supplier, { status: 201 })
  } catch (error) {
    console.error("Error creating supplier:", error)
    return NextResponse.json({ error: "Failed to create supplier" }, { status: 500 })
  }
}
