import { useState } from "react";
import toast from "react-hot-toast";

import {
  getProfile,
  updateProfile,
} from "../../services/authService";

function ProfileCard({ profile, setProfile }) {
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("full_name", profile.full_name);
      formData.append("company_name", profile.company_name);

      await updateProfile(formData);

      toast.success("Profile updated successfully!");

      const updatedProfile = await getProfile();
      setProfile(updatedProfile);

    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 rounded-3xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 shadow-sm">

      <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-8">
        Profile Information
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <label className="font-medium text-stone-900 dark:text-white">
            Full Name
          </label>

          <input
            value={profile.full_name}
            onChange={(e) =>
              setProfile({
                ...profile,
                full_name: e.target.value,
              })
            }
            className="w-full mt-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-white p-3 outline-none focus:ring-2 focus:ring-[#65735B]"
          />
        </div>

        <div>
          <label className="font-medium text-stone-900 dark:text-white">
            Company
          </label>

          <input
            value={profile.company_name}
            onChange={(e) =>
              setProfile({
                ...profile,
                company_name: e.target.value,
              })
            }
            className="w-full mt-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-white p-3 outline-none focus:ring-2 focus:ring-[#65735B]"
          />
        </div>

        <div>
          <label className="font-medium text-stone-900 dark:text-white">
            Username
          </label>

          <input
            disabled
            value={profile.username}
            className="w-full mt-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 p-3"
          />
        </div>

        <div>
          <label className="font-medium text-stone-900 dark:text-white">
            Email
          </label>

          <input
            disabled
            value={profile.email}
            className="w-full mt-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 p-3"
          />
        </div>

        <div>
          <label className="font-medium text-stone-900 dark:text-white">
            Role
          </label>

          <input
            disabled
            value={profile.role}
            className="w-full mt-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 p-3"
          />
        </div>

        <div>
          <label className="font-medium text-stone-900 dark:text-white">
            Joined On
          </label>

          <input
            disabled
            value={
              profile.created_at
                ? new Date(profile.created_at).toLocaleDateString()
                : ""
            }
            className="w-full mt-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 p-3"
          />
        </div>

      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="mt-8 rounded-xl bg-[#65735B] px-8 py-3 text-white hover:bg-[#55624D] transition disabled:opacity-70"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>

    </div>
  );
}

export default ProfileCard;