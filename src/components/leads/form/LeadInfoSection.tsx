import React from 'react';
import { User, Mail, Phone, Building2, Briefcase } from 'lucide-react';
import Input from '../../common/Input';

interface LeadInfoProps {
  data: {
    name: string;
    email: string;
    phone: string;
    company: string;
    position: string;
  };
  onChange: (field: string, value: string) => void;
}

const LeadInfoSection: React.FC<LeadInfoProps> = ({ data, onChange }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Informações Básicas
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nome"
          icon={User}
          value={data.name}
          onChange={(e) => onChange('name', e.target.value)}
          required
        />

        <Input
          label="Email"
          type="email"
          icon={Mail}
          value={data.email}
          onChange={(e) => onChange('email', e.target.value)}
          required
        />

        <Input
          label="Telefone"
          icon={Phone}
          value={data.phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            onChange('phone', value);
          }}
          maxLength={11}
          placeholder="(00) 00000-0000"
          required
        />

        <Input
          label="Empresa"
          icon={Building2}
          value={data.company}
          onChange={(e) => onChange('company', e.target.value)}
          required
        />

        <Input
          label="Cargo"
          icon={Briefcase}
          value={data.position}
          onChange={(e) => onChange('position', e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default LeadInfoSection;