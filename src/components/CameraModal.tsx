import React from "react";
import CameraComponent from "./CameraComponent";

type CameraModalProps = {
  isOpen: boolean;
  capturedImage: string | null;
  onCapture: (capturedImage: string) => void;
  handleDialog: () => void;
  onRetake: () => void;
};

const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  capturedImage,
  onCapture,
  handleDialog,
  onRetake,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative">
        <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Take Photo
        </h2>
        <div className="space-y-4">
          <div className="flex flex-row gap-4 items-start">
            <div className="flex-1">
              <CameraComponent
                capturedImage={capturedImage}
                onCapture={onCapture}
                onRetake={onRetake}
              />
            </div>
            {capturedImage && (
              <div className="flex-1">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="max-w-full h-auto rounded border border-gray-200"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleDialog}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraModal;
