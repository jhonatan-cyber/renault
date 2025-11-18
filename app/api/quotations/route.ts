import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const quotations = await prisma.quotation.findMany({
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
    const transformed = quotations.map((quotation) => ({
      id: quotation.id,
      date: quotation.date.toISOString().split("T")[0],
      clientId: quotation.clientId,
      clientName: quotation.client.name,
      sellerUserId: quotation.sellerUserId,
      sellerName: quotation.seller.name,
      items: quotation.items.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      })),
      subtotal: quotation.subtotal,
      tax: quotation.tax,
      discount: quotation.discount,
      total: quotation.total,
      validUntil: quotation.validUntil.toISOString().split("T")[0],
      status: quotation.status,
      convertedToSaleId: quotation.convertedToSaleId,
      createdAt: quotation.createdAt.toISOString().split("T")[0],
    }))

    return NextResponse.json(transformed)
  } catch (error) {
    console.error("Error fetching quotations:", error)
    return NextResponse.json({ error: "Failed to fetch quotations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, clientId, sellerUserId, items, subtotal, tax, discount, total, validUntil, status } = body

    if (!date || !clientId || !sellerUserId || !items || !Array.isArray(items) || items.length === 0 || !validUntil) {
      return NextResponse.json({ error: "Invalid quotation data" }, { status: 400 })
    }

    const quotation = await prisma.quotation.create({
      data: {
        date: new Date(date),
        clientId: parseInt(clientId),
        sellerUserId: parseInt(sellerUserId),
        subtotal: parseFloat(subtotal),
        tax: parseFloat(tax) || 0,
        discount: parseFloat(discount) || 0,
        total: parseFloat(total),
        validUntil: new Date(validUntil),
        status: status || "activa",
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

    return NextResponse.json(quotation, { status: 201 })
  } catch (error) {
    console.error("Error creating quotation:", error)
    return NextResponse.json({ error: "Failed to create quotation" }, { status: 500 })
  }
}
