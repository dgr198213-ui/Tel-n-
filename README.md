# TELÓN - Plataforma para Artistas y Eventos

TELÓN es una plataforma integral diseñada para conectar a artistas con su audiencia y facilitar la publicación y gestión de eventos culturales. Esta versión de la plataforma ha sido migrada a una infraestructura propia para garantizar total autonomía y escalabilidad.

---

## 🚀 Stack Tecnológico

La plataforma utiliza un stack moderno y eficiente:

- **Frontend:** React 19 + Vite + Tailwind CSS 4
- **Backend:** Node.js + Express 4 + tRPC 11
- **Base de Datos:** PostgreSQL (alojado en Supabase)
- **ORM:** Drizzle ORM
- **Autenticación:** Supabase Auth
- **Almacenamiento:** Supabase Storage
- **Pagos:** Stripe (Suscripciones y Checkouts)
- **Despliegue:** Preparado para Vercel

---

## 🛠️ Arquitectura y Flujo de Desarrollo

### 1. tRPC-First
Toda la comunicación entre el cliente y el servidor se realiza a través de tRPC. Los procedimientos se definen en `server/routers.ts` y se consumen en el frontend mediante hooks de `trpc.*`. Esto garantiza tipos de extremo a extremo y una experiencia de desarrollo fluida.

### 2. Autenticación con Supabase
La autenticación se gestiona íntegramente a través de Supabase Auth. El hook `useAuth()` en el cliente proporciona el estado del usuario, mientras que el servidor valida los tokens JWT en cada petición tRPC para poblar el contexto (`ctx.user`).

### 3. Base de Datos y Esquema
El esquema se define en `drizzle/schema.ts` utilizando PostgreSQL.
- Para generar cambios: `npx drizzle-kit generate`
- Para aplicar cambios: `npx drizzle-kit migrate` (requiere `DATABASE_URL`)

### 4. Almacenamiento Multimedia
Las imágenes y archivos se gestionan a través de Supabase Storage. El servidor proporciona helpers en `server/storage.ts` para subir archivos (`storagePut`) y obtener URLs públicas o firmadas.

---

## 📁 Estructura del Proyecto

```text
client/
  src/
    _core/hooks/  ← Hooks globales (useAuth, etc.)
    components/   ← Componentes UI (shadcn/ui) y Mapas
    lib/          ← Clientes de Supabase y tRPC
    pages/        ← Páginas de la aplicación (Artistas, Eventos, Perfil, etc.)
    App.tsx       ← Enrutamiento con wouter
    main.tsx      ← Punto de entrada y proveedores
drizzle/          ← Esquema de base de datos y migraciones
server/
  _core/          ← Infraestructura del servidor (tRPC context, env, security)
  db.ts           ← Helpers de acceso a base de datos
  routers.ts      ← Definición de procedimientos tRPC
  stripe.ts       ← Integración y webhooks de Stripe
  storage.ts      ← Gestión de archivos con Supabase
shared/           ← Tipos y constantes compartidas
```

---

## 🔐 Variables de Entorno Necesarias

Para que la plataforma funcione correctamente, se deben configurar las siguientes variables:

### Backend
- `DATABASE_URL`: URL de conexión a PostgreSQL.
- `SUPABASE_URL`: URL de tu proyecto Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: Clave secreta para operaciones administrativas del servidor.
- `STRIPE_SECRET_KEY`: Clave secreta de Stripe.
- `STRIPE_WEBHOOK_SECRET`: Secreto para validar firmas de webhooks de Stripe.
- `JWT_SECRET`: Secreto para firma de cookies locales (si aplica).

### Frontend (Vite)
- `VITE_SUPABASE_URL`: URL pública de Supabase.
- `VITE_SUPABASE_ANON_KEY`: Clave pública anónima de Supabase.
- `VITE_GOOGLE_MAPS_API_KEY`: Clave de API para Google Maps.

---

## 💳 Integración de Stripe

La plataforma incluye un flujo completo de suscripciones para artistas (Planes: Free, Estándar, Premium).
- **Webhooks:** El endpoint `/api/stripe/webhook` procesa eventos como `checkout.session.completed`, `invoice.payment_succeeded` y `customer.subscription.deleted` para actualizar automáticamente el estatus del artista en la base de datos.

---

## 🛡️ Seguridad

- **Helmet:** Configurado para establecer cabeceras de seguridad HTTP y Content Security Policy (CSP).
- **Rate Limiting:** Implementado para proteger los endpoints de la API contra abusos.
- **Validación:** Uso intensivo de `zod` para validar todas las entradas de la API.

---

## 📦 Despliegue

La plataforma está optimizada para ser desplegada en **Vercel**.
1. Conecta tu repositorio de GitHub a Vercel.
2. Configura las variables de entorno mencionadas anteriormente.
3. El comando de build es `pnpm build` y el directorio de salida es `dist`.
