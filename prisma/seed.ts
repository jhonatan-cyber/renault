import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // Limpiar datos existentes (opcional - comentar en producción)
  console.log("🧹 Limpiando datos existentes...");
  await prisma.commission.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.cashRecord.deleteMany();
  await prisma.quotationItem.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.saleItem.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.purchaseItem.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.client.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuarios
  console.log("👥 Creando usuarios...");
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const hashedPassword2 = await bcrypt.hash("pass123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@erp.com",
      password: hashedPassword,
      role: "admin",
      status: "active",
    },
  });

  const vendedor = await prisma.user.create({
    data: {
      name: "Juan Pérez",
      email: "juan@erp.com",
      password: hashedPassword2,
      role: "vendedor",
      status: "active",
    },
  });

  const compras = await prisma.user.create({
    data: {
      name: "María García",
      email: "maria@erp.com",
      password: hashedPassword2,
      role: "compras",
      status: "active",
    },
  });

  const supervisor = await prisma.user.create({
    data: {
      name: "Carlos López",
      email: "supervisor@erp.com",
      password: hashedPassword2,
      role: "supervisor",
      status: "active",
    },
  });

  const invitado = await prisma.user.create({
    data: {
      name: "Usuario Invitado",
      email: "guest@erp.com",
      password: hashedPassword2,
      role: "invitado",
      status: "active",
    },
  });

  // Crear categorías
  console.log("📦 Creando categorías...");
  const catElectronica = await prisma.category.create({
    data: {
      name: "Electrónica",
      color: "#3B82F6",
      icon: "zap",
      type: "product",
    },
  });

  const catRopa = await prisma.category.create({
    data: {
      name: "Ropa",
      color: "#EC4899",
      icon: "shirt",
      type: "product",
    },
  });

  const catAlimentos = await prisma.category.create({
    data: {
      name: "Alimentos",
      color: "#10B981",
      icon: "utensils",
      type: "product",
    },
  });

  const catGastosOficina = await prisma.category.create({
    data: {
      name: "Oficina",
      color: "#F59E0B",
      icon: "briefcase",
      type: "expense",
    },
  });

  // Crear proveedores
  console.log("🏢 Creando proveedores...");
  const supplier1 = await prisma.supplier.create({
    data: {
      name: "Proveedor ABC",
      company: "ABC Distribuidora S.A.",
      phone: "+57 300 111 2222",
      email: "contacto@abc.com",
      address: "Cra 10 # 20-30, Bogotá",
      totalPurchases: 0,
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      name: "Proveedor XYZ",
      company: "XYZ Comercial Ltda",
      phone: "+57 301 222 3333",
      email: "ventas@xyz.com",
      address: "Av 5 # 15-25, Medellín",
      totalPurchases: 0,
    },
  });

  // Crear clientes
  console.log("👤 Creando clientes...");
  const client1 = await prisma.client.create({
    data: {
      name: "Empresa ABC S.A.",
      phone: "+57 300 123 4567",
      email: "contacto@abc.com",
      nit: "123456789-1",
      address: "Cra 5 # 45-23, Bogotá",
      totalPurchases: 0,
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: "Comercial XYZ Ltda",
      phone: "+57 301 234 5678",
      email: "ventas@xyz.com",
      nit: "987654321-0",
      address: "Av 19 # 34-12, Medellín",
      totalPurchases: 0,
    },
  });

  const client3 = await prisma.client.create({
    data: {
      name: "Distribuidora 123",
      phone: "+57 302 345 6789",
      email: "dist@ejemplo.com",
      nit: "555444333-2",
      address: "Calle 10 # 56-78, Cali",
      totalPurchases: 0,
    },
  });

  // Crear productos
  console.log("📦 Creando productos...");
  const product1 = await prisma.product.create({
    data: {
      code: "PROD-001",
      name: "Laptop Dell XPS 15",
      categoryId: catElectronica.id,
      purchasePrice: 3500,
      salePrice: 4200,
      stock: 10,
      minimumStock: 3,
      unit: "unidad",
      supplierId: supplier1.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      code: "PROD-002",
      name: "Mouse Inalámbrico",
      categoryId: catElectronica.id,
      purchasePrice: 50,
      salePrice: 65,
      stock: 50,
      minimumStock: 10,
      unit: "unidad",
      supplierId: supplier1.id,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      code: "PROD-003",
      name: "Camiseta Básica",
      categoryId: catRopa.id,
      purchasePrice: 15,
      salePrice: 25,
      stock: 100,
      minimumStock: 20,
      unit: "unidad",
      supplierId: supplier2.id,
    },
  });

  const product4 = await prisma.product.create({
    data: {
      code: "PROD-004",
      name: "Arroz Premium",
      categoryId: catAlimentos.id,
      purchasePrice: 250,
      salePrice: 280,
      stock: 200,
      minimumStock: 50,
      unit: "kg",
      supplierId: supplier2.id,
    },
  });

  const product5 = await prisma.product.create({
    data: {
      code: "PROD-005",
      name: "Azúcar Blanca",
      categoryId: catAlimentos.id,
      purchasePrice: 12,
      salePrice: 15,
      stock: 300,
      minimumStock: 100,
      unit: "kg",
      supplierId: supplier2.id,
    },
  });

  console.log("✅ Seed completado exitosamente!");
  console.log(`
📊 Resumen:
- ${await prisma.user.count()} usuarios creados
- ${await prisma.category.count()} categorías creadas
- ${await prisma.supplier.count()} proveedores creados
- ${await prisma.client.count()} clientes creados
- ${await prisma.product.count()} productos creados
  `);
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

