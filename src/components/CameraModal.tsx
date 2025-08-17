import React, { useState } from "react";
import CameraComponent from "./CameraComponent";
import { useAuth } from "../contexts/AuthContext";
import { apiCall } from "../services/api";
import type { ApiResponse } from "../types/api";
import useToast from "../hooks/useToast";

type CameraModalProps = {
  isOpen: boolean;
  capturedImage: string | null;
  onCapture: (capturedImage: string) => void;
  handleDialog: () => void;
  onRetake: () => void;
};

type ViewMode = "camera" | "upload";

const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  capturedImage,
  onCapture,
  handleDialog,
  onRetake,
}) => {
  const {
    state: { user },
  } = useAuth();
  const toast = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>("camera");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append("file", file, file.name);
      const response = await apiCall<ApiResponse>(
        "POST",
        `/files/uploadFile/${user?._id}`,
        formData
      );
      if (response.status === "success") {
        toast.showSuccess(response.message);
      }
    } catch (err) {
      toast.showError("Upload failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode("camera")}
              className={`px-4 py-2 rounded transition ${
                viewMode === "camera"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Take Photo
            </button>
            <button
              onClick={() => setViewMode("upload")}
              className={`px-4 py-2 rounded transition ${
                viewMode === "upload"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Upload Image
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {viewMode === "camera" ? (
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
          ) : (
            <div className="flex flex-col items-center">
              {!uploadedImage ? (
                <label className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                  <span className="text-gray-500 mb-2">
                    Click to select image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <span className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                    Browse Files
                  </span>
                </label>
              ) : (
                <div className="flex flex-row gap-4 items-start w-full">
                  <div className="flex-1">
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="max-w-full h-auto rounded border border-gray-200"
                    />
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="mt-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition w-full"
                    >
                      Upload Different Image
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
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
