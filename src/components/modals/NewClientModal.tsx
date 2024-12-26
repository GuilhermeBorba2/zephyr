import React from 'react';
import Modal from '../common/Modal';
import ClientForm from '../clients/ClientForm';
import { useToastStore } from '../../stores/toastStore';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NewClientModal: React.FC<NewClientModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const addToast = useToastStore(state => state.addToast);

  const handleSuccess = () => {
    addToast('Cliente criado com sucesso!', 'success');
    onSuccess();
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Novo Cliente"
      maxWidth="max-w-4xl"
    >
      <ClientForm onSuccess={handleSuccess} onCancel={onClose} />
    </Modal>
  );
};

export default NewClientModal;