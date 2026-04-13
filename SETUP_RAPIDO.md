# ⚡ Setup Rápido - 3 pasos

## Paso 1️⃣: Instalar dependencias

Abre terminal en esta carpeta y ejecuta:

```bash
npm run install:all
```

Espera a que termine (toma unos minutos).

---

## Paso 2️⃣: Ejecutar la app

```bash
npm run dev
```

Verás algo como:

```
🚀 Backend server running on port 3000
⚠️  MODO DEMOSTRACIÓN ACTIVO
📊 Usando datos de prueba
```

---

## Paso 3️⃣: Abre tu navegador

Ve a: **http://localhost:5173**

¡Listo! Deberías ver la interfaz con contactos y mensajes de prueba. 🎉

---

## 📱 Funciones disponibles ahora:

- ✅ Ver lista de contactos (datos de prueba)
- ✅ Ver historial de mensajes
- ✅ Enviar mensajes de texto (en modo demo)
- ✅ Enviar imágenes
- ✅ Grabar audios
- ✅ Crear respuestas rápidas

---

## 🔌 Conectar con Go High Level (después)

Cuando tengas tus credenciales de GHL:

1. Abre el archivo `.env`
2. Descomenta y rellena:
```env
GHL_API_KEY=tu_api_key_aqui
GHL_LOCATION_ID=tu_location_id_aqui
```

3. Reinicia `npm run dev`

¡Eso es todo! Ahora usará tus datos reales de GHL.

---

## ❌ Errores comunes

**Error: npm not found**
- Instala Node.js desde https://nodejs.org/

**Puerto 3000 o 5173 en uso**
- Cierra otras aplicaciones que usen esos puertos
- O cambia PORT en `.env`

**No carga la página**
- Abre la consola (F12)
- Busca errores rojos
- Verifica que ambos servidores estén corriendo

---

## 📞 ¿Necesitas ayuda?

Verifica que:
- [ ] Node.js está instalado (`node --version`)
- [ ] npm está instalado (`npm --version`)
- [ ] Ejecutaste `npm run install:all`
- [ ] Ejecutaste `npm run dev` en la carpeta correcta
- [ ] No hay otros procesos en puertos 3000 y 5173
