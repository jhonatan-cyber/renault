import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de la base de datos - Renault Repuestos Automotrices...");

  // ============================================
  // LIMPIAR DATOS EXISTENTES
  // ============================================
  console.log("🧹 Limpiando datos existentes...");
  await prisma.commission.deleteMany();
  await prisma.cashRecord.deleteMany();
  await prisma.expense.deleteMany();
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

  // ============================================
  // CREAR USUARIOS
  // ============================================
  console.log("👥 Creando usuarios...");
  const hashedAdmin = await bcrypt.hash("admin123", 10);
  const hashedVendedor = await bcrypt.hash("vendedor123", 10);
  const hashedCompras = await bcrypt.hash("compras123", 10);
  const hashedSupervisor = await bcrypt.hash("supervisor123", 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Administrador Sistema",
        email: "admin@repuestos.com",
        password: hashedAdmin,
        role: "admin",
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        name: "Carlos Rodríguez",
        email: "carlos.rodriguez@repuestos.com",
        password: hashedVendedor,
        role: "vendedor",
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        name: "Ana María Gómez",
        email: "ana.gomez@repuestos.com",
        password: hashedVendedor,
        role: "vendedor",
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        name: "Luis Fernando Castro",
        email: "luis.castro@repuestos.com",
        password: hashedCompras,
        role: "compras",
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        name: "Patricia Morales",
        email: "patricia.morales@repuestos.com",
        password: hashedSupervisor,
        role: "supervisor",
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        name: "Diego Martínez",
        email: "diego.martinez@repuestos.com",
        password: hashedVendedor,
        role: "vendedor",
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        name: "Sandra Pérez",
        email: "sandra.perez@repuestos.com",
        password: hashedVendedor,
        role: "vendedor",
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        name: "Roberto Silva",
        email: "roberto.silva@repuestos.com",
        password: hashedCompras,
        role: "compras",
        status: "active",
      },
    }),
  ]);

  const [admin, carlos, ana, luis, patricia, diego, sandra, roberto] = users;

  // ============================================
  // CREAR CATEGORÍAS
  // ============================================
  console.log("📦 Creando categorías...");
  const categories = await Promise.all([
    // Categorías de Productos
    prisma.category.create({ data: { name: "Motor", color: "#EF4444", icon: "Wrench", type: "product" } }),
    prisma.category.create({ data: { name: "Frenos", color: "#DC2626", icon: "CircleStop", type: "product" } }),
    prisma.category.create({ data: { name: "Suspensión", color: "#F59E0B", icon: "Settings", type: "product" } }),
    prisma.category.create({ data: { name: "Transmisión", color: "#3B82F6", icon: "Cog", type: "product" } }),
    prisma.category.create({ data: { name: "Eléctrico", color: "#FBBF24", icon: "Zap", type: "product" } }),
    prisma.category.create({ data: { name: "Filtros", color: "#10B981", icon: "Filter", type: "product" } }),
    prisma.category.create({ data: { name: "Lubricantes", color: "#8B5CF6", icon: "Droplet", type: "product" } }),
    prisma.category.create({ data: { name: "Iluminación", color: "#F97316", icon: "Lightbulb", type: "product" } }),
    prisma.category.create({ data: { name: "Carrocería", color: "#06B6D4", icon: "Car", type: "product" } }),
    prisma.category.create({ data: { name: "Neumáticos", color: "#6366F1", icon: "Circle", type: "product" } }),
    prisma.category.create({ data: { name: "Escape", color: "#64748B", icon: "Wind", type: "product" } }),
    prisma.category.create({ data: { name: "Refrigeración", color: "#0EA5E9", icon: "Snowflake", type: "product" } }),
    // Categorías de Gastos
    prisma.category.create({ data: { name: "Servicios", color: "#EF4444", icon: "Lightbulb", type: "expense" } }),
    prisma.category.create({ data: { name: "Alquiler", color: "#F97316", icon: "Building", type: "expense" } }),
    prisma.category.create({ data: { name: "Salarios", color: "#06B6D4", icon: "DollarSign", type: "expense" } }),
    prisma.category.create({ data: { name: "Marketing", color: "#EC4899", icon: "Megaphone", type: "expense" } }),
    prisma.category.create({ data: { name: "Transporte", color: "#8B5CF6", icon: "Truck", type: "expense" } }),
    prisma.category.create({ data: { name: "Mantenimiento", color: "#10B981", icon: "Wrench", type: "expense" } }),
  ]);

  const [catMotor, catFrenos, catSuspension, catTransmision, catElectrico, catFiltros, 
         catLubricantes, catIluminacion, catCarroceria, catNeumaticos, catEscape, catRefrigeracion] = categories;

  // ============================================
  // CREAR PROVEEDORES
  // ============================================
  console.log("🏢 Creando proveedores...");
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        name: "Roberto Martínez",
        company: "AutoPartes Premium S.A.S",
        phone: "+57 300 555 1001",
        email: "ventas@autopartespremium.com",
        address: "Calle 45 #23-15, Bogotá",
        totalPurchases: 0,
      },
    }),
    prisma.supplier.create({
      data: {
        name: "Laura Sánchez",
        company: "Repuestos Originales Ltda",
        phone: "+57 301 555 2002",
        email: "contacto@repuestosoriginales.com",
        address: "Av. Caracas #67-89, Bogotá",
        totalPurchases: 0,
      },
    }),
    prisma.supplier.create({
      data: {
        name: "Diego Ramírez",
        company: "Importadora AutoMotriz",
        phone: "+57 302 555 3003",
        email: "diego@importadoraautomotriz.com",
        address: "Cra 30 #45-12, Medellín",
        totalPurchases: 0,
      },
    }),
    prisma.supplier.create({
      data: {
        name: "Ana Torres",
        company: "Distribuidora Continental",
        phone: "+57 303 555 4004",
        email: "ana.torres@distcontinental.com",
        address: "Calle 100 #15-20, Bogotá",
        totalPurchases: 0,
      },
    }),
    prisma.supplier.create({
      data: {
        name: "Miguel Ángel Castro",
        company: "Repuestos del Norte",
        phone: "+57 304 555 5005",
        email: "ventas@repuestosdelnorte.com",
        address: "Av. 19 #120-45, Bogotá",
        totalPurchases: 0,
      },
    }),
    prisma.supplier.create({
      data: {
        name: "Patricia Gómez",
        company: "AutoRepuestos Express",
        phone: "+57 305 555 6006",
        email: "patricia@autorepuestosexpress.com",
        address: "Calle 13 #68-24, Cali",
        totalPurchases: 0,
      },
    }),
    prisma.supplier.create({
      data: {
        name: "Fernando Silva",
        company: "Lubricantes y Filtros S.A",
        phone: "+57 306 555 7007",
        email: "fernando@lubricantesyfiltros.com",
        address: "Cra 7 #32-18, Barranquilla",
        totalPurchases: 0,
      },
    }),
    prisma.supplier.create({
      data: {
        name: "Carmen Ruiz",
        company: "Neumáticos Colombia",
        phone: "+57 307 555 8008",
        email: "carmen@neumaticoscolombia.com",
        address: "Av. 68 #45-90, Bogotá",
        totalPurchases: 0,
      },
    }),
  ]);

  // ============================================
  // CREAR CLIENTES
  // ============================================
  console.log("👤 Creando clientes...");
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: "Taller Mecánico El Experto",
        phone: "+57 310 400 5001",
        email: "tallerexperto@gmail.com",
        nit: "900123456-1",
        address: "Calle 72 #45-23, Bogotá",
        totalPurchases: 0,
      },
    }),
    prisma.client.create({
      data: {
        name: "AutoServicio Rápido",
        phone: "+57 311 400 5002",
        email: "autoserviciorapido@hotmail.com",
        nit: "900234567-2",
        address: "Av. Boyacá #134-56, Bogotá",
        totalPurchases: 0,
      },
    }),
    prisma.client.create({
      data: {
        name: "Mecánica Alemana",
        phone: "+57 312 400 5003",
        email: "mecanicaalemana@outlook.com",
        nit: "900345678-3",
        address: "Cra 15 #89-12, Bogotá",
        totalPurchases: 0,
      },
    }),
    prisma.client.create({
      data: {
        name: "Taller Los Andes",
        phone: "+57 313 400 5004",
        email: "tallerlosandes@gmail.com",
        nit: "900456789-4",
        address: "Calle 26 #68-45, Bogotá",
        totalPurchases: 0,
      },
    }),
    prisma.client.create({
      data: {
        name: "Carlos Mendoza",
        phone: "+57 314 400 5005",
        email: "carlosmendoza@gmail.com",
        nit: "79456123-5",
        address: "Cra 50 #23-67, Bogotá",
        totalPurchases: 0,
      },
    }),
    prisma.client.create({
      data: {
        name: "Serviteca La 80",
        phone: "+57 315 400 5006",
        email: "servitecala80@gmail.com",
        nit: "900567890-6",
        address: "Av. 80 #45-90, Bogotá",
        totalPurchases: 0,
      },
    }),
    prisma.client.create({
      data: {
        name: "María Fernanda López",
        phone: "+57 316 400 5007",
        email: "mafe.lopez@hotmail.com",
        nit: "52789456-7",
        address: "Calle 100 #15-34, Bogotá",
        totalPurchases: 0,
      },
    }),
    prisma.client.create({
      data: {
        name: "Taller Diesel Power",
        phone: "+57 317 400 5008",
        email: "dieselpower@gmail.com",
        nit: "900678901-8",
        address: "Cra 68 #23-12, Bogotá",
        totalPurchases: 0,
      },
    }),
    prisma.client.create({
      data: {
        name: "AutoLujo Premium",
        phone: "+57 318 400 5009",
        email: "autolujopremium@gmail.com",
        nit: "900789012-9",
        address: "Calle 116 #45-78, Bogotá",
        totalPurchases: 0,
      },
    }),
    prisma.client.create({
      data: {
        name: "Jorge Andrés Ruiz",
        phone: "+57 319 400 5010",
        email: "jorge.ruiz@outlook.com",
        nit: "80123789-0",
        address: "Av. Suba #120-45, Bogotá",
        totalPurchases: 0,
      },
    }),
    prisma.client.create({
      data: {
        name: "Taller Multimarcas",
        phone: "+57 320 400 5011",
        email: "tallermultimarcas@gmail.com",
        nit: "900890123-1",
        address: "Calle 13 #34-56, Bogotá",
        totalPurchases: 0,
      },
    }),
    prisma.client.create({
      data: {
        name: "Electro Auto",
        phone: "+57 321 400 5012",
        email: "electroauto@hotmail.com",
        nit: "900901234-2",
        address: "Cra 30 #67-89, Bogotá",
        totalPurchases: 0,
      },
    }),
  ]);

  // ============================================
  // CREAR PRODUCTOS (50 productos automotrices)
  // ============================================
  console.log("🔧 Creando productos de repuestos automotrices...");
  const products = await Promise.all([
    // MOTOR (5 productos)
    prisma.product.create({ data: { code: "MOT-001", name: "Filtro de Aceite Toyota", categoryId: catMotor.id, purchasePrice: 15000, salePrice: 25000, stock: 45, minimumStock: 15, unit: "unidad", supplierId: suppliers[0].id } }),
    prisma.product.create({ data: { code: "MOT-002", name: "Bujía NGK Platino", categoryId: catMotor.id, purchasePrice: 18000, salePrice: 32000, stock: 120, minimumStock: 30, unit: "unidad", supplierId: suppliers[1].id } }),
    prisma.product.create({ data: { code: "MOT-003", name: "Correa de Distribución Gates", categoryId: catMotor.id, purchasePrice: 85000, salePrice: 145000, stock: 25, minimumStock: 10, unit: "unidad", supplierId: suppliers[2].id } }),
    prisma.product.create({ data: { code: "MOT-004", name: "Empaque de Culata Universal", categoryId: catMotor.id, purchasePrice: 120000, salePrice: 195000, stock: 8, minimumStock: 5, unit: "unidad", supplierId: suppliers[0].id } }),
    prisma.product.create({ data: { code: "MOT-005", name: "Bomba de Agua Chevrolet", categoryId: catMotor.id, purchasePrice: 95000, salePrice: 155000, stock: 18, minimumStock: 8, unit: "unidad", supplierId: suppliers[1].id } }),
    // FRENOS (5 productos)
    prisma.product.create({ data: { code: "FRE-001", name: "Pastillas de Freno Delanteras Mazda", categoryId: catFrenos.id, purchasePrice: 75000, salePrice: 125000, stock: 32, minimumStock: 12, unit: "juego", supplierId: suppliers[0].id } }),
    prisma.product.create({ data: { code: "FRE-002", name: "Disco de Freno Ventilado Renault", categoryId: catFrenos.id, purchasePrice: 110000, salePrice: 180000, stock: 24, minimumStock: 10, unit: "unidad", supplierId: suppliers[2].id } }),
    prisma.product.create({ data: { code: "FRE-003", name: "Líquido de Frenos DOT 4", categoryId: catFrenos.id, purchasePrice: 12000, salePrice: 22000, stock: 85, minimumStock: 20, unit: "litro", supplierId: suppliers[6].id } }),
    prisma.product.create({ data: { code: "FRE-004", name: "Cilindro Maestro de Freno", categoryId: catFrenos.id, purchasePrice: 185000, salePrice: 295000, stock: 6, minimumStock: 4, unit: "unidad", supplierId: suppliers[1].id } }),
    prisma.product.create({ data: { code: "FRE-005", name: "Manguera de Freno Flexible", categoryId: catFrenos.id, purchasePrice: 25000, salePrice: 42000, stock: 40, minimumStock: 15, unit: "unidad", supplierId: suppliers[0].id } }),
    // SUSPENSIÓN (4 productos)
    prisma.product.create({ data: { code: "SUS-001", name: "Amortiguador Delantero KYB", categoryId: catSuspension.id, purchasePrice: 145000, salePrice: 235000, stock: 16, minimumStock: 8, unit: "unidad", supplierId: suppliers[2].id } }),
    prisma.product.create({ data: { code: "SUS-002", name: "Terminal de Dirección", categoryId: catSuspension.id, purchasePrice: 45000, salePrice: 75000, stock: 28, minimumStock: 12, unit: "unidad", supplierId: suppliers[0].id } }),
    prisma.product.create({ data: { code: "SUS-003", name: "Rótula de Suspensión", categoryId: catSuspension.id, purchasePrice: 55000, salePrice: 92000, stock: 22, minimumStock: 10, unit: "unidad", supplierId: suppliers[1].id } }),
    prisma.product.create({ data: { code: "SUS-004", name: "Resorte Helicoidal Trasero", categoryId: catSuspension.id, purchasePrice: 85000, salePrice: 140000, stock: 12, minimumStock: 6, unit: "unidad", supplierId: suppliers[2].id } }),
    // TRANSMISIÓN (3 productos)
    prisma.product.create({ data: { code: "TRA-001", name: "Kit de Embrague Completo", categoryId: catTransmision.id, purchasePrice: 320000, salePrice: 495000, stock: 8, minimumStock: 4, unit: "kit", supplierId: suppliers[2].id } }),
    prisma.product.create({ data: { code: "TRA-002", name: "Aceite de Transmisión ATF", categoryId: catTransmision.id, purchasePrice: 28000, salePrice: 48000, stock: 65, minimumStock: 20, unit: "litro", supplierId: suppliers[6].id } }),
    prisma.product.create({ data: { code: "TRA-003", name: "Cruceta de Cardan", categoryId: catTransmision.id, purchasePrice: 65000, salePrice: 105000, stock: 14, minimumStock: 6, unit: "unidad", supplierId: suppliers[1].id } }),
    // ELÉCTRICO (5 productos)
    prisma.product.create({ data: { code: "ELE-001", name: "Batería 12V 45Ah", categoryId: catElectrico.id, purchasePrice: 185000, salePrice: 295000, stock: 22, minimumStock: 10, unit: "unidad", supplierId: suppliers[4].id } }),
    prisma.product.create({ data: { code: "ELE-002", name: "Alternador Reconstruido", categoryId: catElectrico.id, purchasePrice: 245000, salePrice: 385000, stock: 7, minimumStock: 4, unit: "unidad", supplierId: suppliers[3].id } }),
    prisma.product.create({ data: { code: "ELE-003", name: "Motor de Arranque", categoryId: catElectrico.id, purchasePrice: 285000, salePrice: 445000, stock: 5, minimumStock: 3, unit: "unidad", supplierId: suppliers[3].id } }),
    prisma.product.create({ data: { code: "ELE-004", name: "Sensor de Oxígeno", categoryId: catElectrico.id, purchasePrice: 95000, salePrice: 155000, stock: 18, minimumStock: 8, unit: "unidad", supplierId: suppliers[1].id } }),
    prisma.product.create({ data: { code: "ELE-005", name: "Bobina de Encendido", categoryId: catElectrico.id, purchasePrice: 75000, salePrice: 125000, stock: 25, minimumStock: 10, unit: "unidad", supplierId: suppliers[0].id } }),
    // FILTROS (4 productos)
    prisma.product.create({ data: { code: "FIL-001", name: "Filtro de Aire K&N", categoryId: catFiltros.id, purchasePrice: 45000, salePrice: 75000, stock: 55, minimumStock: 20, unit: "unidad", supplierId: suppliers[5].id } }),
    prisma.product.create({ data: { code: "FIL-002", name: "Filtro de Combustible Diesel", categoryId: catFiltros.id, purchasePrice: 32000, salePrice: 55000, stock: 42, minimumStock: 15, unit: "unidad", supplierId: suppliers[5].id } }),
    prisma.product.create({ data: { code: "FIL-003", name: "Filtro de Cabina con Carbón", categoryId: catFiltros.id, purchasePrice: 28000, salePrice: 48000, stock: 38, minimumStock: 15, unit: "unidad", supplierId: suppliers[5].id } }),
    prisma.product.create({ data: { code: "FIL-004", name: "Filtro de Aceite Mann", categoryId: catFiltros.id, purchasePrice: 18000, salePrice: 32000, stock: 95, minimumStock: 30, unit: "unidad", supplierId: suppliers[5].id } }),
    // LUBRICANTES (4 productos)
    prisma.product.create({ data: { code: "LUB-001", name: "Aceite Motor 20W-50 Mobil", categoryId: catLubricantes.id, purchasePrice: 35000, salePrice: 58000, stock: 120, minimumStock: 40, unit: "litro", supplierId: suppliers[6].id } }),
    prisma.product.create({ data: { code: "LUB-002", name: "Aceite Sintético 5W-30 Castrol", categoryId: catLubricantes.id, purchasePrice: 52000, salePrice: 85000, stock: 85, minimumStock: 30, unit: "litro", supplierId: suppliers[6].id } }),
    prisma.product.create({ data: { code: "LUB-003", name: "Grasa Multiusos", categoryId: catLubricantes.id, purchasePrice: 15000, salePrice: 28000, stock: 45, minimumStock: 15, unit: "kg", supplierId: suppliers[6].id } }),
    prisma.product.create({ data: { code: "LUB-004", name: "Refrigerante Verde", categoryId: catLubricantes.id, purchasePrice: 18000, salePrice: 32000, stock: 75, minimumStock: 25, unit: "litro", supplierId: suppliers[6].id } }),
    // ILUMINACIÓN (4 productos)
    prisma.product.create({ data: { code: "ILU-001", name: "Bombilla H4 Halógena", categoryId: catIluminacion.id, purchasePrice: 12000, salePrice: 22000, stock: 85, minimumStock: 30, unit: "unidad", supplierId: suppliers[4].id } }),
    prisma.product.create({ data: { code: "ILU-002", name: "Faro Delantero Derecho", categoryId: catIluminacion.id, purchasePrice: 145000, salePrice: 235000, stock: 12, minimumStock: 5, unit: "unidad", supplierId: suppliers[3].id } }),
    prisma.product.create({ data: { code: "ILU-003", name: "Luz LED Trasera", categoryId: catIluminacion.id, purchasePrice: 85000, salePrice: 140000, stock: 18, minimumStock: 8, unit: "unidad", supplierId: suppliers[4].id } }),
    prisma.product.create({ data: { code: "ILU-004", name: "Bombilla LED H7", categoryId: catIluminacion.id, purchasePrice: 35000, salePrice: 58000, stock: 42, minimumStock: 15, unit: "unidad", supplierId: suppliers[4].id } }),
    // CARROCERÍA (4 productos)
    prisma.product.create({ data: { code: "CAR-001", name: "Espejo Retrovisor Eléctrico", categoryId: catCarroceria.id, purchasePrice: 95000, salePrice: 155000, stock: 16, minimumStock: 6, unit: "unidad", supplierId: suppliers[3].id } }),
    prisma.product.create({ data: { code: "CAR-002", name: "Parachoque Delantero", categoryId: catCarroceria.id, purchasePrice: 285000, salePrice: 445000, stock: 5, minimumStock: 3, unit: "unidad", supplierId: suppliers[3].id } }),
    prisma.product.create({ data: { code: "CAR-003", name: "Guardafango Trasero", categoryId: catCarroceria.id, purchasePrice: 125000, salePrice: 195000, stock: 8, minimumStock: 4, unit: "unidad", supplierId: suppliers[3].id } }),
    prisma.product.create({ data: { code: "CAR-004", name: "Manija de Puerta Cromada", categoryId: catCarroceria.id, purchasePrice: 45000, salePrice: 75000, stock: 24, minimumStock: 10, unit: "unidad", supplierId: suppliers[5].id } }),
    // NEUMÁTICOS (4 productos)
    prisma.product.create({ data: { code: "NEU-001", name: "Llanta 185/65 R15 Michelin", categoryId: catNeumaticos.id, purchasePrice: 285000, salePrice: 445000, stock: 32, minimumStock: 16, unit: "unidad", supplierId: suppliers[7].id } }),
    prisma.product.create({ data: { code: "NEU-002", name: "Llanta 205/55 R16 Bridgestone", categoryId: catNeumaticos.id, purchasePrice: 345000, salePrice: 525000, stock: 28, minimumStock: 12, unit: "unidad", supplierId: suppliers[7].id } }),
    prisma.product.create({ data: { code: "NEU-003", name: "Rin de Aluminio 15 pulgadas", categoryId: catNeumaticos.id, purchasePrice: 195000, salePrice: 315000, stock: 20, minimumStock: 8, unit: "unidad", supplierId: suppliers[7].id } }),
    prisma.product.create({ data: { code: "NEU-004", name: "Válvula de Neumático", categoryId: catNeumaticos.id, purchasePrice: 3000, salePrice: 6000, stock: 200, minimumStock: 50, unit: "unidad", supplierId: suppliers[7].id } }),
    // ESCAPE (3 productos)
    prisma.product.create({ data: { code: "ESC-001", name: "Silenciador Universal", categoryId: catEscape.id, purchasePrice: 125000, salePrice: 195000, stock: 14, minimumStock: 6, unit: "unidad", supplierId: suppliers[2].id } }),
    prisma.product.create({ data: { code: "ESC-002", name: "Catalizador", categoryId: catEscape.id, purchasePrice: 385000, salePrice: 595000, stock: 6, minimumStock: 3, unit: "unidad", supplierId: suppliers[2].id } }),
    prisma.product.create({ data: { code: "ESC-003", name: "Tubo de Escape Flexible", categoryId: catEscape.id, purchasePrice: 45000, salePrice: 75000, stock: 22, minimumStock: 10, unit: "unidad", supplierId: suppliers[2].id } }),
    // REFRIGERACIÓN (5 productos)
    prisma.product.create({ data: { code: "REF-001", name: "Radiador de Aluminio", categoryId: catRefrigeracion.id, purchasePrice: 245000, salePrice: 385000, stock: 10, minimumStock: 5, unit: "unidad", supplierId: suppliers[1].id } }),
    prisma.product.create({ data: { code: "REF-002", name: "Termostato de Motor", categoryId: catRefrigeracion.id, purchasePrice: 35000, salePrice: 58000, stock: 32, minimumStock: 12, unit: "unidad", supplierId: suppliers[0].id } }),
    prisma.product.create({ data: { code: "REF-003", name: "Ventilador Eléctrico", categoryId: catRefrigeracion.id, purchasePrice: 145000, salePrice: 235000, stock: 8, minimumStock: 4, unit: "unidad", supplierId: suppliers[4].id } }),
    prisma.product.create({ data: { code: "REF-004", name: "Manguera de Radiador Superior", categoryId: catRefrigeracion.id, purchasePrice: 28000, salePrice: 48000, stock: 35, minimumStock: 15, unit: "unidad", supplierId: suppliers[0].id } }),
    prisma.product.create({ data: { code: "REF-005", name: "Tapa de Radiador", categoryId: catRefrigeracion.id, purchasePrice: 15000, salePrice: 28000, stock: 45, minimumStock: 20, unit: "unidad", supplierId: suppliers[0].id } }),
  ]);

  // ============================================
  // CREAR COMPRAS (6 compras)
  // ============================================
  console.log("📥 Creando compras a proveedores...");
  
  const purchase1 = await prisma.purchase.create({
    data: {
      date: new Date("2024-11-15"),
      supplierId: suppliers[0].id,
      buyerUserId: luis.id,
      subtotal: 3500000,
      tax: 665000,
      total: 4165000,
      status: "recibida",
      items: {
        create: [
          { productId: products[0].id, quantity: 50, price: 15000 },
          { productId: products[3].id, quantity: 15, price: 120000 },
          { productId: products[11].id, quantity: 30, price: 45000 },
        ],
      },
    },
  });

  const purchase2 = await prisma.purchase.create({
    data: {
      date: new Date("2024-11-20"),
      supplierId: suppliers[2].id,
      buyerUserId: luis.id,
      subtotal: 5200000,
      tax: 988000,
      total: 6188000,
      status: "recibida",
      items: {
        create: [
          { productId: products[2].id, quantity: 30, price: 85000 },
          { productId: products[10].id, quantity: 20, price: 145000 },
        ],
      },
    },
  });

  const purchase3 = await prisma.purchase.create({
    data: {
      date: new Date("2024-11-25"),
      supplierId: suppliers[6].id,
      buyerUserId: roberto.id,
      subtotal: 10450000,
      tax: 1985500,
      total: 12435500,
      status: "recibida",
      items: {
        create: [
          { productId: products[26].id, quantity: 150, price: 35000 },
          { productId: products[27].id, quantity: 100, price: 52000 },
        ],
      },
    },
  });

  const purchase4 = await prisma.purchase.create({
    data: {
      date: new Date("2024-11-28"),
      supplierId: suppliers[7].id,
      buyerUserId: luis.id,
      subtotal: 21750000,
      tax: 4132500,
      total: 25882500,
      status: "recibida",
      items: {
        create: [
          { productId: products[38].id, quantity: 40, price: 285000 },
          { productId: products[39].id, quantity: 30, price: 345000 },
        ],
      },
    },
  });

  const purchase5 = await prisma.purchase.create({
    data: {
      date: new Date("2024-12-02"),
      supplierId: suppliers[1].id,
      buyerUserId: roberto.id,
      subtotal: 6975000,
      tax: 1325250,
      total: 8300250,
      status: "recibida",
      items: {
        create: [
          { productId: products[1].id, quantity: 150, price: 18000 },
          { productId: products[4].id, quantity: 20, price: 95000 },
          { productId: products[20].id, quantity: 25, price: 95000 },
        ],
      },
    },
  });

  const purchase6 = await prisma.purchase.create({
    data: {
      date: new Date("2024-12-03"),
      supplierId: suppliers[4].id,
      buyerUserId: luis.id,
      subtotal: 8500000,
      tax: 1615000,
      total: 10115000,
      status: "pendiente",
      items: {
        create: [
          { productId: products[17].id, quantity: 30, price: 185000 },
          { productId: products[30].id, quantity: 100, price: 12000 },
          { productId: products[33].id, quantity: 50, price: 35000 },
        ],
      },
    },
  });

  // ============================================
  // CREAR VENTAS (8 ventas)
  // ============================================
  console.log("💰 Creando ventas...");

  const sale1 = await prisma.sale.create({
    data: {
      date: new Date("2024-12-01T10:30:00"),
      clientId: clients[0].id,
      sellerUserId: carlos.id,
      subtotal: 458000,
      tax: 87020,
      discount: 0,
      total: 545020,
      paymentMethod: "transferencia",
      status: "completada",
      items: {
        create: [
          { productId: products[0].id, quantity: 4, price: 25000, subtotal: 100000 },
          { productId: products[5].id, quantity: 2, price: 125000, subtotal: 250000 },
          { productId: products[22].id, quantity: 1, price: 75000, subtotal: 75000 },
          { productId: products[47].id, quantity: 1, price: 58000, subtotal: 58000 },
        ],
      },
    },
  });

  const sale2 = await prisma.sale.create({
    data: {
      date: new Date("2024-12-01T14:15:00"),
      clientId: clients[4].id,
      sellerUserId: ana.id,
      subtotal: 295000,
      tax: 56050,
      discount: 15000,
      total: 336050,
      paymentMethod: "efectivo",
      status: "completada",
      items: {
        create: [
          { productId: products[17].id, quantity: 1, price: 295000, subtotal: 295000 },
        ],
      },
    },
  });

  const sale3 = await prisma.sale.create({
    data: {
      date: new Date("2024-12-02T09:45:00"),
      clientId: clients[1].id,
      sellerUserId: carlos.id,
      subtotal: 1254000,
      tax: 238260,
      discount: 50000,
      total: 1442260,
      paymentMethod: "crédito",
      status: "completada",
      items: {
        create: [
          { productId: products[14].id, quantity: 2, price: 495000, subtotal: 990000 },
          { productId: products[26].id, quantity: 4, price: 58000, subtotal: 232000 },
          { productId: products[25].id, quantity: 1, price: 32000, subtotal: 32000 },
        ],
      },
    },
  });

  const sale4 = await prisma.sale.create({
    data: {
      date: new Date("2024-12-02T11:20:00"),
      clientId: clients[2].id,
      sellerUserId: diego.id,
      subtotal: 913000,
      tax: 173470,
      discount: 0,
      total: 1086470,
      paymentMethod: "transferencia",
      status: "completada",
      items: {
        create: [
          { productId: products[10].id, quantity: 2, price: 235000, subtotal: 470000 },
          { productId: products[18].id, quantity: 1, price: 385000, subtotal: 385000 },
          { productId: products[47].id, quantity: 1, price: 58000, subtotal: 58000 },
        ],
      },
    },
  });

  const sale5 = await prisma.sale.create({
    data: {
      date: new Date("2024-12-03T10:00:00"),
      clientId: clients[5].id,
      sellerUserId: ana.id,
      subtotal: 1780000,
      tax: 338200,
      discount: 80000,
      total: 2038200,
      paymentMethod: "transferencia",
      status: "completada",
      items: {
        create: [
          { productId: products[38].id, quantity: 4, price: 445000, subtotal: 1780000 },
        ],
      },
    },
  });

  const sale6 = await prisma.sale.create({
    data: {
      date: new Date("2024-12-03T15:30:00"),
      clientId: clients[7].id,
      sellerUserId: sandra.id,
      subtotal: 1425000,
      tax: 270750,
      discount: 0,
      total: 1695750,
      paymentMethod: "transferencia",
      status: "completada",
      items: {
        create: [
          { productId: products[19].id, quantity: 1, price: 445000, subtotal: 445000 },
          { productId: products[46].id, quantity: 1, price: 385000, subtotal: 385000 },
          { productId: products[44].id, quantity: 1, price: 595000, subtotal: 595000 },
        ],
      },
    },
  });

  const sale7 = await prisma.sale.create({
    data: {
      date: new Date("2024-12-04T09:15:00"),
      clientId: clients[8].id,
      sellerUserId: carlos.id,
      subtotal: 2100000,
      tax: 399000,
      discount: 100000,
      total: 2399000,
      paymentMethod: "transferencia",
      status: "completada",
      items: {
        create: [
          { productId: products[39].id, quantity: 4, price: 525000, subtotal: 2100000 },
        ],
      },
    },
  });

  const sale8 = await prisma.sale.create({
    data: {
      date: new Date("2024-12-04T13:45:00"),
      clientId: clients[3].id,
      sellerUserId: diego.id,
      subtotal: 410000,
      tax: 77900,
      discount: 20000,
      total: 467900,
      paymentMethod: "efectivo",
      status: "completada",
      items: {
        create: [
          { productId: products[6].id, quantity: 2, price: 180000, subtotal: 360000 },
          { productId: products[7].id, quantity: 1, price: 22000, subtotal: 22000 },
          { productId: products[49].id, quantity: 1, price: 28000, subtotal: 28000 },
        ],
      },
    },
  });

  // ============================================
  // CREAR COTIZACIONES (4 cotizaciones)
  // ============================================
  console.log("📋 Creando cotizaciones...");

  const quotation1 = await prisma.quotation.create({
    data: {
      date: new Date("2024-12-03T16:30:00"),
      clientId: clients[10].id,
      sellerUserId: carlos.id,
      subtotal: 1576000,
      tax: 299440,
      discount: 0,
      total: 1875440,
      validUntil: new Date("2024-12-10"),
      status: "activa",
      items: {
        create: [
          { productId: products[14].id, quantity: 2, price: 495000, subtotal: 990000 },
          { productId: products[10].id, quantity: 2, price: 235000, subtotal: 470000 },
          { productId: products[26].id, quantity: 2, price: 58000, subtotal: 116000 },
        ],
      },
    },
  });

  const quotation2 = await prisma.quotation.create({
    data: {
      date: new Date("2024-12-04T10:00:00"),
      clientId: clients[11].id,
      sellerUserId: ana.id,
      subtotal: 979000,
      tax: 186010,
      discount: 50000,
      total: 1115010,
      validUntil: new Date("2024-12-11"),
      status: "activa",
      items: {
        create: [
          { productId: products[18].id, quantity: 1, price: 385000, subtotal: 385000 },
          { productId: products[19].id, quantity: 1, price: 445000, subtotal: 445000 },
          { productId: products[21].id, quantity: 1, price: 125000, subtotal: 125000 },
          { productId: products[41].id, quantity: 4, price: 6000, subtotal: 24000 },
        ],
      },
    },
  });

  const quotation3 = await prisma.quotation.create({
    data: {
      date: new Date("2024-12-04T14:20:00"),
      clientId: clients[9].id,
      sellerUserId: diego.id,
      subtotal: 445000,
      tax: 84550,
      discount: 0,
      total: 529550,
      validUntil: new Date("2024-12-11"),
      status: "activa",
      items: {
        create: [
          { productId: products[38].id, quantity: 1, price: 445000, subtotal: 445000 },
        ],
      },
    },
  });

  const quotation4 = await prisma.quotation.create({
    data: {
      date: new Date("2024-12-04T15:45:00"),
      clientId: clients[0].id,
      sellerUserId: sandra.id,
      subtotal: 1218000,
      tax: 231420,
      discount: 60000,
      total: 1389420,
      validUntil: new Date("2024-12-11"),
      status: "activa",
      items: {
        create: [
          { productId: products[46].id, quantity: 2, price: 385000, subtotal: 770000 },
          { productId: products[48].id, quantity: 1, price: 235000, subtotal: 235000 },
          { productId: products[29].id, quantity: 5, price: 32000, subtotal: 160000 },
          { productId: products[47].id, quantity: 1, price: 58000, subtotal: 58000 },
        ],
      },
    },
  });

  // ============================================
  // CREAR GASTOS (10 gastos)
  // ============================================
  console.log("💸 Creando gastos...");

  await prisma.expense.createMany({
    data: [
      {
        date: new Date("2024-12-01T09:00:00"),
        category: "Servicios",
        description: "Pago de energía eléctrica del mes de noviembre",
        amount: 450000,
        responsibleUserId: admin.id,
        notes: "Factura #45678 - Codensa",
      },
      {
        date: new Date("2024-12-01T09:15:00"),
        category: "Servicios",
        description: "Internet y telefonía empresarial",
        amount: 180000,
        responsibleUserId: admin.id,
        notes: "Plan empresarial 100MB - Claro",
      },
      {
        date: new Date("2024-12-01T10:00:00"),
        category: "Alquiler",
        description: "Arriendo del local comercial - Diciembre 2024",
        amount: 3500000,
        responsibleUserId: admin.id,
        notes: "Pago mensual - Contrato #2024-001",
      },
      {
        date: new Date("2024-12-02T14:30:00"),
        category: "Transporte",
        description: "Flete de mercancía desde Medellín",
        amount: 350000,
        responsibleUserId: luis.id,
        notes: "Transportes Rápidos S.A - Guía #TR-12345",
      },
      {
        date: new Date("2024-12-03T11:00:00"),
        category: "Mantenimiento",
        description: "Reparación de estantería metálica",
        amount: 280000,
        responsibleUserId: patricia.id,
        notes: "Soldadura y pintura - Taller Metal Works",
      },
      {
        date: new Date("2024-12-03T15:00:00"),
        category: "Marketing",
        description: "Publicidad en redes sociales - Facebook Ads",
        amount: 500000,
        responsibleUserId: patricia.id,
        notes: "Campaña diciembre 2024 - 30 días",
      },
      {
        date: new Date("2024-12-04T08:30:00"),
        category: "Servicios",
        description: "Servicio de aseo y limpieza",
        amount: 320000,
        responsibleUserId: admin.id,
        notes: "Aseo Profesional Ltda - Quincenal",
      },
      {
        date: new Date("2024-12-04T16:00:00"),
        category: "Transporte",
        description: "Domicilios y entregas a clientes",
        amount: 180000,
        responsibleUserId: carlos.id,
        notes: "Mensajería urbana - Semana 1",
      },
      {
        date: new Date("2024-11-30T17:00:00"),
        category: "Salarios",
        description: "Nómina del mes de noviembre 2024",
        amount: 12500000,
        responsibleUserId: admin.id,
        notes: "Pago de 8 empleados + prestaciones",
      },
      {
        date: new Date("2024-12-01T13:00:00"),
        category: "Mantenimiento",
        description: "Mantenimiento preventivo del sistema de aire acondicionado",
        amount: 450000,
        responsibleUserId: patricia.id,
        notes: "Clima Confort S.A.S - Revisión trimestral",
      },
    ],
  });

  // ============================================
  // CREAR REGISTROS DE CAJA DIARIA (4 registros)
  // ============================================
  console.log("💵 Creando registros de caja diaria...");

  await prisma.cashRecord.createMany({
    data: [
      {
        date: new Date("2024-12-01"),
        openingBalance: 500000,
        cashIncome: 336050,
        cashExpenses: 150000,
        closingBalance: 686050,
        userId: carlos.id,
        notes: "Venta en efectivo a Carlos Mendoza. Pago de domicilios.",
      },
      {
        date: new Date("2024-12-02"),
        openingBalance: 686050,
        cashIncome: 0,
        cashExpenses: 80000,
        closingBalance: 606050,
        userId: ana.id,
        notes: "Sin ventas en efectivo. Gastos menores de oficina.",
      },
      {
        date: new Date("2024-12-03"),
        openingBalance: 606050,
        cashIncome: 0,
        cashExpenses: 120000,
        closingBalance: 486050,
        userId: diego.id,
        notes: "Todas las ventas por transferencia. Pago de servicios menores.",
      },
      {
        date: new Date("2024-12-04"),
        openingBalance: 486050,
        cashIncome: 467900,
        cashExpenses: 200000,
        closingBalance: 753950,
        userId: sandra.id,
        notes: "Venta en efectivo a Taller Los Andes. Pago de transporte y domicilios.",
      },
    ],
  });

  console.log("✅ Seed completado exitosamente!");
  console.log(`
📊 Resumen - Renault Repuestos Automotrices:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👥 Usuarios:          ${await prisma.user.count()}
📦 Categorías:        ${await prisma.category.count()} (12 productos + 6 gastos)
🏢 Proveedores:       ${await prisma.supplier.count()}
👤 Clientes:          ${await prisma.client.count()}
🔧 Productos:         ${await prisma.product.count()}
📥 Compras:           ${await prisma.purchase.count()}
💰 Ventas:            ${await prisma.sale.count()}
📋 Cotizaciones:      ${await prisma.quotation.count()}
💸 Gastos:            ${await prisma.expense.count()}
💵 Registros de Caja: ${await prisma.cashRecord.count()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 Credenciales de acceso:
   Admin:      admin@repuestos.com / admin123
   Vendedor:   carlos.rodriguez@repuestos.com / vendedor123
   Compras:    luis.castro@repuestos.com / compras123
   Supervisor: patricia.morales@repuestos.com / supervisor123
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
