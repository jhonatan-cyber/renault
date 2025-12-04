import { NextResponse } from "next/server"

// Roles del sistema (hardcoded por ahora)
const SYSTEM_ROLES = [
  {
    id: 1,
    name: "Administrador",
    description: "Acceso completo al sistema",
    permissions: [
      "dashboard",
      "clients",
      "suppliers",
      "inventory",
      "quotations",
      "purchases",
      "sales",
      "expenses",
      "reports",
      "cash",
      "categories",
      "users",
      "roles",
    ],
    isSystem: true,
    userCount: 0,
  },
  {
    id: 2,
    name: "Vendedor",
    description: "Gestión de ventas y clientes",
    permissions: ["dashboard", "clients", "inventory", "quotations", "sales", "reports"],
    isSystem: true,
    userCount: 0,
  },
  {
    id: 3,
    name: "Comprador",
    description: "Gestión de compras y proveedores",
    permissions: ["dashboard", "suppliers", "inventory", "purchases", "reports"],
    isSystem: true,
    userCount: 0,
  },
  {
    id: 4,
    name: "Supervisor",
    description: "Supervisión de operaciones",
    permissions: [
      "dashboard",
      "clients",
      "suppliers",
      "inventory",
      "quotations",
      "purchases",
      "sales",
      "expenses",
      "reports",
      "cash",
    ],
    isSystem: true,
    userCount: 0,
  },
  {
    id: 5,
    name: "Invitado",
    description: "Solo lectura de reportes",
    permissions: ["dashboard", "reports"],
    isSystem: true,
    userCount: 0,
  },
]

export async function GET() {
  try {
    // TODO: Cuando se implemente Prisma, obtener roles de la base de datos
    // const roles = await prisma.role.findMany({
    //   include: {
    //     _count: {
    //       select: { users: true }
    //     }
    //   }
    // })

    return NextResponse.json(SYSTEM_ROLES)
  } catch (error) {
    console.error("Error fetching roles:", error)
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, permissions } = body

    if (!name || !permissions || permissions.length === 0) {
      return NextResponse.json(
        { error: "Nombre y permisos son requeridos" },
        { status: 400 }
      )
    }

    // TODO: Cuando se implemente Prisma, crear rol en la base de datos
    // const role = await prisma.role.create({
    //   data: {
    //     name,
    //     description,
    //     permissions,
    //     isSystem: false,
    //   }
    // })

    const newRole = {
      id: Date.now(),
      name,
      description,
      permissions,
      isSystem: false,
      userCount: 0,
    }

    return NextResponse.json(newRole, { status: 201 })
  } catch (error) {
    console.error("Error creating role:", error)
    return NextResponse.json({ error: "Failed to create role" }, { status: 500 })
  }
}
