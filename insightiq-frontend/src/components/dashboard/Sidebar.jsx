import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="h-full p-8">

      <h1
        onClick={() => navigate("/dashboard")}
        className="text-3xl font-bold mb-12 cursor-pointer"
      >
        Insight<span className="text-[#65735B]">IQ</span>
      </h1>

      <nav className="space-y-2">

        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          active={location.pathname === "/dashboard"}
          onClick={() => navigate("/dashboard")}
        />

        <SidebarItem
          icon={<FileText size={20} />}
          label="Documents"
          active={location.pathname === "/documents"}
          onClick={() => navigate("/documents")}
        />

        <SidebarItem
          icon={<MessageSquare size={20} />}
          label="AI Chat"
          active={false}
          onClick={() => alert("Coming Soon 🚀")}
        />

        <SidebarItem
          icon={<BarChart3 size={20} />}
          label="Analytics"
          active={false}
          onClick={() => alert("Coming Soon 🚀")}
        />

        <SidebarItem
          icon={<Settings size={20} />}
          label="Settings"
          active={false}
          onClick={() => alert("Coming Soon 🚀")}
        />

      </nav>

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
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        active
          ? "bg-[#65735B] text-white shadow"
          : "hover:bg-stone-100 text-stone-600"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export default Sidebar;