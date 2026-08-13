import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, FileText } from "lucide-react";
import toast from "react-hot-toast";

import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    company_name: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.full_name ||
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        company_name: formData.company_name,
      });

      toast.success("Account created successfully! 🎉");

      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      console.error("Registration error:", error);

      const data = error.response?.data;

      if (data) {
        if (data.username) {
          toast.error(
            Array.isArray(data.username)
              ? data.username[0]
              : data.username
          );
        } else if (data.email) {
          toast.error(
            Array.isArray(data.email)
              ? data.email[0]
              : data.email
          );
        } else if (data.error) {
          toast.error(data.error);
        } else {
          toast.error("Registration failed.");
        }
      } else {
        toast.error("Unable to connect to the server.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F4] dark:bg-slate-950 flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-2xl">

        {/* Logo */}

        <div className="text-center mb-8">

          <Link
            to="/"
            className="inline-flex items-center gap-2"
          >
            <div className="h-10 w-10 rounded-xl bg-[#65735B] flex items-center justify-center">
              <FileText
                size={22}
                className="text-white"
              />
            </div>

            <h1 className="text-3xl font-bold text-stone-900 dark:text-white">
              Insight
              <span className="text-[#65735B]">
                IQ
              </span>
            </h1>
          </Link>

        </div>

        {/* Card */}

        <div className="rounded-3xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-8 md:p-10">

          <div className="text-center mb-8">

            <h2 className="text-3xl font-bold text-stone-900 dark:text-white">
              Create your account
            </h2>

            <p className="mt-2 text-stone-500 dark:text-slate-400">
              Start analyzing your documents with InsightIQ.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Full Name */}

            <div>
              <label className="block font-medium text-stone-900 dark:text-white mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-slate-500 px-4 py-3 outline-none focus:ring-2 focus:ring-[#65735B]"
              />
            </div>

            {/* Username + Company */}

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="block font-medium text-stone-900 dark:text-white mb-2">
                  Username
                </label>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  className="w-full rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-slate-500 px-4 py-3 outline-none focus:ring-2 focus:ring-[#65735B]"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-900 dark:text-white mb-2">
                  Company
                </label>

                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="Company name"
                  className="w-full rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-slate-500 px-4 py-3 outline-none focus:ring-2 focus:ring-[#65735B]"
                />
              </div>

            </div>

            {/* Email */}

            <div>
              <label className="block font-medium text-stone-900 dark:text-white mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-slate-500 px-4 py-3 outline-none focus:ring-2 focus:ring-[#65735B]"
              />
            </div>

            {/* Password */}

            <div>
              <label className="block font-medium text-stone-900 dark:text-white mb-2">
                Password
              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-slate-500 px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-[#65735B]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-3.5 text-stone-400 hover:text-stone-600 dark:hover:text-slate-200"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>
            </div>

            {/* Confirm Password */}

            <div>
              <label className="block font-medium text-stone-900 dark:text-white mb-2">
                Confirm Password
              </label>

              <div className="relative">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Enter password again"
                  className="w-full rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-slate-500 px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-[#65735B]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-3.5 text-stone-400 hover:text-stone-600 dark:hover:text-slate-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>
            </div>

            {/* Register */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#65735B] py-3.5 font-semibold text-white hover:bg-[#55624D] transition disabled:opacity-70"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          {/* Login */}

          <div className="mt-8 text-center">

            <p className="text-stone-500 dark:text-slate-400">
              Already have an account?{" "}

              <Link
                to="/"
                className="font-semibold text-[#65735B] hover:underline"
              >
                Login
              </Link>
            </p>

          </div>

        </div>

        <p className="text-center text-sm text-stone-400 dark:text-slate-500 mt-6">
          © 2026 InsightIQ. All rights reserved.
        </p>

      </div>

    </div>
  );
}

export default Register;