import { useState, useRef } from 'react';

export default function ImageUpload({ onImageReady, onCancel }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      alert('Por favor selecciona una imagen válida');
    }
  };

  const handleSend = () => {
    if (file) {
      onImageReady(file, caption);
      handleCancel();
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setFile(null);
    setCaption('');
    onCancel();
  };

  return (
    <div className="border-t bg-white p-4">
      {!preview ? (
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 font-medium"
          >
            📷 Seleccionar Imagen
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="max-w-xs mx-auto">
            <img
              src={preview}
              alt="Preview"
              className="w-full rounded-lg border border-gray-300"
            />
          </div>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Agregar comentario (opcional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
