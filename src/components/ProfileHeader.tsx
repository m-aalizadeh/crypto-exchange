import { useAuth } from "../contexts/AuthContext";
import { Icon } from "./Icon";

type HeaderProps = {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
};

export const Header = ({ toggleSidebar, isSidebarCollapsed }: HeaderProps) => {
  const {
    state: { user },
  } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label={
              isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            <Icon name="menu" className="h-6 w-6" />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="search" className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="button"
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span className="sr-only">View notifications</span>
            <div className="relative">
              <Icon name="bell" className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </div>
          </button>
          <div className="relative ml-3">
            <div className="flex items-center space-x-2">
              <div>
                <p className="text-sm font-medium text-gray-700 hidden md:block">
                  {user?.username}
                </p>
                <p className="text-xs font-medium text-gray-500 hidden md:block">
                  {user?.email}
                </p>
              </div>
              <button
                type="button"
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
              </button>
            </div>
            <div
              className="hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabIndex={-1}
            >
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                tabIndex={-1}
                id="user-menu-item-0"
              >
                Your Profile
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                tabIndex={-1}
                id="user-menu-item-1"
              >
                Settings
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                tabIndex={-1}
                id="user-menu-item-2"
              >
                Sign out
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
