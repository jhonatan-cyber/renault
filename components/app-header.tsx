"use client"

import { useAuth } from "@/lib/auth-context"
import { usePathname } from "next/navigation"
import { Bell, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/clients": "Clientes",
  "/suppliers": "Proveedores",
  "/inventory": "Inventario",
  "/quotations": "Cotizaciones",
  "/purchases": "Compras",
  "/sales": "Ventas",
  "/expenses": "Gastos",
  "/reports": "Reportes",
  "/cash": "Caja Diaria",
  "/categories": "Categorías",
  "/users": "Usuarios",
  "/roles": "Roles y Permisos",
  "/permissions": "Permisos del Sistema",
}

export function AppHeader() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const title = routeTitles[pathname] || "Dashboard"

  return (
    <header className="sticky top-0 z-30 w-full bg-background border-b border-border">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <Button variant="ghost" size="icon">
            <Settings size={20} />
          </Button>

          <div className="hidden md:flex items-center gap-3 pl-4 border-l border-border">
            <div className="text-sm">
              <p className="font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} className="text-destructive hover:bg-destructive/10">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
