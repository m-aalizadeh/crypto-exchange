export const verifyCaptcha = async (token: string): Promise<boolean> => {
  try {
    debugger;
    if (import.meta.env.MODE === "development") {
      return true;
    }
    const response = await fetch("/api/verify-captcha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    return false;
  }
};
