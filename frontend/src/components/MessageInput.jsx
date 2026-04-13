import { useState, useRef } from 'react';
import AudioRecorder from './AudioRecorder';
import ImageUpload from './ImageUpload';
import QuickReplies from './QuickReplies';
import { apiService } from '../services/api';

export default function MessageInput({ contactId, onMessageSent }) {
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState('text'); // 'text', 'audio', 'image'
  const [sending, setSending] = useState(false);
  const textInputRef = useRef(null);

  const handleSendText = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setSending(true);
      await apiService.sendTextMessage(contactId, message);
      setMessage('');
      onMessageSent();
      textInputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error al enviar mensaje');
    } finally {
      setSending(false);
    }
  };

  const handleSendImage = async (file, caption) => {
    try {
      setSending(true);
      const messageBody = caption || '(Imagen compartida)';
      // First send the media
      await apiService.sendMediaMessage(contactId, file, messageBody);
      setMode('text');
      onMessageSent();
    } catch (error) {
      console.error('Error sending image:', error);
      alert('Error al enviar imagen');
    } finally {
      setSending(false);
    }
  };

  const handleSendAudio = async (file) => {
    try {
      setSending(true);
      await apiService.sendMediaMessage(contactId, file, '(Audio)');
      setMode('text');
      onMessageSent();
    } catch (error) {
      console.error('Error sending audio:', error);
      alert('Error al enviar audio');
    } finally {
      setSending(false);
    }
  };

  const handleQuickReplySelect = (reply) => {
    setMessage(reply);
    textInputRef.current?.focus();
  };

  if (mode === 'audio') {
    return (
      <AudioRecorder
        onAudioReady={handleSendAudio}
        onCancel={() => setMode('text')}
      />
    );
  }

  if (mode === 'image') {
    return (
      <ImageUpload
        onImageReady={handleSendImage}
        onCancel={() => setMode('text')}
      />
    );
  }

  return (
    <div className="border-t bg-white p-4">
      <form onSubmit={handleSendText} className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <input
            ref={textInputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={sending}
          />
        </div>

        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() => setMode('image')}
            className="p-2 text-lg hover:bg-gray-100 rounded-lg transition"
            title="Enviar imagen"
            disabled={sending}
          >
            📷
          </button>

          <button
            type="button"
            onClick={() => setMode('audio')}
            className="p-2 text-lg hover:bg-gray-100 rounded-lg transition"
            title="Grabar audio"
            disabled={sending}
          >
            🎤
          </button>

          <QuickReplies
            onSelectReply={handleQuickReplySelect}
            contactId={contactId}
          />

          <button
            type="submit"
            disabled={!message.trim() || sending}
            className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-full transition font-bold"
            title="Enviar mensaje"
          >
            ➤
          </button>
        </div>
      </form>
    </div>
  );
}
