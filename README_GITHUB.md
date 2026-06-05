# 🎭 TELÓN Platform - Plataforma para Artistas y Promotores

**Conecta artistas con promotores. Descubre talento. Crea eventos.**

TELÓN es una plataforma web moderna que permite a artistas mostrar su trabajo y a promotores descubrir talento para sus eventos. Con integración de pagos Stripe, autenticación OAuth, y un diseño cyber-minimalist cautivador.

## ✨ Características Principales

### Para Artistas

- 🎨 **Perfil Personalizado**: Crea tu perfil con fotos, videos y descripción
- 📅 **Publicar Eventos**: Anuncia tus presentaciones de forma frictionless
- 💳 **Planes Flexibles**: Free, Estándar (6€/mes) o Premium (9,99€/mes)
- 🌟 **Destacado VIP**: Plan Premium incluye posición destacada en Home
- 🎬 **Galería Multimedia**: Sube fotos y videos según tu plan

### Para Promotores

- 🔍 **Descubrir Talento**: Busca artistas por disciplina, ubicación o fecha
- 📊 **Directorio Completo**: Accede a perfiles públicos de artistas
- 🎪 **Catálogo de Eventos**: Explora eventos próximos
- 💬 **Contacto Directo**: Conecta con artistas interesantes

### Plataforma

- 🔐 **Autenticación Segura**: OAuth integrado con Manus
- 💰 **Pagos Seguros**: Stripe integrado para suscripciones
- 📱 **Responsive Design**: Funciona perfectamente en móvil, tablet y desktop
- ⚡ **Performance**: Optimizado con Vite, React 19 y tRPC
- 🌙 **Dark Mode**: Interfaz cyber-minimalist moderna

## 🚀 Stack Tecnológico

### Frontend
- **React 19** - UI library moderna
- **Tailwind CSS 4** - Styling utility-first
- **shadcn/ui** - Componentes accesibles
- **Vite** - Build tool ultrarrápido
- **Framer Motion** - Animaciones suaves

### Backend
- **Express 4** - Servidor HTTP
- **tRPC 11** - Type-safe API
- **Drizzle ORM** - Database queries type-safe
- **Zod** - Validación de datos

### Infraestructura
- **MySQL/TiDB** - Base de datos
- **S3 (Manus)** - Almacenamiento de archivos
- **Stripe** - Procesamiento de pagos
- **Manus OAuth** - Autenticación

## 📋 Requisitos Previos

- Node.js 20.x o superior
- pnpm 10.4.1 o superior
- Git

## 🔧 Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/dgr198213-ui/Tel-n-.git
cd Tel-n-

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

El servidor estará disponible en `http://localhost:5173` (frontend) y `http://localhost:3000` (backend).

## 📁 Estructura del Proyecto

```
telon-platform/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Páginas principales
│   │   │   ├── Home.tsx      # Landing page
│   │   │   ├── Artistas.tsx  # Directorio de artistas
│   │   │   ├── Eventos.tsx   # Directorio de eventos
│   │   │   ├── ArtistaPublico.tsx  # Perfil público
│   │   │   ├── PerfilArtista.tsx   # Editor de perfil
│   │   │   ├── PublicarEvento.tsx  # Formulario de eventos
│   │   │   └── Suscripcion.tsx     # Planes de pago
│   │   ├── components/       # Componentes reutilizables
│   │   ├── contexts/         # React contexts
│   │   └── lib/              # Utilidades
│   └── public/               # Archivos estáticos
├── server/                   # Backend Express + tRPC
│   ├── routers.ts           # tRPC procedures
│   ├── db.ts                # Database helpers
│   ├── stripe.ts            # Stripe integration
│   └── _core/               # Framework core
├── drizzle/                 # Database schema
│   ├── schema.ts            # Tablas y tipos
│   └── migrations/          # SQL migrations
├── shared/                  # Código compartido
└── tests/                   # Tests unitarios

```

## 🎯 Rutas Principales

