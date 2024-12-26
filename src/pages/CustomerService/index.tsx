import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/common/Tabs';
import TicketList from '../../components/customer-service/TicketList';
import CustomerList from '../../components/customer-service/CustomerList';
import SatisfactionDashboard from '../../components/customer-service/SatisfactionDashboard';

const AtendimentoPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Atendimento ao Cliente
        </h1>
      </div>

      <Tabs defaultValue="tickets">
        <TabsList>
          <TabsTrigger value="tickets">Chamados</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfação</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          <TicketList />
        </TabsContent>

        <TabsContent value="customers">
          <CustomerList />
        </TabsContent>

        <TabsContent value="satisfaction">
          <SatisfactionDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AtendimentoPage;