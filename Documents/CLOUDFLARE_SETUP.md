# ☁️ Cloudflare Setup Guide — MejoraContactos

## ¿Por qué Cloudflare?

- **CDN global:** Assets servidos desde el edge más cercano al usuario (~50ms vs ~600ms)
- **SSL automático:** HTTPS sin configurar
- **DDoS protection:** Protección contra ataques
- **Cache inteligente:** JS/CSS/images cacheados en el edge
- **Gratis:** El plan free de Cloudflare es suficiente

## Pasos

### 1. Crear cuenta Cloudflare
Ir a [dash.cloudflare.com](https://dash.cloudflare.com) y registrarse.

### 2. Agregar dominio
- Click "Add a Site" → ingresar `mejoraok.com`
- Seleccionar plan Free

### 3. Configurar DNS
Cloudflare escaneará los DNS existentes. Verificar que estén correctos:
- `util.mejoraok.com` → IP de Hostinger (185.212.70.250)
- `mejoraok.com` → IP de Hostinger

### 4. Cambiar nameservers en Hostinger
Ir a Hostinger → DNS → cambiar nameservers a los que Cloudflare indica:
```
ns1.cloudflare.com
ns2.cloudflare.com
```
**⚠️ Esto puede tardar hasta 48h en propagarse (usualmente <1h).**

### 5. Configurar reglas de cache
En Cloudflare Dashboard → Rules → Page Rules:
- `util.mejoracontactos/assets/*` → Cache Level: Cache Everything, Edge Cache TTL: 1 month
- `util.mejoracontactos/*.js` → Cache Level: Cache Everything
- `util.mejoracontactos/*.css` → Cache Level: Cache Everything

### 6. Habilitar Auto Minify
En Cloudflare Dashboard → Speed → Optimization:
- ✅ Auto Minify JavaScript
- ✅ Auto Minify CSS
- ✅ Auto Minify HTML
- ✅ Brotli compression

### 7. Verificar
```bash
# Debería mostrar headers de Cloudflare
curl -sI https://util.mejoraok.com/mejoracontactos/ | grep -i "cf-"

# Verificar cache HIT
curl -sI https://util.mejoraok.com/mejoracontactos/assets/index-*.js | grep -i "cf-cache-status"
# Debería mostrar: cf-cache-status: HIT
```

## Impacto esperado

| Métrica | Antes | Después |
|---------|-------|---------|
| TTFB (Time to First Byte) | ~600ms | ~50-100ms |
| Page Load (repeat visit) | ~3s | ~1s |
| SSL | Manual | Automático |
| DDoS protection | ❌ | ✅ |
| CDN | ❌ | Global (200+ cities) |

## Notas

- Los Edge Functions de Supabase NO pasan por Cloudflare (van directo a Supabase)
- El rate limiting de la Edge Function sigue funcionando igual
- Si se usa Cloudflare proxy (nube naranja), verificar que Hostinger no bloquee IPs de Cloudflare
