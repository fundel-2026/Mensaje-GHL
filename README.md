# Plataforma SMS de Go High Level

Una aplicación web moderna para responder SMS desde Go High Level CRM. Permite enviar textos, imágenes, audios grabados y utilizar respuestas rápidas preconfiguradas.

## 🚀 Características

- **📱 Visualizar conversaciones** - Lista de todos tus contactos con SMS
- **💬 Responder SMS** - Enviar mensajes de texto
- **📷 Enviar imágenes** - Compartir fotos en las conversaciones
- **🎤 Grabar audios** - Enviar mensajes de voz directamente
- **⚡ Respuestas rápidas** - Guardar y usar plantillas de mensajes frecuentes
- **🔄 Sincronización automática** - Los mensajes se actualizan en tiempo real

## 📋 Requisitos

- Node.js v16 o superior
- npm o yarn
- Credenciales de Go High Level API (API Key y Location ID)

## ⚙️ Instalación

### 1. Clonar y configurar

```bash
cd "Mensaje GHL"
npm run install:all
```

### 2. Configurar variables de entorno

Copiar `.env.example` a `.env`:

```bash
cp .env.example .env
```

Editar `.env` y agregar tus credenciales:

```env
GHL_API_KEY=tu_api_key_aqui
GHL_LOCATION_ID=tu_location_id_aqui
GHL_API_BASE=https://api.gohighlevel.com/v1
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### 3. Ejecutar la aplicación

```bash
npm run dev
```

Esto iniciará:
- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173

## 📁 Estructura del Proyecto

```
.
├── backend/                    # Servidor Express
│   ├── server.js              # Servidor principal
│   ├── routes/
│   │   ├── conversations.js   # API de conversaciones
│   │   ├── messages.js        # API de mensajes
│   │   └── quickReplies.js    # API de respuestas rápidas
│   ├── services/
│   │   └── ghlService.js      # Wrapper de GHL API
│   └── quickReplies.json      # Almacén de respuestas rápidas
├── frontend/                   # Aplicación React
│   ├── src/
│   │   ├── App.jsx            # Componente principal
│   │   ├── components/        # Componentes de la UI
│   │   ├── services/          # Servicios API
│   │   └── index.css          # Estilos globales
│   └── index.html             # HTML raíz
├── package.json               # Dependencias raíz
└── .env                        # Variables de entorno
```

## 🔌 API Endpoints

### Conversaciones
- `GET /api/conversations` - Listar todas las conversaciones
- `GET /api/conversations/:contactId` - Detalles de un contacto

### Mensajes
- `GET /api/messages/:contactId` - Obtener historial de mensajes
- `POST /api/messages/send-text` - Enviar mensaje de texto
- `POST /api/messages/send-media` - Enviar imagen o audio

### Respuestas Rápidas
- `GET /api/quick-replies` - Listar todas las respuestas rápidas
- `POST /api/quick-replies` - Crear nueva respuesta rápida
- `PUT /api/quick-replies/:id` - Actualizar respuesta rápida
- `DELETE /api/quick-replies/:id` - Eliminar respuesta rápida

## 🎯 Cómo usar

### Responder un mensaje

1. Selecciona un contacto en la lista izquierda
2. Escribe tu respuesta en el campo de texto
3. Presiona Enter o haz clic en el botón Enviar

### Enviar una imagen

1. Haz clic en el botón 📷
2. Selecciona la imagen desde tu computadora
3. Agrega un comentario (opcional)
4. Haz clic en "Enviar"

### Grabar un audio

1. Haz clic en el botón 🎤
2. Permite el acceso al micrófono cuando se solicite
3. Haz clic en "Grabar Audio" para comenzar
4. Detén la grabación cuando termines
5. Revisa el audio y haz clic en "Enviar"

### Usar respuestas rápidas

1. Haz clic en el botón ⚡
2. Selecciona una respuesta de la lista, o crea una nueva
3. La respuesta se insertará en el campo de texto
4. Edita si es necesario y envía

## 🔐 Seguridad

- Nunca compartas tu archivo `.env` ni tus credenciales de API
- Las credenciales se almacenan solo en el backend
- El frontend accede a través de endpoints seguros

## 📝 Notas

- Los mensajes se sincronizan automáticamente cada 3 segundos
- Las conversaciones se actualizan cada 5 segundos
- Los audios se graban en formato WebM
- Las imágenes se comprimen automáticamente antes de enviarse

## 🐛 Solución de problemas

### No puedo conectarme a Go High Level
- Verifica que tu API Key sea válida
- Confirma que el Location ID sea correcto
- Asegúrate de que tu cuenta de GHL tenga permisos de API

### El micrófono no funciona
- Verifica los permisos de acceso a micrófono en tu navegador
- Recarga la página e intenta nuevamente
- Asegúrate de que otro programa no esté usando el micrófono

### Las imágenes no se envían
- Verifica que el archivo sea una imagen válida
- El tamaño máximo es de 50MB
- Intenta con un archivo diferente

## 📞 Soporte

Para reportar problemas, abre un issue en el repositorio.

## 📄 Licencia

MIT
