import React from "react";
import { CircleX } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50  flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <button
          onClick={onClose}
          className="float-right text-gray-500 hover:text-gray-700"
        >
          <CircleX />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
