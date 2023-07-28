import { RootState } from "@/lib/Types";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
	const isAuthenticated = useSelector(
		(state: RootState) => state.user.isAuthenticated
	);

	return isAuthenticated ? <Outlet /> : <Navigate to="/user/login" />;
};

export default ProtectedRoute;
