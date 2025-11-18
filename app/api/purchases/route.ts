import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const purchases = await prisma.purchase.findMany({
      include: {
        supplier: true,
        buyer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // Transformar para mantener compatibilidad
    const transformed = purchases.map((purchase) => ({
      id: purchase.id,
      date: purchase.date.toISOString().split("T")[0],
      supplierId: purchase.supplierId,
      supplierName: purchase.supplier.name,
      buyerUserId: purchase.buyerUserId,
      buyerName: purchase.buyer.name,
      items: purchase.items.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: purchase.subtotal,
      tax: purchase.tax,
      total: purchase.total,
      status: purchase.status,
      createdAt: purchase.createdAt.toISOString().split("T")[0],
    }))

    return NextResponse.json(transformed)
  } catch (error) {
    console.error("Error fetching purchases:", error)
    return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, supplierId, buyerUserId, items, subtotal, tax, total, status } = body

    if (!date || !supplierId || !buyerUserId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid purchase data" }, { status: 400 })
    }

    const purchase = await prisma.purchase.create({
      data: {
        date: new Date(date),
        supplierId: parseInt(supplierId),
        buyerUserId: parseInt(buyerUserId),
        subtotal: parseFloat(subtotal),
        tax: parseFloat(tax) || 0,
        total: parseFloat(total),
        status: status || "pendiente",
        items: {
          create: items.map((item: any) => ({
            productId: parseInt(item.productId),
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price),
          })),
        },
      },
      include: {
        supplier: true,
        buyer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Actualizar stock de productos si la compra está recibida
    if (status === "recibida") {
      for (const item of items) {
        await prisma.product.update({
          where: { id: parseInt(item.productId) },
          data: {
            stock: {
              increment: parseInt(item.quantity),
            },
          },
        })
      }
    }

    return NextResponse.json(purchase, { status: 201 })
  } catch (error) {
    console.error("Error creating purchase:", error)
    return NextResponse.json({ error: "Failed to create purchase" }, { status: 500 })
  }
}
