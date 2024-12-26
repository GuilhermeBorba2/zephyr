import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isOpen && iframeRef.current) {
      iframeRef.current.style.height = '500px';
    }
  }, [isOpen]);

  return (
    <>
      {/* Botão flutuante do chatbot */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        aria-label="Abrir chat"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Container do chatbot */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50">
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Assistente Virtual</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              aria-label="Fechar chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full h-[500px] overflow-hidden bg-white dark:bg-gray-800">
            <iframe
              ref={iframeRef}
              src="https://dash.superagentes.ai/agents/cm285669l01ws10iwlbrjzjd9/iframe"
              className="w-full h-full"
              frameBorder="0"
              allow="clipboard-write"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;