| Ruta | Descripción |
|------|-------------|
| `/` | Home - Landing page con búsqueda bifuncional |
| `/artistas` | Directorio de artistas |
| `/artistas/:slug` | Perfil público de artista |
| `/eventos` | Directorio de eventos |
| `/eventos/:id` | Detalle de evento |
| `/eventos/publicar` | Formulario frictionless de publicación |
| `/perfil` | Editor de perfil (autenticado) |
| `/suscripcion` | Página de planes y checkout |

## 💳 Integración Stripe

### Test Mode

```bash
# Tarjeta de prueba
Número: 4242 4242 4242 4242
Fecha: Cualquier futura (ej: 12/25)
CVC: Cualquier 3 dígitos
```

### Productos Disponibles

- **Free**: 0€ - 1 foto, sin videos
- **Estándar**: 6€/mes - 3 fotos, 1 video
- **Premium**: 9,99€/mes - 3 fotos, 3 videos, destacado VIP

## 🧪 Testing

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar tests en modo watch
pnpm test:watch

# Ver cobertura
pnpm test:coverage
```

**Cobertura Actual**: 23 tests pasando ✓

## 📚 Documentación

- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Guía para contribuidores
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guía de despliegue
- **[README.md](./README.md)** - Documentación técnica del template

## 🎨 Diseño Visual

### Paleta de Colores

- **Azul Eléctrico**: `#adc6ff` - Acento principal
- **Naranja Cálido**: `#ffb786` - Acento secundario
- **Gris Técnico**: `#1a1a1a` - Fondo oscuro
- **Blanco Puro**: `#ffffff` - Texto principal

### Tipografía

- **Inter**: Contenido general (sans-serif)
- **JetBrains Mono**: Datos técnicos (monospace)

### Animaciones

- **Fade In**: Entrada de elementos
- **Slide Up**: Transiciones verticales
- **Pulse Glow**: Efecto de brillo
- **Hover Lift**: Elevación al pasar mouse

## 🔐 Seguridad

- ✅ Secrets no están en el código
- ✅ HTTPS habilitado (Manus por defecto)
- ✅ CORS configurado correctamente
- ✅ Validación de entrada con Zod
- ✅ Stripe webhook signature verificada
- ✅ OAuth token validado

## 📊 Estadísticas del Proyecto

- **Páginas**: 9 rutas principales
- **Componentes**: 50+ componentes React
- **Tablas BD**: 3 (artistas, eventos, suscripciones)
- **tRPC Routers**: 5 (artista, evento, stripe, auth, system)
- **Tests**: 23 tests unitarios e integración
- **Líneas de Código**: ~5000+ líneas

## 🚀 Despliegue

### En Manus (Recomendado)

1. Crea un checkpoint en Manus
2. Haz clic en **Publish**
3. Configura tu dominio personalizado
4. ¡Listo! Tu plataforma está en vivo

### Configuración Requerida

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# OAuth (Auto-configurado)
VITE_APP_ID=...
OAUTH_SERVER_URL=...

# Base de Datos (Auto-configurado)
DATABASE_URL=mysql://...
JWT_SECRET=...
```

## 🐛 Reportar Bugs

Crea un issue en GitHub con:
- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots si es relevante

## 💡 Solicitar Features

Crea un issue con:
- Descripción de la feature
- Caso de uso
- Mockups si es UI

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Lee [CONTRIBUTING.md](./CONTRIBUTING.md) para detalles.

### Proceso Rápido

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo licencia MIT. Ver [LICENSE](./LICENSE) para detalles.

## 👥 Equipo

- **Desarrollador Principal**: TELÓN Platform Team
- **Diseño**: Cyber-minimalist aesthetic
- **Infraestructura**: Manus Platform

## 🙏 Agradecimientos

- [React](https://react.dev) - UI library
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com) - Componentes
- [tRPC](https://trpc.io) - Type-safe API
- [Stripe](https://stripe.com) - Pagos
- [Manus](https://manus.im) - Hosting

## 📞 Soporte

¿Preguntas o problemas?

- 📧 Email: support@telon.dev
- 🐛 Issues: [GitHub Issues](https://github.com/dgr198213-ui/Tel-n-/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/dgr198213-ui/Tel-n-/discussions)

---

**Hecho con ❤️ para artistas y promotores. Conectando talento desde 2026.**

🎭 **TELÓN - Where Art Meets Opportunity**
