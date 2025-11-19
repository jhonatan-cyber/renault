"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
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
import { CategorySchema, type CategoryInput } from "@/lib/validations"
import type { Category } from "@/lib/types"

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [formOpen, setFormOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<CategoryInput>({
        resolver: zodResolver(CategorySchema),
        defaultValues: {
            name: "",
            color: "#3B82F6",
            icon: "",
            type: "product",
        },
    })

    useEffect(() => {
        fetchCategories()
    }, [refreshKey])

    useEffect(() => {
        if (selectedCategory) {
            form.reset({
                name: selectedCategory.name,
                color: selectedCategory.color,
                icon: selectedCategory.icon || "",
                type: selectedCategory.type,
            })
        } else {
            form.reset({
                name: "",
                color: "#3B82F6",
                icon: "",
                type: "product",
            })
        }
    }, [selectedCategory, form])

    async function fetchCategories() {
        try {
            setIsLoading(true)
            const response = await fetch("/api/categories")
            const data = await response.json()
            setCategories(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error("Error fetching categories:", error)
            toast.error("Error al cargar categorías")
        } finally {
            setIsLoading(false)
        }
    }

    function handleEdit(category: Category) {
        setSelectedCategory(category)
        setFormOpen(true)
    }

    function handleDelete(category: Category) {
        setCategoryToDelete(category)
        setDeleteDialogOpen(true)
    }

    function handleNew() {
        setSelectedCategory(null)
        setFormOpen(true)
    }

    async function onSubmit(data: CategoryInput) {
        try {
            setIsSubmitting(true)

            const url = selectedCategory ? `/api/categories/${selectedCategory.id}` : "/api/categories"
            const method = selectedCategory ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || "Error al guardar categoría")
            }

            toast.success(selectedCategory ? "Categoría actualizada correctamente" : "Categoría creada correctamente")
            setRefreshKey((prev) => prev + 1)
            setFormOpen(false)
            setSelectedCategory(null)
            form.reset()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error al guardar categoría")
        } finally {
            setIsSubmitting(false)
        }
    }

    async function confirmDelete() {
        if (!categoryToDelete) return

        try {
            const response = await fetch(`/api/categories/${categoryToDelete.id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || "Error al eliminar categoría")
            }

            toast.success("Categoría eliminada correctamente")
            setRefreshKey((prev) => prev + 1)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error al eliminar categoría")
        } finally {
            setDeleteDialogOpen(false)
            setCategoryToDelete(null)
        }
    }

    const productCategories = categories.filter((c) => c.type === "product")
    const expenseCategories = categories.filter((c) => c.type === "expense")

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Categorías"
                    description="Gestiona las categorías de productos y gastos"
                />
                <Button onClick={handleNew}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Categoría
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Product Categories */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Categorías de Productos</h3>
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Color</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-8">
                                            Cargando...
                                        </TableCell>
                                    </TableRow>
                                ) : productCategories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                            No hay categorías de productos
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    productCategories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">{category.name}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-6 h-6 rounded"
                                                        style={{ backgroundColor: category.color }}
                                                    />
                                                    <span className="text-sm font-mono">{category.color}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" variant="ghost" onClick={() => handleEdit(category)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost" onClick={() => handleDelete(category)}>
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
                </div>

                {/* Expense Categories */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Categorías de Gastos</h3>
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Color</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-8">
                                            Cargando...
                                        </TableCell>
                                    </TableRow>
                                ) : expenseCategories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                            No hay categorías de gastos
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    expenseCategories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">{category.name}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-6 h-6 rounded"
                                                        style={{ backgroundColor: category.color }}
                                                    />
                                                    <span className="text-sm font-mono">{category.color}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" variant="ghost" onClick={() => handleEdit(category)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost" onClick={() => handleDelete(category)}>
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
                </div>
            </div>

            {/* Form Dialog */}
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedCategory ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
                        <DialogDescription>
                            {selectedCategory
                                ? "Modifica la información de la categoría"
                                : "Completa el formulario para agregar una nueva categoría"}
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nombre de la categoría" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Color *</FormLabel>
                                        <div className="flex gap-2">
                                            <FormControl>
                                                <Input type="color" {...field} className="w-20 h-10" />
                                            </FormControl>
                                            <Input
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="#3B82F6"
                                                className="font-mono"
                                            />
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="product">Producto</SelectItem>
                                                <SelectItem value="expense">Gasto</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                                    {isSubmitting ? "Guardando..." : selectedCategory ? "Actualizar" : "Crear"}
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
                            Esta acción no se puede deshacer. Se eliminará la categoría{" "}
                            <strong>{categoryToDelete?.name}</strong>.
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
