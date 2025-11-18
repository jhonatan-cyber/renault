// Data loading utilities to parse markdown data files
import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")

export interface User {
  id: number
  name: string
  email: string
  password: string
  role: "admin" | "vendedor" | "compras" | "supervisor" | "invitado"
  status: "active" | "inactive"
  createdAt: string
}

export interface Client {
  id: number
  name: string
  phone: string
  email: string
  nit: string
  address: string
  totalPurchases: number
  createdAt: string
}

export interface Supplier {
  id: number
  name: string
  company: string
  phone: string
  email: string
  address: string
  totalPurchases: number
  createdAt: string
}

export interface Category {
  id: number
  name: string
  color: string
  icon?: string
}

export interface Product {
  id: number
  code: string
  name: string
  category: string
  purchasePrice: number
  salePrice: number
  stock: number
  minimumStock: number
  unit: string
  supplierId: number
  createdAt: string
}

export interface SaleItem {
  productId: number
  quantity: number
  price: number
  subtotal: number
}

export interface Sale {
  id: number
  date: string
  clientId: number
  sellerUserId: number
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
  quantity: number
  price: number
}

export interface Purchase {
  id: number
  date: string
  supplierId: number
  buyerUserId: number
  items: PurchaseItem[]
  subtotal: number
  tax: number
  total: number
  status: "pendiente" | "recibida" | "cancelada"
  createdAt: string
}

export interface QuotationItem {
  productId: number
  quantity: number
  price: number
  subtotal: number
}

export interface Quotation {
  id: number
  date: string
  clientId: number
  sellerUserId: number
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
  saleId: number
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
  notes: string
  createdAt: string
}

export interface CashRecord {
  id: number
  date: string
  openingBalance: number
  cashIncome: number
  cashExpenses: number
  closingBalance: number
  notes: string
  userId: number
}

function parseMarkdownData(content: string): any[] {
  const lines = content.split("\n")
  const items: any[] = []
  let currentItem: any = {}
  let inList = false

  for (const line of lines) {
    if (line.startsWith("## ")) {
      inList = true
      continue
    }

    if (inList && line.startsWith("- ")) {
      if (Object.keys(currentItem).length > 0) {
        items.push(currentItem)
      }
      currentItem = {}
      const match = line.match(/- (\w+):\s*(.+)/)
      if (match) {
        const key = match[1]
        let value: any = match[2].trim()

        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        } else if (value === "true") {
          value = true
        } else if (value === "false") {
          value = false
        } else if (!isNaN(Number(value)) && value !== "") {
          value = Number(value)
        } else if (value.startsWith("[") || value.startsWith("{")) {
          try {
            value = JSON.parse(value)
          } catch {}
        }

        currentItem[key] = value
      }
    } else if (inList && line.startsWith("  ") && !line.startsWith("    ")) {
      const match = line.match(/^\s+(\w+):\s*(.+)/)
      if (match) {
        const key = match[1]
        let value: any = match[2].trim()

        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        } else if (value === "true") {
          value = true
        } else if (value === "false") {
          value = false
        } else if (!isNaN(Number(value)) && value !== "") {
          value = Number(value)
        } else if (value.startsWith("[") || value.startsWith("{")) {
          try {
            value = JSON.parse(value)
          } catch {}
        }

        currentItem[key] = value
      }
    }
  }

  if (Object.keys(currentItem).length > 0) {
    items.push(currentItem)
  }

  return items
}

export async function loadUsers(): Promise<User[]> {
  const content = fs.readFileSync(path.join(DATA_DIR, "users.md"), "utf-8")
  return parseMarkdownData(content)
}

export async function loadClients(): Promise<Client[]> {
  const content = fs.readFileSync(path.join(DATA_DIR, "clients.md"), "utf-8")
  return parseMarkdownData(content)
}

export async function loadSuppliers(): Promise<Supplier[]> {
  const content = fs.readFileSync(path.join(DATA_DIR, "suppliers.md"), "utf-8")
  return parseMarkdownData(content)
}

export async function loadCategories(): Promise<Category[]> {
  const content = fs.readFileSync(path.join(DATA_DIR, "categories.md"), "utf-8")
  const lines = content.split("\n")
  const categories: Category[] = []
  let inSection = false

  for (const line of lines) {
    if (line.startsWith("## Product Categories")) {
      inSection = true
      continue
    }
    if (line.startsWith("## Expense Categories")) {
      break
    }
    if (inSection && line.startsWith("- ")) {
      const match = line.match(/- (\w+):\s*(.+)/)
      if (match && match[1] === "id") {
        categories.push({ id: 0, name: "", color: "" })
      }
    }
  }

  return parseMarkdownData(content)
}

export async function loadProducts(): Promise<Product[]> {
  const content = fs.readFileSync(path.join(DATA_DIR, "inventory.md"), "utf-8")
  return parseMarkdownData(content)
}

export async function loadSales(): Promise<Sale[]> {
  const content = fs.readFileSync(path.join(DATA_DIR, "sales.md"), "utf-8")
  return parseMarkdownData(content)
}

export async function loadPurchases(): Promise<Purchase[]> {
  const content = fs.readFileSync(path.join(DATA_DIR, "purchases.md"), "utf-8")
  return parseMarkdownData(content)
}

export async function loadQuotations(): Promise<Quotation[]> {
  const content = fs.readFileSync(path.join(DATA_DIR, "quotations.md"), "utf-8")
  return parseMarkdownData(content)
}

export async function loadCommissions(): Promise<Commission[]> {
  const content = fs.readFileSync(path.join(DATA_DIR, "commissions.md"), "utf-8")
  return parseMarkdownData(content)
}

export async function loadExpenses(): Promise<Expense[]> {
  const content = fs.readFileSync(path.join(DATA_DIR, "expenses.md"), "utf-8")
  return parseMarkdownData(content)
}

export async function loadCashRecords(): Promise<CashRecord[]> {
  const content = fs.readFileSync(path.join(DATA_DIR, "daily-cash.md"), "utf-8")
  return parseMarkdownData(content)
}
