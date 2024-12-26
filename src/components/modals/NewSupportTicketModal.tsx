import React from 'react';
import Modal from '../common/Modal';
import SupportTicketForm from '../support/SupportTicketForm';

interface NewSupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NewSupportTicketModal: React.FC<NewSupportTicketModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Novo Chamado de Suporte"
    >
      <SupportTicketForm
        onSuccess={() => {
          onSuccess();
          onClose();
        }}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default NewSupportTicketModal;