import React, { useState } from "react";
import Modal from "./Modal";
import CircularProgress from "./CircularProgress";
import { useTranslation } from "react-i18next";
interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        {t("confirmation")}
      </h2>
      <p className="mb-6 text-gray-700 dark:text-gray-300">{message}</p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          {t("cancel")}
        </button>
        <button
          onClick={handleConfirm}
          className={`px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:text-white dark:hover:bg-red-700 ${
            loading ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {loading && (
            <CircularProgress
              progress={70}
              size={10}
              strokeWidth={2}
              className="text-white"
            />
          )}
          {t("confirm")}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
