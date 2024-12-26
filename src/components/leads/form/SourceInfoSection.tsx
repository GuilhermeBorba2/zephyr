import React from 'react';
import { Globe, Megaphone, FileText } from 'lucide-react';
import Input from '../../common/Input';

interface SourceInfoProps {
  data: {
    source: string;
    campaign: string;
    notes: string;
  };
  onChange: (field: string, value: string) => void;
}

const SourceInfoSection: React.FC<SourceInfoProps> = ({ data, onChange }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Origem do Lead
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fonte
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={data.source}
              onChange={(e) => onChange('source', e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="">Selecione a fonte</option>
              <option value="referral">Indicação</option>
              <option value="campaign">Campanha</option>
              <option value="organic">Orgânico</option>
              <option value="other">Outros</option>
            </select>
          </div>
        </div>

        <Input
          label="Campanha"
          icon={Megaphone}
          value={data.campaign}
          onChange={(e) => onChange('campaign', e.target.value)}
          placeholder="Se aplicável"
        />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Observações
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              value={data.notes}
              onChange={(e) => onChange('notes', e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={3}
              placeholder="Informações adicionais sobre o lead..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourceInfoSection;