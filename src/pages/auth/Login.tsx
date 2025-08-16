import { useAuth } from "../../contexts/AuthContext";
import { GenericForm } from "../../components/GenericForm";
import { useTranslation } from "react-i18next";
type LoginFormData = {
  username: string;
  password: string;
};

export const Login = () => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.username, data.password);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const loginFields = [
    {
      name: "username",
      type: "text",
      label: t("username"),
      autoComplete: "username",
      required: true,
      icon: "Mail" as const,
    },
    {
      name: "password",
      type: "password",
      label: t("password"),
      autoComplete: "current-password",
      required: true,
      icon: "Lock" as const,
    },
  ];

  return (
    <GenericForm<LoginFormData>
      fields={loginFields}
      onSubmit={onSubmit}
      submitButtonText={t("signIn")}
    />
  );
};
