import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Building2,
  ShieldCheck,
  CalendarDays,
  AtSign,
  ArrowLeft,
  Pencil,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

import { getProfile } from "../services/authService";

function Profile() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    full_name: "",
    company_name: "",
    username: "",
    email: "",
    role: "",
    is_verified: false,
    created_at: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const data = await getProfile();

      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const initials = profile.full_name
    ? profile.full_name.charAt(0).toUpperCase()
    : profile.username
    ? profile.username.charAt(0).toUpperCase()
    : "U";

  return (
    <DashboardLayout
      sidebar={<Sidebar />}
      topbar={
        <Topbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      }
    >
      {/* Header */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold text-stone-900 dark:text-white">
            My Profile
          </h1>

          <p className="mt-2 text-stone-500 dark:text-slate-400">
            View and manage your account information.
          </p>
        </div>

        <button
          onClick={() => navigate("/settings")}
          className="flex items-center gap-2 rounded-xl bg-[#65735B] px-5 py-3 text-white hover:bg-[#55624D] transition"
        >
          <Pencil size={18} />
          Edit Profile
        </button>

      </div>

      {/* Profile Card */}

      <div className="mt-10 rounded-3xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 shadow-sm">

        {loading ? (
          <div className="py-16 text-center text-stone-500 dark:text-slate-400">
            Loading profile...
          </div>
        ) : (
          <>
            {/* Profile Header */}

            <div className="flex items-center gap-6 pb-8 border-b border-stone-200 dark:border-slate-700">

              <div className="h-24 w-24 rounded-full bg-[#65735B] flex items-center justify-center text-white text-4xl font-bold">
                {initials}
              </div>

              <div>
                <h2 className="text-3xl font-bold text-stone-900 dark:text-white">
                  {profile.full_name || profile.username}
                </h2>

                <p className="mt-1 text-stone-500 dark:text-slate-400">
                  @{profile.username}
                </p>

                <div className="flex items-center gap-2 mt-3">

                  <span
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      profile.is_verified
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    <ShieldCheck size={15} />

                    {profile.is_verified
                      ? "Verified Account"
                      : "Not Verified"}
                  </span>

                </div>
              </div>

            </div>

            {/* Information */}

            <div className="grid md:grid-cols-2 gap-6 mt-8">

              <ProfileItem
                icon={<User size={20} />}
                label="Full Name"
                value={profile.full_name || "Not provided"}
              />

              <ProfileItem
                icon={<AtSign size={20} />}
                label="Username"
                value={profile.username || "Not provided"}
              />

              <ProfileItem
                icon={<Mail size={20} />}
                label="Email Address"
                value={profile.email || "Not provided"}
              />

              <ProfileItem
                icon={<Building2 size={20} />}
                label="Company"
                value={profile.company_name || "Not provided"}
              />

              <ProfileItem
                icon={<ShieldCheck size={20} />}
                label="Role"
                value={profile.role || "EMPLOYEE"}
              />

              <ProfileItem
                icon={<CalendarDays size={20} />}
                label="Joined On"
                value={
                  profile.created_at
                    ? new Date(
                        profile.created_at
                      ).toLocaleDateString()
                    : "Not available"
                }
              />

            </div>

            {/* Bottom Actions */}

            <div className="mt-8 pt-6 border-t border-stone-200 dark:border-slate-700 flex flex-wrap gap-4">

              <button
                onClick={() => navigate("/settings")}
                className="rounded-xl border border-stone-300 dark:border-slate-700 px-6 py-3 text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition"
              >
                Account Settings
              </button>

              <button
                onClick={() => navigate("/settings")}
                className="rounded-xl border border-stone-300 dark:border-slate-700 px-6 py-3 text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition"
              >
                Change Password
              </button>

            </div>
          </>
        )}

      </div>

      {/* Back */}

      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 flex items-center gap-2 text-stone-500 dark:text-slate-400 hover:text-[#65735B] transition"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

    </DashboardLayout>
  );
}

function ProfileItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 p-5">

      <div className="h-11 w-11 rounded-xl bg-[#65735B]/10 flex items-center justify-center text-[#65735B]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm text-stone-500 dark:text-slate-400">
          {label}
        </p>

        <p className="mt-1 font-semibold text-stone-900 dark:text-white truncate">
          {value}
        </p>
      </div>

    </div>
  );
}

export default Profile;