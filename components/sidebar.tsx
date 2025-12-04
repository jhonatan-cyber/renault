"use client"

import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  FileText,
  ShoppingCart,
  DollarSign,
  Receipt,
  Wallet,
  BarChart3,
  FolderTree,
  Shield,
  Lock,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"

interface MenuItem {
  label: string
  href: string
  icon: any
  module: string
}

interface MenuGroup {
  title: string
  items: MenuItem[]
}

const menuGroups: MenuGroup[] = [
  {
    title: "Principal",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, module: "dashboard" },
    ],
  },
  {
    title: "Ventas",
    items: [
      { label: "Clientes", href: "/clients", icon: Users, module: "clients" },
      { label: "Cotizaciones", href: "/quotations", icon: FileText, module: "quotations" },
      { label: "Ventas", href: "/sales", icon: ShoppingCart, module: "sales" },
    ],
  },
  {
    title: "Inventario",
    items: [
      { label: "Productos", href: "/inventory", icon: Package, module: "inventory" },
      { label: "Proveedores", href: "/suppliers", icon: Building2, module: "suppliers" },
      { label: "Compras", href: "/purchases", icon: Receipt, module: "purchases" },
      { label: "Categorías", href: "/categories", icon: FolderTree, module: "categories" },
    ],
  },
  {
    title: "Finanzas",
    items: [
      { label: "Gastos", href: "/expenses", icon: DollarSign, module: "expenses" },
      { label: "Caja Diaria", href: "/cash", icon: Wallet, module: "cash" },
      { label: "Reportes", href: "/reports", icon: BarChart3, module: "reports" },
    ],
  },
  {
    title: "Administración",
    items: [
      { label: "Usuarios", href: "/users", icon: Users, module: "users" },
      { label: "Roles", href: "/roles", icon: Shield, module: "roles" },
      { label: "Permisos", href: "/permissions", icon: Lock, module: "permissions" },
    ],
  },
]

export function Sidebar() {
  const { user, logout, hasPermission } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Filtrar grupos y items según permisos
  const visibleGroups = menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => hasPermission(item.module)),
    }))
    .filter((group) => group.items.length > 0)

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
          "fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 z-40 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-6 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold text-sidebar-foreground">Renault</h1>
          <p className="text-xs text-sidebar-foreground/50 mt-1">Repuestos Automotrices</p>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-custom">
          {visibleGroups.map((group) => (
            <div key={group.title}>
              <h3 className="px-4 mb-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
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
              </div>
            </div>
          ))}
        </nav>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 p-4 border-t border-sidebar-border bg-sidebar">
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
