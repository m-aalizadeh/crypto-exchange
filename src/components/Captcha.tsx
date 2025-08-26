import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface CaptchaProps {
  onVerify: (token: string | null) => void;
  onExpire?: () => void;
  siteKey: string;
  className?: string;
}

const Captcha: React.FC<CaptchaProps> = ({
  onVerify,
  onExpire,
  siteKey,
  className = "",
}) => {
  const handleChange = (token: string | null) => {
    onVerify(token);
  };

  const handleExpired = () => {
    if (onExpire) {
      onExpire();
    }
  };

  return (
    <div className={className}>
      <ReCAPTCHA
        sitekey={siteKey}
        onChange={handleChange}
        onExpired={handleExpired}
      />
    </div>
  );
};

export default Captcha;
