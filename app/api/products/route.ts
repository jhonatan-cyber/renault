import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        supplier: true,
      },
      orderBy: { createdAt: "desc" },
    })

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

    return NextResponse.json(transformed)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, name, categoryId, purchasePrice, salePrice, stock, minimumStock, unit, supplierId } = body

    if (!code || !name || !categoryId || !supplierId) {
      return NextResponse.json(
        { error: "Code, name, categoryId, and supplierId are required" },
        { status: 400 },
      )
    }

    const product = await prisma.product.create({
      data: {
        code,
        name,
        categoryId: parseInt(categoryId),
        purchasePrice: parseFloat(purchasePrice),
        salePrice: parseFloat(salePrice),
        stock: parseInt(stock) || 0,
        minimumStock: parseInt(minimumStock) || 0,
        unit: unit || "unidad",
        supplierId: parseInt(supplierId),
      },
      include: {
        category: true,
        supplier: true,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
