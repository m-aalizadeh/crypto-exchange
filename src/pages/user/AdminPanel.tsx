import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Table from "../../components/Table";
import { useTranslation } from "react-i18next";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  online: boolean;
  status: string;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/user/allUsers");
        if (Array.isArray(response.data.users) && response.data.users.length) {
          setUsers(response.data.users);
        }
      } catch (err) {
        setError("Failed to fetch users.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    console.log("Edit user:", user);
  };

  const handleDelete = async (user: User) => {
    if (
      window.confirm(
        `${t("Are you sure you want to delete user")}: ${user.username}?`
      )
    ) {
      try {
        setUsers(users.filter((u) => u._id !== user._id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div>{t("Loading users...")}</div>;
  }

  if (error) {
    return (
      <div>
        {t("Error")}: {error}
      </div>
    );
  }

  const headers = [
    t("Username"),
    t("Email"),
    t("Role"),
    t("Online"),
    t("Status"),
  ];

  const renderUserRow = (user: User) => (
    <>
      <td className="border border-gray-300 dark:border-gray-600 p-2">
        {user.username}
      </td>
      <td className="border border-gray-300 dark:border-gray-600 p-2">
        {user.email}
      </td>
      <td className="border border-gray-300 dark:border-gray-600 p-2">
        {user.role}
      </td>
      <td className="border border-gray-300 dark:border-gray-600 p-2">
        {user.online ? t("Yes") : t("No")}
      </td>
      <td className="border border-gray-300 dark:border-gray-600 p-2">
        {user.status}
      </td>
    </>
  );

  const renderUserActions = (user: User) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleEdit(user)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded flex items-center justify-center"
        title={t("Edit")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
          <path
            fillRule="evenodd"
            d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <button
        onClick={() => handleDelete(user)}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded flex items-center justify-center"
        title={t("Delete")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="admin-panel p-4 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">
        {t("Admin Panel - User Management")}
      </h1>
      <Table
        headers={headers}
        data={users}
        renderRow={renderUserRow}
        renderActions={renderUserActions}
        t={t}
      />
    </div>
  );
};

export default AdminPanel;
