import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import toast from "react-hot-toast";

import { resetPassword } from "../services/authService";

function ResetPassword() {
  const navigate = useNavigate();
  const { uid, token } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill both password fields.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await resetPassword(
        uid,
        token,
        newPassword
      );

      toast.success(
        response.message || "Password reset successfully!"
      );

      setSuccess(true);

    } catch (error) {
      console.error("Reset Password Error:", error);

      toast.error(
        error.response?.data?.error ||
        "Invalid or expired reset link."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F4] flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* Logo */}

        <div
          onClick={() => navigate("/")}
          className="text-center mb-8 cursor-pointer"
        >
          <h1 className="text-4xl font-bold text-stone-900">
            Insight<span className="text-[#65735B]">IQ</span>
          </h1>
        </div>

        {/* Card */}

        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-10">

          {!success ? (
            <>
              {/* Icon */}

              <div className="flex justify-center">

                <div className="h-16 w-16 rounded-2xl bg-[#65735B]/10 flex items-center justify-center">
                  <LockKeyhole
                    size={30}
                    className="text-[#65735B]"
                  />
                </div>

              </div>

              {/* Heading */}

              <div className="text-center mt-6">

                <h2 className="text-3xl font-bold text-stone-900">
                  Reset Password
                </h2>

                <p className="mt-2 text-stone-500">
                  Create a new password for your InsightIQ account.
                </p>

              </div>

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >

                {/* New Password */}

                <div>

                  <label className="block text-sm font-medium text-stone-700">
                    New Password
                  </label>

                  <div className="relative mt-2">

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(e.target.value)
                      }
                      placeholder="Enter new password"
                      className="w-full rounded-xl border border-stone-200 px-4 py-3 pr-12 outline-none focus:border-[#65735B] focus:ring-2 focus:ring-[#65735B]/20"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>

                  </div>

                  <p className="text-xs text-stone-400 mt-2">
                    Password must be at least 8 characters.
                  </p>

                </div>

                {/* Confirm Password */}

                <div>

                  <label className="block text-sm font-medium text-stone-700">
                    Confirm Password
                  </label>

                  <div className="relative mt-2">

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Confirm new password"
                      className="w-full rounded-xl border border-stone-200 px-4 py-3 pr-12 outline-none focus:border-[#65735B] focus:ring-2 focus:ring-[#65735B]/20"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>

                  </div>

                </div>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#65735B] hover:bg-[#55624D] text-white py-3 font-semibold transition disabled:opacity-70"
                >
                  {loading
                    ? "Resetting..."
                    : "Reset Password"}
                </button>

              </form>

              {/* Back */}

              <div className="text-center mt-6">

                <Link
                  to="/"
                  className="text-sm text-[#65735B] hover:underline"
                >
                  Back to Login
                </Link>

              </div>
            </>
          ) : (
            /* Success */

            <div className="text-center">

              <div className="h-16 w-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">

                <LockKeyhole
                  size={30}
                  className="text-green-600"
                />

              </div>

              <h2 className="text-2xl font-bold text-stone-900 mt-6">
                Password Reset Successfully!
              </h2>

              <p className="text-stone-500 mt-3">
                Your password has been updated successfully.
                You can now login with your new password.
              </p>

              <button
                onClick={() => navigate("/")}
                className="w-full mt-8 rounded-xl bg-[#65735B] hover:bg-[#55624D] text-white py-3 font-semibold"
              >
                Go to Login
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default ResetPassword;