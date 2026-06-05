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
- [ ] Implementar página de login (/auth/login)
- [ ] Implementar página de registro (/auth/registro)
- [ ] Crear dashboard inicio (/dashboard)
- [ ] Crear editor de perfil (/dashboard/perfil)
- [ ] Crear página de suscripción (/dashboard/suscripcion)
- [ ] Implementar lógica de permisos por plan (Free, Estándar, Premium)

## Fase 3: Capa Pública - Home y Directorios

- [ ] Implementar Home con hero section y búsqueda bifuncional
- [ ] Implementar módulo VIP de artistas premium
- [ ] Crear directorio de artistas (/artistas)
- [ ] Crear directorio de eventos (/eventos)
- [ ] Implementar filtros de búsqueda (ubicación, fecha, disciplina)

## Fase 4: Perfiles Públicos

- [ ] Implementar perfil público de artista (/artistas/:slug)
- [ ] Renderizado dinámico según plan (free, estandar, premium)
- [ ] Implementar ficha de evento (/eventos/:id-evento)
- [ ] Lazy loading de vídeos y optimización de imágenes

## Fase 5: Integración Stripe

- [ ] Configurar Stripe Billing
- [ ] Implementar Stripe Checkout
- [ ] Implementar Stripe Customer Portal
- [ ] Crear Edge Function para webhooks de Stripe
- [ ] Sincronizar plan_status con webhooks

## Fase 6: Publicación de Eventos (Frictionless)

- [ ] Crear formulario de publicación de evento (/eventos/publicar)
- [ ] Integrar Cloudflare Turnstile para anti-spam
- [ ] Implementar edición anónima con token (/eventos/editar/:token)
- [ ] Sistema de moderación de eventos

## Fase 7: Pulido Visual y Animaciones

- [ ] Animaciones de entrada/salida de componentes
- [ ] Transiciones suaves entre pantallas
- [ ] Responsive design mobile-first
- [ ] Optimización de performance
- [ ] Testing y validación cross-browser

## Características por Plan

### Free (0€)
- [ ] 1 foto permitida
- [ ] 0 vídeos permitidos
- [ ] Bio/reseña de artista
- [ ] Sin publicidad en RRSS
- [ ] Sin destacado en Home

### Estándar (6€/mes)
- [ ] 3 fotos permitidas
- [ ] 1 vídeo permitido
- [ ] Bio/reseña de artista
- [ ] Publicidad en RRSS de la web
- [ ] Sin destacado en Home

### Premium (9,99€/mes)
- [ ] 3 fotos permitidas
- [ ] 3 vídeos permitidos
- [ ] Bio/reseña de artista
- [ ] Publicidad en RRSS de la web
- [ ] Destacado en Home (ubicación VIP)
- [ ] Interfaz premium/portafolio VIP

## Seguridad y Datos

- [ ] Configurar Row Level Security (RLS) en Supabase
- [ ] Implementar almacenamiento seguro de imágenes
- [ ] Validación de URLs de vídeo (YouTube, Vimeo, TikTok)
- [ ] Protección contra spam en formularios
- [ ] Manejo seguro de Stripe Customer ID

## Testing y Validación

- [ ] Tests unitarios con Vitest
- [ ] Tests de integración para tRPC procedures
- [ ] Validación de flujos de pago
- [ ] Testing de permisos por plan
- [ ] Testing de responsive design

## Despliegue

- [ ] Crear checkpoint final
- [ ] Documentación de deployment
- [ ] Configuración de dominio personalizado
- [ ] Monitoreo y logging
