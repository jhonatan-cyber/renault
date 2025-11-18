"use client"

import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  Receipt,
  DollarSign,
  FileText,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react"
import { useState } from "react"

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, module: "dashboard" },
  { label: "Clientes", href: "/clients", icon: Users, module: "clients" },
  { label: "Proveedores", href: "/suppliers", icon: Package, module: "suppliers" },
  { label: "Inventario", href: "/inventory", icon: ShoppingCart, module: "inventory" },
  { label: "Cotizaciones", href: "/quotations", icon: Receipt, module: "quotations" },
  { label: "Compras", href: "/purchases", icon: ShoppingCart, module: "purchases" },
  { label: "Ventas", href: "/sales", icon: DollarSign, module: "sales" },
  { label: "Comisiones", href: "/commissions", icon: BarChart3, module: "commissions" },
  { label: "Gastos", href: "/expenses", icon: FileText, module: "expenses" },
  { label: "Reportes", href: "/reports", icon: FileText, module: "reports" },
  { label: "Caja Diaria", href: "/cash", icon: DollarSign, module: "cash" },
  { label: "Usuarios", href: "/users", icon: Users, module: "users" },
  { label: "Categorías", href: "/categories", icon: Package, module: "categories" },
]

export function Sidebar() {
  const { user, logout, hasPermission } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const visibleItems = menuItems.filter((item) => hasPermission(item.module))

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-sidebar border border-sidebar-border hover:bg-sidebar-accent"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto transition-transform duration-300 z-40",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-sidebar-foreground">ERP System</h1>
          <p className="text-xs text-sidebar-foreground/50 mt-1">Gestión Empresarial</p>
        </div>

        <nav className="px-4 space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/70 mb-3">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sidebar-foreground/50">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  )
}
