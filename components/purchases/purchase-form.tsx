"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface PurchaseFormProps {
  purchase?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function PurchaseForm({ purchase, onSubmit, onCancel }: PurchaseFormProps) {
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  const [formData, setFormData] = useState({
    supplierId: purchase?.supplierId || "",
    productId: purchase?.productId || "",
    quantity: purchase?.quantity || "",
    unitCost: purchase?.unitCost || "",
    notes: purchase?.notes || "",
  })

  useEffect(() => {
    fetch("/api/suppliers")
      .then(res => res.json())
      .then(data => setSuppliers(data))
    
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      quantity: parseInt(formData.quantity),
      unitCost: parseFloat(formData.unitCost),
      totalCost: parseInt(formData.quantity) * parseFloat(formData.unitCost),
    })
  }

  const total = formData.quantity && formData.unitCost 
    ? (parseInt(formData.quantity) * parseFloat(formData.unitCost)).toFixed(2)
    : "0.00"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="supplierId">Proveedor *</Label>
        <Select value={formData.supplierId} onValueChange={(value) => setFormData({ ...formData, supplierId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar proveedor" />
          </SelectTrigger>
          <SelectContent>
            {suppliers.map((supplier: any) => (
              <SelectItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="productId">Producto *</Label>
        <Select value={formData.productId} onValueChange={(value) => setFormData({ ...formData, productId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar producto" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product: any) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Cantidad *</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unitCost">Costo Unitario *</Label>
          <Input
            id="unitCost"
            type="number"
            step="0.01"
            min="0"
            value={formData.unitCost}
            onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Total</Label>
        <div className="text-2xl font-bold">${total}</div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={2}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {purchase ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  )
}
