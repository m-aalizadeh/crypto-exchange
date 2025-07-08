import { NavLink } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  LayoutDashboard,
  Folder,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

type SidebarProps = {
  isCollapsed: boolean;
  toggleCollapse: () => void;
};

export const Sidebar = ({ isCollapsed, toggleCollapse }: SidebarProps) => {
  const { logout } = useAuth();

  const navItems = [
    {
      path: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      path: "/dashboard/watchlist",
      icon: <Folder className="w-5 h-5" />,
      label: "Watchlist",
    },
    {
      path: "/dashboard/profile",
      icon: <User className="w-5 h-5" />,
      label: "Profile",
    },
  ];

  return (
    <aside
      className={`h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
        border-r border-gray-200 dark:border-gray-700
        transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-64"
        }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Panel
            </h1>
          )}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-md 
              text-gray-500 dark:text-gray-400
              hover:text-gray-700 dark:hover:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-700
              focus:outline-none focus:ring-2
              focus:ring-indigo-500 dark:focus:ring-indigo-400
              transition-colors duration-200"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1 p-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink to={item.path}>
                  {({ isActive }: { isActive: boolean }) => (
                    <div
                      className={`flex items-center p-3 rounded-md
                      text-gray-700 dark:text-gray-300
                      hover:text-gray-900 dark:hover:text-white
                      hover:bg-gray-100 dark:hover:bg-gray-700
                      ${
                        isActive
                          ? "bg-gray-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400"
                          : ""
                      } 
                      ${isCollapsed ? "justify-center" : ""}
                      transition-colors duration-200`}
                    >
                      <div
                        className={
                          isActive ? "text-indigo-600 dark:text-indigo-400" : ""
                        }
                      >
                        {item.icon}
                      </div>
                      {!isCollapsed && (
                        <span className="ml-3 text-sm font-medium">
                          {item.label}
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={logout}
            className={`flex items-center w-full p-2 rounded-md
              text-gray-700 dark:text-gray-300
              hover:text-red-600 dark:hover:text-red-400
              hover:bg-red-50 dark:hover:bg-red-900/20
              ${isCollapsed ? "justify-center" : ""}
              transition-colors duration-200`}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && (
              <span className="ml-3 text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
