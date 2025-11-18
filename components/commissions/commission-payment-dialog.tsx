"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DollarSign } from "lucide-react"

interface Commission {
  id: number
  sellerId: number
  sellerName: string
  amount: number
  percentage: number
  date: string
  status: string
}

interface CommissionPaymentDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  commission: Commission
}

export function CommissionPaymentDialog({ isOpen, onClose, onConfirm, commission }: CommissionPaymentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Pago de Comisión</DialogTitle>
          <DialogDescription>Verifica los detalles antes de confirmar el pago</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Comisión ID:</span>
              <span className="font-medium">#{commission.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vendedor:</span>
              <span className="font-medium">{commission.sellerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Porcentaje:</span>
              <span className="font-medium">{commission.percentage}%</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-muted-foreground">Monto a Pagar:</span>
              <span className="font-bold text-lg text-green-600">${commission.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fecha:</span>
              <span className="font-medium">{commission.date}</span>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={onConfirm} className="gap-2">
              <DollarSign size={16} />
              Confirmar Pago
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
