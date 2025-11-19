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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
import { ExpenseSchema, type ExpenseInput } from "@/lib/validations"
import { formatCurrency, formatDate } from "@/lib/format-utils"
import { useAuth } from "@/lib/auth-context"
import type { Expense, Category } from "@/lib/types"

export default function ExpensesPage() {
    const { user } = useAuth()
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [formOpen, setFormOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
    const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<ExpenseInput>({
        resolver: zodResolver(ExpenseSchema),
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
            description: "",
            amount: 0,
            category: "",
            responsibleUserId: user?.id ? parseInt(user.id) : 0,
            notes: "",
        },
    })

    useEffect(() => {
        fetchExpenses()
        fetchCategories()
    }, [refreshKey])

    useEffect(() => {
        if (selectedExpense) {
            const date = new Date(selectedExpense.date)
            form.reset({
                date: date.toISOString().split("T")[0],
                description: selectedExpense.description,
                amount: selectedExpense.amount,
                category: selectedExpense.category,
                responsibleUserId: selectedExpense.responsibleUserId,
                notes: selectedExpense.notes || "",
            })
        } else if (user) {
            form.reset({
                date: new Date().toISOString().split("T")[0],
                description: "",
                amount: 0,
                category: "",
                responsibleUserId: parseInt(user.id),
                notes: "",
            })
        }
    }, [selectedExpense, user, form])

    async function fetchExpenses() {
        try {
            setIsLoading(true)
            const response = await fetch("/api/expenses")
            const data = await response.json()
            setExpenses(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error("Error fetching expenses:", error)
            toast.error("Error al cargar gastos")
        } finally {
            setIsLoading(false)
        }
    }

    async function fetchCategories() {
        try {
            const response = await fetch("/api/categories")
            const data = await response.json()
            const expenseCategories = Array.isArray(data) ? data.filter((c: Category) => c.type === "expense") : []
            setCategories(expenseCategories)
        } catch (error) {
            console.error("Error fetching categories:", error)
        }
    }

    function handleEdit(expense: Expense) {
        setSelectedExpense(expense)
        setFormOpen(true)
    }

    function handleDelete(expense: Expense) {
        setExpenseToDelete(expense)
        setDeleteDialogOpen(true)
    }

    function handleNew() {
        setSelectedExpense(null)
        setFormOpen(true)
    }

    async function onSubmit(data: ExpenseInput) {
        try {
            setIsSubmitting(true)

            const url = selectedExpense ? `/api/expenses/${selectedExpense.id}` : "/api/expenses"
            const method = selectedExpense ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || "Error al guardar gasto")
            }

            toast.success(selectedExpense ? "Gasto actualizado correctamente" : "Gasto registrado correctamente")
            setRefreshKey((prev) => prev + 1)
            setFormOpen(false)
            setSelectedExpense(null)
            form.reset()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error al guardar gasto")
        } finally {
            setIsSubmitting(false)
        }
    }

    async function confirmDelete() {
        if (!expenseToDelete) return

        try {
            const response = await fetch(`/api/expenses/${expenseToDelete.id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || "Error al eliminar gasto")
            }

            toast.success("Gasto eliminado correctamente")
            setRefreshKey((prev) => prev + 1)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error al eliminar gasto")
        } finally {
            setDeleteDialogOpen(false)
            setExpenseToDelete(null)
        }
    }

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Gastos"
                    description="Gestiona y registra los gastos de la empresa"
                />
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total Gastos</p>
                        <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
                    </div>
                    <Button onClick={handleNew}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Gasto
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Responsable</TableHead>
                            <TableHead className="text-right">Monto</TableHead>
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
                        ) : expenses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No hay gastos registrados
                                </TableCell>
                            </TableRow>
                        ) : (
                            expenses.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell className="font-mono text-sm">{formatDate(expense.date)}</TableCell>
                                    <TableCell className="font-medium max-w-xs truncate">{expense.description}</TableCell>
                                    <TableCell>{expense.category}</TableCell>
                                    <TableCell className="text-muted-foreground">{expense.responsibleName}</TableCell>
                                    <TableCell className="text-right font-semibold">{formatCurrency(expense.amount)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="ghost" onClick={() => handleEdit(expense)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" onClick={() => handleDelete(expense)}>
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
                        <DialogTitle>{selectedExpense ? "Editar Gasto" : "Nuevo Gasto"}</DialogTitle>
                        <DialogDescription>
                            {selectedExpense ? "Modifica la información del gasto" : "Registra un nuevo gasto de la empresa"}
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fecha *</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Monto *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Categoría *</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccionar categoría" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id} value={category.name}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Descripción *</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Descripción del gasto" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Notas Adicionales</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Notas opcionales" {...field} />
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
                                    {isSubmitting ? "Guardando..." : selectedExpense ? "Actualizar" : "Registrar"}
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
                            Se eliminará el gasto: <strong>{expenseToDelete?.description}</strong> por{" "}
                            <strong>{expenseToDelete && formatCurrency(expenseToDelete.amount)}</strong>.
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
