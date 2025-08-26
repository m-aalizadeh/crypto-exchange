import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { GenericForm } from "../../components/GenericForm";
import useToast from "../../hooks/useToast";
import { apiCall } from "../../services/api";
import { useTranslation } from "react-i18next";
import type { ApiResponse } from "../../types/api";

type ProfileFormData = {
  username: string;
  email: string;
};

const Profile = () => {
  const {
    state: { user },
    getCurrentUser,
  } = useAuth();
  const toast = useToast();
  const { t } = useTranslation("translation");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    username: user?.username || "",
    email: user?.email || "",
  });

  const handleSubmit = async (data: ProfileFormData) => {
    setFormData(data);
    setIsEditing(false);
    try {
      const response = await apiCall<ApiResponse>(
        "PATCH",
        `/user/updateUser/${user?._id}`,
        data
      );
      if (response.status === "success" && response.data) {
        toast.showSuccess(
          response.message || t("Profile updated successfully")
        );
        await getCurrentUser();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || t("Update got failed");
      toast.showError(errorMessage);
    }
  };

  const profileFields = [
    {
      name: "username",
      type: "text",
      label: t("username"),
      required: true,
    },
    {
      name: "email",
      type: "email",
      label: t("email"),
      required: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-700/20 overflow-hidden md:max-w-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-200">
              {t("profileInformation")}
            </h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
              >
                {t("editProfile")}
              </button>
            )}
          </div>
          {isEditing ? (
            <>
              <GenericForm<ProfileFormData>
                fields={profileFields}
                onSubmit={handleSubmit}
                submitButtonText={t("saveChanges")}
                formClassName="space-y-4"
                defaultValues={formData}
              />
              <div className="mt-4">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      username: user?.username || "",
                      email: user?.email || "",
                    });
                  }}
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                >
                  {t("cancel")}
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">
                  {t("username")}
                </h2>
                <p className="mt-1 text-lg text-gray-900 dark:text-white transition-colors duration-200">
                  {user?.username}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">
                  {t("email")}
                </h2>
                <p className="mt-1 text-lg text-gray-900 dark:text-white transition-colors duration-200">
                  {user?.email}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">
                  {t("role")}
                </h2>
                <p className="mt-1 text-lg text-gray-900 dark:text-white transition-colors duration-200">
                  {user?.role}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">
                  {t("status")}
                </h2>
                <p className="mt-1 text-lg text-gray-900 dark:text-white transition-colors duration-200">
                  {user?.status}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
