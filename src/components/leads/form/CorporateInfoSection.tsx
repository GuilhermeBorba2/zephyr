import React from 'react';
import { Building2, Mail, Phone, User, Briefcase } from 'lucide-react';
import Input from '../../common/Input';
import { cnpjApi } from '../../../lib/api/cnpj';
import { useToastStore } from '../../../stores/toastStore';

interface CorporateInfoProps {
  data: {
    cnpj: string;
    corporate_name: string;
    corporate_email: string;
    corporate_phone: string;
    corporate_responsible: string;
    responsible_position: string;
  };
  onChange: (field: string, value: string) => void;
}

const CorporateInfoSection: React.FC<CorporateInfoProps> = ({ data, onChange }) => {
  const addToast = useToastStore(state => state.addToast);

  const handleCNPJLookup = async (cnpj: string) => {
    if (cnpj.length !== 14) return;
    
    try {
      const companyData = await cnpjApi.fetch(cnpj);
      if (companyData) {
        onChange('corporate_name', companyData.razao_social);
        onChange('corporate_email', companyData.email || '');
        onChange('corporate_phone', companyData.ddd_telefone_1 || '');
        onChange('corporate_responsible', companyData.nome_fantasia || '');
        addToast('Dados da empresa carregados com sucesso!', 'success');
      }
    } catch (error) {
      addToast('Erro ao buscar dados da empresa', 'error');
    }
  };

  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Informações da Empresa
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="CNPJ"
          icon={Building2}
          value={formatCNPJ(data.cnpj)}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            onChange('cnpj', value);
            if (value.length === 14) {
              handleCNPJLookup(value);
            }
          }}
          maxLength={18}
          placeholder="00.000.000/0000-00"
          required
        />

        <Input
          label="Razão Social"
          icon={Building2}
          value={data.corporate_name}
          onChange={(e) => onChange('corporate_name', e.target.value)}
          required
        />

        <Input
          label="Email Corporativo"
          type="email"
          icon={Mail}
          value={data.corporate_email}
          onChange={(e) => onChange('corporate_email', e.target.value)}
          required
        />

        <Input
          label="Telefone Corporativo"
          icon={Phone}
          value={data.corporate_phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            onChange('corporate_phone', value);
          }}
          maxLength={11}
          placeholder="(00) 00000-0000"
          required
        />

        <Input
          label="Responsável"
          icon={User}
          value={data.corporate_responsible}
          onChange={(e) => onChange('corporate_responsible', e.target.value)}
          required
        />

        <Input
          label="Cargo do Responsável"
          icon={Briefcase}
          value={data.responsible_position}
          onChange={(e) => onChange('responsible_position', e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default CorporateInfoSection;