"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PermissionFormProps {
  permission?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

const MODULES = [
  "dashboard",
  "clients",
  "suppliers",
  "inventory",
  "quotations",
  "purchases",
  "sales",
  "expenses",
  "reports",
  "cash",
  "categories",
  "users",
  "roles",
  "permissions",
]

const CATEGORIES = [
  { id: "core", label: "Core" },
  { id: "sales", label: "Ventas" },
  { id: "inventory", label: "Inventario" },
  { id: "finance", label: "Finanzas" },
  { id: "admin", label: "Administración" },
]

export function PermissionForm({ permission, onSubmit, onCancel }: PermissionFormProps) {
  const [formData, setFormData] = useState({
    id: permission?.id || "",
    name: permission?.name || "",
    module: permission?.module || "",
    description: permission?.description || "",
    category: permission?.category || "core",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="id">ID del Permiso *</Label>
        <Input
          id="id"
          value={formData.id}
          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
          placeholder="Ej: view_reports, create_sales"
          required
          disabled={!!permission}
        />
        <p className="text-xs text-muted-foreground">
          Identificador único en formato snake_case
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nombre *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Ver Reportes, Crear Ventas"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="module">Módulo *</Label>
        <Select
          value={formData.module}
          onValueChange={(value) => setFormData({ ...formData, module: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar módulo" />
          </SelectTrigger>
          <SelectContent>
            {MODULES.map((module) => (
              <SelectItem key={module} value={module}>
                {module.charAt(0).toUpperCase() + module.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoría *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe qué permite hacer este permiso"
          rows={3}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{permission ? "Actualizar" : "Crear"} Permiso</Button>
      </div>
    </form>
  )
}
