import { useAuth } from "../contexts/AuthContext";
import { Menu, Search, Bell } from "lucide-react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import DarkModeToggle from "../components/DarkModeToggle";

type HeaderProps = {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
};

export const Header = ({ toggleSidebar, isSidebarCollapsed }: HeaderProps) => {
  const {
    state: { user },
  } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 
              hover:text-gray-600 dark:hover:text-gray-300 
              hover:bg-gray-50 dark:hover:bg-gray-700 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
              transition-colors duration-200"
            aria-label={
              isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <DarkModeToggle />
          <LanguageSwitcher />
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="block w-full pl-10 pr-3 py-2 
                border border-gray-300 dark:border-gray-600 
                rounded-md leading-5 
                bg-white dark:bg-gray-700 
                text-gray-900 dark:text-gray-100
                placeholder-gray-500 dark:placeholder-gray-400 
                focus:outline-none 
                focus:ring-indigo-500 dark:focus:ring-indigo-400 
                focus:border-indigo-500 dark:focus:border-indigo-400 
                transition-colors duration-200
                sm:text-sm"
            />
          </div>
          <button
            type="button"
            className="p-1 rounded-full 
              text-gray-400 dark:text-gray-500 
              hover:text-gray-500 dark:hover:text-gray-400
              focus:outline-none focus:ring-2 
              focus:ring-offset-2 dark:focus:ring-offset-gray-800 
              focus:ring-indigo-500 dark:focus:ring-indigo-400
              transition-colors duration-200"
          >
            <span className="sr-only">View notifications</span>
            <div className="relative">
              <Bell className="w-5 h-5" />
              <span
                className="absolute top-0 right-0 block h-2 w-2 rounded-full 
                bg-red-400 dark:bg-red-500 
                ring-2 ring-white dark:ring-gray-800"
              ></span>
            </div>
          </button>
          <div className="relative ml-3">
            <div className="flex items-center space-x-2">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block transition-colors duration-200">
                  {user?.username}
                </p>
              </div>
              <button
                type="button"
                className="flex items-center text-sm rounded-full 
                  focus:outline-none focus:ring-2 
                  focus:ring-offset-2 dark:focus:ring-offset-gray-800 
                  focus:ring-indigo-500 dark:focus:ring-indigo-400
                  transition-colors duration-200"
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                <div
                  className="h-8 w-8 rounded-full 
                  bg-indigo-600 dark:bg-indigo-500 
                  hover:bg-indigo-700 dark:hover:bg-indigo-600
                  flex items-center justify-center 
                  text-white dark:text-gray-100 
                  font-medium transition-colors duration-200"
                >
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
