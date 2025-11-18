// Tipos compartidos para el sistema ERP

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "vendedor" | "compras" | "supervisor" | "invitado"
}

export interface Client {
  id: number
  name: string
  phone: string
  email: string | null
  nit: string | null
  address: string | null
  totalPurchases: number
  createdAt: string
}

export interface Supplier {
  id: number
  name: string
  company: string | null
  phone: string
  email: string | null
  address: string | null
  totalPurchases: number
  createdAt: string
}

export interface Category {
  id: number
  name: string
  color: string
  icon: string | null
  type: "product" | "expense"
}

export interface Product {
  id: number
  code: string
  name: string
  category: string
  categoryId: number
  purchasePrice: number
  salePrice: number
  stock: number
  minimumStock: number
  unit: string
  supplierId: number
  supplierName?: string
  createdAt: string
}

export interface SaleItem {
  productId: number
  productName?: string
  quantity: number
  price: number
  subtotal: number
}

export interface Sale {
  id: number
  date: string
  clientId: number
  clientName?: string
  sellerUserId: number
  sellerName?: string
  items: SaleItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: "efectivo" | "transferencia" | "crédito" | "qr"
  status: "completada" | "pendiente" | "cancelada"
  createdAt: string
}

export interface PurchaseItem {
  productId: number
  productName?: string
  quantity: number
  price: number
}

export interface Purchase {
  id: number
  date: string
  supplierId: number
  supplierName?: string
  buyerUserId: number
  buyerName?: string
  items: PurchaseItem[]
  subtotal: number
  tax: number
  total: number
  status: "pendiente" | "recibida" | "cancelada"
  createdAt: string
}

export interface QuotationItem {
  productId: number
  productName?: string
  quantity: number
  price: number
  subtotal: number
}

export interface Quotation {
  id: number
  date: string
  clientId: number
  clientName?: string
  sellerUserId: number
  sellerName?: string
  items: QuotationItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  validUntil: string
  status: "activa" | "vencida" | "convertida"
  convertedToSaleId: number | null
  createdAt: string
}

export interface Commission {
  id: number
  sellerId: number
  sellerName?: string
  saleId: number
  saleInfo?: {
    id: number
    date: string
    clientName: string
    total: number
  }
  amount: number
  percentage: number
  date: string
  status: "completada" | "pendiente"
}

export interface Expense {
  id: number
  date: string
  description: string
  amount: number
  category: string
  responsibleUserId: number
  responsibleName?: string
  notes: string | null
  createdAt: string
}

export interface CashRecord {
  id: number
  date: string
  openingBalance: number
  cashIncome: number
  cashExpenses: number
  closingBalance: number
  notes: string | null
  userId: number
  userName?: string
}

