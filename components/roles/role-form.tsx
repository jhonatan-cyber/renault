"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

interface RoleFormProps {
  role?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

const AVAILABLE_PERMISSIONS = [
  { id: "dashboard", label: "Dashboard", description: "Ver panel principal" },
  { id: "clients", label: "Clientes", description: "Gestionar clientes" },
  { id: "suppliers", label: "Proveedores", description: "Gestionar proveedores" },
  { id: "inventory", label: "Inventario", description: "Gestionar productos" },
  { id: "quotations", label: "Cotizaciones", description: "Gestionar cotizaciones" },
  { id: "purchases", label: "Compras", description: "Gestionar compras" },
  { id: "sales", label: "Ventas", description: "Gestionar ventas" },
  { id: "expenses", label: "Gastos", description: "Gestionar gastos" },
  { id: "reports", label: "Reportes", description: "Ver reportes" },
  { id: "cash", label: "Caja Diaria", description: "Gestionar caja" },
  { id: "categories", label: "Categorías", description: "Gestionar categorías" },
  { id: "users", label: "Usuarios", description: "Gestionar usuarios" },
  { id: "roles", label: "Roles", description: "Gestionar roles y permisos" },
]

export function RoleForm({ role, onSubmit, onCancel }: RoleFormProps) {
  const [formData, setFormData] = useState({
    name: role?.name || "",
    description: role?.description || "",
    permissions: role?.permissions || [],
  })

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((p: string) => p !== permissionId)
        : [...prev.permissions, permissionId]
    }))
  }

  const handleSelectAll = () => {
    setFormData(prev => ({
      ...prev,
      permissions: AVAILABLE_PERMISSIONS.map(p => p.id)
    }))
  }

  const handleDeselectAll = () => {
    setFormData(prev => ({
      ...prev,
      permissions: []
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Rol *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Gerente, Cajero, Almacenista"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descripción del rol y sus responsabilidades"
            rows={2}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Permisos *</Label>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleSelectAll}>
                Seleccionar Todos
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={handleDeselectAll}>
                Deseleccionar Todos
              </Button>
            </div>
          </div>

          <div className="border rounded-lg p-4 space-y-3 max-h-96 overflow-y-auto">
            {AVAILABLE_PERMISSIONS.map((permission) => (
              <div key={permission.id} className="flex items-start space-x-3 p-2 hover:bg-muted/50 rounded">
                <Checkbox
                  id={permission.id}
                  checked={formData.permissions.includes(permission.id)}
                  onCheckedChange={() => handlePermissionToggle(permission.id)}
                />
                <div className="flex-1">
                  <label
                    htmlFor={permission.id}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {permission.label}
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {permission.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            {formData.permissions.length} de {AVAILABLE_PERMISSIONS.length} permisos seleccionados
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {role ? "Actualizar" : "Crear"} Rol
        </Button>
      </div>
    </form>
  )
}
