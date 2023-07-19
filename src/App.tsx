import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Home from "./page/Home";
import Auth from "./page/Auth";
import ProtectedRoute from "./utils/ProtectedRoute";
import VerifyEmail from "./page/VerifyEmail";

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/user/*" element={<Auth />} />
				<Route element={<ProtectedRoute />}>
					<Route element={<Home />} path="/" />
				</Route>
				<Route element={<VerifyEmail />} path="/verify-email/:uid/:token" />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
