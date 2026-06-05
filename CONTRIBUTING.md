# Guía de Contribución - TELÓN Platform

Gracias por tu interés en contribuir a TELÓN Platform. Esta guía te ayudará a entender cómo contribuir de manera efectiva.

## Requisitos Previos

- Node.js 20.x o superior
- pnpm 10.4.1 o superior
- Git

## Configuración del Entorno

```bash
# Clonar el repositorio
git clone https://github.com/dgr198213-ui/Tel-n-.git
cd Tel-n-

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

## Estructura del Proyecto

```
telon-platform/
├── client/                 # Frontend React 19 + Tailwind 4
│   ├── src/
│   │   ├── pages/         # Páginas principales
│   │   ├── components/    # Componentes reutilizables
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilidades
│   └── public/            # Archivos estáticos
├── server/                # Backend Express 4 + tRPC 11
│   ├── routers.ts         # tRPC procedures
│   ├── db.ts              # Database helpers
│   └── stripe.ts          # Stripe integration
├── drizzle/               # Database schema
│   ├── schema.ts          # Tablas y tipos
│   └── migrations/        # SQL migrations
├── shared/                # Código compartido
└── tests/                 # Tests
```

## Flujo de Desarrollo

### 1. Crear una rama para tu feature

```bash
git checkout -b feature/nombre-feature
```

### 2. Hacer cambios

- **Backend**: Edita `server/routers.ts` y `server/db.ts`
- **Frontend**: Edita archivos en `client/src/pages/` o `client/src/components/`
- **Database**: Modifica `drizzle/schema.ts` y ejecuta `pnpm drizzle-kit generate`

### 3. Escribir tests

```bash
# Crear tests en server/*.test.ts
pnpm test
```

### 4. Commit y push

```bash
git add .
git commit -m "feat: descripción clara del cambio"
git push origin feature/nombre-feature
```

### 5. Crear Pull Request

- Describe los cambios realizados
- Incluye screenshots si es UI
- Asegúrate de que todos los tests pasen

## Estándares de Código

### Naming Conventions

- **Componentes React**: PascalCase (`Home.tsx`, `ArtistaPublico.tsx`)
- **Funciones/variables**: camelCase (`getArtista`, `handleSubmit`)
- **Constantes**: UPPER_SNAKE_CASE (`STRIPE_PRODUCTS`, `MAX_FILE_SIZE`)
- **Tipos**: PascalCase (`Artista`, `Evento`)

### Estilos

- Usar Tailwind CSS para estilos
- Usar shadcn/ui para componentes complejos
- Mantener consistencia con la paleta cyber-minimalist

### TypeScript

- Siempre usar tipos explícitos
- Evitar `any`
- Usar Zod para validación de datos

## Proceso de Review

1. Mínimo 1 review requerido
2. Todos los tests deben pasar
3. Sin conflictos de merge
4. Código debe seguir los estándares

## Reportar Bugs

Crea un issue con:
- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots si es relevante

## Solicitar Features

Crea un issue con:
- Descripción de la feature
- Caso de uso
- Mockups si es UI

## Licencia

Al contribuir, aceptas que tu código se publique bajo la licencia del proyecto.

## Preguntas

Si tienes preguntas, abre un issue o contacta al equipo de desarrollo.

¡Gracias por contribuir! 🎭
