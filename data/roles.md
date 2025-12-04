# Roles del Sistema

## Roles Predefinidos

### 1. Administrador
- **ID**: 1
- **Descripción**: Acceso completo al sistema
- **Permisos**: Todos los módulos
- **Es Sistema**: Sí

### 2. Vendedor
- **ID**: 2
- **Descripción**: Gestión de ventas y clientes
- **Permisos**: Dashboard, Clientes, Inventario, Cotizaciones, Ventas, Reportes
- **Es Sistema**: Sí

### 3. Comprador
- **ID**: 3
- **Descripción**: Gestión de compras y proveedores
- **Permisos**: Dashboard, Proveedores, Inventario, Compras, Reportes
- **Es Sistema**: Sí

### 4. Supervisor
- **ID**: 4
- **Descripción**: Supervisión de operaciones
- **Permisos**: Dashboard, Clientes, Proveedores, Inventario, Cotizaciones, Compras, Ventas, Gastos, Reportes, Caja
- **Es Sistema**: Sí

### 5. Invitado
- **ID**: 5
- **Descripción**: Solo lectura de reportes
- **Permisos**: Dashboard, Reportes
- **Es Sistema**: Sí

## Permisos Disponibles

| Permiso | Módulo | Descripción |
|---------|--------|-------------|
| dashboard | Dashboard | Ver panel principal |
| clients | Clientes | Gestionar clientes |
| suppliers | Proveedores | Gestionar proveedores |
| inventory | Inventario | Gestionar productos |
| quotations | Cotizaciones | Gestionar cotizaciones |
| purchases | Compras | Gestionar compras |
| sales | Ventas | Gestionar ventas |
| expenses | Gastos | Gestionar gastos |
| reports | Reportes | Ver reportes |
| cash | Caja Diaria | Gestionar caja |
| categories | Categorías | Gestionar categorías |
| users | Usuarios | Gestionar usuarios |
| roles | Roles | Gestionar roles y permisos |

## Notas

- Los roles del sistema no pueden ser eliminados
- Los roles personalizados pueden ser creados por administradores
- Un rol no puede ser eliminado si tiene usuarios asignados
- Los permisos se verifican en cada módulo para controlar el acceso
