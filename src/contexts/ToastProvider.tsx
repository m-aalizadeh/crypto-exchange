import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  return (
    <Toaster
      position="top-center"
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: "",
        duration: 5000,
        style: {
          background: "#ffffff",
          color: "#374151",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          borderRadius: "8px",
          padding: "16px",
          fontSize: "14px",
        },
        success: {
          iconTheme: {
            primary: "#10B981",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#EF4444",
            secondary: "#ffffff",
          },
        },
        loading: {
          iconTheme: {
            primary: "#3B82F6",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
};

export default ToastProvider;
