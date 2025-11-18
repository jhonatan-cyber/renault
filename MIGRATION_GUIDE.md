# Guía de Migración a Prisma

## ✅ Cambios Completados

### 1. Base de Datos
- ✅ Schema de Prisma creado con todas las entidades
- ✅ Migración inicial aplicada
- ✅ Cliente Prisma singleton configurado (`lib/prisma.ts`)

### 2. API Routes Actualizadas
Todas las API routes ahora usan Prisma en lugar de archivos Markdown:

- ✅ `/api/auth/login` - Autenticación con bcrypt
- ✅ `/api/clients` - GET y POST
- ✅ `/api/suppliers` - GET y POST
- ✅ `/api/categories` - GET y POST
- ✅ `/api/products` - GET y POST (con relaciones)
- ✅ `/api/sales` - GET y POST (con actualización de stock)
- ✅ `/api/purchases` - GET y POST (con actualización de stock)
- ✅ `/api/quotations` - GET y POST
- ✅ `/api/commissions` - GET y POST
- ✅ `/api/expenses` - GET y POST
- ✅ `/api/cash` - GET y POST
- ✅ `/api/users` - GET y POST (sin exponer contraseñas)

### 3. Sistema de Autenticación
- ✅ Login actualizado para usar Prisma y bcrypt
- ✅ AuthContext actualizado para usar tipos compartidos
- ✅ Tipos compartidos creados (`lib/types.ts`)

## 🚀 Próximos Pasos

### 1. Ejecutar el Seed
```bash
pnpm db:seed
```

Esto creará:
- 5 usuarios de prueba
- 4 categorías
- 2 proveedores
- 3 clientes
- 5 productos

### 2. Probar el Sistema
1. Iniciar el servidor: `pnpm dev`
2. Iniciar sesión con:
   - Email: `admin@erp.com`
   - Password: `admin123`

### 3. Funcionalidades Adicionales (Opcional)
- [ ] Agregar endpoints PUT/DELETE para actualizar/eliminar registros
- [ ] Agregar validación con Zod en las API routes
- [ ] Agregar paginación en los endpoints GET
- [ ] Agregar filtros y búsqueda avanzada
- [ ] Agregar middleware de autenticación para proteger rutas

## 📝 Notas Importantes

### Cambios en el Formato de Datos
- Las fechas ahora se devuelven como strings ISO (ej: "2025-01-15")
- Los IDs son números en lugar de strings
- Las relaciones se incluyen automáticamente (client, seller, etc.)

### Compatibilidad
- Las respuestas de la API mantienen un formato compatible con el código frontend existente
- Los campos adicionales (como `clientName`, `sellerName`) se agregan automáticamente

### Seguridad
- Las contraseñas se hashean con bcrypt
- Las contraseñas nunca se exponen en las respuestas de la API
- Validación básica de campos requeridos implementada

## 🔧 Comandos Útiles

```bash
# Ver la base de datos en Prisma Studio
pnpm db:studio

# Crear una nueva migración
pnpm db:migrate

# Aplicar migraciones en producción
pnpm db:migrate:deploy

# Resetear la base de datos (¡CUIDADO!)
pnpm db:reset
```

## 🐛 Solución de Problemas

### Error: "PrismaClient is not exported"
1. Ejecutar: `pnpm db:generate`
2. Reiniciar el servidor TypeScript/Next.js
3. Verificar que `node_modules/.prisma/client` existe

### Error de conexión a la base de datos
1. Verificar que PostgreSQL está corriendo
2. Verificar la variable `DATABASE_URL` en `.env`
3. Verificar que la base de datos existe

### Error al ejecutar el seed
1. Asegurarse de que las migraciones están aplicadas: `pnpm db:migrate`
2. Verificar que la base de datos está vacía o usar `pnpm db:reset`

