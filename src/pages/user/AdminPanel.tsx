import React, { useEffect, useState } from "react";
import { apiCall } from "../../services/api";
import GenericTable from "../../components/GenericTable";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";
import { Tooltip } from "@material-tailwind/react";
import useToast from "../../hooks/useToast";
import { useAuth } from "../../contexts/AuthContext";
import type { ApiResponse } from "../../types/api";
interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  online: boolean;
  status: string;
}

const AdminPanel: React.FC = () => {
  const {
    state: { user },
  } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User>();

  const { t } = useTranslation();
  const toast = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiCall<ApiResponse>("GET", "/user/allUsers");
        if (response.status === "success") {
          setUsers(response.users);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await apiCall<ApiResponse>(
        "DELETE",
        `/user/deleteUser/${selectedUser?._id}`
      );
      if (response.status === "success") {
        toast.showSuccess(t("User deleted successfully"));
      }
    } catch (err: any) {
      const errorMessage = err?.message || t("Something went wrong!");
      toast.showError(errorMessage);
    } finally {
      setIsOpen(false);
    }
  };

  const handleConfirmationModal = (selectedUser: User) => {
    if (user?.role === "admin") {
      setSelectedUser(selectedUser);
      setIsOpen(true);
    } else {
      toast.showError(t(`Only admin users are able do this action`));
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  if (loading) {
    return <div>{t("Loading users...")}</div>;
  }

  const columns = [
    {
      key: "username" as const,
      header: t("Username"),
      sortable: true,
    },
    {
      key: "email" as const,
      header: t("Email"),
      sortable: true,
    },
    {
      key: "role" as const,
      header: t("Role"),
      sortable: true,
    },
    {
      key: "status" as const,
      header: t("Status"),
      sortable: true,
    },
    {
      key: "actions",
      header: t("Actions"),
      align: "right" as const,
      render: (_: undefined, row: User) => (
        <div className="flex justify-end space-x-2">
          <Tooltip content={t(`Delete`)}>
            <button
              onClick={() => handleConfirmationModal(row)}
              className="text-red-600 hover:text-red-600"
            >
              <Trash2 />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-panel p-4 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">
        {t("Admin Panel - User Management")}
      </h1>
      <GenericTable columns={columns} data={users} />
      <ConfirmationModal
        isOpen={isOpen}
        onCancel={handleCancel}
        onConfirm={handleDelete}
        message={t(
          `Are you sure you want to delete this item? This action cannot be undone.`
        )}
      />
    </div>
  );
};

export default AdminPanel;
