import { useEffect, useState } from "react";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

import ProfileCard from "../components/settings/ProfileCard";
import ChangePasswordCard from "../components/settings/ChangePasswordCard";

import { getProfile } from "../services/authService";

function Settings() {
  const [searchQuery, setSearchQuery] = useState("");

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
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      console.error(error);
    }
  };

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
      <h1 className="text-4xl font-bold text-stone-900 dark:text-white">
        Settings
      </h1>

      <p className="mt-2 text-stone-500 dark:text-slate-400">
        Manage your account settings.
      </p>

      <ProfileCard
        profile={profile}
        setProfile={setProfile}
      />

      <ChangePasswordCard />

    </DashboardLayout>
  );
}

export default Settings;