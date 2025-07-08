import { Link } from "react-router-dom";
import DarkModeToggle from "../components/DarkModeToggle";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

export const Header = () => {
  const { t } = useTranslation("translation");
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white hidden md:inline">
              {t(`cryptoExchange`)}
            </span>
          </Link>
        </div>
        <nav className="flex items-center space-x-4">
          <DarkModeToggle />
          <LanguageSwitcher />
          <>
            <Link
              to="/login"
              className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Sign up
            </Link>
          </>
        </nav>
      </div>
    </header>
  );
};
