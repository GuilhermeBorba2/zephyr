import React from 'react';
import AdvancedMetrics from '../../components/analytics/AdvancedMetrics';
import AdvancedDashboard from '../../components/analytics/AdvancedDashboard';
import CustomReportBuilder from '../../components/analytics/CustomReportBuilder';
import ROIDashboard from '../../components/marketing/ROIDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/common/Tabs';

const ReportsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Relatórios e Análises
        </h1>
      </div>

      <AdvancedMetrics />

      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="roi">ROI Marketing</TabsTrigger>
          <TabsTrigger value="custom">Relatórios Personalizados</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <AdvancedDashboard />
        </TabsContent>

        <TabsContent value="roi">
          <ROIDashboard />
        </TabsContent>

        <TabsContent value="custom">
          <CustomReportBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;