# Purchases Database

## Purchase Orders
- id: 1
  date: "2025-01-10"
  supplierId: 1
  buyerUserId: 3
  items: [
    { productId: 1, quantity: 20, price: 3500 },
    { productId: 2, quantity: 100, price: 45 }
  ]
  subtotal: 74500
  tax: 11920
  total: 86420
  status: "recibida"
  createdAt: "2025-01-10"

- id: 2
  date: "2025-01-12"
  supplierId: 2
  buyerUserId: 3
  items: [
    { productId: 4, quantity: 30, price: 200 },
    { productId: 6, quantity: 50, price: 20 }
  ]
  subtotal: 7000
  tax: 1120
  total: 8120
  status: "pendiente"
  createdAt: "2025-01-12"

- id: 3
  date: "2025-01-14"
  supplierId: 3
  buyerUserId: 3
  items: [
    { productId: 3, quantity: 15, price: 75 }
  ]
  subtotal: 1125
  tax: 180
  total: 1305
  status: "recibida"
  createdAt: "2025-01-14"
