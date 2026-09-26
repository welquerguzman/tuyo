# 📊 Gestor de Tareas Contables - MVP

Una aplicación web moderna y profesional para gestión de tareas contables, diseñada específicamente para despachos contables y contadores independientes.

## 🚀 Características

### ✅ Funcionalidades Principales
- **Formulario completo** para registrar nuevas tareas contables
- **Dashboard** con contadores de tareas por estado
- **Tabla interactiva** ordenable y filtrable
- **Filtros avanzados** por estado, categoría, prioridad y cliente
- **Edición de tareas** con modal intuitivo
- **Eliminación de tareas** con confirmación
- **Marcar completadas** directamente desde la tabla
- **Exportación a Excel** con resumen y estadísticas
- **Persistencia de datos** con localStorage

### 📋 Campos de Tarea
- Nombre/Descripción
- Cliente/Empresa
- Categoría (Impuestos, Facturación, Conciliación bancaria, Nómina, Cierre contable, Otro)
- Fecha de vencimiento
- Prioridad (Alta, Media, Baja)
- Estado (Pendiente, En proceso, Completado)
- Responsable

## 🎨 Diseño

- **Paleta de colores:** Azules y verdes profesionales, típicos de aplicaciones financieras
- **Responsive:** Funciona perfectamente en escritorio, tablet y móvil
- **Moderno:** Interfaz limpia con animaciones suaves
- **Accesible:** Diseño intuitivo y fácil de usar

## 🛠️ Instalación y Uso

### Opción 1: Abrir directamente en el navegador
1. Descarga los archivos: `index.html`, `style.css`, `script.js`
2. Abre `index.html` en tu navegador web
3. ¡Listo! La aplicación está lista para usar

### Opción 2: Usar con un servidor local (recomendado)
```bash
# Con Python 3
python3 -m http.server 8000

# O con Node.js
npx http-server

# O con PHP
php -S localhost:8000
```

Luego abre: `http://localhost:8000`

## 📊 Dashboard

El dashboard principal muestra:
- **Total de Tareas:** Cantidad total de tareas registradas
- **Pendientes:** Tareas sin empezar
- **En Proceso:** Tareas en ejecución
- **Completadas:** Tareas finalizadas

## 📥 Exportación a Excel

El reporte descargado incluye:
- **Hoja 1 - Tareas:** Tabla completa con todos los campos
- **Hoja 2 - Resumen:** 
  - Conteo por estado
  - Distribución por categoría
  - Distribución por prioridad

## 💾 Almacenamiento de Datos

Los datos se guardan automáticamente en el navegador utilizando `localStorage`. Esto significa:
- ✅ Los datos persisten entre sesiones
- ✅ No se pierden al recargar la página
- ✅ Funciona sin necesidad de servidor backend
- ⚠️ Se guardan localmente en el navegador (no en la nube)

## 🔍 Filtros y Búsqueda

Filtra rápidamente por:
- **Estado:** Pendiente, En proceso, Completado
- **Categoría:** Todas las categorías disponibles
- **Prioridad:** Alta, Media, Baja
- **Cliente:** Búsqueda por texto

## 📱 Responsive Design

La aplicación se adapta a cualquier tamaño de pantalla:
- **Escritorio:** Interfaz completa con todas las columnas
- **Tablet:** Diseño optimizado
- **Móvil:** Interfaz simplificada con elementos esenciales

## 🎯 Casos de Uso

Perfecta para:
- Gestión de tareas contables diarias
- Seguimiento de declaraciones de impuestos
- Conciliaciones bancarias
- Control de facturación
- Gestión de nóminas
- Cierres contables mensuales

## 📝 Datos de Ejemplo (Opcional)

Para cargar datos de ejemplo, descomenta la siguiente línea en `script.js`:
```javascript
loadSampleData();
```

## 🔧 Tecnologías Utilizadas

- **HTML5:** Estructura semántica
- **CSS3:** Diseño responsive y moderno
- **JavaScript:** Lógica pura sin frameworks
- **SheetJS (XLSX):** Exportación a Excel vía CDN
- **LocalStorage:** Persistencia de datos

## 📋 Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- JavaScript habilitado
- Conexión a Internet (solo para cargar la librería SheetJS de CDN)

## 🚀 Próximas Mejoras (v2)

- Backend para sincronización en la nube
- Autenticación de usuarios
- Múltiples vistas (Kanban, calendario, etc.)
- Notificaciones de tareas vencidas
- Reportes más detallados
- Gestión de usuarios y permisos
- Integración con APIs externas

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso personal y comercial.

## 👨‍💻 Soporte

Para reportar problemas o sugerencias, contacta al equipo de desarrollo.

---

**Versión:** 1.0 MVP  
**Última actualización:** Septiembre 2026
