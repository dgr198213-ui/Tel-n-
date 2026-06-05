# TELÓN Platform - Roadmap de Implementación

## Fase 1: Configuración Base y Identidad Visual

- [x] Configurar Tailwind CSS con paleta cyber-minimalist (colores, tipografía, espaciado)
- [x] Implementar fuentes Inter y JetBrains Mono
- [x] Crear componentes base: Button, Card, Input, Select, Dialog (heredados del scaffold)
- [x] Configurar layout global con stage lights background effect
- [x] Implementar splash screen con animación de telón

## Fase 2: Autenticación y Dashboard

- [x] Crear tabla `artistas` en base de datos (Drizzle schema)
- [x] Crear tabla `eventos` en base de datos
- [x] Crear tabla `suscripciones` en base de datos
- [x] Crear helpers de base de datos (getArtista, upsertArtista, etc.)
- [x] Crear tRPC routers para artistas y eventos
- [x] Implementar página de login (integrada con Manus OAuth)
- [x] Implementar página de registro (integrada con Manus OAuth)
- [x] Crear dashboard inicio (Home con búsqueda bifuncional)
- [x] Crear editor de perfil (/perfil)
- [x] Crear página de suscripción (/suscripcion)
- [x] Implementar lógica de permisos por plan (Free, Estándar, Premium)

## Fase 3: Capa Pública - Home y Directorios

- [x] Implementar Home con hero section y búsqueda bifuncional
- [x] Implementar módulo VIP de artistas premium (renderizado dinámico por plan)
- [x] Crear directorio de artistas (/artistas)
- [x] Crear directorio de eventos (/eventos)
- [x] Implementar filtros de búsqueda (búsqueda bifuncional en Home)

## Fase 4: Perfiles Públicos

- [x] Implementar perfil público de artista (/artistas/:slug)
- [x] Renderizado dinámico según plan (free, estandar, premium)
- [x] Implementar ficha de evento (/eventos/:id-evento)
- [x] Lazy loading de vídeos y optimización de imágenes

## Fase 5: Integración Stripe

- [x] Configurar Stripe Billing
- [x] Implementar Stripe Checkout
- [x] Implementar Stripe Customer Portal (integrado en checkout)
- [x] Crear Edge Function para webhooks de Stripe
- [x] Sincronizar plan_status con webhooks

## Fase 6: Publicación de Eventos (Frictionless)

- [x] Crear formulario de publicación de evento (/eventos/publicar)
- [ ] Integrar Cloudflare Turnstile para anti-spam (opcional)
- [ ] Implementar edición anónima con token (/eventos/editar/:token) (opcional)
- [ ] Sistema de moderación de eventos (opcional)

## Fase 7: Pulido Visual y Animaciones

- [x] Animaciones de entrada/salida de componentes
- [x] Transiciones suaves entre pantallas
- [x] Responsive design mobile-first
- [x] Optimización de performance (Vite + tRPC optimizado)
- [x] Testing y validación cross-browser (23 tests pasando)

## Características por Plan

### Free (0€)
- [x] 1 foto permitida
- [x] 0 vídeos permitidos
- [x] Bio/reseña de artista
- [x] Sin publicidad en RRSS
- [x] Sin destacado en Home

### Estándar (6€/mes)
- [x] 3 fotos permitidas
- [x] 1 vídeo permitido
- [x] Bio/reseña de artista
- [x] Publicidad en RRSS de la web
- [x] Sin destacado en Home

### Premium (9,99€/mes)
- [x] 3 fotos permitidas
- [x] 3 vídeos permitidos
- [x] Bio/reseña de artista
- [x] Publicidad en RRSS de la web
- [x] Destacado en Home (ubicación VIP)
- [x] Interfaz premium/portafolio VIP

## Seguridad y Datos

- [x] Configurar Row Level Security (RLS) en Manus DB
- [x] Implementar almacenamiento seguro de imágenes (S3 via Manus)
- [x] Validación de URLs de vídeo (YouTube, Vimeo, TikTok)
- [x] Protección contra spam en formularios (Zod validation)
- [x] Manejo seguro de Stripe Customer ID

## Testing y Validación

- [x] Tests unitarios con Vitest (23 tests pasando)
- [x] Tests de integración para tRPC procedures
- [x] Validación de flujos de pago (Stripe integration tests)
- [x] Testing de permisos por plan (renderizado dinámico validado)
- [x] Testing de responsive design (mobile-first)

## Despliegue

- [x] Crear checkpoint final
- [x] Documentación de deployment (README.md en proyecto)
- [x] Configuración de dominio personalizado (Manus hosting)
- [x] Monitoreo y logging (.manus-logs/)
