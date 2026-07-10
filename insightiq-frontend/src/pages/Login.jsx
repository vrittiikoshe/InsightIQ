import AuthLayout from "../layouts/AuthLayout";
import Branding from "../components/common/Branding";
import LoginCard from "../components/common/LoginCard";

function Login() {
  return (
    <AuthLayout
      left={<Branding />}
      right={<LoginCard />}
    />
  );
}

export default Login;