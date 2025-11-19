"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search, Pencil, Trash2, AlertTriangle } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/format-utils"
import type { Product, Category, Supplier } from "@/lib/types"

interface ProductsTableProps {
    onEdit: (product: Product) => void
    onDelete: (product: Product) => void
}

export function ProductsTable({ onEdit, onDelete }: ProductsTableProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [supplierFilter, setSupplierFilter] = useState("all")
    const [lowStockFilter, setLowStockFilter] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        fetchProducts()
        fetchCategories()
        fetchSuppliers()
    }, [search, categoryFilter, supplierFilter, lowStockFilter, page])

    async function fetchProducts() {
        try {
            setIsLoading(true)
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "20",
            })

            if (search) params.append("search", search)
            if (categoryFilter && categoryFilter !== "all") params.append("categoryId", categoryFilter)
            if (supplierFilter && supplierFilter !== "all") params.append("supplierId", supplierFilter)
            if (lowStockFilter) params.append("lowStock", "true")

            const response = await fetch(`/api/products?${params}`)
            const data = await response.json()

            setProducts(data.data || [])
            setTotalPages(data.pagination?.totalPages || 1)
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            setIsLoading(false)
        }
    }

    async function fetchCategories() {
        try {
            const response = await fetch("/api/categories")
            const data = await response.json()
            setCategories(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error("Error fetching categories:", error)
        }
    }

    async function fetchSuppliers() {
        try {
            const response = await fetch("/api/suppliers")
            const data = await response.json()
            setSuppliers(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error("Error fetching suppliers:", error)
        }
    }

    const getStockStatus = (stock: number, minimumStock: number) => {
        const percentage = (stock / minimumStock) * 100
        if (percentage <= 0) return { label: "Sin stock", variant: "destructive" as const }
        if (percentage <= 50) return { label: "Crítico", variant: "destructive" as const }
        if (percentage <= 100) return { label: "Bajo", variant: "secondary" as const }
        return { label: "Normal", variant: "default" as const }
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre o código..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1)
                        }}
                        className="pl-10"
                    />
                </div>

                <Select
                    value={categoryFilter}
                    onValueChange={(value) => {
                        setCategoryFilter(value)
                        setPage(1)
                    }}
                >
                    <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas las categorías</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={supplierFilter}
                    onValueChange={(value) => {
                        setSupplierFilter(value)
                        setPage(1)
                    }}
                >
                    <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Todos los proveedores" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los proveedores</SelectItem>
                        {suppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id.toString()}>
                                {supplier.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button
                    variant={lowStockFilter ? "default" : "outline"}
                    onClick={() => {
                        setLowStockFilter(!lowStockFilter)
                        setPage(1)
                    }}
                >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Stock Bajo
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Código</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Proveedor</TableHead>
                            <TableHead className="text-right">Precio Compra</TableHead>
                            <TableHead className="text-right">Precio Venta</TableHead>
                            <TableHead className="text-right">Stock</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-8">
                                    Cargando...
                                </TableCell>
                            </TableRow>
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                                    No se encontraron productos
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => {
                                const status = getStockStatus(product.stock, product.minimumStock)
                                return (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-mono text-sm">{product.code}</TableCell>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{product.category}</Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {product.supplierName}
                                        </TableCell>
                                        <TableCell className="text-right">{formatCurrency(product.purchasePrice)}</TableCell>
                                        <TableCell className="text-right font-semibold">
                                            {formatCurrency(product.salePrice)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {product.stock} {product.unit}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={status.variant}>{status.label}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => onEdit(product)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => onDelete(product)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    >
                        Anterior
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Página {page} de {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                    >
                        Siguiente
                    </Button>
                </div>
            )}
        </div>
    )
}
