# TELÓN - Plataforma para Artistas y Eventos

TELÓN es una plataforma integral diseñada para conectar a artistas con su audiencia y facilitar la publicación y gestión de eventos culturales. Esta versión de la plataforma utiliza una arquitectura limpia y modular para garantizar escalabilidad y mantenibilidad.

---

## 🚀 Stack Tecnológico

La plataforma utiliza un stack moderno y eficiente:

- **Frontend:** React 19 + Vite + Tailwind CSS 4 + wouter
- **Backend:** Node.js + Express 4 + tRPC 11
- **Base de Datos:** PostgreSQL (alojado en Supabase)
- **ORM:** Drizzle ORM
- **Autenticación:** Supabase Auth (Sistema Unificado)
- **Almacenamiento:** Supabase Storage
- **Pagos:** Stripe (Suscripciones y Checkouts)
- **Despliegue:** Optimizado para Vercel / Fly.io

---

## 🛠️ Arquitectura y Flujo de Desarrollo

### 1. tRPC Modular
Toda la comunicación entre el cliente y el servidor se realiza a través de tRPC. A diferencia de versiones anteriores, los procedimientos están organizados por dominios en `server/routers/`:
- `artista.router.ts`: Gestión de perfiles, búsqueda y límites de plan.
- `evento.router.ts`: CRUD de eventos y listados públicos.
- `stripe.router.ts`: Creación de sesiones de checkout.
- `systemRouter.ts`: Procedimientos de salud del sistema.

El archivo `server/routers.ts` actúa como el punto de entrada que combina todos los sub-routers.

### 2. Capa de Casos de Uso (Clean Architecture)
Para separar la lógica de negocio de los protocolos de transporte, se ha introducido una capa de **Use Cases** en `server/use-cases/`. Esto permite:
- Validar reglas de negocio (ej. límites de fotos según el plan) de forma aislada.
- Facilitar el testing unitario de la lógica de dominio.
- Mantener los routers limpios y enfocados solo en la entrada/salida.

### 3. Autenticación Unificada
La autenticación se gestiona exclusivamente a través de **Supabase Auth**. 
- **Adaptadores:** Se utiliza un `AuthGateway` (`server/_core/auth/`) para desacoplar la implementación de Supabase de la lógica del servidor.
- **Contexto:** El servidor valida los tokens JWT en cada petición para poblar el contexto (`ctx.user`) y sincroniza automáticamente los datos con la tabla de usuarios local.

### 4. Optimización de Frontend
- **Code Splitting:** Se utiliza `React.lazy()` y `Suspense` para cargar las páginas bajo demanda, mejorando drásticamente el tiempo de carga inicial.
- **Validación con Zod:** Tipado estricto de extremo a extremo desde el esquema de base de datos hasta los formularios del frontend.

---

## 📁 Estructura del Proyecto

```text
client/
  src/
    _core/hooks/  ← Hooks globales (useAuth, etc.)
    components/   ← Componentes UI (shadcn/ui) y Mapas
    lib/          ← Clientes de Supabase y tRPC
    pages/        ← Páginas con Lazy Loading
    App.tsx       ← Enrutamiento y Suspense
drizzle/          ← Esquema de base de datos y migraciones
server/
  _core/          ← Infraestructura (Auth Adapters, tRPC context, env)
  routers/        ← Routers tRPC divididos por dominio
  use-cases/      ← Lógica de negocio y repositorios (Clean Architecture)
  db.ts           ← Acceso a datos con Drizzle
  stripe.ts       ← Lógica de integración con Stripe
  storage.ts      ← Gestión de archivos con Supabase
shared/           ← Tipos y constantes compartidas
```

---

## 🔐 Variables de Entorno

Consulta el archivo `.env.example` para ver la lista completa de variables necesarias para el desarrollo y despliegue.

### Principales:
- `DATABASE_URL`: Conexión a PostgreSQL.
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`: Configuración de Supabase.
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`: Integración de pagos.
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`: Configuración cliente Supabase.

---

## 📦 Despliegue

La plataforma está optimizada para ser desplegada en **Vercel**:
1. Conecta tu repositorio de GitHub.
2. Configura las variables de entorno.
3. El comando de build es `pnpm build` y el directorio de salida es `dist`.
