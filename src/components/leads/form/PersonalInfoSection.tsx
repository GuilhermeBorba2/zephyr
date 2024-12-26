import React from 'react';
import { User, Calendar, Briefcase, Mail, Phone } from 'lucide-react';
import Input from '../../common/Input';

interface PersonalInfoProps {
  data: {
    name: string;
    birth_date: string;
    position: string;
    email: string;
    phone: string;
  };
  onChange: (field: string, value: string) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoProps> = ({ data, onChange }) => {
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
          label="Data de Nascimento"
          type="date"
          icon={Calendar}
          value={data.birth_date}
          onChange={(e) => onChange('birth_date', e.target.value)}
          required
        />

        <Input
          label="Cargo"
          icon={Briefcase}
          value={data.position}
          onChange={(e) => onChange('position', e.target.value)}
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
      </div>
    </div>
  );
};

export default PersonalInfoSection;