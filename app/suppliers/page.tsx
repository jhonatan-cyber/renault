"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import type { Supplier } from "@/lib/data-loader"

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/suppliers")
        setSuppliers(await res.json())
      } catch (error) {
        console.error("Error loading suppliers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const columns = [
    { key: "name", label: "Nombre" },
    { key: "company", label: "Empresa" },
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
    return <div className="text-muted-foreground">Cargando proveedores...</div>
  }

  return (
    <div>
      <PageHeader title="Gestión de Proveedores" description="Administra la información de tus proveedores" />

      <DataTable columns={columns} data={suppliers} searchFields={["name", "company", "email"]} />
    </div>
  )
}
