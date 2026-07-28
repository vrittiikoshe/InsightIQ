import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

import { getProfile, updateProfile } from "../services/authService";

function Settings() {
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(false);

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

  const handleSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("full_name", profile.full_name);
      formData.append("company_name", profile.company_name);

      await updateProfile(formData);

      toast.success("Profile updated successfully!");

      loadProfile();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
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
      <h1 className="text-4xl font-bold">
        Settings
      </h1>

      <p className="text-stone-500 mt-2">
        Manage your profile information.
      </p>

      <div className="mt-10 bg-white rounded-3xl border border-stone-200 p-8">

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="font-medium">
              Full Name
            </label>

            <input
              className="w-full mt-2 border rounded-xl p-3"
              value={profile.full_name}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  full_name: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="font-medium">
              Company
            </label>

            <input
              className="w-full mt-2 border rounded-xl p-3"
              value={profile.company_name}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  company_name: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="font-medium">
              Username
            </label>

            <input
              disabled
              className="w-full mt-2 border rounded-xl p-3 bg-stone-100"
              value={profile.username}
            />
          </div>

          <div>
            <label className="font-medium">
              Email
            </label>

            <input
              disabled
              className="w-full mt-2 border rounded-xl p-3 bg-stone-100"
              value={profile.email}
            />
          </div>

          <div>
            <label className="font-medium">
              Role
            </label>

            <input
              disabled
              className="w-full mt-2 border rounded-xl p-3 bg-stone-100"
              value={profile.role}
            />
          </div>

          <div>
            <label className="font-medium">
              Joined On
            </label>

            <input
              disabled
              className="w-full mt-2 border rounded-xl p-3 bg-stone-100"
              value={
                profile.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : ""
              }
            />
          </div>

        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-8 bg-[#65735B] hover:bg-[#55624D] text-white px-8 py-3 rounded-xl"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

      </div>
    </DashboardLayout>
  );
}

export default Settings;