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

  return (
    <div className="flex justify-between items-center w-full">
      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-3 text-stone-400"
          size={18}
        />

        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documents..."
          className="w-96 rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 outline-none"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        <Bell className="cursor-pointer" />

        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="h-11 w-11 rounded-full bg-[#65735B] flex items-center justify-center text-white font-bold text-lg">
              {user?.full_name
                ? user.full_name.charAt(0).toUpperCase()
                : user?.username?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="font-semibold">
                {user?.full_name || user?.username || "User"}
              </p>

              <p className="text-xs text-stone-500">
                {user?.role || "EMPLOYEE"}
              </p>
            </div>
          </div>

          {open && (
            <div className="absolute right-0 mt-3 w-64 bg-white border border-stone-200 rounded-2xl shadow-lg z-50">
              <div className="p-4">
                <p className="font-semibold">
                  {user?.full_name || user?.username}
                </p>

                <p className="text-sm text-stone-500 mt-1">
                  {user?.email}
                </p>
              </div>

              <hr />

              <button
                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-stone-100"
              >
                <User size={18} />
                My Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-600"
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