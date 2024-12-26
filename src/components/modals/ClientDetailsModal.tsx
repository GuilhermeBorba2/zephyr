import React from 'react';
import Modal from '../common/Modal';
import { Building2, Mail, Phone, MapPin, FileText } from 'lucide-react';
import type { Client } from '../../types/database.types';

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
}

const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({
  isOpen,
  onClose,
  client
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalhes do Cliente">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Informações Básicas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Nome</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{client.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Empresa</p>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">{client.company}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <a href={`mailto:${client.email}`} className="text-sm font-medium text-blue-600 hover:underline">
                  {client.email}
                </a>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Telefone</p>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href={`tel:${client.phone}`} className="text-sm font-medium text-blue-600 hover:underline">
                  {client.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Documento
          </h3>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {client.document_type?.toUpperCase()}: {client.document}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Endereço
          </h3>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-1" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {client.street}, {client.number}
                {client.complement && ` - ${client.complement}`}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {client.neighborhood} - {client.city}/{client.state}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                CEP: {client.zip_code}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ClientDetailsModal;