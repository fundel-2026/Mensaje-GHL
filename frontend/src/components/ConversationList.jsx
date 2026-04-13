import { useEffect, useState } from 'react';
import { apiService } from '../services/api';

export default function ConversationList({ onSelectContact, selectedContactId }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadConversations();
    // Refresh conversations every 5 seconds
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await apiService.getConversations();
      const contactList = data.contacts || data.data || data || [];
      setConversations(contactList);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const name = `${conv.firstName || ''} ${conv.lastName || ''}`.toLowerCase();
    const phone = (conv.phone || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || phone.includes(search);
  });

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold mb-4">Mensajes SMS</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar contacto..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {loading && conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <div className="animate-spin text-2xl">⟳</div>
            <p className="mt-2">Cargando conversaciones...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'No se encontraron contactos' : 'Sin conversaciones'}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => onSelectContact(conv)}
                className={`p-3 rounded-lg cursor-pointer transition ${
                  selectedContactId === conv.id
                    ? 'bg-blue-100 border-l-4 border-blue-500'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {conv.firstName} {conv.lastName}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {conv.phone || 'Sin teléfono'}
                    </p>
                  </div>
                  {selectedContactId === conv.id && (
                    <div className="ml-2 text-blue-500">✓</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t p-3">
        <button
          onClick={loadConversations}
          className="w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium"
        >
          🔄 Actualizar
        </button>
      </div>
    </div>
  );
}
