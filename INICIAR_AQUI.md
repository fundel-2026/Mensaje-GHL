# 🚀 Iniciar la Aplicación

## Opción 1: Click en el archivo (La más fácil) ⭐

1. Abre la carpeta: `C:\Users\FUNDEL\OneDrive\Documentos\Escritorio\Mensaje GHL`
2. **Haz doble click en:** `iniciar.bat`
3. Se abrirán dos ventanas de terminal automáticamente
4. **Espera 5 segundos** a que carguen ambos servidores
5. Abre tu navegador en: **http://localhost:5173**

¡Listo! Así de simple.

---

## Opción 2: Desde una terminal

```bash
cd "C:\Users\FUNDEL\OneDrive\Documentos\Escritorio\Mensaje GHL"
npm run dev
```

---

## ❌ Cómo DETENER

- Cierra las dos ventanas de terminal
- O presiona `Ctrl + C` en cada una

---

## 📱 Acceso a la app

Una vez que estén corriendo ambos servidores:

- **Frontend (lo que ves):** http://localhost:5173
- **Backend (API):** http://localhost:3000/api

---

## 🔧 Troubleshooting

**Si no abre las ventanas:**
- Verifica que npm esté instalado: `npm --version`
- Verifica que Node.js esté instalado: `node --version`

**Si dice puerto en uso:**
- Otro programa está usando el puerto 3000 o 5173
- Cierra otras aplicaciones

**Si el frontend no carga:**
- Espera 10 segundos y recarga la página (F5)
- Abre la consola (F12) y revisa errores

---

**¿Preguntas?** Cuéntame qué ves cuando ejecutas `iniciar.bat`
