import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react";

function Sidebar() {
  return (
    <div className="h-full p-8">

      <h1 className="text-3xl font-bold mb-12">
        Insight<span className="text-[#65735B]">IQ</span>
      </h1>

      <nav className="space-y-2">

        <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />

        <SidebarItem icon={<FileText size={20} />} label="Documents" />

        <SidebarItem icon={<MessageSquare size={20} />} label="AI Chat" />

        <SidebarItem icon={<BarChart3 size={20} />} label="Analytics" />

        <SidebarItem icon={<Settings size={20} />} label="Settings" />

      </nav>

    </div>
  );
}

function SidebarItem({ icon, label, active }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition
      ${
        active
          ? "bg-[#65735B] text-white"
          : "hover:bg-stone-100 text-stone-600"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export default Sidebar;