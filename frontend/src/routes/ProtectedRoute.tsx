import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  role: string;
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, element }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  useEffect(() => {
    // Add slight delay to ensure Redux state is updated
    const timer = setTimeout(() => setIsChecking(false), 100);
    return () => clearTimeout(timer);
  }, []);
  if (isChecking) return null; // Or loading spinner
  // Get user details from localStorage if Redux state is empty
  const storedToken = localStorage.getItem("authToken");
  const storedRole = localStorage.getItem("userRole");

  // If there's no Redux state but localStorage has auth details, use them
  const isAuthenticated = token || storedToken;
  const userRole = user?.role || storedRole;

  if (!isAuthenticated) {
    console.log("User is not authenticated, redirecting to login."); // Log unauthenticated access
    return <Navigate to="/login" />;
  }

  // If roles don't match
  if (role !== (user?.role || storedRole)) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;
