import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

import {
  loginUser,
  googleLogin,
} from "../../services/authService";

function LoginForm() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Normal Login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Please enter username and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(username, password);

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      toast.success("Login successful!");

      navigate("/dashboard");

    } catch (error) {
      console.error("Login Error:", error);

      toast.error(
        error.response?.data?.detail ||
        "Invalid username or password."
      );

    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);

      const data = await googleLogin(
        credentialResponse.credential
      );

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      toast.success("Google login successful!");

      navigate("/dashboard");

    } catch (error) {
      console.error("Google Login Error:", error);

      toast.error(
        error.response?.data?.error ||
        "Google login failed."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">

      {/* WHITE LOGIN CARD */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-10">

        {/* Heading */}

        <div className="mb-8">

          <h2 className="text-4xl font-bold text-stone-900">
            Welcome back 🚀
          </h2>

          <p className="mt-2 text-stone-500">
            Sign in to continue to InsightIQ 
          </p>

        </div>

        {/* Login Form */}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* Username */}

          <div>

            <label className="block text-sm font-medium text-stone-700">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Enter your username"
              className="w-full mt-2 rounded-xl border border-stone-200 bg-white text-stone-900 px-4 py-3 outline-none transition focus:border-[#65735B] focus:ring-2 focus:ring-[#65735B]/20"
            />

          </div>

          {/* Password */}

          <div>

            <label className="block text-sm font-medium text-stone-700">
              Password
            </label>

            <div className="relative mt-2">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                className="w-full rounded-xl border border-stone-200 bg-white text-stone-900 px-4 py-3 pr-12 outline-none transition focus:border-[#65735B] focus:ring-2 focus:ring-[#65735B]/20"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

            {/* Forgot Password */}

            <div className="flex justify-end mt-2">

              <Link
                to="/forgot-password"
                className="text-sm text-[#65735B] hover:underline"
              >
                Forgot Password?
              </Link>

            </div>

          </div>

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#65735B] hover:bg-[#55624D] text-white py-3 font-semibold transition disabled:opacity-70"
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

        {/* Divider */}

        <div className="flex items-center gap-4 my-7">

          <div className="flex-1 h-px bg-stone-200" />

          <span className="text-sm text-stone-400">
            OR
          </span>

          <div className="flex-1 h-px bg-stone-200" />

        </div>

        {/* Google Login */}

        <div className="flex justify-center">

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              toast.error("Google login failed.");
            }}
          />

        </div>

        {/* Register */}

        <p className="text-center mt-7 text-sm text-stone-500">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-[#65735B] font-medium hover:underline"
          >
            Create Account
          </Link>

        </p>

      </div>

    </div>
  );
}

export default LoginForm; 