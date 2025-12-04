"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { formatCurrency } from "@/lib/format-utils"
import type { Quotation } from "@/lib/types"

interface ConvertQuotationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quotation: Quotation
  onSuccess: () => void
}

export function ConvertQuotationDialog({ open, onOpenChange, quotation, onSuccess }: ConvertQuotationDialogProps) {
  const [isConverting, setIsConverting] = useState(false)

  async function handleConvert() {
    try {
      setIsConverting(true)

      const response = await fetch(`/api/quotations/${quotation.id}/convert`, {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al convertir cotización")
      }

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error converting quotation:", error)
      alert(error instanceof Error ? error.message : "Error al convertir cotización")
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convertir Cotización a Venta</DialogTitle>
          <DialogDescription>Esta acción creará una venta a partir de esta cotización</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cotización ID:</span>
              <span className="font-medium">#{quotation.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cliente:</span>
              <span className="font-medium">{quotation.clientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cantidad de Items:</span>
              <span className="font-medium">{quotation.items?.length || 0}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-muted-foreground">Monto Total:</span>
              <span className="font-bold text-lg text-primary">{formatCurrency(quotation.total)}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-sm text-blue-900 dark:text-blue-100">
            Se creará una venta con los datos de esta cotización. La cotización quedará marcada como convertida.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isConverting}>
            Cancelar
          </Button>
          <Button onClick={handleConvert} disabled={isConverting} className="gap-2">
            <ArrowRight size={16} />
            {isConverting ? "Convirtiendo..." : "Convertir a Venta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
