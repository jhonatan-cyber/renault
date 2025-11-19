import { z } from "zod"

// ============================================
// PRODUCTOS
// ============================================

export const ProductSchema = z.object({
    code: z.string().min(1, "El código es requerido"),
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    categoryId: z.number().int().positive("Debe seleccionar una categoría"),
    purchasePrice: z.number().positive("El precio de compra debe ser positivo"),
    salePrice: z.number().positive("El precio de venta debe ser positivo"),
    stock: z.number().int().min(0, "El stock no puede ser negativo").default(0),
    minimumStock: z.number().int().min(0, "El stock mínimo no puede ser negativo").default(0),
    unit: z.string().min(1, "La unidad es requerida").default("unidad"),
    supplierId: z.number().int().positive("Debe seleccionar un proveedor"),
})

export type ProductInput = z.infer<typeof ProductSchema>

// ============================================
// CLIENTES
// ============================================

export const ClientSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    phone: z.string().min(7, "El teléfono debe tener al menos 7 caracteres"),
    email: z.string().email("Email inválido").nullable().optional(),
    nit: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
})

export type ClientInput = z.infer<typeof ClientSchema>

// ============================================
// PROVEEDORES
// ============================================

export const SupplierSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    company: z.string().nullable().optional(),
    phone: z.string().min(7, "El teléfono debe tener al menos 7 caracteres"),
    email: z.string().email("Email inválido").nullable().optional(),
    address: z.string().nullable().optional(),
})

export type SupplierInput = z.infer<typeof SupplierSchema>

// ============================================
// USUARIOS
// ============================================

export const UserSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    role: z.enum(["admin", "vendedor", "compras", "supervisor", "invitado"]),
    status: z.enum(["active", "inactive"]).default("active"),
})

export type UserInput = z.infer<typeof UserSchema>

// ============================================
// CATEGORÍAS
// ============================================

export const CategorySchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, "Color hexadecimal inválido"),
    icon: z.string().nullable().optional(),
    type: z.enum(["product", "expense"]).default("product"),
})

export type CategoryInput = z.infer<typeof CategorySchema>

// ============================================
// VENTAS
// ============================================

export const SaleItemSchema = z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive("La cantidad debe ser positiva"),
    price: z.number().positive("El precio debe ser positivo"),
    subtotal: z.number(),
})

export const SaleSchema = z.object({
    date: z.string().or(z.date()),
    clientId: z.number().int().positive("Debe seleccionar un cliente"),
    sellerUserId: z.number().int().positive("Debe seleccionar un vendedor"),
    items: z.array(SaleItemSchema).min(1, "Debe agregar al menos un producto"),
    subtotal: z.number(),
    tax: z.number().min(0).default(0),
    discount: z.number().min(0).default(0),
    total: z.number().positive(),
    paymentMethod: z.enum(["efectivo", "transferencia", "crédito", "qr"]),
    status: z.enum(["completada", "pendiente", "cancelada"]).default("completada"),
})

export type SaleInput = z.infer<typeof SaleSchema>

// ============================================
// COMPRAS
// ============================================

export const PurchaseItemSchema = z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive("La cantidad debe ser positiva"),
    price: z.number().positive("El precio debe ser positivo"),
})

export const PurchaseSchema = z.object({
    date: z.string().or(z.date()),
    supplierId: z.number().int().positive("Debe seleccionar un proveedor"),
    buyerUserId: z.number().int().positive("Debe seleccionar un comprador"),
    items: z.array(PurchaseItemSchema).min(1, "Debe agregar al menos un producto"),
    subtotal: z.number(),
    tax: z.number().min(0).default(0),
    total: z.number().positive(),
    status: z.enum(["pendiente", "recibida", "cancelada"]).default("pendiente"),
})

export type PurchaseInput = z.infer<typeof PurchaseSchema>

// ============================================
// COTIZACIONES
// ============================================

export const QuotationItemSchema = z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive("La cantidad debe ser positiva"),
    price: z.number().positive("El precio debe ser positivo"),
    subtotal: z.number(),
})

export const QuotationSchema = z.object({
    date: z.string().or(z.date()),
    clientId: z.number().int().positive("Debe seleccionar un cliente"),
    sellerUserId: z.number().int().positive("Debe seleccionar un vendedor"),
    items: z.array(QuotationItemSchema).min(1, "Debe agregar al menos un producto"),
    subtotal: z.number(),
    tax: z.number().min(0).default(0),
    discount: z.number().min(0).default(0),
    total: z.number().positive(),
    validUntil: z.string().or(z.date()),
    status: z.enum(["activa", "vencida", "convertida"]).default("activa"),
})

export type QuotationInput = z.infer<typeof QuotationSchema>

// ============================================
// GASTOS
// ============================================

export const ExpenseSchema = z.object({
    date: z.string().or(z.date()),
    description: z.string().min(3, "La descripción debe tener al menos 3 caracteres"),
    amount: z.number().positive("El monto debe ser positivo"),
    category: z.string().min(2, "La categoría es requerida"),
    responsibleUserId: z.number().int().positive("Debe seleccionar un responsable"),
    notes: z.string().nullable().optional(),
})

export type ExpenseInput = z.infer<typeof ExpenseSchema>

// ============================================
// COMISIONES
// ============================================

export const CommissionSchema = z.object({
    sellerId: z.number().int().positive("Debe seleccionar un vendedor"),
    saleId: z.number().int().positive("Debe seleccionar una venta"),
    amount: z.number().positive("El monto debe ser positivo"),
    percentage: z.number().min(0).max(100, "El porcentaje debe estar entre 0 y 100"),
    date: z.string().or(z.date()),
    status: z.enum(["completada", "pendiente"]).default("pendiente"),
})

export type CommissionInput = z.infer<typeof CommissionSchema>

// ============================================
// CAJA DIARIA
// ============================================

export const CashRecordSchema = z.object({
    date: z.string().or(z.date()),
    openingBalance: z.number(),
    cashIncome: z.number().min(0).default(0),
    cashExpenses: z.number().min(0).default(0),
    closingBalance: z.number(),
    notes: z.string().nullable().optional(),
    userId: z.number().int().positive("Debe seleccionar un usuario"),
})

export type CashRecordInput = z.infer<typeof CashRecordSchema>
