import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";

const CallbackPage: React.FC = () => {
  const { isLoading, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (error) {
      console.error("OIDC callback error:", error);
      navigate("/login");
      return;
    }

    if (isAuthenticated) {
      const redirectPath = localStorage.getItem("redirectPath");
      localStorage.removeItem("redirectPath");
      navigate(redirectPath ?? "/dashboard");
    }
  }, [isLoading, isAuthenticated, error, navigate]);

  if (isLoading) {
    return <p>Processing login...</p>;
  }

  if (error) {
    return <p>Login error: {error.message}</p>;
  }

  return <p>Completing login...</p>;
};

export default CallbackPage;
