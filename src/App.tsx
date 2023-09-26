// React Router Components
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Protected Route
import ProtectedRoute from "./utils/ProtectedRoute";

// Pages
import Home from "./page/Home";
import Auth from "./page/Auth";
import VerifyEmail from "./page/VerifyEmail";

// Styles
import "./App.css";
import { useEffect } from "react";
import { RootState } from "./lib/Types";
import { useSelector } from "react-redux";
import { requestPermission } from "./lib/firebase";


const App = () => {

	const loggedUser = useSelector((state: RootState) => state.user.userId);
	// const VAPID = import.meta.env.VITE_VAPID_PUBLIC_KEY



	const checkCameraPermission = async () => {
		try {
			const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });

			if (cameraPermission.state === 'granted') {
				console.log('granted');
			} else if (cameraPermission.state === 'denied') {
				const getPermission = await navigator.mediaDevices.getUserMedia({ video: true })
				return getPermission
			}
		} catch (error) {
			console.error('Error checking camera permission:', error);
		}
	};

	useEffect(() => {
		if (!loggedUser) return
		if (Notification.permission !== 'granted') {
			requestPermission()
		}
		checkCameraPermission()
		console.log(loggedUser, '---')
	}, [loggedUser])


	return (
		<BrowserRouter>
			<Routes>
				<Route path="/user/*" element={<Auth />} />
				<Route element={<ProtectedRoute />}>
					{/* Protected Routes: only logged in users will be able to access */}
					<Route path="/:server?/:channel?" element={<Home />} />
					{/* Catch-all route to redirect undefined paths to the home page */}
					<Route path="/*" element={<Navigate to="/" />} />
				</Route>
				<Route element={<VerifyEmail />} path="/verify-email/:uid/:token" />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
