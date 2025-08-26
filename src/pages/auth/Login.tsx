import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { GenericForm } from "../../components/GenericForm";
import { useTranslation } from "react-i18next";
import { verifyCaptcha } from "../../services/utils";

type LoginFormData = {
  username: string;
  password: string;
  captchaToken: string;
};

export const Login = () => {
  const { login } = useAuth();
  const { t } = useTranslation("translation");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const RECAPTCHA_SITE_KEY =
    import.meta.env.RECAPTCHA_SITE_KEY ||
    "6LdribErAAAAAA7CucS7zozTD7pBLt13bUodfYur";

  const onSubmit = async (data: LoginFormData) => {
    if (captchaToken) {
      const captchaValid = await verifyCaptcha(captchaToken);
      if (!captchaValid) {
        t("CAPTCHA verification failed");
      }
    }
    await login(data.username, data.password);
  };

  const handleCaptchaVerify = (token: string | null) => {
    setCaptchaToken(token);
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
      showCaptcha={true}
      captchaSiteKey={RECAPTCHA_SITE_KEY}
      onCaptchaVerify={handleCaptchaVerify}
    />
  );
};
