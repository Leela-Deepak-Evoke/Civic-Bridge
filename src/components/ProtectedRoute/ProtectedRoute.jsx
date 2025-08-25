import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AppLoader from "../AppLoader/AppLoader";


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <AppLoader />; // prevent flashing
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
