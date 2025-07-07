import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function CheckAuth({ children }) {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth); // Add isLoading state

  // Wait for authentication check to finish before rendering
  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a better UI (spinner, skeleton, etc.)
  }

  if (!isAuthenticated) {
    if (location.pathname === "/") return <Navigate to="/auth/login" />;
    if (!location.pathname.includes("/login") && !location.pathname.includes("/register")) {
      return <Navigate to="/auth/login" />;
    }
  } else {
    // Redirect logged-in users trying to access auth pages
    if (location.pathname.includes("/login") || location.pathname.includes("/register") || location.pathname === "/") {
      return <Navigate to={`/${user?.role}/dashboard`} />;
    }

    // Prevent unauthorized admin access
    if (user?.role !== "admin" && location.pathname.includes("/admin")) {
      return <Navigate to="/unauth-page" />;
    }

    // Prevent admin from accessing user/manager routes
    if (user?.role === "admin" && (location.pathname.includes("/user") || location.pathname.includes("/manager"))) {
      return <Navigate to="/admin/dashboard" />;
    }
  }

  return <>{children}</>;
}

export default CheckAuth;