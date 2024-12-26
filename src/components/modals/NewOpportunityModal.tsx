import React from 'react';
import Modal from '../common/Modal';
import OpportunityForm from '../opportunities/OpportunityForm';
import { useToastStore } from '../../stores/toastStore';

interface NewOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NewOpportunityModal: React.FC<NewOpportunityModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const addToast = useToastStore(state => state.addToast);

  const handleSuccess = () => {
    addToast('Oportunidade criada com sucesso!', 'success');
    onSuccess();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Oportunidade">
      <OpportunityForm onSuccess={handleSuccess} onCancel={onClose} />
    </Modal>
  );
};

export default NewOpportunityModal;