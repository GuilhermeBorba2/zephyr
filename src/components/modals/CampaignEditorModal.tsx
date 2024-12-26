import React from 'react';
import Modal from '../common/Modal';
import CampaignEditor from '../marketing/CampaignEditor';
import type { Campaign } from '../../types/database.types';

interface CampaignEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  campaign?: Campaign | null;
}

const CampaignEditorModal: React.FC<CampaignEditorModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  campaign
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={campaign ? 'Editar Campanha' : 'Nova Campanha'}
      maxWidth="max-w-3xl"
    >
      <CampaignEditor
        initialData={campaign}
        onSuccess={() => {
          onSuccess();
          onClose();
        }}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default CampaignEditorModal;