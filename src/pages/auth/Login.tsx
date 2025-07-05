import { useAuth } from "../../contexts/AuthContext";
import { GenericForm } from "../../components/GenericForm";

type LoginFormData = {
  username: string;
  password: string;
};

export const Login = () => {
  const { login } = useAuth();

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
      label: "Username",
      autoComplete: "username",
      required: true,
      icon: "Mail" as const,
    },
    {
      name: "password",
      type: "password",
      label: "Password",
      autoComplete: "current-password",
      required: true,
      icon: "Lock" as const,
    },
  ];

  return (
    <GenericForm<LoginFormData>
      fields={loginFields}
      onSubmit={onSubmit}
      submitButtonText="Sign in"
      showRememberMe={true}
    />
  );
};
