"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CashRecordSchema, type CashRecordInput } from "@/lib/validations"
import { formatCurrency, formatDate } from "@/lib/format-utils"
import { useAuth } from "@/lib/auth-context"
import type { CashRecord } from "@/lib/types"

export default function CashPage() {
  const { user } = useAuth()
  const [records, setRecords] = useState<CashRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CashRecordInput>({
    resolver: zodResolver(CashRecordSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      openingBalance: 0,
      cashIncome: 0,
      cashExpenses: 0,
      closingBalance: 0,
      notes: "",
      userId: user?.id ? parseInt(user.id) : 0,
    },
  })

  const cashIncome = form.watch("cashIncome")
  const cashExpenses = form.watch("cashExpenses")
  const openingBalance = form.watch("openingBalance")

  useEffect(() => {
    const closing = openingBalance + cashIncome - cashExpenses
    form.setValue("closingBalance", closing)
  }, [openingBalance, cashIncome, cashExpenses, form])

  useEffect(() => {
    fetchRecords()
  }, [refreshKey])

  useEffect(() => {
    if (user) {
      form.setValue("userId", parseInt(user.id))
    }
  }, [user, form])

  async function fetchRecords() {
    try {
      setIsLoading(true)
      const response = await fetch("/api/cash-records")
      const data = await response.json()
      setRecords(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching cash records:", error)
      toast.error("Error al cargar registros de caja")
    } finally {
      setIsLoading(false)
    }
  }

  function handleNew() {
    form.reset({
      date: new Date().toISOString().split("T")[0],
      openingBalance: records.length > 0 ? records[0].closingBalance : 0,
      cashIncome: 0,
      cashExpenses: 0,
      closingBalance: 0,
      notes: "",
      userId: user?.id ? parseInt(user.id) : 0,
    })
    setFormOpen(true)
  }

  async function onSubmit(data: CashRecordInput) {
    try {
      setIsSubmitting(true)

      const response = await fetch("/api/cash-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al guardar registro")
      }

      toast.success("Registro de caja guardado correctamente")
      setRefreshKey((prev) => prev + 1)
      setFormOpen(false)
      form.reset()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar registro")
    } finally {
      setIsSubmitting(false)
    }
  }

  const latestRecord = records.length > 0 ? records[0] : null
  const totalIncome = records.reduce((sum, r) => sum + r.cashIncome, 0)
  const totalExpenses = records.reduce((sum, r) => sum + r.cashExpenses, 0)
  const netFlow = totalIncome - totalExpenses

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Caja Diaria"
          description="Gestiona el flujo de efectivo y cierre de caja"
        />
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Registro
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Actual</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestRecord ? formatCurrency(latestRecord.closingBalance) : "$0"}
            </div>
            <p className="text-xs text-muted-foreground">
              {latestRecord ? formatDate(latestRecord.date) : "Sin registros"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">{records.length} registros</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Egresos Totales</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">{records.length} registros</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flujo Neto</CardTitle>
            <DollarSign className={`h-4 w-4 ${netFlow >= 0 ? "text-green-500" : "text-red-500"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netFlow >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(netFlow)}
            </div>
            <p className="text-xs text-muted-foreground">
              {netFlow >= 0 ? "Positivo" : "Negativo"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Saldo Inicial</TableHead>
              <TableHead className="text-right">Ingresos</TableHead>
              <TableHead className="text-right">Egresos</TableHead>
              <TableHead className="text-right">Saldo Final</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Notas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No hay registros de caja
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-mono text-sm">{formatDate(record.date)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(record.openingBalance)}</TableCell>
                  <TableCell className="text-right text-green-600 font-semibold">
                    +{formatCurrency(record.cashIncome)}
                  </TableCell>
                  <TableCell className="text-right text-red-600 font-semibold">
                    -{formatCurrency(record.cashExpenses)}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(record.closingBalance)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{record.userName}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                    {record.notes || "-"}
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
            <DialogTitle>Nuevo Registro de Caja</DialogTitle>
            <DialogDescription>
              Registra el cierre de caja del día con ingresos y egresos
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
                  name="openingBalance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Saldo Inicial</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
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
                  name="cashIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ingresos en Efectivo</FormLabel>
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
                  name="cashExpenses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Egresos en Efectivo</FormLabel>
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
                  name="closingBalance"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Saldo Final (Calculado)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          disabled
                          className="font-bold text-lg"
                        />
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
                      <FormLabel>Notas</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Observaciones del cierre de caja" {...field} />
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
                  {isSubmitting ? "Guardando..." : "Registrar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
