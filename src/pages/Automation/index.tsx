import React from 'react';
import ChatbotConfig from '../../components/automation/ChatbotConfig';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/common/Tabs';

const AutomationPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Automação
      </h1>

      <Tabs defaultValue="chatbot">
        <TabsList>
          <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
          <TabsTrigger value="rules">Regras de Automação</TabsTrigger>
        </TabsList>

        <TabsContent value="chatbot">
          <ChatbotConfig />
        </TabsContent>

        <TabsContent value="rules">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Regras de Automação</h2>
            {/* Implementar regras de automação */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomationPage;