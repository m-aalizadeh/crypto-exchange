import { useState } from "react";
import { useTranslation } from "react-i18next";

export const useCaptcha = () => {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const { t } = useTranslation("translation");

  const handleCaptchVerify = (token: string | null) => {
    setCaptchaToken(token);
    setCaptchaError(null);
  };

  const handleCaptchaExpire = () => {
    setCaptchaToken(null);
    setCaptchaError(t("CAPTCHA verification expired. Please verify again."));
  };

  const validateCaptcha = (): boolean => {
    if (!captchaToken) {
      setCaptchaError(t("Please complete the CAPTCHA verification."));
      return false;
    }
    return true;
  };

  const resetCaptcha = () => {
    setCaptchaToken(null);
    setCaptchaError(null);
  };

  return {
    captchaToken,
    captchaError,
    handleCaptchVerify,
    handleCaptchaExpire,
    validateCaptcha,
    resetCaptcha,
  };
};
