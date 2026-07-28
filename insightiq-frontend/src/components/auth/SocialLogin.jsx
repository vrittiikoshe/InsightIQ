import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { googleLogin } from "../../services/authService";

function SocialLogin() {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const data = await googleLogin(credentialResponse.credential);

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      toast.success("Logged in with Google!");

      navigate("/dashboard");
    } catch (error) {
        alert(JSON.stringify(error.response?.data, null, 2));
        console.log(error.response?.data);
        toast.error("Google login failed");
    }
  };

  return (
    <div className="mt-6 flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => toast.error("Google Login Failed")}
        theme="outline"
        size="large"
        shape="pill"
        text="continue_with"
        width="350"
      />
    </div>
  );
}

export default SocialLogin; 