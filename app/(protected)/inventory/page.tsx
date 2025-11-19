"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ProductsTable } from "@/components/inventory/products-table"
import { ProductFormDialog } from "@/components/inventory/product-form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import type { Product } from "@/lib/types"

export default function InventoryPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  function handleEdit(product: Product) {
    setSelectedProduct(product)
    setFormOpen(true)
  }

  function handleDelete(product: Product) {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  function handleNewProduct() {
    setSelectedProduct(null)
    setFormOpen(true)
  }

  async function confirmDelete() {
    if (!productToDelete) return

    try {
      const response = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al eliminar producto")
      }

      toast.success("Producto eliminado correctamente")
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar producto")
    } finally {
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  function handleFormSuccess() {
    toast.success(selectedProduct ? "Producto actualizado correctamente" : "Producto creado correctamente")
    setRefreshKey((prev) => prev + 1)
    setSelectedProduct(null)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Inventario"
          description="Gestiona los productos y el stock de tu inventario"
        />
        <Button onClick={handleNewProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <ProductsTable
        key={refreshKey}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={selectedProduct}
        onSuccess={handleFormSuccess}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará el producto{" "}
              <strong>{productToDelete?.name}</strong> del inventario.
              {productToDelete && (
                <div className="mt-2 text-sm">
                  Código: <span className="font-mono">{productToDelete.code}</span>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
