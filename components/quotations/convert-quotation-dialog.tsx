"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface Quotation {
  id: number
  clientName: string
  date: string
  total: number
  status: string
  items: any[]
  clientId: number
}

interface ConvertQuotationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  quotation: Quotation
}

export function ConvertQuotationDialog({ isOpen, onClose, onConfirm, quotation }: ConvertQuotationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              <span className="font-medium">{quotation.items.length}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-muted-foreground">Monto Total:</span>
              <span className="font-bold text-lg text-primary">${quotation.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-sm text-blue-900 dark:text-blue-100">
            Se creará una venta con los datos de esta cotización. Podrás editarla si es necesario.
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={onConfirm} className="gap-2">
              <ArrowRight size={16} />
              Convertir a Venta
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
