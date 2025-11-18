"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Card } from "@/components/ui/card"
import type { Category } from "@/lib/data-loader"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/categories")
        const data = await res.json()
        // Filter only product categories
        setCategories(data.slice(0, 5))
      } catch (error) {
        console.error("Error loading categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const columns = [
    {
      key: "color",
      label: "Color",
      render: (value: string) => (
        <div className="w-6 h-6 rounded border border-border" style={{ backgroundColor: value }} title={value} />
      ),
    },
    { key: "name", label: "Nombre" },
  ]

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando categorías...</div>
  }

  return (
    <div>
      <PageHeader title="Categorías de Productos" description="Gestiona las categorías de productos y gastos" />

      <div className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <Card key={cat.id} className="p-4">
            <div className="w-12 h-12 rounded-lg mx-auto mb-3" style={{ backgroundColor: cat.color }} />
            <p className="text-sm font-medium text-center">{cat.name}</p>
          </Card>
        ))}
      </div>

      <DataTable columns={columns} data={categories} />
    </div>
  )
}
