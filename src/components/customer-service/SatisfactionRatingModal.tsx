import React from 'react';
import Modal from '../common/Modal';
import SatisfactionRatingForm from './SatisfactionRatingForm';

interface SatisfactionRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  ticketId: string;
}

const SatisfactionRatingModal: React.FC<SatisfactionRatingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  ticketId
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Avaliar Atendimento"
    >
      <SatisfactionRatingForm
        ticketId={ticketId}
        onSuccess={() => {
          onSuccess();
          onClose();
        }}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default SatisfactionRatingModal;