import React from 'react';
import Modal from '../common/Modal';
import LeadForm from '../leads/LeadForm';
import { useToastStore } from '../../stores/toastStore';
import type { Lead } from '../../types/database.types';

interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lead: Lead | null;
}

const EditLeadModal: React.FC<EditLeadModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  lead 
}) => {
  const addToast = useToastStore(state => state.addToast);

  const handleSuccess = () => {
    addToast('Lead atualizado com sucesso!', 'success');
    onSuccess();
    onClose();
  };

  if (!lead) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Editar Lead"
      maxWidth="max-w-6xl"
    >
      <LeadForm 
        onSuccess={handleSuccess} 
        onCancel={onClose}
        initialData={lead}
      />
    </Modal>
  );
};

export default EditLeadModal;