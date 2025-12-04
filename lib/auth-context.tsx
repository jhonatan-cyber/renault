"use client"

import type React from "react"

import { createContext, useContext, useState, useCallback, useEffect } from "react"
import type { User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasPermission: (module: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const PERMISSIONS: Record<string, string[]> = {
  admin: [
    "dashboard",
    "clients",
    "suppliers",
    "users",
    "inventory",
    "quotations",
    "purchases",
    "sales",
    "expenses",
    "reports",
    "categories",
    "cash",
    "roles",
    "permissions",
  ],
  vendedor: ["dashboard", "clients", "inventory", "quotations", "sales", "reports"],
  compras: ["dashboard", "suppliers", "inventory", "purchases", "reports"],
  supervisor: [
    "dashboard",
    "clients",
    "suppliers",
    "inventory",
    "quotations",
    "purchases",
    "sales",
    "expenses",
    "reports",
    "cash",
  ],
  invitado: ["dashboard", "reports"],
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {}
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new Error("Invalid credentials")
    }

    const userData = await response.json()
    setUser(userData)
    localStorage.setItem("currentUser", JSON.stringify(userData))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }, [])

  const hasPermission = useCallback(
    (module: string) => {
      if (!user) return false
      const userPermissions = PERMISSIONS[user.role] || []
      return userPermissions.includes(module)
    },
    [user],
  )

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasPermission }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
