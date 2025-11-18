"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Sale {
  id: number
  date: string
  clientId: number
  total: number
  paymentMethod: string
  status: string
  items: any[]
}

interface EditSaleDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (sale: Sale) => void
  sale: Sale
  clients: any[]
}

export function EditSaleDialog({ isOpen, onClose, onSave, sale, clients }: EditSaleDialogProps) {
  const [formData, setFormData] = useState<Sale>(sale)

  useEffect(() => {
    setFormData(sale)
  }, [sale])

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Venta #{formData.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Cliente</Label>
            <Select
              value={formData.clientId.toString()}
              onValueChange={(value) => setFormData({ ...formData, clientId: Number.parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Total</Label>
            <Input
              type="number"
              value={formData.total}
              onChange={(e) => setFormData({ ...formData, total: Number.parseFloat(e.target.value) })}
            />
          </div>

          <div>
            <Label>Método de Pago</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="transferencia">Transferencia</SelectItem>
                <SelectItem value="crédito">Crédito</SelectItem>
                <SelectItem value="qr">QR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Estado</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completada">Completada</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Actualizar Venta</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
