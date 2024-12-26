import React, { useState } from 'react';
import { MessageSquare, Settings } from 'lucide-react';

const ChatbotConfig = () => {
  const [config, setConfig] = useState({
    enabled: false,
    welcomeMessage: 'Olá! Como posso ajudar?',
    qualificationQuestions: [
      'Qual o tamanho da sua empresa?',
      'Qual seu principal interesse?',
      'Qual seu orçamento estimado?'
    ]
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Configuração do Chatbot
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Status:
          </span>
          <button
            onClick={() => setConfig(c => ({ ...c, enabled: !c.enabled }))}
            className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${config.enabled
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
              }
            `}
          >
            {config.enabled ? 'Ativo' : 'Inativo'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mensagem de Boas-vindas
          </label>
          <input
            type="text"
            value={config.welcomeMessage}
            onChange={(e) => setConfig(c => ({ ...c, welcomeMessage: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Perguntas de Qualificação
          </label>
          <div className="space-y-2">
            {config.qualificationQuestions.map((question, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => {
                    const newQuestions = [...config.qualificationQuestions];
                    newQuestions[index] = e.target.value;
                    setConfig(c => ({ ...c, qualificationQuestions: newQuestions }));
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => {
                    const newQuestions = config.qualificationQuestions.filter((_, i) => i !== index);
                    setConfig(c => ({ ...c, qualificationQuestions: newQuestions }));
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  Remover
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newQuestions = [...config.qualificationQuestions, ''];
                setConfig(c => ({ ...c, qualificationQuestions: newQuestions }));
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Adicionar Pergunta
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Settings className="w-4 h-4" />
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotConfig;