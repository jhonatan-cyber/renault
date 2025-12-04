"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Shield, Lock, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PermissionForm } from "@/components/permissions/permission-form"
import { toast } from "sonner"

interface Permission {
  id: string
  name: string
  module: string
  description: string
  category: string
  isSystem: boolean
  rolesCount?: number
}

const PERMISSION_CATEGORIES = [
  { id: "all", label: "Todos", color: "default" },
  { id: "core", label: "Core", color: "blue" },
  { id: "sales", label: "Ventas", color: "green" },
  { id: "inventory", label: "Inventario", color: "purple" },
  { id: "finance", label: "Finanzas", color: "orange" },
  { id: "admin", label: "Administración", color: "red" },
]

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [formOpen, setFormOpen] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    fetchPermissions()
  }, [])

  useEffect(() => {
    filterPermissions()
  }, [permissions, search, selectedCategory])

  async function fetchPermissions() {
    try {
      setIsLoading(true)
      const response = await fetch("/api/permissions")
      const data = await response.json()
      setPermissions(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching permissions:", error)
      toast.error("Error al cargar permisos")
    } finally {
      setIsLoading(false)
    }
  }

  function filterPermissions() {
    let filtered = permissions

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.module.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    setFilteredPermissions(filtered)
  }

  function handleViewDetails(permission: Permission) {
    setSelectedPermission(permission)
    setDetailsOpen(true)
  }

  function handleNew() {
    setSelectedPermission(null)
    setFormOpen(true)
  }

  async function handleSubmit(data: any) {
    try {
      const url = selectedPermission
        ? `/api/permissions/${selectedPermission.id}`
        : "/api/permissions"
      const method = selectedPermission ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al guardar permiso")
      }

      toast.success(
        selectedPermission
          ? "Permiso actualizado correctamente"
          : "Permiso creado correctamente"
      )
      fetchPermissions()
      setFormOpen(false)
      setSelectedPermission(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar permiso")
    }
  }

  const categoryStats = PERMISSION_CATEGORIES.map((cat) => ({
    ...cat,
    count:
      cat.id === "all"
        ? permissions.length
        : permissions.filter((p) => p.category === cat.id).length,
  }))

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Permisos del Sistema"
          description="Gestiona los permisos disponibles y su asignación a roles"
        />
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Permiso
        </Button>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Control de Permisos
          </CardTitle>
          <CardDescription>
            Los permisos definen acciones específicas que los usuarios pueden realizar en cada
            módulo. Los permisos del sistema no pueden ser eliminados.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categoryStats.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
            <Badge variant="secondary" className="ml-2">
              {cat.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar permisos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Permissions Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Permiso</TableHead>
              <TableHead>Módulo</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : filteredPermissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {search || selectedCategory !== "all"
                    ? "No se encontraron permisos"
                    : "No hay permisos registrados"}
                </TableCell>
              </TableRow>
            ) : (
              filteredPermissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      {permission.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{permission.module}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {permission.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {PERMISSION_CATEGORIES.find((c) => c.id === permission.category)?.label ||
                        permission.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{permission.rolesCount || 0} roles</span>
                  </TableCell>
                  <TableCell>
                    {permission.isSystem ? (
                      <Badge variant="secondary">Sistema</Badge>
                    ) : (
                      <Badge variant="outline">Personalizado</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewDetails(permission)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPermission ? "Editar Permiso" : "Nuevo Permiso"}
            </DialogTitle>
            <DialogDescription>
              {selectedPermission
                ? "Modifica la información del permiso"
                : "Crea un nuevo permiso personalizado"}
            </DialogDescription>
          </DialogHeader>

          <PermissionForm
            permission={selectedPermission}
            onSubmit={handleSubmit}
            onCancel={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Permiso</DialogTitle>
          </DialogHeader>

          {selectedPermission && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <p className="font-medium">{selectedPermission.name}</p>
              </div>

              <div className="space-y-2">
                <Label>Módulo</Label>
                <Badge variant="outline">{selectedPermission.module}</Badge>
              </div>

              <div className="space-y-2">
                <Label>Descripción</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedPermission.description}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Categoría</Label>
                <Badge variant="secondary">
                  {PERMISSION_CATEGORIES.find((c) => c.id === selectedPermission.category)
                    ?.label || selectedPermission.category}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                {selectedPermission.isSystem ? (
                  <Badge variant="secondary">Sistema</Badge>
                ) : (
                  <Badge variant="outline">Personalizado</Badge>
                )}
              </div>

              <div className="space-y-2">
                <Label>Roles con este permiso</Label>
                <p className="text-sm">{selectedPermission.rolesCount || 0} roles</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-muted-foreground">{children}</p>
}
