import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        client: true,
        seller: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // Transformar para mantener compatibilidad
    const transformed = sales.map((sale) => ({
      id: sale.id,
      date: sale.date.toISOString().split("T")[0],
      clientId: sale.clientId,
      clientName: sale.client.name,
      sellerUserId: sale.sellerUserId,
      sellerName: sale.seller.name,
      items: sale.items.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      })),
      subtotal: sale.subtotal,
      tax: sale.tax,
      discount: sale.discount,
      total: sale.total,
      paymentMethod: sale.paymentMethod,
      status: sale.status,
      createdAt: sale.createdAt.toISOString().split("T")[0],
    }))

    return NextResponse.json(transformed)
  } catch (error) {
    console.error("Error fetching sales:", error)
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, clientId, sellerUserId, items, subtotal, tax, discount, total, paymentMethod, status } = body

    if (!date || !clientId || !sellerUserId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid sale data" }, { status: 400 })
    }

    const sale = await prisma.sale.create({
      data: {
        date: new Date(date),
        clientId: parseInt(clientId),
        sellerUserId: parseInt(sellerUserId),
        subtotal: parseFloat(subtotal),
        tax: parseFloat(tax) || 0,
        discount: parseFloat(discount) || 0,
        total: parseFloat(total),
        paymentMethod: paymentMethod || "efectivo",
        status: status || "completada",
        items: {
          create: items.map((item: any) => ({
            productId: parseInt(item.productId),
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price),
            subtotal: parseFloat(item.subtotal),
          })),
        },
      },
      include: {
        client: true,
        seller: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Actualizar stock de productos
    for (const item of items) {
      await prisma.product.update({
        where: { id: parseInt(item.productId) },
        data: {
          stock: {
            decrement: parseInt(item.quantity),
          },
        },
      })
    }

    return NextResponse.json(sale, { status: 201 })
  } catch (error) {
    console.error("Error creating sale:", error)
    return NextResponse.json({ error: "Failed to create sale" }, { status: 500 })
  }
}
