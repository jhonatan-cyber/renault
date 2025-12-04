import { NextResponse } from "next/server"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, module, description, category } = body

    if (!name || !module || !description || !category) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    // TODO: Cuando se implemente Prisma, actualizar permiso en la base de datos
    // const permission = await prisma.permission.update({
    //   where: { id: params.id },
    //   data: {
    //     name,
    //     module,
    //     description,
    //     category,
    //   }
    // })

    const updatedPermission = {
      id: params.id,
      name,
      module,
      description,
      category,
      isSystem: false,
      rolesCount: 0,
    }

    return NextResponse.json(updatedPermission)
  } catch (error) {
    console.error("Error updating permission:", error)
    return NextResponse.json({ error: "Failed to update permission" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Cuando se implemente Prisma, verificar y eliminar permiso
    // const permission = await prisma.permission.findUnique({
    //   where: { id: params.id },
    //   include: {
    //     _count: {
    //       select: { roles: true }
    //     }
    //   }
    // })

    // if (permission.isSystem) {
    //   return NextResponse.json(
    //     { error: "No se pueden eliminar permisos del sistema" },
    //     { status: 400 }
    //   )
    // }

    // if (permission._count.roles > 0) {
    //   return NextResponse.json(
    //     { error: "No se puede eliminar un permiso asignado a roles" },
    //     { status: 400 }
    //   )
    // }

    // await prisma.permission.delete({
    //   where: { id: params.id }
    // })

    return NextResponse.json({ message: "Permission deleted successfully" })
  } catch (error) {
    console.error("Error deleting permission:", error)
    return NextResponse.json({ error: "Failed to delete permission" }, { status: 500 })
  }
}
