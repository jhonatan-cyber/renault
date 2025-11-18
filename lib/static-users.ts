export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "vendedor" | "compras" | "supervisor" | "invitado"
}

// Static user credentials - no database needed
export const STATIC_USERS = [
  {
    id: "1",
    email: "admin@erp.com",
    password: "admin123",
    name: "Administrador",
    role: "admin" as const,
  },
  {
    id: "2",
    email: "juan@erp.com",
    password: "pass123",
    name: "Juan García",
    role: "vendedor" as const,
  },
  {
    id: "3",
    email: "maria@erp.com",
    password: "pass123",
    name: "María López",
    role: "compras" as const,
  },
  {
    id: "4",
    email: "supervisor@erp.com",
    password: "pass123",
    name: "Carlos Supervisor",
    role: "supervisor" as const,
  },
  {
    id: "5",
    email: "guest@erp.com",
    password: "pass123",
    name: "Usuario Invitado",
    role: "invitado" as const,
  },
]
