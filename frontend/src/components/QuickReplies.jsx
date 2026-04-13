import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export default function QuickReplies({ onSelectReply, contactId }) {
  const [replies, setReplies] = useState([]);
  const [showManager, setShowManager] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReplies();
  }, []);

  const loadReplies = async () => {
    try {
      setLoading(true);
      const data = await apiService.getQuickReplies();
      setReplies(data);
    } catch (error) {
      console.error('Error loading quick replies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.message) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await apiService.updateQuickReply(editingId, formData.title, formData.message);
      } else {
        await apiService.createQuickReply(formData.title, formData.message);
      }
      loadReplies();
      setFormData({ title: '', message: '' });
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error saving quick reply:', error);
      alert('Error al guardar respuesta rápida');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (reply) => {
    setFormData({ title: reply.title, message: reply.message });
    setEditingId(reply.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta respuesta rápida?')) {
      try {
        setLoading(true);
        await apiService.deleteQuickReply(id);
        loadReplies();
      } catch (error) {
        console.error('Error deleting quick reply:', error);
        alert('Error al eliminar respuesta rápida');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {/* Quick Replies Button */}
      <button
        onClick={() => setShowManager(!showManager)}
        className="p-2 text-lg hover:bg-gray-100 rounded-lg transition"
        title="Respuestas rápidas"
      >
        ⚡
      </button>

      {/* Quick Replies Dropdown */}
      {showManager && (
        <div className="absolute bottom-16 right-4 w-72 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-semibold">Respuestas Rápidas</h3>
            <button
              onClick={() => setShowManager(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {showForm ? (
            <div className="p-3 border-b space-y-2">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Mensaje"
                rows="3"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded py-1 text-sm font-medium disabled:bg-gray-400"
                >
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ title: '', message: '' });
                    setEditingId(null);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 rounded py-1 text-sm font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="p-3">
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded py-2 text-sm font-medium"
                >
                  + Nueva Respuesta
                </button>
              </div>

              {loading ? (
                <div className="p-3 text-center text-gray-500">Cargando...</div>
              ) : replies.length === 0 ? (
                <div className="p-3 text-center text-gray-500 text-sm">
                  No hay respuestas rápidas aún
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto space-y-1 p-2">
                  {replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="p-2 hover:bg-gray-100 rounded border border-gray-200 cursor-pointer group"
                    >
                      <div
                        onClick={() => {
                          onSelectReply(reply.message);
                          setShowManager(false);
                        }}
                        className="text-sm"
                      >
                        <div className="font-medium text-gray-900">{reply.title}</div>
                        <div className="text-xs text-gray-600 truncate">
                          {reply.message}
                        </div>
                      </div>
                      <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleEdit(reply)}
                          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded px-2 py-1 text-xs"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(reply.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded px-2 py-1 text-xs"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
