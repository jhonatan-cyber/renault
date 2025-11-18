import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (user.status !== "active") {
      return NextResponse.json({ error: "User account is inactive" }, { status: 403 })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({
      id: userWithoutPassword.id.toString(),
      email: userWithoutPassword.email,
      name: userWithoutPassword.name,
      role: userWithoutPassword.role,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
