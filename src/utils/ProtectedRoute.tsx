import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
	const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

	return isAuthenticated ? <Outlet /> : <Navigate to="/user/login" />;
};

export default ProtectedRoute;
