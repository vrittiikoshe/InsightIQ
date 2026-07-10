import { Button } from "@/components/ui/button";

function SocialLogin() {
  return (
    <div className="space-y-3 mt-6">
      <Button
        variant="outline"
        className="w-full h-11 rounded-xl"
      >
        Continue with Google
      </Button>

      <Button
        variant="outline"
        className="w-full h-11 rounded-xl"
      >
        Continue with GitHub
      </Button>
    </div>
  );
}

export default SocialLogin;