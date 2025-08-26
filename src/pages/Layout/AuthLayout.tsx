import { Outlet, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
export const AuthLayout = () => {
  const { t } = useTranslation("translation");
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white transition-colors duration-200">
          {t("cryptoExchange")}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 ring-1 ring-gray-900/5 dark:ring-white/10 transition-colors duration-200">
          <Outlet />
        </div>
      </div>
      <div className="mt-8 text-center">
        <Link
          to="/"
          className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
        >
          {t("backToHome")}
        </Link>
      </div>
    </div>
  );
};
