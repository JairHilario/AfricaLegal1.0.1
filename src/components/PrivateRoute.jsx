import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("user"); // ou useContext/AuthProvider

  return isAuthenticated ? children : <Navigate to="/Login" />;
};

export default PrivateRoute;