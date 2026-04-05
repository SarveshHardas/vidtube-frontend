import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/tokenUtils";

/**
 * PublicRoute — wraps pages that should only be accessible when NOT logged in
 * (e.g. Login, Register). If the user has a valid accessToken, redirect to home.
 */
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
