import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

interface ProtectedProps {
  children: React.ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({ children }) => {
  const navigate = useNavigate();
  const { token, user } = useAuthStore();

  useEffect(() => {
    if (!token || user?.role !== "admin") {
      navigate("/auth/login", { replace: true });
    }
  }, [token, user, navigate]);

  if (!token || user?.role !== "admin") {
    return null;
  }

  return <>{children}</>;
};

export default Protected;
