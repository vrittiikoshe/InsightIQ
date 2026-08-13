import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import toast from "react-hot-toast";

import { forgotPassword } from "../services/authService";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const response = await forgotPassword(email);

      toast.success(
        response.message ||
          "Password reset link has been sent."
      );

      setSent(true);

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.error ||
          "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F4] dark:bg-slate-950 flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* Logo */}

        <div
          onClick={() => navigate("/")}
          className="text-center cursor-pointer mb-10"
        >
          <h1 className="text-4xl font-bold text-stone-900 dark:text-white">
            Insight<span className="text-[#65735B]">IQ</span>
          </h1>
        </div>

        <div className="rounded-3xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 shadow-sm">

          {!sent ? (
            <>
              <div className="flex justify-center mb-6">

                <div className="h-16 w-16 rounded-2xl bg-[#65735B]/10 flex items-center justify-center">
                  <Mail
                    size={30}
                    className="text-[#65735B]"
                  />
                </div>

              </div>

              <h2 className="text-3xl font-bold text-center text-stone-900 dark:text-white">
                Forgot Password?
              </h2>

              <p className="text-center text-stone-500 dark:text-slate-400 mt-3">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8"
              >

                <label className="font-medium text-stone-900 dark:text-white">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  className="w-full mt-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-white p-3 outline-none focus:ring-2 focus:ring-[#65735B]"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 rounded-xl bg-[#65735B] hover:bg-[#55624D] text-white py-3 font-medium transition disabled:opacity-70"
                >
                  {loading
                    ? "Sending..."
                    : "Send Reset Link"}
                </button>

              </form>

              <div className="mt-6 text-center">

                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm text-[#65735B] hover:underline"
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>

              </div>
            </>
          ) : (
            <div className="text-center">

              <div className="h-16 w-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Mail
                  size={30}
                  className="text-green-600"
                />
              </div>

              <h2 className="text-2xl font-bold mt-6 text-stone-900 dark:text-white">
                Check Your Email
              </h2>

              <p className="mt-3 text-stone-500 dark:text-slate-400">
                If an account exists with{" "}
                <span className="font-medium text-stone-900 dark:text-white">
                  {email}
                </span>
                , we've sent a password reset link.
              </p>

              <Link
                to="/"
                className="inline-flex items-center gap-2 mt-8 text-[#65735B] hover:underline"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;