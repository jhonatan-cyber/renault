import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      include: {
        responsible: true,
      },
      orderBy: { createdAt: "desc" },
    })

    // Transformar para mantener compatibilidad
    const transformed = expenses.map((expense) => ({
      id: expense.id,
      date: expense.date.toISOString().split("T")[0],
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      responsibleUserId: expense.responsibleUserId,
      responsibleName: expense.responsible.name,
      notes: expense.notes,
      createdAt: expense.createdAt.toISOString().split("T")[0],
    }))

    return NextResponse.json(transformed)
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, description, amount, category, responsibleUserId, notes } = body

    if (!date || !description || !amount || !category || !responsibleUserId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const expense = await prisma.expense.create({
      data: {
        date: new Date(date),
        description,
        amount: parseFloat(amount),
        category,
        responsibleUserId: parseInt(responsibleUserId),
        notes: notes || null,
      },
      include: {
        responsible: true,
      },
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    console.error("Error creating expense:", error)
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 })
  }
}
