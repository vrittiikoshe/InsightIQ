import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function LoginCard() {
  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 p-10 shadow-sm">

      <h2 className="text-4xl font-bold mb-2">
        Welcome back
      </h2>

      <p className="text-gray-500 mb-8">
        Sign in to continue to InsightIQ
      </p>

      <div className="space-y-5">

        <Input
          placeholder="Email"
        />

        <Input
          placeholder="Password"
          type="password"
        />

        <Button
          className="w-full h-12 rounded-xl bg-[#5C6B5F] hover:bg-[#4C5A4F]"
        >
          Sign In
        </Button>

      </div>

    </div>
  );
}

export default LoginCard;