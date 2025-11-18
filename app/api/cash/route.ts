import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const cashRecords = await prisma.cashRecord.findMany({
      include: {
        user: true,
      },
      orderBy: { date: "desc" },
    })

    // Transformar para mantener compatibilidad
    const transformed = cashRecords.map((record) => ({
      id: record.id,
      date: record.date.toISOString().split("T")[0],
      openingBalance: record.openingBalance,
      cashIncome: record.cashIncome,
      cashExpenses: record.cashExpenses,
      closingBalance: record.closingBalance,
      notes: record.notes,
      userId: record.userId,
      userName: record.user.name,
    }))

    return NextResponse.json(transformed)
  } catch (error) {
    console.error("Error fetching cash records:", error)
    return NextResponse.json({ error: "Failed to fetch cash records" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, openingBalance, cashIncome, cashExpenses, closingBalance, notes, userId } = body

    if (!date || openingBalance === undefined || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const cashRecord = await prisma.cashRecord.create({
      data: {
        date: new Date(date),
        openingBalance: parseFloat(openingBalance),
        cashIncome: parseFloat(cashIncome) || 0,
        cashExpenses: parseFloat(cashExpenses) || 0,
        closingBalance: parseFloat(closingBalance) || parseFloat(openingBalance),
        notes: notes || null,
        userId: parseInt(userId),
      },
      include: {
        user: true,
      },
    })

    return NextResponse.json(cashRecord, { status: 201 })
  } catch (error) {
    console.error("Error creating cash record:", error)
    return NextResponse.json({ error: "Failed to create cash record" }, { status: 500 })
  }
}
