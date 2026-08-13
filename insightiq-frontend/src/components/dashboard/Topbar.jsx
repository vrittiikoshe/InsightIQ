import { useEffect, useRef, useState } from "react";
import { Bell, Search, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getProfile, logoutUser } from "../../services/authService";

function Topbar({ searchQuery, setSearchQuery }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const handleProfile = () => {
    setOpen(false);
    navigate("/profile");
  };

  const handleSettings = () => {
    setOpen(false);
    navigate("/settings");
  };

  return (
    <div className="flex justify-between items-center w-full">

      {/* Search */}

      <div className="relative">
        <Search
          className="absolute left-3 top-3 text-stone-400 dark:text-slate-500"
          size={18}
        />

        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documents..."
          className="w-96 rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-white py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#65735B]"
        />
      </div>

      {/* Right Side */}

      <div className="flex items-center gap-6">

        {/* Notification */}

        <Bell
          size={21}
          className="cursor-pointer text-stone-600 dark:text-slate-300 hover:text-[#65735B]"
        />

        {/* Profile */}

        <div
          className="relative"
          ref={dropdownRef}
        >

          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 cursor-pointer"
          >

            {/* Avatar */}

            <div className="h-11 w-11 rounded-full bg-[#65735B] flex items-center justify-center text-white font-bold text-lg">
              {user?.full_name
                ? user.full_name.charAt(0).toUpperCase()
                : user?.username
                ? user.username.charAt(0).toUpperCase()
                : "U"}
            </div>

            {/* User Info */}

            <div>
              <p className="font-semibold text-stone-900 dark:text-white">
                {user?.full_name ||
                  user?.username ||
                  "User"}
              </p>

              <p className="text-xs text-stone-500 dark:text-slate-400">
                {user?.role || "EMPLOYEE"}
              </p>
            </div>

          </div>

          {/* Dropdown */}

          {open && (
            <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 rounded-2xl shadow-lg z-50">

              {/* User Details */}

              <div className="p-4">

                <p className="font-semibold text-stone-900 dark:text-white">
                  {user?.full_name ||
                    user?.username ||
                    "User"}
                </p>

                <p className="text-sm text-stone-500 dark:text-slate-400 mt-1">
                  {user?.email}
                </p>

              </div>

              <hr className="border-stone-200 dark:border-slate-700" />

              {/* My Profile */}

              <button
                onClick={handleProfile}
                className="w-full flex items-center gap-2 px-4 py-3 text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition"
              >
                <User size={18} />

                My Profile
              </button>

              {/* Settings */}

              <button
                onClick={handleSettings}
                className="w-full flex items-center gap-2 px-4 py-3 text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition"
              >
                <span className="text-lg">
                  ⚙️
                </span>

                Settings
              </button>

              {/* Logout */}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition"
              >
                <LogOut size={18} />

                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Topbar; 