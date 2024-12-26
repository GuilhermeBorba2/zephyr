import React from 'react';
import { Settings, AlertCircle } from 'lucide-react';

const AutomationRules = () => {
  const rules = [
    {
      title: 'Qualificação Automática',
      description: 'Leads são qualificados após 3 interações recentes',
      icon: Settings
    },
    {
      title: 'Criação de Oportunidade',
      description: 'Oportunidade criada automaticamente para leads qualificados',
      icon: AlertCircle
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Regras de Automação
      </h2>
      
      <div className="space-y-4">
        {rules.map((rule, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <rule.icon className="w-5 h-5 text-blue-500 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {rule.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {rule.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutomationRules;