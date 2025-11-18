import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const commissions = await prisma.commission.findMany({
      include: {
        seller: true,
        sale: {
          include: {
            client: true,
          },
        },
      },
      orderBy: { date: "desc" },
    })

    // Transformar para mantener compatibilidad
    const transformed = commissions.map((commission) => ({
      id: commission.id,
      sellerId: commission.sellerId,
      sellerName: commission.seller.name,
      saleId: commission.saleId,
      saleInfo: {
        id: commission.sale.id,
        date: commission.sale.date.toISOString().split("T")[0],
        clientName: commission.sale.client.name,
        total: commission.sale.total,
      },
      amount: commission.amount,
      percentage: commission.percentage,
      date: commission.date.toISOString().split("T")[0],
      status: commission.status,
    }))

    return NextResponse.json(transformed)
  } catch (error) {
    console.error("Error fetching commissions:", error)
    return NextResponse.json({ error: "Failed to fetch commissions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sellerId, saleId, amount, percentage, date, status } = body

    if (!sellerId || !saleId || !amount || !percentage || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const commission = await prisma.commission.create({
      data: {
        sellerId: parseInt(sellerId),
        saleId: parseInt(saleId),
        amount: parseFloat(amount),
        percentage: parseFloat(percentage),
        date: new Date(date),
        status: status || "pendiente",
      },
      include: {
        seller: true,
        sale: true,
      },
    })

    return NextResponse.json(commission, { status: 201 })
  } catch (error) {
    console.error("Error creating commission:", error)
    return NextResponse.json({ error: "Failed to create commission" }, { status: 500 })
  }
}
