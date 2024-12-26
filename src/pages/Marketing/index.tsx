import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import CampaignList from '../../components/marketing/CampaignList';
import ROIDashboard from '../../components/marketing/ROIDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/common/Tabs';
import { marketing } from '../../lib/marketing';
import type { Campaign } from '../../types/database.types';
import CampaignEditorModal from '../../components/modals/CampaignEditorModal';

const MarketingPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const data = await marketing.getCampaigns();
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsEditorOpen(true);
  };

  const handleNewCampaign = () => {
    setSelectedCampaign(null);
    setIsEditorOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Marketing
        </h1>
        <button
          onClick={handleNewCampaign}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nova Campanha
        </button>
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="roi">ROI Marketing</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <CampaignList
            campaigns={campaigns}
            loading={loading}
            onEdit={handleEdit}
            onRefresh={fetchCampaigns}
          />
        </TabsContent>

        <TabsContent value="roi">
          <ROIDashboard />
        </TabsContent>
      </Tabs>

      <CampaignEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSuccess={fetchCampaigns}
        campaign={selectedCampaign}
      />
    </div>
  );
};

export default MarketingPage;