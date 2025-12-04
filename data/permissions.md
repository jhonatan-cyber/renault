# Permisos del Sistema

## Categorías de Permisos

### Core
Permisos fundamentales del sistema

| ID | Nombre | Módulo | Descripción |
|----|--------|--------|-------------|
| dashboard | Dashboard | dashboard | Ver panel principal con estadísticas |

### Ventas (Sales)
Permisos relacionados con el proceso de ventas

| ID | Nombre | Módulo | Descripción |
|----|--------|--------|-------------|
| clients | Clientes | clients | Gestionar información de clientes |
| quotations | Cotizaciones | quotations | Crear y gestionar cotizaciones |
| sales | Ventas | sales | Registrar y gestionar ventas |

### Inventario (Inventory)
Permisos relacionados con productos y stock

| ID | Nombre | Módulo | Descripción |
|----|--------|--------|-------------|
| inventory | Inventario | inventory | Gestionar productos y stock |
| suppliers | Proveedores | suppliers | Gestionar información de proveedores |
| purchases | Compras | purchases | Registrar compras a proveedores |
| categories | Categorías | categories | Gestionar categorías de productos |

### Finanzas (Finance)
Permisos relacionados con aspectos financieros

| ID | Nombre | Módulo | Descripción |
|----|--------|--------|-------------|
| expenses | Gastos | expenses | Registrar y gestionar gastos |
| cash | Caja Diaria | cash | Gestionar flujo de efectivo diario |
| reports | Reportes | reports | Ver reportes financieros y estadísticas |

### Administración (Admin)
Permisos administrativos del sistema

| ID | Nombre | Módulo | Descripción |
|----|--------|--------|-------------|
| users | Usuarios | users | Gestionar usuarios del sistema |
| roles | Roles | roles | Gestionar roles y asignar permisos |
| permissions | Permisos | permissions | Gestionar permisos del sistema |

## Asignación de Permisos por Rol

### Administrador
Todos los permisos (14 permisos)

### Vendedor
- dashboard
- clients
- inventory
- quotations
- sales
- reports

### Comprador
- dashboard
- suppliers
- inventory
- purchases
- reports

### Supervisor
- dashboard
- clients
- suppliers
- inventory
- quotations
- purchases
- sales
- expenses
- reports
- cash

### Invitado
- dashboard
- reports

## Notas

- Los permisos del sistema no pueden ser eliminados
- Los permisos personalizados pueden ser creados por administradores
- Un permiso no puede ser eliminado si está asignado a algún rol
- Los permisos se verifican en cada módulo para controlar el acceso
- El formato de ID debe ser en snake_case (ej: view_reports, create_sales)
