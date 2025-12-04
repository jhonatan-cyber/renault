import { NextResponse } from "next/server"

// Permisos del sistema
const SYSTEM_PERMISSIONS = [
  // Core
  { id: "dashboard", name: "Dashboard", module: "dashboard", description: "Ver panel principal", category: "core", isSystem: true, rolesCount: 5 },
  
  // Sales
  { id: "clients", name: "Clientes", module: "clients", description: "Gestionar clientes", category: "sales", isSystem: true, rolesCount: 4 },
  { id: "quotations", name: "Cotizaciones", module: "quotations", description: "Gestionar cotizaciones", category: "sales", isSystem: true, rolesCount: 3 },
  { id: "sales", name: "Ventas", module: "sales", description: "Gestionar ventas", category: "sales", isSystem: true, rolesCount: 3 },
  
  // Inventory
  { id: "inventory", name: "Inventario", module: "inventory", description: "Gestionar productos", category: "inventory", isSystem: true, rolesCount: 4 },
  { id: "suppliers", name: "Proveedores", module: "suppliers", description: "Gestionar proveedores", category: "inventory", isSystem: true, rolesCount: 3 },
  { id: "purchases", name: "Compras", module: "purchases", description: "Gestionar compras", category: "inventory", isSystem: true, rolesCount: 3 },
  { id: "categories", name: "Categorías", module: "categories", description: "Gestionar categorías", category: "inventory", isSystem: true, rolesCount: 2 },
  
  // Finance
  { id: "expenses", name: "Gastos", module: "expenses", description: "Gestionar gastos", category: "finance", isSystem: true, rolesCount: 2 },
  { id: "cash", name: "Caja Diaria", module: "cash", description: "Gestionar caja", category: "finance", isSystem: true, rolesCount: 2 },
  { id: "reports", name: "Reportes", module: "reports", description: "Ver reportes", category: "finance", isSystem: true, rolesCount: 5 },
  
  // Admin
  { id: "users", name: "Usuarios", module: "users", description: "Gestionar usuarios", category: "admin", isSystem: true, rolesCount: 1 },
  { id: "roles", name: "Roles", module: "roles", description: "Gestionar roles y permisos", category: "admin", isSystem: true, rolesCount: 1 },
  { id: "permissions", name: "Permisos", module: "permissions", description: "Gestionar permisos", category: "admin", isSystem: true, rolesCount: 1 },
]

export async function GET() {
  try {
    // TODO: Cuando se implemente Prisma, obtener permisos de la base de datos
    // const permissions = await prisma.permission.findMany({
    //   include: {
    //     _count: {
    //       select: { roles: true }
    //     }
    //   }
    // })

    return NextResponse.json(SYSTEM_PERMISSIONS)
  } catch (error) {
    console.error("Error fetching permissions:", error)
    return NextResponse.json({ error: "Failed to fetch permissions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, name, module, description, category } = body

    if (!id || !name || !module || !description || !category) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    // TODO: Cuando se implemente Prisma, crear permiso en la base de datos
    // const permission = await prisma.permission.create({
    //   data: {
    //     id,
    //     name,
    //     module,
    //     description,
    //     category,
    //     isSystem: false,
    //   }
    // })

    const newPermission = {
      id,
      name,
      module,
      description,
      category,
      isSystem: false,
      rolesCount: 0,
    }

    return NextResponse.json(newPermission, { status: 201 })
  } catch (error) {
    console.error("Error creating permission:", error)
    return NextResponse.json({ error: "Failed to create permission" }, { status: 500 })
  }
}
