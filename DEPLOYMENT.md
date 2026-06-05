# Guía de Despliegue - TELÓN Platform

## Despliegue en Manus

TELÓN Platform está optimizado para despliegue en Manus. Sigue estos pasos:

### 1. Preparación Previa

```bash
# Asegurate de que todos los tests pasen
pnpm test

# Verifica que no hay errores de TypeScript
pnpm check

# Build local para validar
pnpm build
```

### 2. Configurar Secrets

En la UI de Manus, ve a **Settings → Secrets** y configura:

```env
# Stripe (Obligatorio para pagos)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# OAuth (Ya configurado por Manus)
VITE_APP_ID=...
OAUTH_SERVER_URL=...

# Base de Datos (Ya configurado por Manus)
DATABASE_URL=mysql://...
JWT_SECRET=...

# Almacenamiento (Ya configurado por Manus)
BUILT_IN_FORGE_API_URL=...
BUILT_IN_FORGE_API_KEY=...
```

### 3. Configurar Dominio

En **Settings → Domains**:
- Usa el dominio auto-generado (xxx.manus.space) o
- Compra un dominio personalizado directamente en Manus

### 4. Publicar

1. Crea un checkpoint en Manus
2. Haz clic en el botón **Publish** en la UI
3. Espera a que se complete el despliegue

### 5. Verificar Despliegue

```bash
# Accede a tu URL publicada
https://tu-dominio.manus.space

# Verifica que:
- La splash screen carga correctamente
- El Home es accesible
- Los directorios funcionan
- Stripe checkout funciona en test mode
```

## Configuración de Stripe

### Test Mode (Sandbox)

1. Reclama tu sandbox en: https://dashboard.stripe.com/claim_sandbox/
2. Usa la tarjeta de prueba: `4242 4242 4242 4242`
3. Fecha: cualquier futura
4. CVC: cualquier 3 dígitos

### Production Mode

1. Completa verificación KYC en Stripe Dashboard
2. Obtén tus claves de producción
3. Actualiza los secrets en Manus Settings
4. Redeploy la aplicación

## Monitoreo

### Logs

Accede a los logs en:
- `.manus-logs/devserver.log` - Logs del servidor
- `.manus-logs/browserConsole.log` - Logs del cliente
- `.manus-logs/networkRequests.log` - Requests HTTP

### Métricas

En **Dashboard** de Manus:
- Visualiza UV/PV (unique/page views)
- Monitorea uptime
- Revisa errores

## Troubleshooting

### Error: "Cannot apply unknown utility class 'dark'"

Este es un error de Tailwind CSS que no afecta la funcionalidad. Puede ignorarse en desarrollo.

### Error: "Stripe API key not found"

Verifica que `STRIPE_SECRET_KEY` esté configurado en Settings → Secrets.

### Error: "Database connection failed"

Asegúrate de que `DATABASE_URL` esté correctamente configurado.

### Error: "OAuth callback failed"

Verifica que:
- `VITE_APP_ID` es correcto
- `OAUTH_SERVER_URL` es accesible
- El dominio está registrado en Manus OAuth

## Rollback

Si algo sale mal después del despliegue:

1. En Manus Dashboard, ve a **Version History**
2. Selecciona el checkpoint anterior
3. Haz clic en **Rollback**

## Performance

### Optimizaciones Implementadas

- ✅ Vite para bundling rápido
- ✅ React 19 con suspense
- ✅ tRPC con caché automático
- ✅ Tailwind CSS purged
- ✅ Lazy loading de componentes

### Monitoreo de Performance

```bash
# Analizar bundle size
pnpm build

# Ejecutar lighthouse
# (Usa Chrome DevTools)
```

## Seguridad

### Checklist de Seguridad

- ✅ Secrets no están en el código
- ✅ HTTPS habilitado (Manus por defecto)
- ✅ CORS configurado correctamente
- ✅ Validación de entrada con Zod
- ✅ Stripe webhook signature verificada
- ✅ OAuth token validado

### Secrets Management

Nunca commits:
- `.env` files
- API keys
- Tokens de acceso
- Credenciales de BD

## Backup y Recuperación

### Backup Automático

Manus realiza backups automáticos. Para acceder:

1. Ve a **Settings → Backups**
2. Descarga el backup más reciente
3. Restaura si es necesario

### Recuperación de BD

Si necesitas restaurar datos:

```bash
# Contacta al soporte de Manus
# O usa el backup descargado
```

## Escalabilidad

TELÓN Platform está diseñado para escalar:

- **BD**: MySQL/TiDB soporta millones de registros
- **Almacenamiento**: S3 via Manus es ilimitado
- **Compute**: Manus auto-escala según demanda
- **API**: tRPC con caché distribuido

## Soporte

Para problemas de despliegue:

1. Revisa los logs en `.manus-logs/`
2. Consulta la documentación de Manus
3. Abre un issue en GitHub
4. Contacta al soporte de Manus

## Próximos Pasos

- [ ] Configurar dominio personalizado
- [ ] Reclamar Stripe sandbox
- [ ] Configurar monitoreo
- [ ] Establecer alertas
- [ ] Documentar runbooks operacionales
