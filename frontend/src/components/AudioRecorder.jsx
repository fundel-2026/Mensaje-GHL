import { useState, useRef } from 'react';

export default function AudioRecorder({ onAudioReady, onCancel }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const durationIntervalRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setRecordedBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      durationIntervalRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('No se pudo acceder al micrófono');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      clearInterval(durationIntervalRef.current);
    }
  };

  const handleSend = () => {
    if (recordedBlob) {
      const file = new File([recordedBlob], `audio-${Date.now()}.webm`, {
        type: 'audio/webm'
      });
      onAudioReady(file);
      handleCancel();
    }
  };

  const handleCancel = () => {
    setRecordedBlob(null);
    setDuration(0);
    setIsRecording(false);
    onCancel();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="border-t bg-white p-4">
      {!recordedBlob ? (
        <div className="flex items-center gap-3">
          {!isRecording ? (
            <>
              <button
                onClick={startRecording}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 font-medium"
              >
                🎤 Grabar Audio
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </>
          ) : (
            <>
              <div className="flex-1 flex items-center gap-3">
                <div className="animate-pulse w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-500 font-medium">{formatTime(duration)}</span>
              </div>
              <button
                onClick={stopRecording}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg font-medium"
              >
                Detener
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <audio
              src={URL.createObjectURL(recordedBlob)}
              controls
              className="w-full"
            />
          </div>
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
          >
            Enviar
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
