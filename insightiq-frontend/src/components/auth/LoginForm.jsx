import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

import { loginUser } from "../../services/authService";

import AuthHeader from "./AuthHeader";
import PasswordInput from "./PasswordInput";
import SocialLogin from "./SocialLogin";
import AuthFooter from "./AuthFooter";

function LoginForm() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await loginUser(username, password);

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-sm p-10">
      <AuthHeader />

      <form className="space-y-5" onSubmit={handleLogin}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={remember}
              onCheckedChange={setRemember}
            />

            <span className="text-sm text-gray-600">
              Remember me
            </span>
          </div>

          <Link
            to="#"
            className="text-sm text-[#5C6B5F] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-[#5C6B5F] hover:bg-[#4F5D52]"
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <div className="my-8">
        <Separator />
      </div>

      <SocialLogin />

      <AuthFooter />
    </div>
  );
}

export default LoginForm;