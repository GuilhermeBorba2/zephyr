import React from 'react';
import Modal from '../common/Modal';
import LeadForm from '../leads/LeadForm';
import { useToastStore } from '../../stores/toastStore';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NewLeadModal: React.FC<NewLeadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const addToast = useToastStore(state => state.addToast);

  const handleSuccess = () => {
    addToast('Lead criado com sucesso!', 'success');
    onSuccess();
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Novo Lead"
      maxWidth="max-w-6xl"
    >
      <LeadForm onSuccess={handleSuccess} onCancel={onClose} />
    </Modal>
  );
};

export default NewLeadModal;