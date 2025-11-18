"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import type { Client } from "@/lib/data-loader"

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/clients")
        setClients(await res.json())
      } catch (error) {
        console.error("Error loading clients:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const columns = [
    { key: "name", label: "Nombre" },
    { key: "nit", label: "NIT" },
    { key: "email", label: "Correo" },
    { key: "phone", label: "Teléfono" },
    { key: "address", label: "Dirección" },
    {
      key: "totalPurchases",
      label: "Compras Totales",
      render: (value: number) => `$${value.toFixed(0)}`,
    },
  ]

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando clientes...</div>
  }

  return (
    <div>
      <PageHeader title="Gestión de Clientes" description="Administra la información de tus clientes" />

      <DataTable columns={columns} data={clients} searchFields={["name", "email", "nit"]} />
    </div>
  )
}
