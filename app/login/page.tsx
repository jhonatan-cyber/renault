"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err) {
      setError("Credenciales inválidas. Por favor intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-2">ERP System</h1>
          <p className="text-sm text-muted-foreground mb-6">Inicia sesión en tu cuenta</p>

          {error && (
            <div className="mb-4 flex gap-3 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
              <Input
                type="email"
                placeholder="admin@erp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contraseña</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-muted-foreground mb-3">Demo Credentials:</p>
            <div className="space-y-1 text-xs">
              <p>
                <span className="font-semibold">Admin:</span> admin@erp.com / admin123
              </p>
              <p>
                <span className="font-semibold">Vendedor:</span> juan@erp.com / pass123
              </p>
              <p>
                <span className="font-semibold">Compras:</span> maria@erp.com / pass123
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
