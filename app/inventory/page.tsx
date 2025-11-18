"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Card } from "@/components/ui/card"
import { AlertTriangle, Package, TrendingDown } from "lucide-react"
import type { Product } from "@/lib/data-loader"

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/products")
        setProducts(await res.json())
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const totalProducts = products.length
  const totalValue = products.reduce((sum, p) => sum + p.stock * p.salePrice, 0)
  const lowStockCount = products.filter((p) => p.stock <= p.minimumStock).length
  const outOfStock = products.filter((p) => p.stock === 0).length

  const columns = [
    { key: "code", label: "Código" },
    { key: "name", label: "Nombre" },
    { key: "category", label: "Categoría" },
    {
      key: "purchasePrice",
      label: "Precio Compra",
      render: (value: number) => `$${value.toFixed(0)}`,
    },
    {
      key: "salePrice",
      label: "Precio Venta",
      render: (value: number) => `$${value.toFixed(0)}`,
    },
    {
      key: "stock",
      label: "Stock Actual",
      render: (value: number, row: Product) => (
        <div className="flex items-center gap-2">
          <span
            className={
              value === 0
                ? "text-red-600 font-semibold"
                : value <= row.minimumStock
                  ? "text-orange-600 font-semibold"
                  : ""
            }
          >
            {value}
          </span>
          {value === 0 && <AlertTriangle size={14} className="text-red-600" />}
          {value > 0 && value <= row.minimumStock && <TrendingDown size={14} className="text-orange-600" />}
        </div>
      ),
    },
    { key: "minimumStock", label: "Stock Mínimo" },
    { key: "unit", label: "Unidad" },
    {
      key: "stock",
      label: "Valor Total",
      render: (value: number, row: Product) => `$${(value * row.salePrice).toFixed(0)}`,
    },
  ]

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando inventario...</div>
  }

  return (
    <div>
      <PageHeader title="Inventario" description="Gestiona el stock de productos" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de Productos</p>
              <p className="text-2xl font-bold mt-2">{totalProducts}</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <Package size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Valor Total Inventario</p>
              <p className="text-2xl font-bold mt-2">${totalValue.toFixed(0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-chart-2/10 text-chart-2">
              <Package size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Stock Bajo</p>
              <p className="text-2xl font-bold mt-2 text-orange-600">{lowStockCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Productos</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
              <TrendingDown size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Agotados</p>
              <p className="text-2xl font-bold mt-2 text-red-600">{outOfStock}</p>
              <p className="text-xs text-muted-foreground mt-1">Productos</p>
            </div>
            <div className="p-3 rounded-lg bg-red-100 text-red-600">
              <AlertTriangle size={24} />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Lista de Productos</h3>
        <DataTable columns={columns} data={products} searchFields={["name", "code", "category"]} />
      </Card>
    </div>
  )
}
