"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Card } from "@/components/ui/card"
import type { User } from "@/lib/data-loader"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/users")
        setUsers(await res.json())
      } catch (error) {
        console.error("Error loading users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const roleLabels: Record<string, string> = {
    admin: "Administrador",
    vendedor: "Vendedor",
    compras: "Compras",
    supervisor: "Supervisor",
    invitado: "Invitado",
  }

  const columns = [
    { key: "name", label: "Nombre" },
    { key: "email", label: "Correo" },
    {
      key: "role",
      label: "Rol",
      render: (value: string) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {roleLabels[value] || value}
        </span>
      ),
    },
    {
      key: "status",
      label: "Estado",
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "active"
              ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200"
          }`}
        >
          {value === "active" ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    { key: "createdAt", label: "Creado el" },
  ]

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando usuarios...</div>
  }

  return (
    <div>
      <PageHeader title="Gestión de Usuarios" description="Administra las cuentas y permisos del sistema" />

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(roleLabels).map(([role, label]) => {
          const count = users.filter((u) => u.role === role).length
          return (
            <Card key={role} className="p-4">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold mt-2">{count}</p>
            </Card>
          )
        })}
      </div>

      <DataTable columns={columns} data={users} searchFields={["name", "email"]} />
    </div>
  )
}
