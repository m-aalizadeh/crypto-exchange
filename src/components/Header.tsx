import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Your auth hook
import DarkModeToggle from "../components/DarkModeToggle";

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="dark:bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="ml-2 text-xl font-semibold dark:text-gray-900 hidden md:inline">
              Crypto Exchange
            </span>
          </Link>
        </div>

        <nav className="flex items-center space-x-4">
          <DarkModeToggle />
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="text-sm font-medium text-red-600 hover:text-red-500"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm dark:text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
