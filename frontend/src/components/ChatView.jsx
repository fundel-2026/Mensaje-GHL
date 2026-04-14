import { useEffect, useRef, useState } from 'react';
import { apiService } from '../services/api';
import MessageInput from './MessageInput';

export default function ChatView({ contactId, contact, onRefresh }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (contactId) {
      loadMessages();
      // Refresh messages every 3 seconds
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [contactId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      // First try to load from localStorage
      const storageKey = `messages_${contactId}`;
      const storedMessages = localStorage.getItem(storageKey);

      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
        return;
      }

      // Fallback to API
      const data = await apiService.getMessages(contactId);
      const messageList = data.data || data.messages || data || [];
      setMessages(messageList);
      // Save to localStorage
      localStorage.setItem(storageKey, JSON.stringify(messageList));
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  if (!contactId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">💬</div>
          <p className="text-gray-500">Selecciona una conversación para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4 flex justify-between items-center">
        <div>
          <h2 className="font-bold text-lg">
            {contact?.firstName || 'Contacto'} {contact?.lastName || ''}
          </h2>
          <p className="text-sm text-gray-500">{contact?.phone || ''}</p>
        </div>
        <button
          onClick={onRefresh}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          title="Refrescar"
        >
          🔄
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide bg-gray-50 p-4 space-y-4">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">Cargando mensajes...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center text-gray-500">
              <p>Inicia una conversación</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
              const prevMsg = idx > 0 ? messages[idx - 1] : null;
              const showDate =
                !prevMsg ||
                formatDate(msg.dateAdded || msg.createdAt) !==
                  formatDate(prevMsg.dateAdded || prevMsg.createdAt);

              return (
                <div key={msg.id || idx}>
                  {showDate && (
                    <div className="text-center text-xs text-gray-500 my-2">
                      {formatDate(msg.dateAdded || msg.createdAt)}
                    </div>
                  )}
                  <div
                    className={`flex ${
                      msg.direction === 'outbound' || msg.type === 'sent'
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`message-bubble ${
                        msg.direction === 'outbound' || msg.type === 'sent'
                          ? 'message-sent'
                          : 'message-received'
                      }`}
                    >
                      {msg.body && (
                        <p className="text-sm">{msg.body}</p>
                      )}

                      {/* Image */}
                      {msg.attachments?.length > 0 &&
                        msg.attachments[0].type === 'image' && (
                          <img
                            src={msg.attachments[0].url}
                            alt="Message image"
                            className="message-image"
                          />
                        )}

                      {/* Audio */}
                      {msg.attachments?.length > 0 &&
                        msg.attachments[0].type === 'audio' && (
                          <audio
                            src={msg.attachments[0].url}
                            controls
                            className="message-audio max-w-xs"
                          />
                        )}

                      <p className="text-xs opacity-70 mt-1">
                        {formatTime(msg.dateAdded || msg.createdAt || msg.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <MessageInput
        contactId={contactId}
        onMessageSent={() => {
          // Add message to UI immediately, then load from server
          loadMessages();
        }}
        onNewMessage={(newMessage) => {
          // Optimistic update: show message immediately
          setMessages(prev => [...prev, newMessage]);
        }}
      />
    </div>
  );
}
