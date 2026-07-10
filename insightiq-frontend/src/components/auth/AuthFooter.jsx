import { Link } from "react-router-dom";

function AuthFooter() {
  return (
    <p className="mt-8 text-center text-gray-500">
      Don't have an account?{" "}
      <Link
        to="/register"
        className="font-semibold text-[#5C6B5F] hover:underline"
      >
        Create account
      </Link>
    </p>
  );
}

export default AuthFooter;