import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Icon } from "./Icon";

type SidebarProps = {
  isCollapsed: boolean;
  toggleCollapse: () => void;
};

export const Sidebar = ({ isCollapsed, toggleCollapse }: SidebarProps) => {
  const {
    state: { user },
    logout,
  } = useAuth();

  const navItems = [
    { path: "/dashboard", icon: "dashboard", label: "Dashboard" },
    { path: "/projects", icon: "folder", label: "Projects" },
    { path: "/reports", icon: "analytics", label: "Reports" },
    { path: "/settings", icon: "settings", label: "Settings" },
  ];

  return (
    <aside
      className={`h-screen bg-gray-800 text-white transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {!isCollapsed && (
            <h1 className="text-xl font-semibold">Admin Panel</h1>
          )}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-md hover:bg-gray-700"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Icon name={isCollapsed ? "chevron-right" : "chevron-left"} />
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 flex items-center border-b border-gray-700">
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          {!isCollapsed && (
            <div>
              <p className="font-medium truncate">{user?.username || "User"}</p>
              <p className="text-sm text-gray-400 truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1 p-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-md hover:bg-gray-700 ${
                      isActive ? "bg-gray-700" : ""
                    } ${isCollapsed ? "justify-center" : ""}`
                  }
                >
                  <Icon name={item.icon} className="w-5 h-5" />
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className={`flex items-center w-full p-2 rounded-md hover:bg-gray-700 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <Icon name="logout" className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};
