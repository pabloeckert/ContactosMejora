

## Plan: Configurar Google Contacts OAuth

### Lo que ya está listo
- Edge Function `google-contacts-auth` desplegada con OAuth flow completo
- Componente `GoogleContactsPanel` en la UI
- Panel integrado en la pestaña Import

### Lo que falta
Agregar los 2 secrets de Google Cloud al proyecto:

1. **GOOGLE_CLIENT_ID** — El Client ID de tu app OAuth en Google Cloud Console
2. **GOOGLE_CLIENT_SECRET** — El Client Secret correspondiente

### Pasos de implementación
1. Usar la herramienta `add_secret` para solicitar `GOOGLE_CLIENT_ID`
2. Usar la herramienta `add_secret` para solicitar `GOOGLE_CLIENT_SECRET`
3. Re-desplegar la edge function `google-contacts-auth`
4. Verificar que el botón "Conectar Google Contacts" funcione

### Nota importante
En tu Google Cloud Console, asegurate de que la **Redirect URI** autorizada sea:
```
https://limpiacontactos.lovable.app
```
(o la URL de preview si estás probando)

