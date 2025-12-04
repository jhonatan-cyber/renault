"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, Shield, Users } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { RoleForm } from "@/components/roles/role-form"
import { toast } from "sonner"

interface Role {
  id: number
  name: string
  description: string
  permissions: string[]
  userCount?: number
  isSystem?: boolean
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    fetchRoles()
  }, [refreshKey])

  async function fetchRoles() {
    try {
      setIsLoading(true)
      const response = await fetch("/api/roles")
      const data = await response.json()
      setRoles(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching roles:", error)
      toast.error("Error al cargar roles")
    } finally {
      setIsLoading(false)
    }
  }

  function handleEdit(role: Role) {
    if (role.isSystem) {
      toast.error("No se pueden editar roles del sistema")
      return
    }
    setSelectedRole(role)
    setFormOpen(true)
  }

  function handleDelete(role: Role) {
    if (role.isSystem) {
      toast.error("No se pueden eliminar roles del sistema")
      return
    }
    if (role.userCount && role.userCount > 0) {
      toast.error(`No se puede eliminar el rol porque tiene ${role.userCount} usuario(s) asignado(s)`)
      return
    }
    setRoleToDelete(role)
    setDeleteDialogOpen(true)
  }

  function handleNew() {
    setSelectedRole(null)
    setFormOpen(true)
  }

  async function handleSubmit(data: any) {
    try {
      const url = selectedRole ? `/api/roles/${selectedRole.id}` : "/api/roles"
      const method = selectedRole ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al guardar rol")
      }

      toast.success(selectedRole ? "Rol actualizado correctamente" : "Rol creado correctamente")
      setRefreshKey((prev) => prev + 1)
      setFormOpen(false)
      setSelectedRole(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar rol")
    }
  }

  async function confirmDelete() {
    if (!roleToDelete) return

    try {
      const response = await fetch(`/api/roles/${roleToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al eliminar rol")
      }

      toast.success("Rol eliminado correctamente")
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar rol")
    } finally {
      setDeleteDialogOpen(false)
      setRoleToDelete(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Roles y Permisos"
          description="Gestiona los roles del sistema y sus permisos de acceso"
        />
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Rol
        </Button>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Control de Acceso
          </CardTitle>
          <CardDescription>
            Los roles definen qué módulos y funcionalidades puede acceder cada usuario.
            Los roles del sistema (Admin, Vendedor, etc.) no pueden ser eliminados.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Roles Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rol</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Permisos</TableHead>
              <TableHead>Usuarios</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No hay roles registrados
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      {role.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {role.description || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {role.permissions.length} permisos
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-3 w-3" />
                      {role.userCount || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    {role.isSystem ? (
                      <Badge variant="secondary">Sistema</Badge>
                    ) : (
                      <Badge variant="outline">Personalizado</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(role)}
                        disabled={role.isSystem}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(role)}
                        disabled={role.isSystem || (role.userCount && role.userCount > 0)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRole ? "Editar Rol" : "Nuevo Rol"}</DialogTitle>
            <DialogDescription>
              {selectedRole
                ? "Modifica el nombre, descripción y permisos del rol"
                : "Crea un nuevo rol y asigna los permisos correspondientes"}
            </DialogDescription>
          </DialogHeader>

          <RoleForm
            role={selectedRole}
            onSubmit={handleSubmit}
            onCancel={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará el rol <strong>{roleToDelete?.name}</strong>.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
