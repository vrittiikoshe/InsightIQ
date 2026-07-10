import AuthLayout from "../layouts/AuthLayout";
import Branding from "../components/common/Branding";
import LoginForm from "../components/auth/LoginForm";

function Login() {
  return (
    <AuthLayout
      left={<Branding />}
      right={<LoginForm />}
    />
  );
}

export default Login;