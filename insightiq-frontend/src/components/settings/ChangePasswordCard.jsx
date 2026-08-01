import { useState } from "react";
import toast from "react-hot-toast";

import { changePassword } from "../../services/authService";

function ChangePasswordCard() {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (
      !passwords.oldPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      toast.error("Please fill all fields.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await changePassword(
        passwords.oldPassword,
        passwords.newPassword
      );

      toast.success(response.message);

      setPasswords({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error) {
      toast.error(
        error.response?.data?.error ||
        "Failed to update password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 rounded-3xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 shadow-sm">

      <h2 className="text-2xl font-bold text-stone-900 dark:text-white">
        Change Password
      </h2>

      <p className="mt-2 text-stone-500 dark:text-slate-400">
        Update your account password.
      </p>

      <div className="mt-8 space-y-5">

        <div>
          <label className="font-medium text-stone-900 dark:text-white">
            Current Password
          </label>

          <input
            type="password"
            value={passwords.oldPassword}
            onChange={(e) =>
              setPasswords({
                ...passwords,
                oldPassword: e.target.value,
              })
            }
            className="w-full mt-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-white p-3 outline-none focus:ring-2 focus:ring-[#65735B]"
          />
        </div>

        <div>
          <label className="font-medium text-stone-900 dark:text-white">
            New Password
          </label>

          <input
            type="password"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords({
                ...passwords,
                newPassword: e.target.value,
              })
            }
            className="w-full mt-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-white p-3 outline-none focus:ring-2 focus:ring-[#65735B]"
          />
        </div>

        <div>
          <label className="font-medium text-stone-900 dark:text-white">
            Confirm Password
          </label>

          <input
            type="password"
            value={passwords.confirmPassword}
            onChange={(e) =>
              setPasswords({
                ...passwords,
                confirmPassword: e.target.value,
              })
            }
            className="w-full mt-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-white p-3 outline-none focus:ring-2 focus:ring-[#65735B]"
          />
        </div>

      </div>

      <button
        onClick={handlePasswordChange}
        disabled={loading}
        className="mt-8 rounded-xl bg-[#65735B] px-8 py-3 text-white hover:bg-[#55624D] transition disabled:opacity-70"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>

    </div>
  );
}

export default ChangePasswordCard;