import { useState, useEffect, use } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Menu } from "lucide-react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import DarkModeToggle from "../components/DarkModeToggle";
import CameraModal from "./cameraModal";
import Avatar from "./Avatar";
import { useTranslation } from "react-i18next";
import api from "../services/api";

type HeaderProps = {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
};

export const Header = ({ toggleSidebar, isSidebarCollapsed }: HeaderProps) => {
  const {
    state: { user },
  } = useAuth();
  const { t } = useTranslation("translation");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const onCapture = async (imageData: string) => {
    setCapturedImage(imageData);
  };

  const handleDialog = async () => {
    setCapturedImage(null);
    setIsOpen(!isOpen);
  };

  const getPhoto = async () => {
    try {
      const response = await api.get(`/files/getFile/${user?._id}`);
      const uint8Array = new Uint8Array(response?.data?.data);
      const base64String = btoa(String.fromCharCode(...uint8Array));
      const imageType = "image/jpeg";
      const dataUrl = `data:${imageType};base64,${base64String}`;
      onCapture(dataUrl);
    } catch (err) {
      console.error("Failed to fetch image", err);
    }
  };

  useEffect(() => {
    if (user?._id && capturedImage === null) {
      getPhoto();
    }
  }, [user?._id]);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 
              hover:text-gray-600 dark:hover:text-gray-300 
              hover:bg-gray-50 dark:hover:bg-gray-700 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
              transition-colors duration-200"
            aria-label={
              isSidebarCollapsed ? t(`expandSidebar`) : t(`collapseSidebar`)
            }
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <DarkModeToggle />
          <LanguageSwitcher />
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar src={capturedImage} alt="MA" onClick={handleDialog} />
            </div>
          </div>
          <CameraModal
            isOpen={isOpen}
            capturedImage={capturedImage}
            onCapture={onCapture}
            handleDialog={handleDialog}
            onRetake={() => setCapturedImage(null)}
          />
        </div>
      </div>
    </header>
  );
};
