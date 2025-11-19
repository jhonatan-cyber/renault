"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Pencil, Trash2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SupplierSchema, type SupplierInput } from "@/lib/validations"
import { formatCurrency } from "@/lib/format-utils"
import type { Supplier } from "@/lib/types"

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [formOpen, setFormOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
    const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<SupplierInput>({
        resolver: zodResolver(SupplierSchema),
        defaultValues: {
            name: "",
            company: "",
            phone: "",
            email: "",
            address: "",
        },
    })

    useEffect(() => {
        fetchSuppliers()
    }, [search, refreshKey])

    useEffect(() => {
        if (selectedSupplier) {
            form.reset({
                name: selectedSupplier.name,
                company: selectedSupplier.company || "",
                phone: selectedSupplier.phone,
                email: selectedSupplier.email || "",
                address: selectedSupplier.address || "",
            })
        } else {
            form.reset({
                name: "",
                company: "",
                phone: "",
                email: "",
                address: "",
            })
        }
    }, [selectedSupplier, form])

    async function fetchSuppliers() {
        try {
            setIsLoading(true)
            const params = new URLSearchParams()
            if (search) params.append("search", search)

            const response = await fetch(`/api/suppliers?${params}`)
            const data = await response.json()
            setSuppliers(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error("Error fetching suppliers:", error)
            toast.error("Error al cargar proveedores")
        } finally {
            setIsLoading(false)
        }
    }

    function handleEdit(supplier: Supplier) {
        setSelectedSupplier(supplier)
        setFormOpen(true)
    }

    function handleDelete(supplier: Supplier) {
        setSupplierToDelete(supplier)
        setDeleteDialogOpen(true)
    }

    function handleNew() {
        setSelectedSupplier(null)
        setFormOpen(true)
    }

    async function onSubmit(data: SupplierInput) {
        try {
            setIsSubmitting(true)

            const url = selectedSupplier ? `/api/suppliers/${selectedSupplier.id}` : "/api/suppliers"
            const method = selectedSupplier ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || "Error al guardar proveedor")
            }

            toast.success(selectedSupplier ? "Proveedor actualizado correctamente" : "Proveedor creado correctamente")
            setRefreshKey((prev) => prev + 1)
            setFormOpen(false)
            setSelectedSupplier(null)
            form.reset()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error al guardar proveedor")
        } finally {
            setIsSubmitting(false)
        }
    }

    async function confirmDelete() {
        if (!supplierToDelete) return

        try {
            const response = await fetch(`/api/suppliers/${supplierToDelete.id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || "Error al eliminar proveedor")
            }

            toast.success("Proveedor eliminado correctamente")
            setRefreshKey((prev) => prev + 1)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error al eliminar proveedor")
        } finally {
            setDeleteDialogOpen(false)
            setSupplierToDelete(null)
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Proveedores"
                    description="Gestiona la información de tus proveedores"
                />
                <Button onClick={handleNew}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Proveedor
                </Button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Buscar por nombre, empresa, teléfono o email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Empresa</TableHead>
                            <TableHead>Teléfono</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Dirección</TableHead>
                            <TableHead className="text-right">Total Compras</TableHead>
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
                        ) : suppliers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    {search ? "No se encontraron proveedores" : "No hay proveedores registrados"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            suppliers.map((supplier) => (
                                <TableRow key={supplier.id}>
                                    <TableCell className="font-medium">{supplier.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{supplier.company || "-"}</TableCell>
                                    <TableCell>{supplier.phone}</TableCell>
                                    <TableCell className="text-muted-foreground">{supplier.email || "-"}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {supplier.address || "-"}
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                        {formatCurrency(supplier.totalPurchases)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="ghost" onClick={() => handleEdit(supplier)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" onClick={() => handleDelete(supplier)}>
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
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{selectedSupplier ? "Editar Proveedor" : "Nuevo Proveedor"}</DialogTitle>
                        <DialogDescription>
                            {selectedSupplier
                                ? "Modifica la información del proveedor"
                                : "Completa el formulario para agregar un nuevo proveedor"}
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nombre del proveedor" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="company"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Empresa</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nombre de la empresa" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Teléfono *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+57 300 123 4567" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="proveedor@ejemplo.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Dirección</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Cra 10 # 20-30" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setFormOpen(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Guardando..." : selectedSupplier ? "Actualizar" : "Crear"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará el proveedor{" "}
                            <strong>{supplierToDelete?.name}</strong>.
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
