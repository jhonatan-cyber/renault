import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { ProductSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parámetros de paginación
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    // Parámetros de búsqueda y filtros
    const search = searchParams.get("search") || ""
    const categoryId = searchParams.get("categoryId")
    const supplierId = searchParams.get("supplierId")
    const lowStock = searchParams.get("lowStock") === "true"

    // Construir filtros
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
      ]
    }

    if (categoryId) {
      where.categoryId = parseInt(categoryId)
    }

    if (supplierId) {
      where.supplierId = parseInt(supplierId)
    }

    if (lowStock) {
      where.stock = {
        lte: prisma.product.fields.minimumStock,
      }
    }

    // Obtener productos
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          supplier: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    // Transformar para mantener compatibilidad con el formato anterior
    const transformed = products.map((product) => ({
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
      data: transformed,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar con Zod
    const validated = ProductSchema.parse(body)

    const product = await prisma.product.create({
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

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
