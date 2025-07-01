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
  const {
    state: { user },
    logout,
  } = useAuth();

  const navItems = [
    { path: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
    { path: "/watchlist", icon: <Folder />, label: "Watchlist" },
    { path: "/profile", icon: <User />, label: "Profile" },
  ];

  return (
    <aside
      className={`h-screen bg-gray-800 text-white transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {!isCollapsed && <h1 className="text-xl font-semibold">Panel</h1>}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-md hover:bg-gray-700"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>
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
                  {item.icon}
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className={`flex items-center w-full p-2 rounded-md hover:bg-gray-700 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <LogOut />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};
