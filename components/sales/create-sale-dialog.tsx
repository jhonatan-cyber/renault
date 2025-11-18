"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreateSaleDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (sale: any) => void
  clients: any[]
}

export function CreateSaleDialog({ isOpen, onClose, onSave, clients }: CreateSaleDialogProps) {
  const [formData, setFormData] = useState({
    clientId: "",
    total: "",
    paymentMethod: "efectivo",
    status: "completada",
  })

  const handleSave = () => {
    if (!formData.clientId || !formData.total) {
      alert("Por favor completa todos los campos")
      return
    }

    const newSale = {
      id: Math.max(...[0], Math.floor(Math.random() * 10000)),
      date: new Date().toISOString().split("T")[0],
      clientId: Number.parseInt(formData.clientId),
      sellerUserId: 2,
      items: [],
      subtotal: Number.parseFloat(formData.total),
      tax: Number.parseFloat(formData.total) * 0.16,
      discount: 0,
      total: Number.parseFloat(formData.total) * 1.16,
      paymentMethod: formData.paymentMethod,
      status: formData.status,
      createdAt: new Date().toISOString().split("T")[0],
    }

    onSave(newSale)
    setFormData({ clientId: "", total: "", paymentMethod: "efectivo", status: "completada" })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva Venta</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Cliente</Label>
            <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
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
              onChange={(e) => setFormData({ ...formData, total: e.target.value })}
              placeholder="Ingresa el total"
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
            <Button onClick={handleSave}>Guardar Venta</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
