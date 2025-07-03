import toast from "react-hot-toast";

const useToast = () => {
  const showSuccess = (message: string) => {
    toast.success(message);
  };

  const showError = (message: string) => {
    toast.error(message);
  };

  const showLoading = (message: string) => {
    return toast.loading(message);
  };

  const dismissToast = (id: string) => {
    toast.dismiss(id);
  };

  const showPromise = (
    promise: Promise<any>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages);
  };

  return {
    showSuccess,
    showError,
    showLoading,
    dismissToast,
    showPromise,
  };
};

export default useToast;
