import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="relative h-full p-8 bg-white dark:bg-stone-900 transition-colors">

      <h1
        onClick={() => navigate("/dashboard")}
        className="text-3xl font-bold mb-12 cursor-pointer text-stone-900 dark:text-white"
      >
        Insight<span className="text-[#65735B]">IQ</span>
      </h1>

      <nav className="space-y-2">

        {/* Dashboard */}

        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          active={location.pathname === "/dashboard"}
          onClick={() => navigate("/dashboard")}
        />


        {/* Documents */}

        <SidebarItem
          icon={<FileText size={20} />}
          label="Documents"
          active={location.pathname === "/documents"}
          onClick={() => navigate("/documents")}
        />


        {/* Analytics */}

        <SidebarItem
          icon={<BarChart3 size={20} />}
          label="Analytics"
          active={location.pathname === "/analytics"}
          onClick={() => navigate("/analytics")}
        />


        {/* Settings */}

        <SidebarItem
          icon={<Settings size={20} />}
          label="Settings"
          active={location.pathname === "/settings"}
          onClick={() => navigate("/settings")}
        />

      </nav>


      {/* Theme Toggle */}

      <div className="absolute bottom-8 left-8">
        <ThemeToggle />
      </div>

    </div>
  );
}


function SidebarItem({
  icon,
  label,
  active,
  onClick,
}) {

  return (
    <button
      onClick={onClick}
      className={`
        w-full
        flex
        items-center
        gap-3
        px-4
        py-3
        rounded-xl
        transition-all
        duration-200

        ${
          active
            ? "bg-[#65735B] text-white shadow"
            : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
        }
      `}
    >

      {icon}

      <span>{label}</span>

    </button>
  );
}


export default Sidebar; 