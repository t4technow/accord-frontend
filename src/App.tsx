// React Router Components
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Protected Route
import ProtectedRoute from "./utils/ProtectedRoute";

// Pages
import Home from "./page/Home";
import Auth from "./page/Auth";
import VerifyEmail from "./page/VerifyEmail";

// Styles
import "./App.css";

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/user/*" element={<Auth />} />
				<Route element={<ProtectedRoute />}>
					{/* Protected Routes: only logged in users will be able to access */}
					<Route element={<Home />} path="/*" />
				</Route>
				<Route element={<VerifyEmail />} path="/verify-email/:uid/:token" />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
