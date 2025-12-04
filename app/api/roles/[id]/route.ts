import { NextResponse } from "next/server"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, permissions } = body

    if (!name || !permissions || permissions.length === 0) {
      return NextResponse.json(
        { error: "Nombre y permisos son requeridos" },
        { status: 400 }
      )
    }

    // TODO: Cuando se implemente Prisma, actualizar rol en la base de datos
    // const role = await prisma.role.update({
    //   where: { id: parseInt(params.id) },
    //   data: {
    //     name,
    //     description,
    //     permissions,
    //   }
    // })

    const updatedRole = {
      id: parseInt(params.id),
      name,
      description,
      permissions,
      isSystem: false,
      userCount: 0,
    }

    return NextResponse.json(updatedRole)
  } catch (error) {
    console.error("Error updating role:", error)
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const roleId = parseInt(params.id)

    // TODO: Cuando se implemente Prisma, verificar y eliminar rol
    // const role = await prisma.role.findUnique({
    //   where: { id: roleId },
    //   include: {
    //     _count: {
    //       select: { users: true }
    //     }
    //   }
    // })

    // if (role.isSystem) {
    //   return NextResponse.json(
    //     { error: "No se pueden eliminar roles del sistema" },
    //     { status: 400 }
    //   )
    // }

    // if (role._count.users > 0) {
    //   return NextResponse.json(
    //     { error: "No se puede eliminar un rol con usuarios asignados" },
    //     { status: 400 }
    //   )
    // }

    // await prisma.role.delete({
    //   where: { id: roleId }
    // })

    return NextResponse.json({ message: "Role deleted successfully" })
  } catch (error) {
    console.error("Error deleting role:", error)
    return NextResponse.json({ error: "Failed to delete role" }, { status: 500 })
  }
}
